import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { RedmineProject } from 'src/app/shared/store/models/redmine-project.model';
import * as fromItemsState from '../../../store/state/items.state';
import * as fromBatchItemsSelectors from '../../../store/selectors/items.batch-item-creation-selectors';
import * as fromCommonItemsSelectors from '../../../store/selectors/items.common-selectors';
import { FormGroupState, SetUserDefinedPropertyAction } from 'ngrx-forms';
import { FORM_SEARCH_STATE, FormSearchState } from 'src/app/shared/store/shared.state';
import { initRedmineProjects } from 'src/app/items/store/actions/items.common-actions';
import { BATCH_ITEM_CREATION_IDSCRITERIA_FORMID } from 'src/app/items/store/state/items.batch-item-creation-state';
import { trimUpperConverter } from 'src/app/shared/tools/validators/ngrxValueConverters';
import { RedmineVersion } from 'src/app/shared/store/models/redmine-version.model';
import { setBatchItemCreationTabIndex } from 'src/app/items/store/actions/items.batch-item-creation-actions';

@Component({
  selector: 'app-batch-creation-idscriteria',
  templateUrl: './batch-creation-idscriteria.component.html',
  styleUrls: ['./batch-creation-idscriteria.component.scss']
})
export class BatchCreationIdscriteriaComponent implements OnInit {
  redmineProjectsFiltered$: Observable<RedmineProject[]> | null = null;
  formState$: Observable<FormGroupState<any>>;
  getBatchItemCreationIdsCriteriaCanActivateFind$: Observable<boolean> | null = null;
  isGridFilled$: Observable<boolean> | null = null;
  versions$: Observable<RedmineVersion[]> | null = null;

  trimUpper = trimUpperConverter;

  constructor(private store: Store<fromItemsState.State>) {
    this.formState$ = this.store.select(fromBatchItemsSelectors.getBatchItemCreationIdsCriteriaFormState);
  }

  ngOnInit(): void {
    this.store.select(fromCommonItemsSelectors.getRedmineProjectsLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineProjects());
    });

    this.redmineProjectsFiltered$ = this.store.select(fromBatchItemsSelectors.getRedmineProjectsFilteredForIdsBatchItemCreation);

    this.getBatchItemCreationIdsCriteriaCanActivateFind$ = this.store.select(fromBatchItemsSelectors.getBatchItemCreationIdsCriteriaCanActivateFind);
    this.isGridFilled$ = this.store.select(fromBatchItemsSelectors.getBatchItemCreationCanActivateGrid);

    this.versions$ = this.store.select(fromBatchItemsSelectors.getIdRedmineVersionsByProject);
  }

  search(): void {
    this.store.dispatch(new SetUserDefinedPropertyAction(BATCH_ITEM_CREATION_IDSCRITERIA_FORMID, FORM_SEARCH_STATE, FormSearchState.Searching));
    this.store.dispatch(setBatchItemCreationTabIndex({index: 0}));
  }
}
