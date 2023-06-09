import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { RedmineProject } from 'src/app/shared/store/models/redmine-project.model';
import * as fromItemsState from '../../../store/items.state';
import * as fromItemsSelectors from '../../../store/items.selectors';
import { initRedmineProjects, initSoftDevProjects } from 'src/app/items/store/items.actions';
import { FormGroupState, SetUserDefinedPropertyAction } from 'ngrx-forms';
import { SoftDevProject } from 'src/app/shared/store/models/softdev-project.model';
import { FORM_SEARCH_STATE, FormSearchState } from 'src/app/shared/store/shared.state';

@Component({
  selector: 'app-batch-creation-sdcriteria',
  templateUrl: './batch-creation-sdcriteria.component.html',
  styleUrls: ['./batch-creation-sdcriteria.component.scss']
})
export class BatchCreationSDCriteriaComponent implements OnInit {
  redmineProjectsFiltered$: Observable<RedmineProject[]> | null = null;
  softDevProjectsFiltered$: Observable<SoftDevProject[]> | null = null;
  formState$: Observable<FormGroupState<any>>;

  constructor(private store: Store<fromItemsState.State>) {
    this.formState$ = this.store.select(fromItemsSelectors.getBatchItemCreationSdCriteriaFormState);
  }
  ngOnInit(): void {

    this.store.select(fromItemsSelectors.getRedmineProjectsLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineProjects());
    });

    this.store.select(fromItemsSelectors.getSoftDevProjectsLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initSoftDevProjects());
    });

    this.redmineProjectsFiltered$ = this.store.select(fromItemsSelectors.getRedmineProjectsFilteredForBatchItemCreation);
    this.softDevProjectsFiltered$ = this.store.select(fromItemsSelectors.getSoftDevProjectsFilteredForBatchItemCreation);
  }

  search(): void {
    this.store.dispatch(new SetUserDefinedPropertyAction(fromItemsState.BATCH_ITEM_CREATION_SDCRITERIA_FORMID, FORM_SEARCH_STATE, FormSearchState.Searching))
  }
}
