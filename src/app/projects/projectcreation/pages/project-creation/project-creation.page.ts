import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import * as fromRoot from '../../../../app.reducer';
import * as fromItemsSelectors from "../../../../items/store/items.selectors";
import { initRedmineProjects, setRedmineProjectsFilter } from "../../../../items/store/items.actions";
import { RedmineProject } from 'src/app/items/store/models/redmine-project.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-project-creation',
  templateUrl: './project-creation.page.html',
  styleUrls: ['./project-creation.page.scss']
})
export class ProjectCreationPage implements OnInit {

  projects$: Observable<RedmineProject[]> | null = null;
  projectsFiltered$: Observable<RedmineProject[]> | null = null;
  rmAutoProject = new FormControl('');

  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit(): void {

    this.store.select(fromItemsSelectors.getRedmineProjectsLoaded).pipe(take(1)).subscribe((loaded: boolean) => {
      if (!loaded)
        this.store.dispatch(initRedmineProjects());
    });

    this.projectsFiltered$ = this.store.select(fromItemsSelectors.getRedmineProjectsFiltered);

    // this.rmAutoProject.valueChanges
    //   .subscribe(redmineProjectsFilter => {
    //     redmineProjectsFilter
    //     this.store.dispatch(setRedmineProjectsFilter({ redmineProjectsFilter: { filter: redmineProjectsFilter } }))
    //   });
  }

}
