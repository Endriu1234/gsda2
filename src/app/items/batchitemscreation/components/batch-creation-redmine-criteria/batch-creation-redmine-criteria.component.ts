import { Component, OnInit } from '@angular/core';
import { FormGroupState } from 'ngrx-forms';
import { Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { RedmineProject } from 'src/app/shared/store/models/redmine-project.model';
import * as fromItemsState from '../../../store/state/items.state';
import * as fromBatchItemsSelectors from '../../../store/selectors/items.batch-item-creation-selectors';
import * as fromCommonItemsSelectors from '../../../store/selectors/items.common-selectors';
import { initRedmineProjects } from 'src/app/items/store/actions/items.common-actions';

@Component({
  selector: 'app-batch-creation-redmine-criteria',
  templateUrl: './batch-creation-redmine-criteria.component.html',
  styleUrls: ['./batch-creation-redmine-criteria.component.scss']
})
export class BatchCreationRedmineCriteriaComponent implements OnInit {
  formState$: Observable<FormGroupState<any>>;
  redmineProjectsFiltered$: Observable<RedmineProject[]> | null = null;

  constructor(private store: Store<fromItemsState.State>) {
    this.formState$ = this.store.select(fromBatchItemsSelectors.getBatchItemCreationRedmineCriteriaFormState);
  }

  ngOnInit(): void {

    this.store.select(fromCommonItemsSelectors.getRedmineProjectsLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineProjects());
    });

    this.redmineProjectsFiltered$ = this.store.select(fromBatchItemsSelectors.getRedmineProjectsFilteredForBatchItemCreation);
    
  }

}
