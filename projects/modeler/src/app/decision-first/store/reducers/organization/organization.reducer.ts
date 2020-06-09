import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap } from 'core/models';
import { createNetworkAdapter, getNewEntitiesIfNeeded, StateWithNetworkActive } from 'core/utilities';
import { ObjectClassNames } from '../../../models/objects.model';
import { Organization } from '../../../models/organization.model';
import * as fromActions from '../../actions';

export interface IOrganizationsState extends EntityState<Organization>, StateWithNetworkActive {}

export const organizationsAdapter: EntityAdapter<Organization> = createEntityAdapter<Organization>();
export const networkAdapter = createNetworkAdapter();

export const initialState: IOrganizationsState = {
  ...organizationsAdapter.getInitialState(),
  ...networkAdapter.initialState,
};

const actionMap: IActionMap<IOrganizationsState, fromActions.OrganizationActions | fromActions.CommonObjectActions> = {
  [fromActions.LOAD_ORGANIZATION]: loadOrganizationHandler,
  [fromActions.LOAD_ORGANIZATION_SUCCESS]: loadOrganizationSuccessHandler,
  [fromActions.ADD_ORGANIZATION]: addOrganizationHandler,
  [fromActions.UPDATE_ORGANIZATION]: updateOrganizationHandler,
  [fromActions.ADD_RELATED_OBJECT_TO_ORGANIZATION]: addRelatedObjectToOrganizationHandler,
  [fromActions.UPDATE_ORGANIZATION_RELATED_OBJECT]: updateOrganizationRelatedObjectHandler,
  [fromActions.REMOVE_RELATED_OBJECT_FROM_ORGANIZATION]: removeRelatedObjectFromOrganizationHandler,
  [fromActions.UPDATE_OBJECT_TAGS]: updateObjectTagsHandler,
  [fromActions.ORGANIZATION_FAILURE]: organizationFailureHandler,
  [fromActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_ORGANIZATION]: finishedGenericNetworkRequestForOrganizationHandler,
  [fromActions.FINISHED_NETWORK_REQUEST_FOR_ORGANIZATION]: finishedNetworkRequestForOrganizationHandler,
  [fromActions.REMOVE_ORGANIZATION_FROM_LOCAL_MEMORY]: removeOrganizationFromLocalMemoryHandler,
};

export function reducer(
  state: IOrganizationsState = initialState,
  action: fromActions.OrganizationActions | fromActions.CommonObjectActions,
): IOrganizationsState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function loadOrganizationHandler(
  state: IOrganizationsState,
  action: fromActions.LoadOrganization,
): IOrganizationsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload, state),
  };
}

function loadOrganizationSuccessHandler(
  state: IOrganizationsState,
  action: fromActions.LoadOrganizationSuccess,
): IOrganizationsState {
  return {
    ...organizationsAdapter.upsertOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload.id, state),
  };
}

function addOrganizationHandler(
  state: IOrganizationsState, 
  action: fromActions.AddOrganization
): IOrganizationsState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function organizationFailureHandler(
  state: IOrganizationsState,
  action: fromActions.OrganizationFailure,
): IOrganizationsState {
  return {
    ...state,
    ...networkAdapter.makeOneInactive(action.payload.id, state),
  };
}

function finishedNetworkRequestForOrganizationHandler(
  state: IOrganizationsState,
  action: fromActions.FinishedNetworkRequestForOrganization,
): IOrganizationsState {
  return {
    ...state,
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

function finishedGenericNetworkRequestForOrganizationHandler(
  state: IOrganizationsState,
  action: fromActions.FinishedGenericNetworkRequestForOrganization,
): IOrganizationsState {
  return {
    ...state,
    ...networkAdapter.makeGenericInactive(state),
  };
}

function updateOrganizationHandler(
  state: IOrganizationsState,
  action: fromActions.UpdateOrganization,
): IOrganizationsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.organization.id, state),
  };
}

function addRelatedObjectToOrganizationHandler(
  state: IOrganizationsState,
  action: fromActions.AddRelatedObjectToOrganization,
): IOrganizationsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.sourceObject.id, state),
  };
}

function updateOrganizationRelatedObjectHandler(
  state: IOrganizationsState,
  action: fromActions.UpdateOrganizationRelatedObject,
): IOrganizationsState {
  return {
    ...state,
    entities: getNewEntitiesIfNeeded(action.payload.object, state.entities, action.payload.paths),
  };
}

function removeRelatedObjectFromOrganizationHandler(
  state: IOrganizationsState,
  action: fromActions.RemoveRelatedObjectFromOrganization,
): IOrganizationsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.sourceObject.id, state),
  };
}

function updateObjectTagsHandler(
  state: IOrganizationsState,
  action: fromActions.UpdateObjectTags,
): IOrganizationsState {
  return action.payload.type === ObjectClassNames.Organization 
  ? {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.id, state),
  }
  : state;
}

function removeOrganizationFromLocalMemoryHandler(
  state: IOrganizationsState,
  action: fromActions.RemoveOrganizationFromLocalMemory,
): IOrganizationsState {
  return {
    ...organizationsAdapter.removeOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

export const { selectAnyNetworkActive, selectGenericNetworkActive, selectNetworkActive } = networkAdapter.selectors;
export const { selectAll, selectEntities, selectIds, selectTotal } = organizationsAdapter.getSelectors();
