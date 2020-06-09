import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { BASE_ROUTE } from 'core/constants';
import { MessageService } from 'core/services';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as authActions from '../../actions';
import { AuthService } from '../../services/auth/auth.service';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService,
  ) { }

  @Effect({ dispatch: false })
  startLogin$ = this.actions$.pipe(
    ofType(authActions.START_LOGIN),
    tap((action: authActions.StartLogin) => {
      this.auth.renewToken(BASE_ROUTE);
    }),
  );

  @Effect({ dispatch: false })
  logout$ = this.actions$.pipe(
    ofType(authActions.LOGOUT),
    tap(() => {
      this.auth.logout();
    }),
  );

  @Effect()
  startValidation$ = this.actions$.pipe(
    ofType(authActions.START_VALIDATION),
    switchMap((action: authActions.StartValidation) =>
      this.auth.handleAuthentication(action.payload).pipe(
        map((authResult) => new authActions.ValidationSuccess(authResult)),
        catchError((error) => of(new authActions.ValidationFailure(error))),
      ),
    ),
  );

  @Effect({ dispatch: false })
  validationFailure$ = this.actions$.pipe(
    ofType(authActions.VALIDATION_FAILURE),
    tap((action: authActions.ValidationFailure) => {
      console.log(action.payload);
    }),
  );

  @Effect({ dispatch: false })
  authorizationFailure$ = this.actions$.pipe(
    ofType(authActions.AUTHORIZATION_FAILURE),
    tap((action: authActions.AuthorizationFailure) => {
      console.log(action.payload);
    }),
  );

  @Effect({ dispatch: false })
  validationSuccess$ = this.actions$.pipe(
    ofType(authActions.VALIDATION_SUCCESS),
    tap((action: authActions.ValidationSuccess) => {
      this.auth.scheduleRenewal(action.payload.expiresAt);
      this.router.navigateByUrl(decodeURIComponent(action.payload.redirectToUrl !== undefined ? action.payload.redirectToUrl : ''));
    }),
  );

  @Effect()
  forgotPassword$ = this.actions$.pipe(
    ofType(authActions.FORGOT_PASSWORD),
    switchMap((action: authActions.ForgotPassword) => {

      return this.auth.forgotPassword(action.payload).pipe(
        map(() => new authActions.ForgotPasswordSuccess()),
        catchError((error) => of(new authActions.ForgotPasswordFailure(error))),
      );
    }),
  );

  @Effect({ dispatch: false })
  forgotPasswordSuccess$ = this.actions$.pipe(
    ofType(authActions.FORGOT_PASSWORD_SUCCESS),
    tap((action: authActions.ForgotPasswordSuccess) => {
      this.messageService.showSuccess(['resources.newPasswordHasBeenSuccessfullySentOnYourEmail'], 'resources.forgotPassword');
    }),
  );

  @Effect({ dispatch: false })
  forgotPasswordFailure$ = this.actions$.pipe(
    ofType(authActions.FORGOT_PASSWORD_FAILURE),
    tap((action: authActions.ForgotPasswordFailure) => {
      this.messageService.handleError(action.payload, 'resources.forgotPassword');
    }),
  );
}
