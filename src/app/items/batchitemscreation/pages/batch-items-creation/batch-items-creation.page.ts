import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProposedItem } from 'src/app/items/store/models/batchitemcreation/proposed-item.model';
import { SelectionModel } from '@angular/cdk/collections';
import { Store } from '@ngrx/store';
import * as fromItemsState from '../../../store/state/items.state';
import { getBatchItemCreationRecords } from 'src/app/items/store/selectors/items.batch-item-creation-selectors';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-batch-items-creation',
  templateUrl: './batch-items-creation.page.html',
  styleUrls: ['./batch-items-creation.page.scss']
})
export class BatchItemsCreationPage implements OnInit, OnDestroy {

  displayedColumns: string[] = ['select', 'subject', 'issue'];
  dataSource: MatTableDataSource<ProposedItem> = new MatTableDataSource<ProposedItem>([]);
  selection = new SelectionModel<ProposedItem>(true, []);
  recordsSubscription: Subscription | null = null;

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

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    // const numSelected = this.selection.selected.length;
    //  const numRows = this.dataSource.data.length;
    //  return numSelected === numRows;
    return false;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    //if (this.isAllSelected()) {
    //  this.selection.clear();
    //    return;
    //  }

    // this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ProposedItem): string {
    // if (!row) {
    //   return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    // }
    // return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    return 'deselect';
  }

}
