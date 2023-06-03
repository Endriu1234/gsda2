import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { RedmineProject } from 'src/app/shared/store/models/redmine-project.model';
import * as fromItemsState from '../../../store/items.state';
import * as fromItemsSelectors from '../../../store/items.selectors';
import { initRedmineProjects } from 'src/app/items/store/items.actions';
import { FormGroupState } from 'ngrx-forms';

@Component({
  selector: 'app-batch-creation-sdcriteria',
  templateUrl: './batch-creation-sdcriteria.component.html',
  styleUrls: ['./batch-creation-sdcriteria.component.scss']
})
export class BatchCreationSDCriteriaComponent implements OnInit {
  projectsFiltered$: Observable<RedmineProject[]> | null = null;
  formState$: Observable<FormGroupState<any>>;

  constructor(private store: Store<fromItemsState.State>) {
    this.formState$ = this.store.select(fromItemsSelectors.getBatchItemCreationSdCriteriaFormState);
  }
  ngOnInit(): void {

    this.store.select(fromItemsSelectors.getRedmineProjectsLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineProjects());
    });

    this.projectsFiltered$ = this.store.select(fromItemsSelectors.getRedmineProjectsFilteredForBatchItemCreation);

  }
}
