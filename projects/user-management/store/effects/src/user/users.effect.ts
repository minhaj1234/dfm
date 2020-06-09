import { Injectable } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AuthenticatedUser } from 'core/models';
import { rootSelectors } from 'core/root-store';
import { MessageService } from 'core/services';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { User, USER_MANAGEMENT_OBJECTS } from 'user-management/models';
import { UsersService } from 'user-management/services';
import * as fromActions from 'user-management/store/actions';
import { IDecisionFirstState } from 'user-management/store/reducers';
import { fromUser } from 'user-management/utilities';

@Injectable()
export class UsersEffects {
  constructor(
    private actions$: Actions,
    private usersService: UsersService,
    private toastrService: NbToastrService,
    private store: Store<IDecisionFirstState>,
    private messageService: MessageService,
  ) { }

  @Effect()
  loadUser$ = this.actions$.pipe(
    ofType(fromActions.LOAD_USER),
    mergeMap((action: fromActions.LoadUser) => {
      return this.usersService.getSingleEdit(action.payload).pipe(
        mergeMap(user => this.usersService.withRelatedObjects(user)),
        map((user: User) => {
          return new fromActions.LoadUserSuccess(user);
        }),
        catchError((error) =>
          of(new fromActions.UserFailure({ error, id: action.payload })),
        ),
      );
    }),
  );

  @Effect()
  addUser$ = this.actions$.pipe(
    ofType(fromActions.ADD_USER),
    withLatestFrom(this.store.select(rootSelectors.getAuthenticatedUser)),
    switchMap(([action, authenticatedUser]: [fromActions.AddUser, AuthenticatedUser]) => {
      const user = { ...action.payload.user, createdBy: authenticatedUser.userId };
      let userToCreate = new User();
      userToCreate = fromUser(user);
      return this.usersService.createUser(userToCreate, action.payload.accountId).pipe(
        switchMap(() => [new fromActions.FinishedGenericNetworkRequestForUser()]),
        catchError((error) => of(new fromActions.GenericUserFailure(error))),
      );
    }),
  );

  @Effect()
  updateUser$ = this.actions$.pipe(
    ofType(fromActions.UPDATE_USER),
    switchMap((action: fromActions.UpdateUser) => {
      let userToPatch = new User();
      userToPatch = fromUser(action.payload);
      return this.usersService.patch(userToPatch).pipe(
        map(() => new fromActions.FinishedNetworkRequestForUser(action.payload.id)),
        catchError((error) =>
          of(new fromActions.UserFailure({ error, id: action.payload.id })),
        ),
      );
    }),
  );

  @Effect()
  deleteUser$ = this.actions$.pipe(
    ofType(fromActions.DELETE_USER),
    switchMap((action: fromActions.DeleteUser) => {
      return this.usersService.delete(action.payload).pipe(
        map(() => new fromActions.FinishedNetworkRequestForUser(action.payload.id)),
        catchError((error) =>
          of(new fromActions.UserFailure({ error, id: action.payload.id })),
        ),
      );
    }),
  );

  @Effect()
  loadUserAsChild$ = this.actions$.pipe(
    ofType(fromActions.LOAD_USER_AS_CHILD),
    switchMap((action: fromActions.LoadUserAsChild) => {
      return this.usersService.getSingleMinimal(action.payload).pipe(
        switchMap((user: User) => {
          return [
            new fromActions.UpdateRelatedObjectInCustomer({object: user, paths: [USER_MANAGEMENT_OBJECTS.User.resourceName]}),
            new fromActions.UpdateRelatedObjectInGroup({object: user, paths: [USER_MANAGEMENT_OBJECTS.User.resourceName]}),
          ];
        }),
        catchError((error) => of(new fromActions.UserFailure({ error, id: action.payload }))),
      );
    }),
  );

  @Effect()
  addGroupsToUser$ = this.actions$.pipe(
    ofType(fromActions.ADD_GROUPS_TO_USER),
    switchMap((action: fromActions.AddGroupsToUser) => {
      return this.usersService.addGroupsToUser(action.payload.userId, action.payload.groupsIds).pipe(
        map(() => new fromActions.FinishedNetworkRequestForUser(action.payload.userId)),
        catchError((error) => of(new fromActions.UserFailure({ error, id: action.payload.userId }))),
      );
    }),
  );

  @Effect()
  removeGroupFromUser$ = this.actions$.pipe(
    ofType(fromActions.REMOVE_GROUP_FROM_USER),
    switchMap((action: fromActions.RemoveGroupFromUser) => {
      return this.usersService.removeGroupFromUser(action.payload.userId, action.payload.groupId).pipe(
        map(() => new fromActions.FinishedNetworkRequestForUser(action.payload.userId)),
        catchError((error) => of(new fromActions.UserFailure({ error, id: action.payload.userId }))),
      );
    }),
  );


  @Effect({ dispatch: false })
  userFailure$ = this.actions$.pipe(
    ofType(fromActions.USER_FAILURE),
    tap(({ payload }: fromActions.UserFailure) => {
      this.messageService.handleError(payload.error, 'resources.user');
    }),
  );

  @Effect({ dispatch: false })
  genericUserFailure$ = this.actions$.pipe(
    ofType(fromActions.GENERIC_USER_FAILURE),
    tap(({ payload }: fromActions.GenericUserFailure) => {
      this.messageService.handleError(payload, 'resources.user');
    }
    ),
  );
}
