import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { take, tap } from 'rxjs';
import * as fromRoot from '../../../../app.reducer';
import * as fromItems from '../../../store/items.reducer';
import { initRedmineTrackers } from '../../../store/items.actions';
import { RedmineTracker } from 'src/app/items/store/models/redmine-tracker.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-item-creation',
  templateUrl: './item-creation.page.html',
  styleUrls: ['./item-creation.page.scss']
})
export class ItemCreationPage implements OnInit {

  trackers$: Observable<RedmineTracker[]> | null = null;

  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit(): void {

    this.store.select(fromItems.getRedmineTrackersLoaded).pipe(take(1)).subscribe(loaded => {
      if (!loaded)
        this.store.dispatch(initRedmineTrackers());
    });

    this.trackers$ = this.store.select(fromItems.getRedmineTrackers);
  }

}
