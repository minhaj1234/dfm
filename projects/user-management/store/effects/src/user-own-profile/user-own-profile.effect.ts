import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { MessageService } from 'core/services';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { UsersService } from 'user-management/services';
import * as fromActions from 'user-management/store/actions';

@Injectable()
export class UserOwnProfileEffects {
  constructor(
    private actions$: Actions,
    private usersService: UsersService,
    private messageService: MessageService,
  ) { }

  @Effect()
  changePassword$ = this.actions$.pipe(
    ofType(fromActions.CHANGE_PASSWORD),
    switchMap((action: fromActions.ChangePassword) => {
      return this.usersService.changePassword(action.payload).pipe(
        map((authResult) => new fromActions.ChangePasswordSuccess()),
        catchError((error) => of(new fromActions.ChangePasswordFailure(error))),
      );
      }
    ),
  );

  @Effect({ dispatch: false })
  changePasswordSuccess$ = this.actions$.pipe(
    ofType(fromActions.CHANGE_PASSWORD_SUCCESS),
    tap((action: fromActions.ChangePasswordSuccess) => {
      this.messageService.showSuccess(['resources.passwordWasChangedSuccessfully'], 'resources.changePassword');
    }),
  );
}
