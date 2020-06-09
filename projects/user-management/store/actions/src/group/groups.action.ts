import { Action } from '@ngrx/store';
import { Group, GroupRelatedObject } from 'user-management/models';

export const LOAD_GROUP = '[ADMIN] Load Group';
export const LOAD_GROUP_SUCCESS = '[ADMIN] Load Group Success';
export const ADD_GROUP = '[ADMIN] Add Group';
export const UPDATE_GROUP = '[ADMIN] Update Group';
export const DELETE_GROUP = '[ADMIN] Delete Group';
export const UPDATE_RELATED_OBJECT_IN_GROUP = '[ADMIN] Update Related Object In Group';
export const ADD_USERS_TO_GROUP = '[ADMIN] Add Users To Group';
export const REMOVE_USER_FROM_GROUP = '[ADMIN] Remove Users From Group';
export const LOAD_GROUP_AS_CHILD = '[ADMIN] Load Group As Child';
export const FINISHED_NETWORK_REQUEST_FOR_GROUP = '[ADMIN] Finished Network Request for Group';
export const FINISHED_GENERIC_NETWORK_REQUEST_FOR_GROUP = '[ADMIN] Finished Generic Network Request for Group';
export const GROUP_FAILURE = '[ADMIN] Group Failure';
export const GENERIC_GROUP_FAILURE = '[ADMIN] Generic Group Failure';
export const REMOVE_GROUP_FROM_LOCAL_MEMORY = '[ADMIN] Remove Group From Local Memory';

export class LoadGroup implements Action {
  readonly type = LOAD_GROUP;
  constructor(public payload: string) { }
}

export class LoadGroupSuccess implements Action {
  readonly type = LOAD_GROUP_SUCCESS;
  constructor(public payload: Group) { }
}

export class AddGroup implements Action {
  readonly type = ADD_GROUP;
  constructor(public payload: {
    group: Partial<Group>;
    accountId: string;
  }) { }
}

export class UpdateGroup implements Action {
  readonly type = UPDATE_GROUP;
  constructor(public payload: Group) { }
}

export class DeleteGroup implements Action {
  readonly type = DELETE_GROUP;
  constructor(public payload: Group) { }
}

export class UpdateRelatedObjectInGroup implements Action {
  readonly type = UPDATE_RELATED_OBJECT_IN_GROUP;
  constructor(public payload: {object: GroupRelatedObject, paths: string[]}) {}
}

export class AddUsersToGroup implements Action {
  readonly type = ADD_USERS_TO_GROUP;
  constructor(public payload: {groupId: string, usersIds: string[]}) {}
}

export class RemoveUserFromGroup implements Action {
  readonly type = REMOVE_USER_FROM_GROUP;
  constructor(public payload: {userId: string, groupId: string}) {}
}

export class LoadGroupAsChild implements Action {
  readonly type = LOAD_GROUP_AS_CHILD;
  constructor(public payload: string) { }
}

export class FinishedNetworkRequestForGroup implements Action {
  readonly type = FINISHED_NETWORK_REQUEST_FOR_GROUP;
  constructor(public payload: string) { }
}

export class FinishedGenericNetworkRequestForGroup implements Action {
  readonly type = FINISHED_GENERIC_NETWORK_REQUEST_FOR_GROUP;
}

export class GroupFailure implements Action {
  readonly type = GROUP_FAILURE;
  constructor(public payload: { id: string; error: Error }) { }
}

export class GenericGroupFailure implements Action {
  readonly type = GENERIC_GROUP_FAILURE;
  constructor(public payload: Error) { }
}

export class RemoveGroupFromLocalMemory implements Action {
  readonly type = REMOVE_GROUP_FROM_LOCAL_MEMORY;
  constructor(public payload: string) { }
}

export type GroupActions = 
  | LoadGroup
  | LoadGroupSuccess
  | AddGroup
  | UpdateGroup
  | DeleteGroup
  | UpdateRelatedObjectInGroup
  | AddUsersToGroup
  | RemoveUserFromGroup
  | LoadGroupAsChild
  | FinishedNetworkRequestForGroup
  | FinishedGenericNetworkRequestForGroup
  | GroupFailure
  | GenericGroupFailure
  | RemoveGroupFromLocalMemory;
