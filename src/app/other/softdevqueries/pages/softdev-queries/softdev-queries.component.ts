import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroupState, SetUserDefinedPropertyAction } from 'ngrx-forms';
import { Observable, Subscription } from 'rxjs';
import * as fromItemsState from '../../../store/state/other.state';
import * as fromOtherSelectors from '../../../store/selectors/other.sd-queries-selectors';
import { SOFT_DEV_QUERIES_FORMID } from 'src/app/other/store/state/sd-queries-state';
import { FORM_SEARCH_STATE, FormSearchState } from 'src/app/shared/store/shared.state';
import { MatTableDataSource } from '@angular/material/table';
import { formatDate } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-softdev-queries',
  templateUrl: './softdev-queries.component.html',
  styleUrls: ['./softdev-queries.component.scss']
})
export class SoftdevQueriesComponent implements OnInit {

  formState$: Observable<FormGroupState<any>>;
  canActivateFind$: Observable<boolean> | null = null;
  isGridFilled$: Observable<boolean> | null = null;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  allColumns$: Observable<any[]> | null = null;
  recordsSubscription: Subscription | null = null;
  public currentDate = new Date;
  public currentFormattedDate = formatDate(this.currentDate, 'yyyy_MM_dd', 'en-US');
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store<fromItemsState.State>) {
    this.formState$ = this.store.select(fromOtherSelectors.getOtherSDQueriesCriteriaFormState);
  }

  ngOnInit(): void {
    this.recordsSubscription = this.store.select(fromOtherSelectors.getOtherSDQueriesRows).subscribe(records => {
      this.dataSource.data = records;
    });

    this.allColumns$ = this.store.select(fromOtherSelectors.getOtherSDQueriesColumns);
    this.canActivateFind$ = this.store.select(fromOtherSelectors.getOtherSDQueriesCanActivateFind);
    this.isGridFilled$ = this.store.select(fromOtherSelectors.getOtherSDQueriesCanActivateGrid);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.recordsSubscription?.unsubscribe();
  }

  search(): void {
    this.store.dispatch(new SetUserDefinedPropertyAction(SOFT_DEV_QUERIES_FORMID, FORM_SEARCH_STATE, FormSearchState.Searching));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator)
      this.dataSource.paginator.firstPage();
  }

}
