import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { RedmineProject } from 'src/app/shared/store/models/redmine-project.model';
import * as fromItemsState from '../../../store/state/items.state';
import * as fromBatchItemsSelectors from '../../../store/selectors/items.batch-item-creation-selectors';
import * as fromCommonItemsSelectors from '../../../store/selectors/items.common-selectors';
import { FormGroupState, SetUserDefinedPropertyAction } from 'ngrx-forms';
import { SoftDevProject } from 'src/app/shared/store/models/softdev-project.model';
import { FORM_SEARCH_STATE, FormSearchState } from 'src/app/shared/store/shared.state';
import { initRedmineProjects, initSoftDevProjects } from 'src/app/items/store/actions/items.common-actions';
import { BATCH_ITEM_CREATION_SDCRITERIA_FORMID } from 'src/app/items/store/state/items.batch-item-creation-state';
import { RedmineVersion } from 'src/app/items/store/models/redmine-version.model';

@Component({
  selector: 'app-batch-creation-sdcriteria',
  templateUrl: './batch-creation-sdcriteria.component.html',
  styleUrls: ['./batch-creation-sdcriteria.component.scss']
})
export class BatchCreationSDCriteriaComponent implements OnInit {
  redmineProjectsFiltered$: Observable<RedmineProject[]> | null = null;
  softDevProjectsFiltered$: Observable<SoftDevProject[]> | null = null;
  formState$: Observable<FormGroupState<any>>;
  getBatchItemCreationSDCriteriaCanActivateFind$: Observable<boolean> | null = null;
  isGridFilled$: Observable<boolean> | null = null;
  versions$: Observable<RedmineVersion[]> | null = null;

  constructor(private store: Store<fromItemsState.State>) {
    this.formState$ = this.store.select(fromBatchItemsSelectors.getBatchItemCreationSdCriteriaFormState);
  }
  ngOnInit(): void {

    this.store.select(fromCommonItemsSelectors.getRedmineProjectsLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineProjects());
    });

    this.store.select(fromCommonItemsSelectors.getSoftDevProjectsLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initSoftDevProjects());
    });

    this.redmineProjectsFiltered$ = this.store.select(fromBatchItemsSelectors.getRedmineProjectsFilteredForBatchItemCreation);
    this.softDevProjectsFiltered$ = this.store.select(fromBatchItemsSelectors.getSoftDevProjectsFilteredForBatchItemCreation);

    this.getBatchItemCreationSDCriteriaCanActivateFind$ = this.store.select(fromBatchItemsSelectors.getBatchItemCreationSDCriteriaCanActivateFind);
    this.isGridFilled$ = this.store.select(fromBatchItemsSelectors.getBatchItemCreationCanActivateGrid);

    this.versions$ = this.store.select(fromBatchItemsSelectors.getSdRedmineVersionsByProject);
  }

  search(): void {
    this.store.dispatch(new SetUserDefinedPropertyAction(BATCH_ITEM_CREATION_SDCRITERIA_FORMID, FORM_SEARCH_STATE, FormSearchState.Searching))
  }
}
