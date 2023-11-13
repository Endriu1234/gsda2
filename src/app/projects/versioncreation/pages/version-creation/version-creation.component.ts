import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { FormGroupState, SetUserDefinedPropertyAction } from 'ngrx-forms';
import * as fromProjectsSelectors from "../../../store/projects.selectors";
import * as fromProjectsState from '../../../store/state/projects.state';
import * as fromSharedState from '../../../../shared/store/shared.state';
import { RedmineProject } from 'src/app/shared/store/models/redmine-project.model';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { initRedmineProjects, initSoftDevProjects } from 'src/app/projects/store/projects.actions';
import { FORM_SAVE_STATE, FormSaveState } from '../../../../shared/store/shared.state';
import { SoftDevProject } from 'src/app/shared/store/models/softdev-project.model';
import { dateValueConverter } from 'src/app/shared/tools/validators/ngrxValueConverters';
import { VERSION_CREATION_FORMID } from 'src/app/projects/store/state/prjects.version-creation-state';

@Component({
  selector: 'app-version-creation',
  templateUrl: './version-creation.component.html',
  styleUrls: ['./version-creation.component.scss']
})
export class VersionCreationComponent implements OnInit  {

  projectsFiltered$: Observable<RedmineProject[]> | null = null;
  formState$: Observable<FormGroupState<any>>;
  canActivateVersionSave$: Observable<boolean> | null = null;
  softDevProjectsFiltered$: Observable<SoftDevProject[]> | null = null;
  dateConverter = dateValueConverter;

  constructor(private store: Store<fromProjectsState.State>, private sharedStore: Store<fromSharedState.State>, private dialog: MatDialog) {
    this.formState$ = this.store.select(fromProjectsSelectors.getVersionCreationFormState);
  }

  ngOnInit(): void {

    this.store.select(fromProjectsSelectors.getRedmineProjectsLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineProjects());
    });

    this.store.select(fromProjectsSelectors.getSoftDevProjectsLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initSoftDevProjects());
    });

    this.projectsFiltered$ = this.store.select(fromProjectsSelectors.getRedmineProjectsForVersionFiltered);

    this.softDevProjectsFiltered$ = this.store.select(fromProjectsSelectors.getSoftDevProjectsForVersionFiltered);

    this.canActivateVersionSave$ = this.store.select(fromProjectsSelectors.canActivateVersionSave);
  }

  createVersion() {
    this.store.dispatch(new SetUserDefinedPropertyAction(VERSION_CREATION_FORMID, FORM_SAVE_STATE, FormSaveState.Saving))
  }

  createAndOpenVersion() {
    this.store.dispatch(new SetUserDefinedPropertyAction(VERSION_CREATION_FORMID, FORM_SAVE_STATE, FormSaveState.SavingWithRedirect))
  }
}
