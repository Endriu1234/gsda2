import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProposedItem } from 'src/app/items/store/models/batchitemcreation/proposed-item.model';
import { Store } from '@ngrx/store';
import * as fromItemsState from '../../../store/state/items.state';
import { getBatchItemCreationRecords } from 'src/app/items/store/selectors/items.batch-item-creation-selectors';
import { Subscription } from 'rxjs/internal/Subscription';
import { toggleAllPropsedItemsSelection, togglePropsedItemSelection } from 'src/app/items/store/actions/items.batch-item-creation-actions';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

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

  displayedColumns: string[] = ['SELECT', 'SUBJECT', 'ISSUE', 'CR', 'expand'];
  dataSource: MatTableDataSource<ProposedItem> = new MatTableDataSource<ProposedItem>([]);
  recordsSubscription: Subscription | null = null;
  expandedElement: ProposedItem | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store<fromItemsState.State>) {

  }

  ngOnInit(): void {
    this.recordsSubscription = this.store.select(getBatchItemCreationRecords).subscribe(records => {
      this.dataSource.data = records.proposedItems;
    });
  }

  ngOnDestroy(): void {

    this.recordsSubscription?.unsubscribe();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  removeColumn(column: string) {
    this.displayedColumns = this.displayedColumns.filter(colName => colName !== column);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
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

  toggleAllRows() {

    this.store.dispatch(toggleAllPropsedItemsSelection());
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator)
      this.dataSource.paginator.firstPage();
  }
}
