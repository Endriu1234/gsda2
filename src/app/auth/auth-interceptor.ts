import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable, map, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from './store/auth.state';
import { getToken } from './store/auth.selectors';
import { take, first, mergeMap } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private store: Store<State>) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return this.store.select(getToken).pipe(
            first(),
            mergeMap(token => {
                let authReq = request;

                if (token)
                    authReq = request.clone({ setHeaders: { Authorization: 'Bearer ' + token } });

                return next.handle(authReq);
            }),
        );
    }
}
