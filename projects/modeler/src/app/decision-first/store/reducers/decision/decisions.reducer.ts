import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap } from 'core/models';
import { createNetworkAdapter, getNewEntitiesIfNeeded, StateWithNetworkActive } from 'core/utilities';
import { Decision } from '../../../models/decision.model';
import { ObjectClassNames } from '../../../models/objects.model';
import * as fromActions from '../../actions';

export interface IDecisionsState extends EntityState<Decision>, StateWithNetworkActive {}

export const decisionsAdapter: EntityAdapter<Decision> = createEntityAdapter<Decision>();
export const networkAdapter = createNetworkAdapter();

export const initialState: IDecisionsState = {
  ...decisionsAdapter.getInitialState(),
  ...networkAdapter.initialState,
};

const actionMap: IActionMap<IDecisionsState, fromActions.DecisionActions | fromActions.CommonObjectActions> = {
  [fromActions.LOAD_DECISION]: loadDecisionHandler,
  [fromActions.LOAD_DECISION_SUCCESS]: loadDecisionSuccessHandler,
  [fromActions.ADD_DECISION]: addDecisionHandler,
  [fromActions.UPDATE_DECISION]: updateDecisionHandler,
  [fromActions.DELETE_DECISION]: deleteDecisionHandler,
  [fromActions.ADD_RELATED_OBJECT_TO_DECISION]: addRelatedObjectToDecisionHandler,
  [fromActions.REMOVE_RELATED_OBJECT_FROM_DECISION]: removeRelatedObjectFromDecisionHandler,
  [fromActions.ADD_IMPLEMENTATION_TABLE_ENTITY]: addImplementationTableEntityHandler,
  [fromActions.UPDATE_IMPLEMENTATION_TABLE_ENTITY]: updateImplementationTableEntityHandler,
  [fromActions.REMOVE_IMPLEMENTATION_TABLE_ENTITY]: removeImplementationTableEntityHandler,
  [fromActions.UPDATE_ANSWER]: updateAnswerHandler,
  [fromActions.UPDATE_OBJECT_TAGS]: updateObjectTagsHandler,
  [fromActions.DECISION_FAILURE]: decisionFailureHandler,
  [fromActions.FINISHED_NETWORK_REQUEST_FOR_DECISION]: finishedNetworkRequestForDecisionHanlder,
  [fromActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_DECISION]: finishedGenericNetworkRequestForDecisionHanlder,
  [fromActions.REMOVE_DECISION_FROM_LOCAL_MEMORY]: removeDecisionFromLocalMemoryHandler,
  [fromActions.UPDATE_DECISION_RELATED_OBJECT]: updateDecisionRelatedObjectHandler,
};

export function reducer(state: IDecisionsState = initialState, action: fromActions.DecisionActions | fromActions.CommonObjectActions): IDecisionsState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function addDecisionHandler(state: IDecisionsState, action: fromActions.AddDecision): IDecisionsState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function updateDecisionHandler(state: IDecisionsState, action: fromActions.UpdateDecision): IDecisionsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.decision.id, state),
  };
}

function deleteDecisionHandler(state: IDecisionsState, action: fromActions.DeleteDecision): IDecisionsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.id, state),
  };
}

function addRelatedObjectToDecisionHandler(
  state: IDecisionsState,
  action: fromActions.AddRelatedObjectToDecision,
): IDecisionsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.sourceObject.id, state),
  };
}

function removeRelatedObjectFromDecisionHandler(
  state: IDecisionsState,
  action: fromActions.RemoveRelatedObjectFromDecision,
): IDecisionsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.sourceObject.id, state),
  };
}

function updateObjectTagsHandler(
  state: IDecisionsState,
  action: fromActions.UpdateObjectTags,
): IDecisionsState {
  return action.payload.type === ObjectClassNames.Decision 
  ? {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.id, state),
  }
  : state;
}

function addImplementationTableEntityHandler(
  state: IDecisionsState,
  action: fromActions.AddImplementationTableEntity,
): IDecisionsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.sourceObject.id, state),
  };
}

function updateImplementationTableEntityHandler(
  state: IDecisionsState,
  action: fromActions.UpdateImplementationTableEntity,
): IDecisionsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.sourceObject.id, state),
  };
}

function removeImplementationTableEntityHandler(
  state: IDecisionsState,
  action: fromActions.RemoveImplementationTableEntity,
): IDecisionsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.sourceObject.id, state),
  };
}

function updateAnswerHandler(
  state: IDecisionsState,
  action: fromActions.UpdateAnswer,
): IDecisionsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.decision.id, state),
  };
}

function loadDecisionHandler(state: IDecisionsState, action: fromActions.LoadDecision): IDecisionsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload, state),
  };
}

function loadDecisionSuccessHandler(state: IDecisionsState, action: fromActions.LoadDecisionSuccess): IDecisionsState {
  return {
    ...decisionsAdapter.upsertOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload.id, state),
  };
}

function decisionFailureHandler(state: IDecisionsState, action: fromActions.DecisionFailure): IDecisionsState {
  return {
    ...state,
    ...networkAdapter.makeOneInactive(action.payload.id, state),
  };
}

function finishedNetworkRequestForDecisionHanlder(
  state: IDecisionsState,
  action: fromActions.FinishedNetworkRequestForDecision,
): IDecisionsState {
  return {
    ...state,
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

function finishedGenericNetworkRequestForDecisionHanlder(
  state: IDecisionsState,
  action: fromActions.FinishedGenericNetworkRequestForDecision,
): IDecisionsState {
  return {
    ...state,
    ...networkAdapter.makeGenericInactive(state),
  };
}

function updateDecisionRelatedObjectHandler(
  state: IDecisionsState,
  action: fromActions.UpdateDecisionRelatedObject,
): IDecisionsState {
  return {
    ...state,
    entities: getNewEntitiesIfNeeded(action.payload.object, state.entities, action.payload.paths),
  };
}


function removeDecisionFromLocalMemoryHandler(
  state: IDecisionsState,
  action: fromActions.RemoveDecisionFromLocalMemory,
): IDecisionsState {
  return {
    ...decisionsAdapter.removeOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

export const { selectGenericNetworkActive, selectNetworkActive, selectAnyNetworkActive } = networkAdapter.selectors;
export const { selectEntities, selectAll } = decisionsAdapter.getSelectors();
