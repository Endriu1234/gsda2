import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormGroupState } from 'ngrx-forms';
import * as fromCacheRefreshSelectors from '../../../store/selectors/setup.selectors';
import * as fromItemsState from '../../../store/state/setup.state';
import { refreshCache, refreshCustomFields, refreshEmailSettings, refreshRedmineProjects, refreshSDProjects, refreshUserPreferences, refreshVersions } from 'src/app/setup/store/actions/setup.actions';

@Component({
  selector: 'app-cache',
  templateUrl: './cache.page.html',
  styleUrls: ['./cache.page.scss']
})
export class CachePage implements OnInit {

  formState$: Observable<FormGroupState<any>>;
  isCacheRefreshingInProgress$: Observable<boolean> | null = null;

  constructor(private store: Store<fromItemsState.State>) {
    this.formState$ = this.store.select(fromCacheRefreshSelectors.getCacheRefreshFormState);
  }

  ngOnInit(): void {
    this.isCacheRefreshingInProgress$ = this.store.select(fromCacheRefreshSelectors.getItemCreationFormCanActivateSave);
  }

  refreshCache() {
    this.store.dispatch(refreshCache());
  }

  refreshUserPreferences() {
    this.store.dispatch(refreshUserPreferences());
  }
  refreshEmailSettings() {
    this.store.dispatch(refreshEmailSettings());
  }
  refreshCustomFields() {
    this.store.dispatch(refreshCustomFields());
  }
  refreshRedmineProjects() {
    this.store.dispatch(refreshRedmineProjects());
  }
  refreshSDProjects() {
    this.store.dispatch(refreshSDProjects());
  }
  refreshVersions() {
    this.store.dispatch(refreshVersions());
  }
}
