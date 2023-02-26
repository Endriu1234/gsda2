import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import * as fromRoot from '../../../../app.reducer';
import * as fromProjectsSelectors from "../../../../projects/store/projects.selector";
import { SoftDevProject } from "src/app/projects/store/models/softdev-project.model";
import { initSoftDevProjects, setSoftDevProjectsFilter } from 'src/app/projects/store/projects.actions';

@Component({
  selector: 'app-project-creation-from-id',
  templateUrl: './project-creation-from-id.html',
  styleUrls: ['./project-creation-from-id.scss']
})
export class ProjectCreationFromId implements OnInit {

  sdProjectsFiltered$: Observable<SoftDevProject[]> | null = null;
  sdAutoProject = new FormControl('');

  constructor (private store: Store<fromRoot.State>, public dialogRef: MatDialogRef<ProjectCreationFromId>) {}

  ngOnInit(): void {

    this.store.select(fromProjectsSelectors.getSoftDevProjectsLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initSoftDevProjects());
    });

    this.sdProjectsFiltered$ = this.store.select(fromProjectsSelectors.getSoftDevProjectsFiltered);

    this.sdAutoProject.valueChanges
      .subscribe(softdevProjectsFilter => {
        softdevProjectsFilter
        this.store.dispatch(setSoftDevProjectsFilter({ softdevProjectsFilter: { filter: softdevProjectsFilter } }))
      });
  }

}
