import { Action } from '@ngrx/store';
import { User, UserRelatedObject } from 'user-management/models';

export const LOAD_USER = '[ADMIN] Load User';
export const LOAD_USER_SUCCESS = '[ADMIN] Load User Success';
export const ADD_USER = '[ADMIN] Add User';
export const UPDATE_USER = '[ADMIN] Update User';
export const DELETE_USER = '[ADMIN] Delete User';
export const UPDATE_RELATED_OBJECT_IN_USER = '[ADMIN] Update Related Object In User';
export const ADD_GROUPS_TO_USER = '[ADMIN] Add Groups To User';
export const REMOVE_GROUP_FROM_USER = '[ADMIN] Remove Group From User';
export const LOAD_USER_AS_CHILD = '[ADMIN] Load User As Child';
export const FINISHED_NETWORK_REQUEST_FOR_USER = '[ADMIN] Finished Network Request for User';
export const FINISHED_GENERIC_NETWORK_REQUEST_FOR_USER = '[ADMIN] Finished Generic Network Request for User';
export const USER_FAILURE = '[ADMIN] User Failure';
export const GENERIC_USER_FAILURE = '[ADMIN] Generic User Failure';
export const REMOVE_USER_FROM_LOCAL_MEMORY = '[ADMIN] Remove User From Local Memory';

export class LoadUser implements Action {
  readonly type = LOAD_USER;
  constructor(public payload: string) { }
}

export class LoadUserSuccess implements Action {
  readonly type = LOAD_USER_SUCCESS;
  constructor(public payload: User) { }
}

export class AddUser implements Action {
  readonly type = ADD_USER;
  constructor(public payload: { 
    user: Partial<User>;
    accountId: string;
  }) { }
}

export class UpdateUser implements Action {
  readonly type = UPDATE_USER;
  constructor(public payload: User) { }
}

export class DeleteUser implements Action {
  readonly type = DELETE_USER;
  constructor(public payload: User) { }
}

export class UpdateRelatedObjectInUser implements Action {
  readonly type = UPDATE_RELATED_OBJECT_IN_USER;
  constructor(public payload: {object: UserRelatedObject, paths: string[]}) {}
}

export class AddGroupsToUser implements Action {
  readonly type = ADD_GROUPS_TO_USER;
  constructor(public payload: {userId: string, groupsIds: string[]}) {}
}

export class RemoveGroupFromUser implements Action {
  readonly type = REMOVE_GROUP_FROM_USER;
  constructor(public payload: {userId: string, groupId: string}) {}
}

export class LoadUserAsChild implements Action {
  readonly type = LOAD_USER_AS_CHILD;
  constructor(public payload: string) { }
}

export class FinishedNetworkRequestForUser implements Action {
  readonly type = FINISHED_NETWORK_REQUEST_FOR_USER;
  constructor(public payload: string) { }
}

export class FinishedGenericNetworkRequestForUser implements Action {
  readonly type = FINISHED_GENERIC_NETWORK_REQUEST_FOR_USER;
}

export class UserFailure implements Action {
  readonly type = USER_FAILURE;
  constructor(public payload: { id: string; error: Error }) { }
}

export class GenericUserFailure implements Action {
  readonly type = GENERIC_USER_FAILURE;
  constructor(public payload: Error) { }
}

export class RemoveUserFromLocalMemory implements Action {
  readonly type = REMOVE_USER_FROM_LOCAL_MEMORY;
  constructor(public payload: string) { }
}

export type UserActions = 
  | LoadUser
  | LoadUserSuccess
  | AddUser
  | UpdateUser
  | DeleteUser
  | UpdateRelatedObjectInUser
  | AddGroupsToUser
  | RemoveGroupFromUser
  | LoadUserAsChild
  | FinishedNetworkRequestForUser
  | FinishedGenericNetworkRequestForUser
  | UserFailure
  | GenericUserFailure
  | RemoveUserFromLocalMemory;
