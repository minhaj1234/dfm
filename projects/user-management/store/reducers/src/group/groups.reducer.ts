import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap } from 'core/models';
import { createNetworkAdapter, getNewEntitiesIfNeeded, StateWithNetworkActive } from 'core/utilities';
import { Group } from 'user-management/models';
import * as fromActions from 'user-management/store/actions';

export interface IGroupsState extends EntityState<Group>, StateWithNetworkActive {}

export const groupsAdapter: EntityAdapter<Group> = createEntityAdapter<Group>();
export const networkAdapter = createNetworkAdapter();

export const initialState: IGroupsState = {
  ...groupsAdapter.getInitialState(),
  ...networkAdapter.initialState,
};

const actionMap: IActionMap<IGroupsState, fromActions.GroupActions> = {
  [fromActions.LOAD_GROUP]: loadGroupHandler,
  [fromActions.LOAD_GROUP_SUCCESS]: loadGroupSuccessHandler,
  [fromActions.ADD_GROUP]: addGroupHandler,
  [fromActions.UPDATE_GROUP]: updateGroupHandler,
  [fromActions.DELETE_GROUP]: deleteGroupHandler,
  [fromActions.UPDATE_RELATED_OBJECT_IN_GROUP]: updateRelatedObjectInGroupHandler,
  [fromActions.ADD_USERS_TO_GROUP]: addUsersToGroupHandler,
  [fromActions.REMOVE_USER_FROM_GROUP]: removeUserFromGroupHandler,
  [fromActions.FINISHED_NETWORK_REQUEST_FOR_GROUP]: finishedNetworkRequestForGroupHandler,
  [fromActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_GROUP]: finishedGenericNetworkRequestForGroupHandler,
  [fromActions.GROUP_FAILURE]: groupFailureHandler,
  [fromActions.REMOVE_GROUP_FROM_LOCAL_MEMORY]: removeGroupFromLocalMemoryHandler,
};

export function reducer(
  state: IGroupsState = initialState,
  action: fromActions.GroupActions,
): IGroupsState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function loadGroupHandler(
  state: IGroupsState,
  action: fromActions.LoadGroup,
): IGroupsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload, state),
  };
}

function loadGroupSuccessHandler(
  state: IGroupsState,
  action: fromActions.LoadGroupSuccess,
): IGroupsState {
  return {
    ...groupsAdapter.upsertOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload.id, state),
  };
}

function addGroupHandler(
  state: IGroupsState,
  action: fromActions.AddGroup,
): IGroupsState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function updateGroupHandler(
  state: IGroupsState, 
  action: fromActions.UpdateGroup
): IGroupsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.id, state),
  };
}

function deleteGroupHandler(
  state: IGroupsState, 
  action: fromActions.DeleteGroup
): IGroupsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.id, state),
  };
}

function updateRelatedObjectInGroupHandler(
  state: IGroupsState,
  action: fromActions.UpdateRelatedObjectInGroup,
): IGroupsState {
  return {
    ...state,
    entities: getNewEntitiesIfNeeded(action.payload.object, state.entities, action.payload.paths),
  };
}

function removeUserFromGroupHandler(
  state: IGroupsState, 
  action: fromActions.RemoveUserFromGroup
): IGroupsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.groupId, state),
  };
}

function addUsersToGroupHandler(
  state: IGroupsState, 
  action: fromActions.AddUsersToGroup
): IGroupsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.groupId, state),
  };
}

function finishedNetworkRequestForGroupHandler(
  state: IGroupsState,
  action: fromActions.FinishedNetworkRequestForGroup,
): IGroupsState {
  return {
    ...state,
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

function finishedGenericNetworkRequestForGroupHandler(
  state: IGroupsState,
  action: fromActions.FinishedGenericNetworkRequestForGroup,
): IGroupsState {
  return {
    ...state,
    ...networkAdapter.makeGenericInactive(state),
  };
}

function groupFailureHandler(
  state: IGroupsState,
  action: fromActions.GroupFailure,
): IGroupsState {
  return {
    ...state,
    ...networkAdapter.makeOneInactive(action.payload.id, state),
  };
}

function removeGroupFromLocalMemoryHandler(
  state: IGroupsState,
  action: fromActions.RemoveGroupFromLocalMemory,
): IGroupsState {
  return {
    ...groupsAdapter.removeOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

export const { selectAnyNetworkActive, selectGenericNetworkActive, selectNetworkActive } = networkAdapter.selectors;
export const { selectAll, selectEntities, selectIds, selectTotal } = groupsAdapter.getSelectors();
