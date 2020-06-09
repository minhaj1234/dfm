import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap } from 'core/models';
import { createNetworkAdapter, getNewEntitiesIfNeeded, StateWithNetworkActive } from 'core/utilities';
import { BusinessObjective } from '../../../models/businessObjective.model';
import { ObjectClassNames } from '../../../models/objects.model';
import * as fromActions from '../../actions';

export interface IBusinessObjectivesState extends EntityState<BusinessObjective>, StateWithNetworkActive {}

export const businessObjectivesAdapter: EntityAdapter<BusinessObjective> = createEntityAdapter<BusinessObjective>();
export const networkAdapter = createNetworkAdapter();

export const initialState: IBusinessObjectivesState = {
  ...businessObjectivesAdapter.getInitialState(),
  ...networkAdapter.initialState,
};

const actionMap: IActionMap<IBusinessObjectivesState, fromActions.BusinessObjectiveActions | fromActions.CommonObjectActions> = {
  [fromActions.LOAD_BUSINESS_OBJECTIVE]: loadBusinessObjectiveHandler,
  [fromActions.LOAD_BUSINESS_OBJECTIVE_SUCCESS]: loadBusinessObjectiveSuccessHandler,
  [fromActions.ADD_BUSINESS_OBJECTIVE]: addBusinessObjectiveHandler,
  [fromActions.UPDATE_BUSINESS_OBJECTIVE]: updateBusinessObjectiveHandler,
  [fromActions.DELETE_BUSINESS_OBJECTIVE]: deleteBusinessObjectiveHandler,
  [fromActions.ADD_RELATED_OBJECT_TO_BUSINESS_OBJECTIVE]: addRelatedObjectToBusinessObjectiveHandler,
  [fromActions.UPDATE_BUSINESS_OBJECTIVE_RELATED_OBJECT]: updateBusinessObjectiveRelatedObjectHandler,
  [fromActions.REMOVE_RELATED_OBJECT_FROM_BUSINESS_OBJECTIVE]: removeRelatedObjectFromBusinessObjectiveHandler,
  [fromActions.UPDATE_OBJECT_TAGS]: updateObjectTagsHandler,
  [fromActions.FINISHED_NETWORK_REQUEST_FOR_BUSINESS_OBJECTIVE]: finishedNetworkRequestForBusinessObjectiveHandler,
  [fromActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_BUSINESS_OBJECTIVE]: finishedGenericNetworkRequestForBusinessObjectiveHandler,
  [fromActions.BUSINESS_OBJECTIVE_FAILURE]: businessObjectiveFailureHandler,
  [fromActions.REMOVE_BUSINESS_OBJECTIVE_FROM_LOCAL_MEMORY]: removeBusinessObjectiveFromLocalMemoryHandler,
};

export function reducer(
  state: IBusinessObjectivesState = initialState,
  action: fromActions.BusinessObjectiveActions | fromActions.CommonObjectActions,
): IBusinessObjectivesState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function loadBusinessObjectiveHandler(
  state: IBusinessObjectivesState,
  action: fromActions.LoadBusinessObjective,
): IBusinessObjectivesState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload, state),
  };
}

function loadBusinessObjectiveSuccessHandler(
  state: IBusinessObjectivesState,
  action: fromActions.LoadBusinessObjectiveSuccess,
): IBusinessObjectivesState {
  return {
    ...businessObjectivesAdapter.upsertOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload.id, state),
  };
}

function addBusinessObjectiveHandler(
  state: IBusinessObjectivesState, 
  action: fromActions.AddBusinessObjective
): IBusinessObjectivesState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function updateBusinessObjectiveHandler(
  state: IBusinessObjectivesState,
  action: fromActions.UpdateBusinessObjective
): IBusinessObjectivesState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.businessObjective.id, state),
  };
}

function deleteBusinessObjectiveHandler(
  state: IBusinessObjectivesState,
  action: fromActions.DeleteBusinessObjective,
): IBusinessObjectivesState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.id, state),
  };
}

function addRelatedObjectToBusinessObjectiveHandler(
  state: IBusinessObjectivesState,
  action: fromActions.AddRelatedObjectToBusinessObjective,
): IBusinessObjectivesState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.sourceObject.id, state),
  };
}

function updateBusinessObjectiveRelatedObjectHandler(
  state: IBusinessObjectivesState,
  action: fromActions.UpdateBusinessObjectiveRelatedObject,
): IBusinessObjectivesState {
  return {
    ...state,
    entities: getNewEntitiesIfNeeded(action.payload.object, state.entities, action.payload.paths),
  };
}

function removeRelatedObjectFromBusinessObjectiveHandler(
  state: IBusinessObjectivesState,
  action: fromActions.RemoveRelatedObjectFromBusinessObjective,
): IBusinessObjectivesState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.sourceObject.id, state),
  };
}

function updateObjectTagsHandler(
  state: IBusinessObjectivesState,
  action: fromActions.UpdateObjectTags,
): IBusinessObjectivesState {
  return action.payload.type === ObjectClassNames.BusinessObjective 
  ? {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.id, state),
  }
  : state;
}

function finishedNetworkRequestForBusinessObjectiveHandler(
  state: IBusinessObjectivesState,
  action: fromActions.FinishedNetworkRequestForBusinessObjective,
): IBusinessObjectivesState {
  return {
    ...state,
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

function finishedGenericNetworkRequestForBusinessObjectiveHandler(
  state: IBusinessObjectivesState,
  action: fromActions.FinishedGenericNetworkRequestForBusinessObjective,
): IBusinessObjectivesState {
  return {
    ...state,
    ...networkAdapter.makeGenericInactive(state),
  };
}

function businessObjectiveFailureHandler(
  state: IBusinessObjectivesState,
  action: fromActions.BusinessObjectiveFailure,
): IBusinessObjectivesState {
  return {
    ...state,
    ...networkAdapter.makeOneInactive(action.payload.id, state),
  };
}

function removeBusinessObjectiveFromLocalMemoryHandler(
  state: IBusinessObjectivesState,
  action: fromActions.RemoveBusinessObjectiveFromLocalMemory,
): IBusinessObjectivesState {
  return {
    ...businessObjectivesAdapter.removeOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

export const { selectAnyNetworkActive, selectGenericNetworkActive, selectNetworkActive } = networkAdapter.selectors;
export const { selectAll, selectEntities, selectIds, selectTotal } = businessObjectivesAdapter.getSelectors();
