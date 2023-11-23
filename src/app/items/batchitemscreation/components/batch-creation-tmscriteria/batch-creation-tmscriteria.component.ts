import { Component, OnInit } from '@angular/core';
import { FormGroupState, SetUserDefinedPropertyAction } from 'ngrx-forms';
import { Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromItemsState from '../../../store/state/items.state';
import * as fromBatchItemsSelectors from '../../../store/selectors/items.batch-item-creation-selectors';
import * as fromCommonItemsSelectors from '../../../store/selectors/items.common-selectors';
import { initRedmineProjects, initRedmineUsers } from 'src/app/items/store/actions/items.common-actions';
import { RedmineProject } from 'src/app/shared/store/models/redmine-project.model';
import { dateValueConverter, trimUpperConverter } from 'src/app/shared/tools/validators/ngrxValueConverters';
import { BATCH_ITEM_CREATION_TMSCRITERIA_FORMID } from 'src/app/items/store/state/items.batch-item-creation-state';
import { FORM_SEARCH_STATE, FormSearchState } from 'src/app/shared/store/shared.state';
import { RedmineUserByLetter } from 'src/app/shared/store/models/redmine-user-letter-model';
import { initTmsClients, setBatchItemCreationTabIndex } from 'src/app/items/store/actions/items.batch-item-creation-actions';
import { TmsClientByLetter } from 'src/app/shared/store/models/tms-client-letter.model';
import { RedmineVersion } from 'src/app/shared/store/models/redmine-version.model';

@Component({
  selector: 'app-batch-creation-tmscriteria',
  templateUrl: './batch-creation-tmscriteria.component.html',
  styleUrls: ['./batch-creation-tmscriteria.component.scss']
})
export class BatchCreationTMSCriteriaComponent implements OnInit {
  formState$: Observable<FormGroupState<any>>;
  redmineProjectsFiltered$: Observable<RedmineProject[]> | null = null;
  isGridFilled$: Observable<boolean> | null = null;
  canActivateFind$: Observable<boolean> | null = null;
  usersFiltered$: Observable<RedmineUserByLetter[]> | null = null;
  tmsClientsFiltered$: Observable<TmsClientByLetter[]> | null = null;
  versions$: Observable<RedmineVersion[]> | null = null;
  trimUpper = trimUpperConverter;
  dateConverter = dateValueConverter;

  constructor(private store: Store<fromItemsState.State>) {
    this.formState$ = this.store.select(fromBatchItemsSelectors.getBatchItemCreationTMSCriteriaFormState);
  }

  ngOnInit(): void { 

    this.store.select(fromCommonItemsSelectors.getRedmineProjectsLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineProjects());
    });

    this.store.select(fromCommonItemsSelectors.getRedmineUsersLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineUsers());
    });

    this.store.select(fromBatchItemsSelectors.getTmsClientsLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initTmsClients());
    });

    this.redmineProjectsFiltered$ = this.store.select(fromBatchItemsSelectors.getRedmineTargetProjectsFilteredForTmsBatchItemCreation);

    this.canActivateFind$ = this.store.select(fromBatchItemsSelectors.getBatchItemCreationTmsCriteriaCanActivateFind);

    this.isGridFilled$ = this.store.select(fromBatchItemsSelectors.getBatchItemCreationCanActivateGrid);

    this.usersFiltered$ = this.store.select(fromBatchItemsSelectors.getRedmineUsersByLetterFiltered);

    this.tmsClientsFiltered$ = this.store.select(fromBatchItemsSelectors.getTmsClientsByLetterFiltered);

    this.versions$ = this.store.select(fromBatchItemsSelectors.getTmsRedmineVersionsByProject);
  }

  search(): void {
    this.store.dispatch(new SetUserDefinedPropertyAction(BATCH_ITEM_CREATION_TMSCRITERIA_FORMID, FORM_SEARCH_STATE, FormSearchState.Searching));
    this.store.dispatch(setBatchItemCreationTabIndex({index: 1}));
  }
}
