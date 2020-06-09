import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthenticatedGuardService } from 'core/auth';
import { rootActions, rootReducers, rootSelectors } from 'core/root-store';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UserType } from 'user-management/models';
import { ONLY_ADMINISTRATORS_HAVE_ACCESS_ERROR_MESSAGE } from './admin-authenticated-guard.const';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthenticatedGuardService extends AuthenticatedGuardService {
  constructor(private adminStore: Store<rootReducers.IState>) {
    super(adminStore);
  }

  canActivate(data): Observable<boolean> {
    return combineLatest([
      this.adminStore.select(rootSelectors.getAuthenticatedUserType),
      super.canActivate(data),
    ])
      .pipe(
        tap(([userType, isAuthorized]) => {
          if (userType !== UserType.ADMIN) {
            this.adminStore.dispatch(new rootActions.AuthorizationFailure(new Error(ONLY_ADMINISTRATORS_HAVE_ACCESS_ERROR_MESSAGE)));
          }
        }),
        map(([userType, isAuthorized]) => {
          return isAuthorized && userType === UserType.ADMIN;
        }),
      );
  }
}
