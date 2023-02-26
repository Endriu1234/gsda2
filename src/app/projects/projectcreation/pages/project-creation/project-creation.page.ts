import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import * as fromRoot from '../../../../app.reducer';
import * as fromProjectsSelectors from "../../../store/projects.selector";
import { initRedmineProjects, setRedmineProjectsFilter } from "../../../store/projects.actions"
import { RedmineProject } from '../../../store/models/redmine-project.model';
import { FormControl } from '@angular/forms';
import { ProjectCreationFromId} from "../project-creation-from-id/project-creation-from-id";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-project-creation',
  templateUrl: './project-creation.page.html',
  styleUrls: ['./project-creation.page.scss']
})
export class ProjectCreationPage implements OnInit {

  projectsFiltered$: Observable<RedmineProject[]> | null = null;
  rmAutoProject = new FormControl('');

  constructor(private store: Store<fromRoot.State>, public dialog: MatDialog) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(ProjectCreationFromId, {
      width: '65%',
      disableClose: true,
      enterAnimationDuration: 500,
      exitAnimationDuration: 500,
      restoreFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit(): void {

    this.store.select(fromProjectsSelectors.getRedmineProjectsLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineProjects());
    });

    this.projectsFiltered$ = this.store.select(fromProjectsSelectors.getRedmineProjectsFiltered);

    // this.rmAutoProject.valueChanges
    //   .subscribe(redmineProjectsFilter => {
    //     redmineProjectsFilter
    //     this.store.dispatch(setRedmineProjectsFilter({ redmineProjectsFilter: { filter: redmineProjectsFilter } }))
    //   });
  }

}
