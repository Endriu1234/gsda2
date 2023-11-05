import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProposedItem } from 'src/app/items/store/models/batchitemcreation/proposed-item.model';
import { Store } from '@ngrx/store';
import * as fromItemsState from '../../../store/state/items.state';
import * as fromSharedState from '../../../../shared/store/shared.state';
import { getBatchItemCreationCanActivateGrid, getIsAnyBatchItemsRecordsSelected, getBatchItemCreationFormData, getBatchItemCreationRecords, getBatchItemCreationFormColumns as getBatchItemCreationFormColumns, getBatchItemCreationFormColumnsLength, getBatchItemCreationGridRemovableColumns, getBatchItemCreationTabIndex } from 'src/app/items/store/selectors/items.batch-item-creation-selectors';
import { Subscription } from 'rxjs/internal/Subscription';
import { createOneRecordFromBatch, dragAndDropBatchItemsCreationColumns, setBatchItemCreationSelectedTabIndex, startBatchItemsCreation, toggleAllPropsedItemsSelection, togglePropsedItemSelection } from 'src/app/items/store/actions/items.batch-item-creation-actions';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Observable } from 'rxjs';
import { FormGroupState } from 'ngrx-forms';
import { openLinkInNewWindow } from 'src/app/shared/store/shared.actions';

@Component({
  selector: 'app-batch-items-creation',
  templateUrl: './batch-items-creation.page.html',
  styleUrls: ['./batch-items-creation.page.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BatchItemsCreationPage implements OnInit, OnDestroy {

  dataSource: MatTableDataSource<ProposedItem> = new MatTableDataSource<ProposedItem>([]);
  recordsSubscription: Subscription | null = null;
  expandedElement: ProposedItem | null = null;
  formState$: Observable<FormGroupState<any>>;
  getBatchItemCreationCanActivateGrid$: Observable<boolean> | null = null;
  allColumns$: Observable<string[]> | null = null;
  columnsLength$: Observable<number> | null = null;
  removableColumns$: Observable<string[]> | null = null;
  activatedTabIndex$: Observable<number> | null = null;

  isAnyRecordSelected$!: Observable<boolean>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store<fromItemsState.State>, private sharedStore: Store<fromSharedState.State>) {
    this.formState$ = this.store.select(getBatchItemCreationFormData);
  }

  ngOnChanges(): void {
    
  }

  ngOnInit(): void {
    this.recordsSubscription = this.store.select(getBatchItemCreationRecords).subscribe(records => {
      this.dataSource.data = records.proposedItems;
    });

    this.getBatchItemCreationCanActivateGrid$ = this.store.select(getBatchItemCreationCanActivateGrid);
    this.removableColumns$ = this.store.select(getBatchItemCreationGridRemovableColumns);
    this.allColumns$ = this.store.select(getBatchItemCreationFormColumns);
    this.columnsLength$ = this.store.select(getBatchItemCreationFormColumnsLength);
    this.dataSource.sortData = this.sortData();
    this.isAnyRecordSelected$ = this.store.select(getIsAnyBatchItemsRecordsSelected);
    this.activatedTabIndex$ = this.store.select(getBatchItemCreationTabIndex);
  }

  ngOnDestroy(): void {

    this.recordsSubscription?.unsubscribe();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  drop(event: CdkDragDrop<string[]>) {
    this.store.dispatch(dragAndDropBatchItemsCreationColumns({prevIndex: event.previousIndex, currIndex: event.currentIndex}))
  }

  toggleRowSelection(row: ProposedItem) {
    this.store.dispatch(togglePropsedItemSelection({ proposedItem: row }));
  }

  isAllSelected() {

    const selectionCount = this.dataSource.data.reduce(function (n, item) {

      if (item.SELECTED)
        return n + 1;
      else
        return n;

    }, 0);

    return selectionCount > 0 && selectionCount === this.dataSource.data.length;
  }

  isIndeterminate() {
    const isSelected = this.dataSource.data.some((element, index, arra) => {
      return element.SELECTED;
    });
    return this.dataSource.data.length > 0 && isSelected && !this.isAllSelected();
  }

  toggleAllRows() {
    this.store.dispatch(toggleAllPropsedItemsSelection());
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator)
      this.dataSource.paginator.firstPage();
  }

  sortData() {
    let sortFunction = (items: ProposedItem[], sort: MatSort): ProposedItem[] => {
      if (!sort.active || sort.direction === '') {
        return items;
      }

      return items.sort((a: ProposedItem, b: ProposedItem) => {
        let comparatorResult = 0;
        switch (sort.active) {
          case 'SELECT':
            comparatorResult = a.SELECTED ? -1 : 1;
            break;
          case 'SUBJECT':
            comparatorResult = a.SUBJECT ? a.SUBJECT.localeCompare(b.SUBJECT) : b.SUBJECT ? -1 : 0;
            break;
          case 'ISSUE':
            if (a.ISSUE && b.ISSUE) {
              const issueNumA = a.ISSUE.match(/(\d+)/);
              const issueNumB = b.ISSUE.match(/(\d+)/);
              if (issueNumA && issueNumB) {
                comparatorResult = Number(issueNumA[0]) - Number(issueNumB[0]);
              } else {
                comparatorResult = a.ISSUE.localeCompare(b.ISSUE);
              }
            } else {
              comparatorResult = a.ISSUE ? a.ISSUE.localeCompare(b.ISSUE) : b.ISSUE ? -1 : 0;
            }
            break;
          case 'CR':
            if (a.CR && b.CR) {
              const crNumA = a.CR.match(/(\d+)/);
              const crNumB = b.CR.match(/(\d+)/);
              if (crNumA && crNumB) {
                comparatorResult = Number(crNumA[0]) - Number(crNumB[0]);
              } else {
                comparatorResult = a.CR.localeCompare(b.CR);
              }
            } else {
              comparatorResult = a.CR ? a.CR.localeCompare(b.CR) : b.CR ? -1 : 0;
            }
            break;
          case 'TMS':
            comparatorResult = a.TMS ? a.TMS.localeCompare(b.TMS) : b.TMS ? -1 : 0;
            break;
          case 'TRACKER':
            comparatorResult = a.TRACKER ? a.TRACKER.localeCompare(b.TRACKER) : b.TRACKER ? -1 : 0;
            break;
          default:
            comparatorResult = a.DESCRIPTION ? a.DESCRIPTION.localeCompare(b.DESCRIPTION) : b.DESCRIPTION ? -1 : 0;
            break;
        }
        return comparatorResult * (sort.direction == 'asc' ? 1 : -1);
      });
    };

    return sortFunction;
  }

  createBatch() {
    this.store.dispatch(startBatchItemsCreation());
  }

  createSingleItem(element: ProposedItem) {
    this.store.dispatch(createOneRecordFromBatch({proposedItem: element}));
  }

  openItemInRedmine(link: string) {
    this.sharedStore.dispatch(openLinkInNewWindow({url: link}));
  }

  selectedTabIndexChanged(index: number) {
    this.store.dispatch(setBatchItemCreationSelectedTabIndex({index}));
  }
}
