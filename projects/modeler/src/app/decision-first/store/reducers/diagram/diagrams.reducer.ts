import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap } from 'core/models';
import { createNetworkAdapter, getNewEntitiesIfNeeded, StateWithNetworkActive } from 'core/utilities';
import { Diagram } from '../../../models/diagram.model';
import { ObjectClassNames } from '../../../models/objects.model';
import * as fromActions from '../../actions';

export interface IDiagramsState extends EntityState<Diagram>, StateWithNetworkActive { }

export const diagramsAdapter: EntityAdapter<Diagram> = createEntityAdapter<Diagram>();
export const networkAdapter = createNetworkAdapter();

export const initialState: IDiagramsState = {
  ...diagramsAdapter.getInitialState(),
  ...networkAdapter.initialState,
};

const actionMap: IActionMap<IDiagramsState, fromActions.DiagramActions | fromActions.CommonObjectActions> = {
  [fromActions.LOAD_DIAGRAM]: loadDiagramHandler,
  [fromActions.DIAGRAM_FAILURE]: diagramFailureHandler,
  [fromActions.LOAD_DIAGRAM_SUCCESS]: loadDiagramSuccessHandler,
  [fromActions.FINISHED_NETWORK_REQUEST_FOR_DIAGRAM]: finishedNetworkRequestForDiagramHandler,
  [fromActions.ADD_GRAPHABLE_OBJECT_TO_DIAGRAM]: addGraphableObjectToDiagramHandler,
  [fromActions.UPDATE_DIAGRAM]: updateDiagramHandler,
  [fromActions.REMOVE_GRAPHABLE_OBJECTS_FROM_DIAGRAM]: removeGraphableObjectsFromDiagramHandler,
  [fromActions.UPDATE_OBJECT_TAGS]: updateObjectTagsHandler,
  [fromActions.UPDATE_GO_JSON]: updateGoJsonHandler,
  [fromActions.REMOVE_DIAGRAM_FROM_LOCAL_MEMORY]: removeDiagramFromLocalMemoryHandler,
  [fromActions.UPDATE_DIAGRAM_GRAPHABLE_OBJECT]: updateDiagramGraphableObjectHandler,
  [fromActions.REMOVE_LINK]: removeLinkHandler,
};

export function reducer(state: IDiagramsState = initialState, action: fromActions.DiagramActions | fromActions.CommonObjectActions): IDiagramsState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function loadDiagramHandler(state: IDiagramsState, action: fromActions.LoadDiagram): IDiagramsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload, state),
  };
}

function diagramFailureHandler(state: IDiagramsState, action: fromActions.DiagramFailure): IDiagramsState {
  return {
    ...state,
    ...networkAdapter.makeOneInactive(action.payload.id, state),
  };
}

function loadDiagramSuccessHandler(state: IDiagramsState, action: fromActions.LoadDiagramSuccess): IDiagramsState {
  return {
    ...diagramsAdapter.upsertOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload.id, state),
  };
}

function finishedNetworkRequestForDiagramHandler(
  state: IDiagramsState,
  action: fromActions.FinishedNetworkRequestForDiagram,
): IDiagramsState {
  return {
    ...state,
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

function addGraphableObjectToDiagramHandler(state: IDiagramsState, action: fromActions.AddGraphableObjectToDiagram): IDiagramsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.sourceObject.id, state),
  };
}

function updateDiagramHandler(state: IDiagramsState, action: fromActions.UpdateDiagram): IDiagramsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.diagram.id, state),
  };
}

function removeGraphableObjectsFromDiagramHandler(
  state: IDiagramsState,
  action: fromActions.RemoveGraphableObjectsFromDiagram,
): IDiagramsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.diagram.id, state),
  };
}

function updateObjectTagsHandler(
  state: IDiagramsState,
  action: fromActions.UpdateObjectTags,
): IDiagramsState {
  return action.payload.type === ObjectClassNames.Diagram
    ? {
      ...state,
      ...networkAdapter.makeOneActive(action.payload.id, state),
    }
    : state;
}

function updateGoJsonHandler(state: IDiagramsState, action: fromActions.UpdateGoJson): IDiagramsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.diagram.id, state),
  };
}

function updateDiagramGraphableObjectHandler(
  state: IDiagramsState,
  action: fromActions.UpdateDiagramGraphableObject,
): IDiagramsState {
  return {
    ...state,
    entities: getNewEntitiesIfNeeded(action.payload.object, state.entities, action.payload.paths),
  };
}

function removeDiagramFromLocalMemoryHandler(
  state: IDiagramsState,
  action: fromActions.RemoveDiagramFromLocalMemory,
): IDiagramsState {
  return {
    ...diagramsAdapter.removeOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

function removeLinkHandler(state: IDiagramsState,
  action: fromActions.RemoveLink,
): IDiagramsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.diagram.id, state)
  }

}

export const { selectAnyNetworkActive, selectGenericNetworkActive, selectNetworkActive } = networkAdapter.selectors;
export const { selectAll, selectEntities, selectIds, selectTotal } = diagramsAdapter.getSelectors();
