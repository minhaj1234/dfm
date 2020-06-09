import { Injectable } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AuthenticatedUser } from 'core/models';
import { rootSelectors } from 'core/root-store';
import { MessageService } from 'core/services';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Group,  USER_MANAGEMENT_OBJECTS } from 'user-management/models';
import { GroupsService } from 'user-management/services';
import * as fromActions from 'user-management/store/actions';
import { IDecisionFirstState } from 'user-management/store/reducers';
import { fromGroup } from 'user-management/utilities';

@Injectable()
export class GroupsEffects {
  constructor(
    private actions$: Actions,
    private groupsService: GroupsService,
    private toastrService: NbToastrService,
    private store: Store<IDecisionFirstState>,
    private messageService: MessageService,
  ) { }

  @Effect()
  loadGroup$ = this.actions$.pipe(
    ofType(fromActions.LOAD_GROUP),
    mergeMap((action: fromActions.LoadGroup) => {
      return this.groupsService.getSingleEdit(action.payload).pipe(
        mergeMap(group => this.groupsService.withRelatedObjects(group)),
        map((group: Group) => {
          return new fromActions.LoadGroupSuccess(group);
        }),
        catchError((error) =>
          of(new fromActions.GroupFailure({ error, id: action.payload })),
        ),
      );
    }),
  );

  @Effect()
  addGroup$ = this.actions$.pipe(
    ofType(fromActions.ADD_GROUP),
    withLatestFrom(this.store.select(rootSelectors.getAuthenticatedUser)),
    switchMap(([action, authenticatedUser]: [fromActions.AddGroup, AuthenticatedUser]) => {
      const group = { ...action.payload.group, createdBy: authenticatedUser.userId };
      const groupToCreate = fromGroup(group);
      return this.groupsService.createGroup(groupToCreate, action.payload.accountId).pipe(
        switchMap(() => [new fromActions.FinishedGenericNetworkRequestForGroup()]),
        catchError((error) => of(new fromActions.GenericGroupFailure(error))),
      );
    }),
  );

  @Effect()
  updateGroup$ = this.actions$.pipe(
    ofType(fromActions.UPDATE_GROUP),
    switchMap((action: fromActions.UpdateGroup) => {
      const groupToPatch = fromGroup(action.payload);
      return this.groupsService.patch(groupToPatch).pipe(
        map(() => new fromActions.FinishedNetworkRequestForGroup(action.payload.id)),
        catchError((error) =>
          of(new fromActions.GroupFailure({ error, id: action.payload.id })),
        ),
      );
    }),
  );

  @Effect()
  deleteGroup$ = this.actions$.pipe(
    ofType(fromActions.DELETE_GROUP),
    switchMap((action: fromActions.DeleteGroup) => {
      return this.groupsService.delete(action.payload).pipe(
        map(() => new fromActions.FinishedNetworkRequestForGroup(action.payload.id)),
        catchError((error) =>
          of(new fromActions.GroupFailure({ error, id: action.payload.id })),
        ),
      );
    }),
  );

  @Effect()
  addusersToGroup$ = this.actions$.pipe(
    ofType(fromActions.ADD_USERS_TO_GROUP),
    switchMap((action: fromActions.AddUsersToGroup) => {
      return this.groupsService.addUsersToGroup(action.payload.groupId, action.payload.usersIds).pipe(
        map(() => new fromActions.FinishedNetworkRequestForGroup(action.payload.groupId)),
        catchError((error) => of(new fromActions.GroupFailure({ error, id: action.payload.groupId }))),
      );
    }),
  );

  @Effect()
  removeUserFromGroup$ = this.actions$.pipe(
    ofType(fromActions.REMOVE_USER_FROM_GROUP),
    switchMap((action: fromActions.RemoveUserFromGroup) => {
      return this.groupsService.removeUserFromGroup(action.payload.groupId, action.payload.userId).pipe(
        map(() => new fromActions.FinishedNetworkRequestForGroup(action.payload.groupId)),
        catchError((error) => of(new fromActions.GroupFailure({ error, id: action.payload.groupId }))),
      );
    }),
  );

  @Effect()
  loadGroupAsChild$ = this.actions$.pipe(
    ofType(fromActions.LOAD_GROUP_AS_CHILD),
    switchMap((action: fromActions.LoadGroupAsChild) => {
      return this.groupsService.getSingleMinimal(action.payload).pipe(
        switchMap((group: Group) => {
          return [
            new fromActions.UpdateRelatedObjectInCustomer({ object: group, paths: [USER_MANAGEMENT_OBJECTS.Group.resourceName] }),
            new fromActions.UpdateRelatedObjectInUser({ object: group, paths: [USER_MANAGEMENT_OBJECTS.Group.resourceName] }),
          ];
        }),
        catchError((error) => of(new fromActions.GroupFailure({ error, id: action.payload }))),
      );
    }),
  );

  @Effect({ dispatch: false })
  groupFailure$ = this.actions$.pipe(
    ofType(fromActions.GROUP_FAILURE),
    tap(({ payload }: fromActions.GroupFailure) => {
      this.messageService.handleError(payload.error, 'resources.group');
    }),
  );

  @Effect({ dispatch: false })
  genericGroupFailure$ = this.actions$.pipe(
    ofType(fromActions.GENERIC_GROUP_FAILURE),
    tap(({ payload }: fromActions.GenericGroupFailure) =>
      this.messageService.handleError(payload, 'resources.group')
    ),
  );
}
