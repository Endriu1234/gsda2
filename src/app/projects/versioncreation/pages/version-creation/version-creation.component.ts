import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { FormGroupState, SetUserDefinedPropertyAction } from 'ngrx-forms';
import * as fromProjectsSelectors from "../../../store/projects.selectors";
import * as fromProjectsState from '../../../store/state/projects.state';
import * as fromSharedState from '../../../../shared/store/shared.state';
import { RedmineProject } from 'src/app/shared/store/models/redmine-project.model';
import { MatDialog } from '@angular/material/dialog';
import { initRedmineProjects, initSoftDevProjects } from 'src/app/projects/store/projects.actions';
import { FORM_SAVE_STATE, FORM_UPDATE_STATE, FormSaveState, FormUpdateState } from '../../../../shared/store/shared.state';
import { SoftDevProject } from 'src/app/shared/store/models/softdev-project.model';
import { dateValueConverter } from 'src/app/shared/tools/validators/ngrxValueConverters';
import { VERSION_CREATION_FORMID } from 'src/app/projects/store/state/prjects.version-creation-state';
import { RedmineVersion } from 'src/app/shared/store/models/redmine-version.model';

@Component({
  selector: 'app-version-creation',
  templateUrl: './version-creation.component.html',
  styleUrls: ['./version-creation.component.scss']
})
export class VersionCreationComponent implements OnInit  {

  projectsFiltered$: Observable<RedmineProject[]> | null = null;
  formState$: Observable<FormGroupState<any>>;
  canActivateVersionSave$: Observable<boolean> | null = null;
  canActivateVersionUpdate$: Observable<boolean> | null = null;
  softDevProjectsFiltered$: Observable<SoftDevProject[]> | null = null;
  versions$: Observable<RedmineVersion[]> | null = null;
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

    this.versions$ = this.store.select(fromProjectsSelectors.getRedmineVersionsByProject);

    this.projectsFiltered$ = this.store.select(fromProjectsSelectors.getRedmineProjectsForVersionFiltered);

    this.softDevProjectsFiltered$ = this.store.select(fromProjectsSelectors.getSoftDevProjectsForVersionFiltered);

    this.canActivateVersionSave$ = this.store.select(fromProjectsSelectors.canActivateVersionSave);
    this.canActivateVersionUpdate$ = this.store.select(fromProjectsSelectors.canActivateVersionUpdate);
  }

  createVersion() {
    this.store.dispatch(new SetUserDefinedPropertyAction(VERSION_CREATION_FORMID, FORM_SAVE_STATE, FormSaveState.Saving));
  }

  createAndOpenVersion() {
    this.store.dispatch(new SetUserDefinedPropertyAction(VERSION_CREATION_FORMID, FORM_SAVE_STATE, FormSaveState.SavingWithRedirect));
  }

  updateVersion() {
    this.store.dispatch(new SetUserDefinedPropertyAction(VERSION_CREATION_FORMID, FORM_UPDATE_STATE, FormUpdateState.Updating));
  }

  updateAndOpenVersion() {
    this.store.dispatch(new SetUserDefinedPropertyAction(VERSION_CREATION_FORMID, FORM_UPDATE_STATE, FormUpdateState.UpdatingWithRedirect));
  }
}
