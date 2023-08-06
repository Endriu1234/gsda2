import { Injectable } from "@angular/core";
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as fromSharedState from './shared.state';
import { Router } from "@angular/router";
import { noopAction, openLinkInNewWindow } from "./shared.actions";
import { of, switchMap } from "rxjs";

@Injectable()
export class SharedEffects {
    constructor(private actions$: Actions,
        private sharedStore: Store<fromSharedState.State>) { }

        openLinkInNewWindow$ = createEffect(() => this.actions$.pipe(
            ofType(openLinkInNewWindow),
            switchMap((link) => {
                window.open(link.url, '_blank');
                return of(noopAction());
            }))
        );

}
