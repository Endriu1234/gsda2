import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import * as fromProjectsState from '../../../store/projects.state';
import * as fromProjectsSelectors from "../../../../projects/store/projects.selector";
import { SoftDevProject } from "src/app/projects/store/models/softdev-project.model";
import { findProjectById, initSoftDevProjects} from 'src/app/projects/store/projects.actions';
import { FormGroupState } from 'ngrx-forms';

@Component({
  selector: 'app-project-creation-from-id',
  templateUrl: './project-creation-from-id.html',
  styleUrls: ['./project-creation-from-id.scss']
})
export class ProjectCreationFromId implements OnInit {

  sdProjectsFiltered$: Observable<SoftDevProject[]> | null = null;
  dialogState$: Observable<FormGroupState<any>>;

  constructor (private store: Store<fromProjectsState.State>) {
    this.dialogState$ = this.store.select(fromProjectsSelectors.getProjectCreationDialogState); 
  }

  ngOnInit(): void {

    this.store.select(fromProjectsSelectors.getSoftDevProjectsLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initSoftDevProjects());
    });

    this.sdProjectsFiltered$ = this.store.select(fromProjectsSelectors.getSoftDevProjectsFiltered);
  }

  fillByProject() {
    let id = "";
    this.dialogState$.subscribe(group => id = group.controls.projectId.value );
    
    this.store.dispatch(findProjectById({id}));
  }

}
