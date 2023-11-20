import { Component, OnInit } from '@angular/core';
import { FormGroupState, SetUserDefinedPropertyAction } from 'ngrx-forms';
import { Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { RedmineProject } from 'src/app/shared/store/models/redmine-project.model';
import * as fromItemsState from '../../../store/state/items.state';
import * as fromBatchItemsSelectors from '../../../store/selectors/items.batch-item-creation-selectors';
import * as fromCommonItemsSelectors from '../../../store/selectors/items.common-selectors';
import { initRedmineProjects } from 'src/app/items/store/actions/items.common-actions';
import { BATCH_ITEM_CREATION_REDMINECRITERIA_FORMID } from 'src/app/items/store/state/items.batch-item-creation-state';
import { FORM_SEARCH_STATE, FormSearchState } from 'src/app/shared/store/shared.state';
import { RedmineVersion } from 'src/app/shared/store/models/redmine-version.model';
import { setBatchItemCreationTabIndex } from 'src/app/items/store/actions/items.batch-item-creation-actions';

@Component({
  selector: 'app-batch-creation-redmine-criteria',
  templateUrl: './batch-creation-redmine-criteria.component.html',
  styleUrls: ['./batch-creation-redmine-criteria.component.scss']
})
export class BatchCreationRedmineCriteriaComponent implements OnInit {
  formState$: Observable<FormGroupState<any>>;
  redmineSourceProjectsFiltered$: Observable<RedmineProject[]> | null = null;
  redmineTargetProjectsFiltered$: Observable<RedmineProject[]> | null = null;
  isGridFilled$: Observable<boolean> | null = null;
  canActivateFind$: Observable<boolean> | null = null;
  versions$: Observable<RedmineVersion[]> | null = null;

  constructor(private store: Store<fromItemsState.State>) {
    this.formState$ = this.store.select(fromBatchItemsSelectors.getBatchItemCreationRedmineCriteriaFormState);
  }

  ngOnInit(): void {

    this.store.select(fromCommonItemsSelectors.getRedmineProjectsLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineProjects());
    });

    this.redmineSourceProjectsFiltered$ = this.store.select(fromBatchItemsSelectors.getRedmineSourceProjectsFilteredForBatchItemCreation);
    this.redmineTargetProjectsFiltered$ = this.store.select(fromBatchItemsSelectors.getRedmineTargetProjectsFilteredForBatchItemCreation);

    this.isGridFilled$ = this.store.select(fromBatchItemsSelectors.getBatchItemCreationCanActivateGrid);

    this.canActivateFind$ = this.store.select(fromBatchItemsSelectors.getBatchItemCreationRmCriteriaCanActivateFind);

    this.versions$ = this.store.select(fromBatchItemsSelectors.getRedmineBatchVersionsByProject);
  }

  search(): void {
    this.store.dispatch(new SetUserDefinedPropertyAction(BATCH_ITEM_CREATION_REDMINECRITERIA_FORMID, FORM_SEARCH_STATE, FormSearchState.Searching));
    this.store.dispatch(setBatchItemCreationTabIndex({index: 2}));
  }

}
