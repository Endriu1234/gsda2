import { Component, OnInit } from '@angular/core';
import { FormGroupState } from 'ngrx-forms';
import { Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromItemsState from '../../../store/state/items.state';
import * as fromBatchItemsSelectors from '../../../store/selectors/items.batch-item-creation-selectors';
import * as fromCommonItemsSelectors from '../../../store/selectors/items.common-selectors';
import { initRedmineProjects } from 'src/app/items/store/actions/items.common-actions';
import { RedmineProject } from 'src/app/shared/store/models/redmine-project.model';
import { trimUpperConverter } from 'src/app/shared/tools/validators/ngrxValueConverters';

@Component({
  selector: 'app-batch-creation-tmscriteria',
  templateUrl: './batch-creation-tmscriteria.component.html',
  styleUrls: ['./batch-creation-tmscriteria.component.scss']
})
export class BatchCreationTMSCriteriaComponent implements OnInit {
  formState$: Observable<FormGroupState<any>>;
  redmineProjectsFiltered$: Observable<RedmineProject[]> | null = null;
  trimUpper = trimUpperConverter;

  constructor(private store: Store<fromItemsState.State>) {
    this.formState$ = this.store.select(fromBatchItemsSelectors.getBatchItemCreationTMSCriteriaFormState);
  }

  ngOnInit(): void { 

    this.store.select(fromCommonItemsSelectors.getRedmineProjectsLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineProjects());
    });

    this.redmineProjectsFiltered$ = this.store.select(fromBatchItemsSelectors.getRedmineProjectsFilteredForBatchItemCreation);

  }
}
