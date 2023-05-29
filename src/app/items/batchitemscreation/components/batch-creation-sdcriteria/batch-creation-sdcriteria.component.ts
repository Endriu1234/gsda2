import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { RedmineProject } from 'src/app/shared/store/models/redmine-project.model';
import * as fromItemsState from '../../../store/items.state';
import * as fromItemsSelectors from '../../../store/items.selectors';

@Component({
  selector: 'app-batch-creation-sdcriteria',
  templateUrl: './batch-creation-sdcriteria.component.html',
  styleUrls: ['./batch-creation-sdcriteria.component.scss']
})
export class BatchCreationSDCriteriaComponent implements OnInit {
  projectsFiltered$: Observable<RedmineProject[]> | null = null;

  constructor(private store: Store<fromItemsState.State>) {
  }
  ngOnInit(): void {
    this.projectsFiltered$ = this.store.select(fromItemsSelectors.getRedmineProjectsFiltered);
    this.projectsFiltered$.pipe(take(1)).subscribe(d => {
      console.log('ngOnint');
      console.log(d);
    })

  }
}
