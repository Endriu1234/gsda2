import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { FormGroupState, SetUserDefinedPropertyAction } from 'ngrx-forms';
import * as fromProjectsSelectors from "../../../store/projects.selectors";
import * as fromProjectsState from '../../../store/state/projects.state';
import * as fromProjectState from '../../../store/state/projects.project-creation-state'
import * as fromSharedState from '../../../../shared/store/shared.state';
import { RedmineProject } from 'src/app/shared/store/models/redmine-project.model';
import { FormControl } from '@angular/forms';
import { ProjectCreationFromId } from "../project-creation-from-id/project-creation-from-id";
import { MatDialog } from '@angular/material/dialog';
import { initRedmineProjects } from 'src/app/projects/store/projects.actions';
import { FORM_SAVE_STATE, FormSaveState } from '../../../../shared/store/shared.state';

@Component({
  selector: 'app-project-creation',
  templateUrl: './project-creation.page.html',
  styleUrls: ['./project-creation.page.scss']
})
export class ProjectCreationPage implements OnInit {

  projectsFiltered$: Observable<RedmineProject[]> | null = null;
  formState$: Observable<FormGroupState<any>>;
  getProjectCreationFormCanActivateSave$: Observable<boolean> | null = null;
  rmAutoProject = new FormControl('');

  constructor(private store: Store<fromProjectsState.State>, private sharedStore: Store<fromSharedState.State>, private dialog: MatDialog) {
    this.formState$ = this.store.select(fromProjectsSelectors.getProjectCreationFormState);
  }

  openFromIdDialog(): void {
    const dialogRef = this.dialog.open(ProjectCreationFromId, {
      width: '65%',
      disableClose: true,
      enterAnimationDuration: 500,
      exitAnimationDuration: 500,
      restoreFocus: false
    });
  }

  ngOnInit(): void {

    this.store.select(fromProjectsSelectors.getRedmineProjectsLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineProjects());
    });

    this.projectsFiltered$ = this.store.select(fromProjectsSelectors.getRedmineProjectsFiltered);

    this.getProjectCreationFormCanActivateSave$ = this.store.select(fromProjectsSelectors.getProjectCreationFormCanActivateSave);
  }

  createProject() {
    this.store.dispatch(new SetUserDefinedPropertyAction(fromProjectState.PROJECT_CREATION_FORMID, FORM_SAVE_STATE, FormSaveState.Saving))
  }

  createAndOpenProject() {
    this.store.dispatch(new SetUserDefinedPropertyAction(fromProjectState.PROJECT_CREATION_FORMID, FORM_SAVE_STATE, FormSaveState.SavingWithRedirect))
  }

}
