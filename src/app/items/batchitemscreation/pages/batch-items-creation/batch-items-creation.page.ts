import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProposedItem } from 'src/app/items/store/models/batchitemcreation/proposed-item.model';
import { SelectionModel } from '@angular/cdk/collections';
import { Store } from '@ngrx/store';
import * as fromItemsState from '../../../store/state/items.state';
import { getBatchItemCreationRecords } from 'src/app/items/store/selectors/items.batch-item-creation-selectors';
import { Subscription } from 'rxjs/internal/Subscription';
import { toggleAllPropsedItemsSelection, togglePropsedItemSelection } from 'src/app/items/store/actions/items.batch-item-creation-actions';
import { animate, state, style, transition, trigger } from '@angular/animations';

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

  displayedColumns: string[] = ['select', 'subject', 'issue', 'cr', 'expand'];
  dataSource: MatTableDataSource<ProposedItem> = new MatTableDataSource<ProposedItem>([]);
  selection = new SelectionModel<ProposedItem>(true, []);
  recordsSubscription: Subscription | null = null;
  expandedElement: ProposedItem | null = null;

  constructor(private store: Store<fromItemsState.State>) {

  }

  ngOnInit(): void {
    this.recordsSubscription = this.store.select(getBatchItemCreationRecords).subscribe(records => {
      this.dataSource = new MatTableDataSource<ProposedItem>(records.proposedItems);
    });
  }

  ngOnDestroy(): void {

    this.recordsSubscription?.unsubscribe();
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
}
