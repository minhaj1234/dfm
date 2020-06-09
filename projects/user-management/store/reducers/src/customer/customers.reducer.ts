import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap } from 'core/models';
import { createNetworkAdapter, getNewEntitiesIfNeeded, StateWithNetworkActive } from 'core/utilities';
import { Customer } from 'user-management/models';
import * as fromActions from 'user-management/store/actions';

export interface ICustomersState extends EntityState<Customer>, StateWithNetworkActive {}

export const customersAdapter: EntityAdapter<Customer> = createEntityAdapter<Customer>();
export const networkAdapter = createNetworkAdapter();

export const initialState: ICustomersState = {
  ...customersAdapter.getInitialState(),
  ...networkAdapter.initialState,
};

const actionMap: IActionMap<ICustomersState, fromActions.CustomerActions> = {
  [fromActions.LOAD_CUSTOMER]: loadCustomerHandler,
  [fromActions.LOAD_CUSTOMER_SUCCESS]: loadCustomerSuccessHandler,
  [fromActions.ADD_CUSTOMER]: addCustomerHandler,
  [fromActions.UPDATE_CUSTOMER]: updateCustomerHandler,
  [fromActions.DELETE_CUSTOMER]: deleteCustomerHandler,
  [fromActions.UPDATE_RELATED_OBJECT_IN_CUSTOMER]: updateRelatedObjectInCustomerHandler,
  [fromActions.FINISHED_NETWORK_REQUEST_FOR_CUSTOMER]: finishedNetworkRequestForCustomerHandler,
  [fromActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_CUSTOMER]: finishedGenericNetworkRequestForCustomerHandler,
  [fromActions.REMOVE_CUSTOMER_FROM_LOCAL_MEMORY]: removeCustomerFromLocalMemoryHandler,
};

export function reducer(
  state: ICustomersState = initialState,
  action: fromActions.CustomerActions,
): ICustomersState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function loadCustomerHandler(
  state: ICustomersState,
  action: fromActions.LoadCustomer,
): ICustomersState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload, state),
  };
}

function loadCustomerSuccessHandler(
  state: ICustomersState,
  action: fromActions.LoadCustomerSuccess,
): ICustomersState {
  return {
    ...customersAdapter.upsertOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload.id, state),
  };
}

function addCustomerHandler(
  state: ICustomersState, 
  action: fromActions.AddCustomer
): ICustomersState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function updateCustomerHandler(
  state: ICustomersState, 
  action: fromActions.UpdateCustomer
): ICustomersState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.id, state),
  };
}

function deleteCustomerHandler(
  state: ICustomersState, 
  action: fromActions.DeleteCustomer
): ICustomersState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.id, state),
  };
}

function updateRelatedObjectInCustomerHandler(
  state: ICustomersState,
  action: fromActions.UpdateRelatedObjectInCustomer,
): ICustomersState {
  return {
    ...state,
    entities: getNewEntitiesIfNeeded(action.payload.object, state.entities, action.payload.paths),
  };
}

function finishedNetworkRequestForCustomerHandler(
  state: ICustomersState,
  action: fromActions.FinishedNetworkRequestForCustomer,
): ICustomersState {
  return {
    ...state,
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

function finishedGenericNetworkRequestForCustomerHandler(
  state: ICustomersState,
  action: fromActions.FinishedGenericNetworkRequestForCustomer,
): ICustomersState {
  return {
    ...state,
    ...networkAdapter.makeGenericInactive(state),
  };
}

function removeCustomerFromLocalMemoryHandler(
  state: ICustomersState,
  action: fromActions.RemoveCustomerFromLocalMemory,
): ICustomersState {
  return {
    ...customersAdapter.removeOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

export const { selectAnyNetworkActive, selectGenericNetworkActive, selectNetworkActive } = networkAdapter.selectors;
export const { selectAll, selectEntities, selectIds, selectTotal } = customersAdapter.getSelectors();
