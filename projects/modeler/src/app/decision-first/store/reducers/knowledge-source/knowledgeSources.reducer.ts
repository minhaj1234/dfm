import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap } from 'core/models';
import { createNetworkAdapter, getNewEntitiesIfNeeded, StateWithNetworkActive } from 'core/utilities';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import { ObjectClassNames } from '../../../models/objects.model';
import * as fromActions from '../../actions';

export interface IKnowledgeSourcesState extends EntityState<KnowledgeSource>, StateWithNetworkActive {}

export const knowledgeSourceAdapter: EntityAdapter<KnowledgeSource> = createEntityAdapter<KnowledgeSource>();
export const networkAdapter = createNetworkAdapter();

export const initialState: IKnowledgeSourcesState = {
  ...knowledgeSourceAdapter.getInitialState(),
  ...networkAdapter.initialState,
};

const actionMap: IActionMap<IKnowledgeSourcesState, fromActions.KnowledgeSourceActions | fromActions.CommonObjectActions> = {
  [fromActions.ADD_KNOWLEDGE_SOURCE]: addKnowledgeSourceHandler,
  [fromActions.UPDATE_KNOWLEDGE_SOURCE]: updateKnowledgeSourceHandler,
  [fromActions.DELETE_KNOWLEDGE_SOURCE]: deleteKnowledgeSourceHandler,
  [fromActions.ADD_RELATED_OBJECT_TO_KNOWLEDGE_SOURCE]: addRelatedObjectToKnowledgeSourceHandler,
  [fromActions.UPDATE_KNOWLEDGE_SOURCE_RELATED_OBJECT]: updateKnowledgeSourceRelatedObjectHandler,
  [fromActions.REMOVE_RELATED_OBJECT_FROM_KNOWLEDGE_SOURCE]: removeRelatedObjectFromKnowledgeSourceHandler,
  [fromActions.UPDATE_OBJECT_TAGS]: updateObjectTagsHandler,
  [fromActions.LOAD_KNOWLEGE_SOURCE]: loadKnowledgeSourceHandler,
  [fromActions.LOAD_KNOWLEGE_SOURCE_SUCCESS]: loadKnowledgeSourceSuccessHandler,
  [fromActions.KNOWLEDGE_SOURCE_FAILURE]: knowledgeSourceFailureHandler,
  [fromActions.FINISHED_NETWORK_REQUEST_FOR_KNOWLEDGE_SOURCE]: finishedNetworkRequestForKnowledgeSourceHandler,
  [fromActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_KNOWLEGE_SOURCE]: finishedGenericNetworkRequestForKnowledgeSourceHandler,
  [fromActions.REMOVE_KNOWLEDGE_SOURCE_FROM_LOCAL_MEMORY]: removeKnowledgeSourceFromLocalMemoryHandler,
};

export function reducer(
  state: IKnowledgeSourcesState = initialState,
  action: fromActions.KnowledgeSourceActions | fromActions.CommonObjectActions,
): IKnowledgeSourcesState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function addKnowledgeSourceHandler(
  state: IKnowledgeSourcesState,
  action: fromActions.AddKnowledgeSource,
): IKnowledgeSourcesState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function updateKnowledgeSourceHandler(
  state: IKnowledgeSourcesState,
  action: fromActions.UpdateKnowledgeSource,
): IKnowledgeSourcesState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.knowledgeSource.id, state),
  };
}

function deleteKnowledgeSourceHandler(
  state: IKnowledgeSourcesState,
  action: fromActions.DeleteKnowledgeSource,
): IKnowledgeSourcesState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.id, state),
  };
}

function addRelatedObjectToKnowledgeSourceHandler(
  state: IKnowledgeSourcesState,
  action: fromActions.AddRelatedObjectToKnowledgeSource,
): IKnowledgeSourcesState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.sourceObject.id, state),
  };
}

function updateKnowledgeSourceRelatedObjectHandler(
  state: IKnowledgeSourcesState,
  action: fromActions.UpdateKnowledgeSourceRelatedObject,
): IKnowledgeSourcesState {
  return {
    ...state,
    entities: getNewEntitiesIfNeeded(action.payload.object, state.entities, action.payload.paths),
  };
}

function removeRelatedObjectFromKnowledgeSourceHandler(
  state: IKnowledgeSourcesState,
  action: fromActions.RemoveRelatedObjectFromKnowledgeSource,
): IKnowledgeSourcesState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.sourceObject.id, state),
  };
}

function updateObjectTagsHandler(
  state: IKnowledgeSourcesState,
  action: fromActions.UpdateObjectTags,
): IKnowledgeSourcesState {
  return action.payload.type === ObjectClassNames.KnowledgeSource 
  ? {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.id, state),
  }
  : state;
}

function knowledgeSourceFailureHandler(
  state: IKnowledgeSourcesState,
  action: fromActions.KnowledgeSourceFailure,
): IKnowledgeSourcesState {
  return {
    ...state,
    ...networkAdapter.makeOneInactive(action.payload.id, state),
  };
}

function loadKnowledgeSourceHandler(
  state: IKnowledgeSourcesState,
  action: fromActions.LoadKnowledgeSource,
): IKnowledgeSourcesState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload, state),
  };
}

function loadKnowledgeSourceSuccessHandler(
  state: IKnowledgeSourcesState,
  action: fromActions.LoadKnowledgeSourceSuccess,
): IKnowledgeSourcesState {
  return {
    ...knowledgeSourceAdapter.upsertOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload.id, state),
  };
}

function finishedNetworkRequestForKnowledgeSourceHandler(
  state: IKnowledgeSourcesState,
  action: fromActions.FinishedNetworkRequestForKnowledgeSource,
): IKnowledgeSourcesState {
  return {
    ...state,
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

function finishedGenericNetworkRequestForKnowledgeSourceHandler(
  state: IKnowledgeSourcesState,
  action: fromActions.FinishedGenericNetworkRequestForKnowledgeSource,
): IKnowledgeSourcesState {
  return {
    ...state,
    ...networkAdapter.makeGenericInactive(state),
  };
}

function removeKnowledgeSourceFromLocalMemoryHandler(
  state: IKnowledgeSourcesState,
  action: fromActions.RemoveKnowledgeSourceFromLocalMemory,
): IKnowledgeSourcesState {
  return {
    ...knowledgeSourceAdapter.removeOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

export const { selectAnyNetworkActive, selectGenericNetworkActive, selectNetworkActive } = networkAdapter.selectors;
export const { selectAll, selectEntities, selectIds, selectTotal } = knowledgeSourceAdapter.getSelectors();
