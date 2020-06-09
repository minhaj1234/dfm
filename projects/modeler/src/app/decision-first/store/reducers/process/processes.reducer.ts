import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap } from 'core/models';
import { createNetworkAdapter, getNewEntitiesIfNeeded, StateWithNetworkActive } from 'core/utilities';
import { ObjectClassNames } from '../../../models/objects.model';
import { Process } from '../../../models/process.model';
import * as fromActions from '../../actions';

export interface IProcessesState extends EntityState<Process>, StateWithNetworkActive {}

export const processesAdapter: EntityAdapter<Process> = createEntityAdapter<Process>();
export const networkAdapter = createNetworkAdapter();

export const initialState: IProcessesState = {
  ...processesAdapter.getInitialState(),
  ...networkAdapter.initialState,
};

const actionMap: IActionMap<IProcessesState, fromActions.ProcessActions | fromActions.CommonObjectActions> = {
  [fromActions.LOAD_PROCESS]: loadProcessHandler,
  [fromActions.LOAD_PROCESS_SUCCESS]: loadProcessSuccessHandler,
  [fromActions.ADD_PROCESS]: addProcessHandler,
  [fromActions.UPDATE_PROCESS]: updateProcessHandler,
  [fromActions.DELETE_PROCESS]: deleteProcessHandler,
  [fromActions.ADD_RELATED_OBJECT_TO_PROCESS]: addRelatedObjectToProcessHandler,
  [fromActions.UPDATE_PROCESS_RELATED_OBJECT]: updateProcessRelatedObjectHandler,
  [fromActions.REMOVE_RELATED_OBJECT_FROM_PROCESS]: removeRelatedObjectFromProcessHandler,
  [fromActions.UPDATE_OBJECT_TAGS]: updateObjectTagsHandler,
  [fromActions.FINISHED_NETWORK_REQUEST_FOR_PROCESS]: finishedNetworkRequestForProcessHandler,
  [fromActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_PROCESS]: finishedGenericNetworkRequestForProcessHandler,
  [fromActions.PROCESS_FAILURE]: processFailureHandler,
  [fromActions.REMOVE_PROCESS_FROM_LOCAL_MEMORY]: removeProcessFromLocalMemoryHandler,
};

export function reducer(state: IProcessesState = initialState, action: fromActions.ProcessActions | fromActions.CommonObjectActions): IProcessesState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function loadProcessHandler(state: IProcessesState, action: fromActions.LoadProcess): IProcessesState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload, state),
  };
}

function loadProcessSuccessHandler(state: IProcessesState, action: fromActions.LoadProcessSuccess): IProcessesState {
  return {
    ...processesAdapter.upsertOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload.id, state),
  };
}

function addProcessHandler(
  state: IProcessesState, 
  action: fromActions.AddProcess
): IProcessesState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function updateProcessHandler(
  state: IProcessesState, 
  action: fromActions.UpdateProcess
): IProcessesState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.process.id, state),
  };
}

function deleteProcessHandler(
  state: IProcessesState,
  action: fromActions.DeleteProcess,
): IProcessesState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.id, state),
  };
}

function addRelatedObjectToProcessHandler(
  state: IProcessesState,
  action: fromActions.AddRelatedObjectToProcess,
): IProcessesState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.sourceObject.id, state),
  };
}

function updateProcessRelatedObjectHandler(
  state: IProcessesState,
  action: fromActions.UpdateProcessRelatedObject,
): IProcessesState {
  return {
    ...state,
    entities: getNewEntitiesIfNeeded(action.payload.object, state.entities, action.payload.paths),
  };
}

function removeRelatedObjectFromProcessHandler(
  state: IProcessesState,
  action: fromActions.RemoveRelatedObjectFromProcess,
): IProcessesState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.sourceObject.id, state),
  };
}

function updateObjectTagsHandler(
  state: IProcessesState,
  action: fromActions.UpdateObjectTags,
): IProcessesState {
  return action.payload.type === ObjectClassNames.Process 
  ? {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.id, state),
  }
  : state;
}

function finishedNetworkRequestForProcessHandler(
  state: IProcessesState,
  action: fromActions.FinishedNetworkRequestForProcess,
): IProcessesState {
  return {
    ...state,
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

function finishedGenericNetworkRequestForProcessHandler(
  state: IProcessesState,
  action: fromActions.FinishedGenericNetworkRequestForProcess,
): IProcessesState {
  return {
    ...state,
    ...networkAdapter.makeGenericInactive(state),
  };
}

function processFailureHandler(state: IProcessesState, action: fromActions.ProcessFailure): IProcessesState {
  return {
    ...state,
    ...networkAdapter.makeOneInactive(action.payload.id, state),
  };
}

function removeProcessFromLocalMemoryHandler(
  state: IProcessesState,
  action: fromActions.RemoveProcessFromLocalMemory,
): IProcessesState {
  return {
    ...processesAdapter.removeOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

export const { selectAnyNetworkActive, selectGenericNetworkActive, selectNetworkActive } = networkAdapter.selectors;
export const { selectAll, selectEntities, selectIds, selectTotal } = processesAdapter.getSelectors();
