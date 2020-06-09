import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap } from 'core/models';
import { createNetworkAdapter, getNewEntitiesIfNeeded, StateWithNetworkActive } from 'core/utilities';
import { User } from 'user-management/models';
import * as fromActions from 'user-management/store/actions';

export interface IUsersState extends EntityState<User>, StateWithNetworkActive {}

export const usersAdapter: EntityAdapter<User> = createEntityAdapter<User>();
export const networkAdapter = createNetworkAdapter();

export const initialState: IUsersState = {
  ...usersAdapter.getInitialState(),
  ...networkAdapter.initialState,
};

const actionMap: IActionMap<IUsersState, fromActions.UserActions> = {
  [fromActions.LOAD_USER]: loadUserHandler,
  [fromActions.LOAD_USER_SUCCESS]: loadUserSuccessHandler,
  [fromActions.ADD_USER]: addUserHandler,
  [fromActions.UPDATE_USER]: updateUserHandler,
  [fromActions.DELETE_USER]: deleteUserHandler,
  [fromActions.UPDATE_RELATED_OBJECT_IN_USER]: updateRelatedObjectInUserHandler,
  [fromActions.ADD_GROUPS_TO_USER]: addGroupsToUserHandler,
  [fromActions.REMOVE_GROUP_FROM_USER]: removeGroupFromUserHandler,
  [fromActions.FINISHED_NETWORK_REQUEST_FOR_USER]: finishedNetworkRequestForUserHandler,
  [fromActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_USER]: finishedGenericNetworkRequestForUserHandler,
  [fromActions.USER_FAILURE]: userFailureHandler,
  [fromActions.REMOVE_USER_FROM_LOCAL_MEMORY]: removeUserFromLocalMemoryHandler,
};

export function reducer(
  state: IUsersState = initialState,
  action: fromActions.UserActions,
): IUsersState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function loadUserHandler(
  state: IUsersState,
  action: fromActions.LoadUser,
): IUsersState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload, state),
  };
}

function loadUserSuccessHandler(
  state: IUsersState,
  action: fromActions.LoadUserSuccess,
): IUsersState {
  return {
    ...usersAdapter.upsertOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload.id, state),
  };
}

function addUserHandler(
  state: IUsersState,
  action: fromActions.AddUser,
): IUsersState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function updateUserHandler(
  state: IUsersState, 
  action: fromActions.UpdateUser
): IUsersState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.id, state),
  };
}

function deleteUserHandler(
  state: IUsersState, 
  action: fromActions.DeleteUser
): IUsersState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.id, state),
  };
}

function updateRelatedObjectInUserHandler(
  state: IUsersState,
  action: fromActions.UpdateRelatedObjectInUser,
): IUsersState {
  return {
    ...state,
    entities: getNewEntitiesIfNeeded(action.payload.object, state.entities, action.payload.paths),
  };
}

function addGroupsToUserHandler(
  state: IUsersState, 
  action: fromActions.AddGroupsToUser
): IUsersState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.userId, state),
  };
}

function removeGroupFromUserHandler(
  state: IUsersState, 
  action: fromActions.RemoveGroupFromUser
): IUsersState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.userId, state),
  };
}

function finishedNetworkRequestForUserHandler(
  state: IUsersState,
  action: fromActions.FinishedNetworkRequestForUser,
): IUsersState {
  return {
    ...state,
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

function finishedGenericNetworkRequestForUserHandler(
  state: IUsersState,
  action: fromActions.FinishedGenericNetworkRequestForUser,
): IUsersState {
  return {
    ...state,
    ...networkAdapter.makeGenericInactive(state),
  };
}

function userFailureHandler(
  state: IUsersState,
  action: fromActions.UserFailure,
): IUsersState {
  return {
    ...state,
    ...networkAdapter.makeOneInactive(action.payload.id, state),
  };
}

function removeUserFromLocalMemoryHandler(
  state: IUsersState,
  action: fromActions.RemoveUserFromLocalMemory,
): IUsersState {
  return {
    ...usersAdapter.removeOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

export const { selectAnyNetworkActive, selectGenericNetworkActive, selectNetworkActive } = networkAdapter.selectors;
export const { selectAll, selectEntities, selectIds, selectTotal } = usersAdapter.getSelectors();
