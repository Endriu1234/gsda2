import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProposedItem } from 'src/app/items/store/models/batchitemcreation/proposed-item.model';
import { Store } from '@ngrx/store';
import * as fromItemsState from '../../../store/state/items.state';
import { getBatchItemCreationCanActivateGrid, getIsAnyBatchItemsRecordsSelected, getBatchItemCreationFormDeletedColumns, getBatchItemCreationFormData, getBatchItemCreationRecords, hasBatchItemCreationFormDeletedColumns, getBatchItemCreationFormDisplayedColumns, getBatchItemCreationFormDisplayedColumnsLength, hasBatchItemCreationFormDeletedColumnsSelToAdd } from 'src/app/items/store/selectors/items.batch-item-creation-selectors';
import { Subscription } from 'rxjs/internal/Subscription';
import { addBatchItemCreationFormColumn, deleteBatchItemCreationFormColumn, startBatchItemsCreation, toggleAllPropsedItemsSelection, togglePropsedItemSelection } from 'src/app/items/store/actions/items.batch-item-creation-actions';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Observable } from 'rxjs';
import { FormGroupState } from 'ngrx-forms';

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

  //displayedColumns: string[] = ['SELECT', 'SUBJECT', 'ISSUE', 'CR', 'expand'];
  dataSource: MatTableDataSource<ProposedItem> = new MatTableDataSource<ProposedItem>([]);
  recordsSubscription: Subscription | null = null;
  expandedElement: ProposedItem | null = null;
  formState$: Observable<FormGroupState<any>>;
  getBatchItemCreationCanActivateGrid$: Observable<boolean> | null = null;
  hasDeletedColumns$: Observable<boolean> | null = null;
  hasDeletedColumnsSelToAdd$: Observable<boolean> | null = null;
  deletedColumns$: Observable<string[]> | null = null;
  displayedColumns$: Observable<string[]> | null = null;
  displayedColumnsLength$: Observable<number> | null = null;

  selectedDeletedValues = "";
  isAnyRecordSelected$!: Observable<boolean>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store<fromItemsState.State>) {
    this.formState$ = this.store.select(getBatchItemCreationFormData);
  }

  ngOnChanges(): void {
    
  }

  ngOnInit(): void {
    this.recordsSubscription = this.store.select(getBatchItemCreationRecords).subscribe(records => {
      this.dataSource.data = records.proposedItems;
    });

    this.getBatchItemCreationCanActivateGrid$ = this.store.select(getBatchItemCreationCanActivateGrid);
    this.hasDeletedColumns$ = this.store.select(hasBatchItemCreationFormDeletedColumns);
    this.hasDeletedColumnsSelToAdd$ = this.store.select(hasBatchItemCreationFormDeletedColumnsSelToAdd);
    this.deletedColumns$ = this.store.select(getBatchItemCreationFormDeletedColumns);
    this.displayedColumns$ = this.store.select(getBatchItemCreationFormDisplayedColumns);
    this.displayedColumnsLength$ = this.store.select(getBatchItemCreationFormDisplayedColumnsLength);
    this.dataSource.sortData = this.sortData();
    this.isAnyRecordSelected$ = this.store.select(getIsAnyBatchItemsRecordsSelected);
  }

  ngOnDestroy(): void {

    this.recordsSubscription?.unsubscribe();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  removeColumn(column: string) {
    this.store.dispatch(deleteBatchItemCreationFormColumn({ column: column }));
  }

  drop(event: CdkDragDrop<string[]>) {
    //moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
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
            comparatorResult = a.SUBJECT.localeCompare(b.SUBJECT);
            break;
          case 'ISSUE':
            const issueNumA = a.ISSUE.match(/(\d+)/);
            const issueNumB = b.ISSUE.match(/(\d+)/);
            if (issueNumA && issueNumB) {
              console.log(issueNumA[0] + "  " + issueNumB[0]);
              comparatorResult = Number(issueNumA[0]) - Number(issueNumB[0]);
            } else {
              comparatorResult = a.ISSUE.localeCompare(b.ISSUE);
            }
            break;
          case 'CR':
            const crNumA = a.CR.match(/(\d+)/);
            const crNumB = b.CR.match(/(\d+)/);
            if (crNumA && crNumB) {
              comparatorResult = Number(crNumA[0]) - Number(crNumB[0]);
            } else {
              comparatorResult = a.CR.localeCompare(b.CR);
            }
            break;
          default:
            comparatorResult = a.DESCRIPTION.localeCompare(b.DESCRIPTION);
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

  addColumns() {
    this.store.dispatch(addBatchItemCreationFormColumn());

    this.selectedDeletedValues = "";
  }
}
