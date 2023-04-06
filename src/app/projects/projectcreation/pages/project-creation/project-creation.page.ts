import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { FormGroupState } from 'ngrx-forms';
import * as fromProjectsSelectors from "../../../store/projects.selector";
import * as fromProjectsState from '../../../store/projects.state';
import * as fromShared from '../../../../shared/store/shared.reducer';
import { RedmineProject } from 'src/app/shared/store/models/redmine-project.model';
import { FormControl } from '@angular/forms';
import { ProjectCreationFromId} from "../project-creation-from-id/project-creation-from-id";
import { MatDialog } from '@angular/material/dialog';
import { initRedmineProjects } from 'src/app/projects/store/projects.actions';

@Component({
  selector: 'app-project-creation',
  templateUrl: './project-creation.page.html',
  styleUrls: ['./project-creation.page.scss']
})
export class ProjectCreationPage implements OnInit {

  projectsFiltered$: Observable<RedmineProject[]> | null = null;
  formState$: Observable<FormGroupState<any>>;
  rmAutoProject = new FormControl('');

  constructor(private store: Store<fromProjectsState.State>, private sharedStore: Store<fromShared.State>, private dialog: MatDialog) { 
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

  }

}
