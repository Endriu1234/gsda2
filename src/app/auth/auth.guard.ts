import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Store } from "@ngrx/store";
import { map, Observable, take } from "rxjs";
import { State } from "./store/auth.state";
import { getIsUserLogged } from "./store/auth.selectors";
import { setRedirectURLForLogin } from "./store/auth.actions";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private store: Store<State>) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.store.select(getIsUserLogged)
            .pipe(
                take(1),
                map(isLogged => {

                    if (isLogged)
                        return true;

                    this.store.dispatch(setRedirectURLForLogin({ url: state.url }));
                    return this.router.createUrlTree(['/auth/login']);
                }));
    }
}