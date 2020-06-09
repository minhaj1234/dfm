import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import { rootActions, rootReducers, rootSelectors } from 'core/root-store';
import { of, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatedGuardService implements CanActivate {
  routerState: RouterReducerState<rootReducers.routerReducer.IRouterStateUrl>;
  constructor(private store: Store<rootReducers.IState>) {
    this.store.pipe(select(rootSelectors.getRouterState)).subscribe((state) => {
      this.routerState = state;
    });
  }

  canActivate(data): Observable<boolean> {
    return this.store.pipe(
      select(rootSelectors.getIsAuthorized),
      tap((result) => {
        if (!result) {
          this.store.dispatch(new rootActions.StartLogin());
        }
      }),
    );
  }
}
