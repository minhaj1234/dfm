import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap } from 'core/models';
import { createNetworkAdapter, getNewEntitiesIfNeeded, StateWithNetworkActive } from 'core/utilities';
import { ObjectClassNames } from '../../../models/objects.model';
import { System } from '../../../models/system.model';
import * as fromActions from '../../actions';

export interface ISystemsState extends EntityState<System>, StateWithNetworkActive {}

export const eventsAdapter: EntityAdapter<System> = createEntityAdapter<System>();
export const networkAdapter = createNetworkAdapter();

export const initialState: ISystemsState = {
  ...eventsAdapter.getInitialState(),
  ...networkAdapter.initialState,
};

const actionMap: IActionMap<ISystemsState, fromActions.SystemActions | fromActions.CommonObjectActions> = {
  [fromActions.LOAD_SYSTEM]: loadSystemHandler,
  [fromActions.LOAD_SYSTEM_SUCCESS]: loadSystemSuccessHandler,
  [fromActions.ADD_SYSTEM]: addSystemHandler,
  [fromActions.UPDATE_SYSTEM]: updateSystemHandler,
  [fromActions.DELETE_SYSTEM]: deleteSystemHandler,
  [fromActions.ADD_RELATED_OBJECT_TO_SYSTEM]: addRelatedObjectToSystemHandler,
  [fromActions.UPDATE_SYSTEM_RELATED_OBJECT]: updateSystemRelatedObjectHandler,
  [fromActions.REMOVE_RELATED_OBJECT_FROM_SYSTEM]: removeRelatedObjectFromSystemHandler,
  [fromActions.UPDATE_OBJECT_TAGS]: updateObjectTagsHandler,
  [fromActions.FINISHED_NETWORK_REQUEST_FOR_SYSTEM]: finishedNetworkRequestForSystemHandler,
  [fromActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_SYSTEM]: finishedGenericNetworkRequestForSystemHandler,
  [fromActions.SYSTEM_FAILURE]: systemFailureHandler,
  [fromActions.REMOVE_SYSTEM_FROM_LOCAL_MEMORY]: removeSystemFromLocalMemoryHandler,
};

export function reducer(state: ISystemsState = initialState, action: fromActions.SystemActions | fromActions.CommonObjectActions): ISystemsState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function loadSystemHandler(state: ISystemsState, action: fromActions.LoadSystem): ISystemsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload, state),
  };
}

function loadSystemSuccessHandler(state: ISystemsState, action: fromActions.LoadSystemSuccess): ISystemsState {
  return {
    ...eventsAdapter.upsertOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload.id, state),
  };
}

function addSystemHandler(
  state: ISystemsState,
  action: fromActions.AddSystem
): ISystemsState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function updateSystemHandler(
  state: ISystemsState, 
  action: fromActions.UpdateSystem
): ISystemsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.system.id, state),
  };
}

function deleteSystemHandler(
  state: ISystemsState,
  action: fromActions.DeleteSystem,
): ISystemsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.id, state),
  };
}

function addRelatedObjectToSystemHandler(
  state: ISystemsState,
  action: fromActions.AddRelatedObjectToSystem,
): ISystemsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.sourceObject.id, state),
  };
}

function updateSystemRelatedObjectHandler(
  state: ISystemsState,
  action: fromActions.UpdateSystemRelatedObject,
): ISystemsState {
  return {
    ...state,
    entities: getNewEntitiesIfNeeded(action.payload.object, state.entities, action.payload.paths),
  };
}

function removeRelatedObjectFromSystemHandler(
  state: ISystemsState,
  action: fromActions.RemoveRelatedObjectFromSystem,
): ISystemsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.sourceObject.id, state),
  };
}

function updateObjectTagsHandler(
  state: ISystemsState,
  action: fromActions.UpdateObjectTags,
): ISystemsState {
  return action.payload.type === ObjectClassNames.System 
  ? {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.id, state),
  }
  : state;
}

function finishedNetworkRequestForSystemHandler(
  state: ISystemsState,
  action: fromActions.FinishedNetworkRequestForSystem,
): ISystemsState {
  return {
    ...state,
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

function finishedGenericNetworkRequestForSystemHandler(
  state: ISystemsState,
  action: fromActions.FinishedGenericNetworkRequestForSystem,
): ISystemsState {
  return {
    ...state,
    ...networkAdapter.makeGenericInactive(state),
  };
}

function systemFailureHandler(state: ISystemsState, action: fromActions.SystemFailure): ISystemsState {
  return {
    ...state,
    ...networkAdapter.makeOneInactive(action.payload.id, state),
  };
}

function removeSystemFromLocalMemoryHandler(
  state: ISystemsState,
  action: fromActions.RemoveSystemFromLocalMemory,
): ISystemsState {
  return {
    ...eventsAdapter.removeOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

export const { selectAnyNetworkActive, selectGenericNetworkActive, selectNetworkActive } = networkAdapter.selectors;
export const { selectAll, selectEntities, selectIds, selectTotal } = eventsAdapter.getSelectors();
