import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap } from 'core/models';
import { createNetworkAdapter, getNewEntitiesIfNeeded, StateWithNetworkActive } from 'core/utilities';
import { ImplementationComponent } from '../../../models/implementationComponent.model';
import { ObjectClassNames } from '../../../models/objects.model';
import * as fromActions from '../../actions';

export interface IImplementationComponentsState extends EntityState<ImplementationComponent>, StateWithNetworkActive {}

export const implementationComponentsAdapter: EntityAdapter<ImplementationComponent> = createEntityAdapter<
  ImplementationComponent
>();
export const networkAdapter = createNetworkAdapter();

export const initialState: IImplementationComponentsState = {
  ...implementationComponentsAdapter.getInitialState(),
  ...networkAdapter.initialState,
};

const actionMap: IActionMap<IImplementationComponentsState, fromActions.ImplementationComponentActions | fromActions.CommonObjectActions> = {
  [fromActions.LOAD_IMPLEMENTATION_COMPONENT]: loadImplementationComponentHandler,
  [fromActions.LOAD_IMPLEMENTATION_COMPONENT_SUCCESS]: loadImplementationComponentSuccessHandler,
  [fromActions.ADD_IMPLEMENTATION_COMPONENT]: addImplementationComponentHandler,
  [fromActions.UPDATE_IMPLEMENTATION_COMPONENT]: updateImplementationComponentHandler,
  [fromActions.DELETE_IMPLEMENTATION_COMPONENT]: deleteImplementationComponentHandler,
  [fromActions.ADD_RELATED_OBJECT_TO_IMPLEMENTATION_COMPONENT]: addRelatedObjectToImplementationComponentHandler,
  [fromActions.UPDATE_IMPLEMENTATION_COMPONENT_RELATED_OBJECT]: updateImplementationComponentRelatedObjectHandler,
  [fromActions.REMOVE_RELATED_OBJECT_FROM_IMPLEMENTATION_COMPONENT]: removeRelatedObjectFromImplementationComponentHandler,
  [fromActions.UPDATE_OBJECT_TAGS]: updateObjectTagsHandler,
  [fromActions.FINISHED_NETWORK_REQUEST_FOR_IMPLEMENTATION_COMPONENT]: finishedNetworkRequestForImplementationComponentHandler,
  [fromActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_IMPLEMENTATION_COMPONENT]: finishedGenericNetworkRequestForImplementationComponentHandler,
  [fromActions.IMPLEMENTATION_COMPONENT_FAILURE]: implementationComponentFailureHandler,
  [fromActions.REMOVE_IMPLEMENTATION_COMPONENT_FROM_LOCAL_MEMORY]: removeImplementationComponentFromLocalMemoryHandler,
};

export function reducer(
  state: IImplementationComponentsState = initialState,
  action: fromActions.ImplementationComponentActions | fromActions.CommonObjectActions,
): IImplementationComponentsState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function loadImplementationComponentHandler(
  state: IImplementationComponentsState,
  action: fromActions.LoadImplementationComponent,
): IImplementationComponentsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload, state),
  };
}

function loadImplementationComponentSuccessHandler(
  state: IImplementationComponentsState,
  action: fromActions.LoadImplementationComponentSuccess,
): IImplementationComponentsState {
  return {
    ...implementationComponentsAdapter.upsertOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload.id, state),
  };
}

function addImplementationComponentHandler(
  state: IImplementationComponentsState,
  action: fromActions.AddImplementationComponent
): IImplementationComponentsState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function updateImplementationComponentHandler(state: IImplementationComponentsState, action: fromActions.UpdateImplementationComponent): IImplementationComponentsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.implementationComponent.id, state),
  };
}

function deleteImplementationComponentHandler(
  state: IImplementationComponentsState,
  action: fromActions.DeleteImplementationComponent,
): IImplementationComponentsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.id, state),
  };
}

function addRelatedObjectToImplementationComponentHandler(
  state: IImplementationComponentsState,
  action: fromActions.AddRelatedObjectToImplementationComponent,
): IImplementationComponentsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.sourceObject.id, state),
  };
}

function updateImplementationComponentRelatedObjectHandler(
  state: IImplementationComponentsState,
  action: fromActions.UpdateImplementationComponentRelatedObject,
): IImplementationComponentsState {
  return {
    ...state,
    entities: getNewEntitiesIfNeeded(action.payload.object, state.entities, action.payload.paths),
  };
}

function removeRelatedObjectFromImplementationComponentHandler(
  state: IImplementationComponentsState,
  action: fromActions.RemoveRelatedObjectFromImplementationComponent,
): IImplementationComponentsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.sourceObject.id, state),
  };
}

function updateObjectTagsHandler(
  state: IImplementationComponentsState,
  action: fromActions.UpdateObjectTags,
): IImplementationComponentsState {
  return action.payload.type === ObjectClassNames.ImplementationComponent 
  ? {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.id, state),
  }
  : state;
}

function finishedNetworkRequestForImplementationComponentHandler(
  state: IImplementationComponentsState,
  action: fromActions.FinishedNetworkRequestForImplementationComponent,
): IImplementationComponentsState {
  return {
    ...state,
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

function finishedGenericNetworkRequestForImplementationComponentHandler(
  state: IImplementationComponentsState,
  action: fromActions.FinishedGenericNetworkRequestForImplementationComponent,
): IImplementationComponentsState {
  return {
    ...state,
    ...networkAdapter.makeGenericInactive(state),
  };
}

function implementationComponentFailureHandler(
  state: IImplementationComponentsState,
  action: fromActions.ImplementationComponentFailure,
): IImplementationComponentsState {
  return {
    ...state,
    ...networkAdapter.makeOneInactive(action.payload.id, state),
  };
}

function removeImplementationComponentFromLocalMemoryHandler(
  state: IImplementationComponentsState,
  action: fromActions.RemoveImplementationComponentFromLocalMemory,
): IImplementationComponentsState {
  return {
    ...implementationComponentsAdapter.removeOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

export const { selectAnyNetworkActive, selectGenericNetworkActive, selectNetworkActive } = networkAdapter.selectors;
export const { selectAll, selectEntities, selectIds, selectTotal } = implementationComponentsAdapter.getSelectors();
