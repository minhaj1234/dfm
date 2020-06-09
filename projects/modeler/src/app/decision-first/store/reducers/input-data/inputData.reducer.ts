import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap } from 'core/models';
import { createNetworkAdapter, getNewEntitiesIfNeeded, StateWithNetworkActive } from 'core/utilities';
import { InputData } from '../../../models/inputData.model';
import { ObjectClassNames } from '../../../models/objects.model';
import * as fromActions from '../../actions';

export interface IInputDatasState extends EntityState<InputData>, StateWithNetworkActive { }

export const inputDatasAdapter: EntityAdapter<InputData> = createEntityAdapter<InputData>();
export const networkAdapter = createNetworkAdapter();

export const initialState: IInputDatasState = {
  ...inputDatasAdapter.getInitialState(),
  ...networkAdapter.initialState,
};

const actionMap: IActionMap<IInputDatasState, fromActions.InputDataActions | fromActions.CommonObjectActions> = {
  [fromActions.LOAD_INPUT_DATA]: loadInputDataHandler,
  [fromActions.LOAD_INPUT_DATA_SUCCESS]: loadInputDataSuccessHandler,
  [fromActions.ADD_INPUT_DATA]: addInputDataHandler,
  [fromActions.UPDATE_INPUT_DATA]: updateInputDataHandler,
  [fromActions.DELETE_INPUT_DATA]: deleteInputDataHandler,
  [fromActions.ADD_RELATED_OBJECT_TO_INPUT_DATA]: addRelatedObjectToInputDataHandler,
  [fromActions.UPDATE_INPUT_DATA_RELATED_OBJECT]: updateInputDAtaRelatedObjectHandler,
  [fromActions.REMOVE_RELATED_OBJECT_FROM_INPUT_DATA]: removeRelatedObjectFromInputDataHandler,
  [fromActions.UPDATE_OBJECT_TAGS]: updateObjectTagsHandler,
  [fromActions.FINISHED_NETWORK_REQUEST_FOR_INPUT_DATA]: finishedNetworkRequestForInputDataHandler,
  [fromActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_INPUT_DATA]: finishedGenericNetworkRequestForInputDataHandler,
  [fromActions.INPUT_DATA_FAILURE]: inputDataFailureHandler,
  [fromActions.REMOVE_INPUT_DATA_FROM_LOCAL_MEMORY]: removeInputDataFromLocalMemoryHandler,
};

export function reducer(
  state: IInputDatasState = initialState,
  action: fromActions.InputDataActions | fromActions.CommonObjectActions,
): IInputDatasState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function loadInputDataHandler(state: IInputDatasState, action: fromActions.LoadInputData): IInputDatasState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload, state),
  };
}

function loadInputDataSuccessHandler(
  state: IInputDatasState,
  action: fromActions.LoadInputDataSuccess,
): IInputDatasState {
  return {
    ...inputDatasAdapter.upsertOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload.id, state),
  };
}

function addInputDataHandler(
  state: IInputDatasState, 
  action: fromActions.AddInputData
): IInputDatasState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function updateInputDataHandler(
  state: IInputDatasState,
  action: fromActions.UpdateInputData
): IInputDatasState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.inputData.id, state),
  };
}

function deleteInputDataHandler(
  state: IInputDatasState,
  action: fromActions.DeleteInputData,
): IInputDatasState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.id, state),
  };
}

function addRelatedObjectToInputDataHandler(
  state: IInputDatasState,
  action: fromActions.AddRelatedObjectToInputData,
): IInputDatasState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.sourceObject.id, state),
  };
}

function updateInputDAtaRelatedObjectHandler(
  state: IInputDatasState,
  action: fromActions.UpdateInputDataRelatedObject,
): IInputDatasState {
  return {
    ...state,
    entities: getNewEntitiesIfNeeded(action.payload.object, state.entities, action.payload.paths),
  };
}

function removeRelatedObjectFromInputDataHandler(
  state: IInputDatasState,
  action: fromActions.RemoveRelatedObjectFromInputData,
): IInputDatasState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.sourceObject.id, state),
  };
}

function updateObjectTagsHandler(
  state: IInputDatasState,
  action: fromActions.UpdateObjectTags,
): IInputDatasState {
  return action.payload.type === ObjectClassNames.InputData 
  ? {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.id, state),
  }
  : state;
}

function finishedNetworkRequestForInputDataHandler(
  state: IInputDatasState,
  action: fromActions.FinishedNetworkRequestForInputData,
): IInputDatasState {
  return {
    ...state,
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

function finishedGenericNetworkRequestForInputDataHandler(
  state: IInputDatasState,
  action: fromActions.FinishedGenericNetworkRequestForInputData,
): IInputDatasState {
  return {
    ...state,
    ...networkAdapter.makeGenericInactive(state),
  };
}

function inputDataFailureHandler(state: IInputDatasState, action: fromActions.InputDataFailure): IInputDatasState {
  return {
    ...state,
    ...networkAdapter.makeOneInactive(action.payload.id, state),
  };
}

function removeInputDataFromLocalMemoryHandler(
  state: IInputDatasState,
  action: fromActions.RemoveInputDataFromLocalMemory,
): IInputDatasState {
  return {
    ...inputDatasAdapter.removeOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

export const { selectAnyNetworkActive, selectGenericNetworkActive, selectNetworkActive } = networkAdapter.selectors;
export const { selectAll, selectEntities, selectIds, selectTotal } = inputDatasAdapter.getSelectors();
