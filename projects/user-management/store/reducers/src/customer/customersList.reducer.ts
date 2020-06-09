import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap, IPagination } from 'core/models';
import { createNetworkAdapter, StateWithNetworkActive } from 'core/utilities';
import { Customer } from 'user-management/models';
import * as fromActions from 'user-management/store/actions';

export interface ICustomersListState extends EntityState<Customer>, StateWithNetworkActive {
  pagination: IPagination;
  searchTerm: string;
}

export const customersListAdapter: EntityAdapter<Customer> = createEntityAdapter<Customer>();
export const networkAdapter = createNetworkAdapter();

export const initialState: ICustomersListState = {
  ...customersListAdapter.getInitialState(),
  ...networkAdapter.initialState,
  pagination: {
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  },
  searchTerm: '',
};

const actionMap: IActionMap<ICustomersListState, fromActions.CustomersListActions> = {
  [fromActions.LOAD_CUSTOMERS_LIST]: loadCustomersListHandler,
  [fromActions.LOAD_SPECIFIC_PAGE_FOR_CUSTOMERS_LIST]: loadSpecificPageForCustomersListHandler,
  [fromActions.UPDATE_SEARCH_FOR_CUSTOMERS_LIST]: updateSearchForCustomersListHandler,
  [fromActions.LOAD_CUSTOMERS_LIST_SUCCESS]: loadCustomersListSuccessHandler,
  [fromActions.CUSTOMERS_LIST_FAILURE]: customersListFailureHandler,
};

export function reducer(
  state: ICustomersListState = initialState,
  action: fromActions.CustomersListActions,
): ICustomersListState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function loadCustomersListHandler(
  state: ICustomersListState,
  action: fromActions.LoadCustomersList,
): ICustomersListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadSpecificPageForCustomersListHandler(
  state: ICustomersListState,
  action: fromActions.LoadSpecificPageForCustomersList,
): ICustomersListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function updateSearchForCustomersListHandler(
  state: ICustomersListState,
  action: fromActions.UpdateSearchForCustomersList,
): ICustomersListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
    searchTerm: action.payload.searchTerm,
  };
}

function loadCustomersListSuccessHandler(
  state: ICustomersListState,
  action: fromActions.LoadCustomersListSuccess,
): ICustomersListState {
  return {
    ...customersListAdapter.addAll(action.payload.results, state),
    ...networkAdapter.makeGenericInactive(state),
    pagination: action.payload.pagination,
  };
}

function customersListFailureHandler(
  state: ICustomersListState,
  action: fromActions.CustomersListFailure,
): ICustomersListState {
  return {
    ...state,
    ...networkAdapter.makeGenericInactive(state),
  };
}

export const { selectAnyNetworkActive, selectGenericNetworkActive, selectNetworkActive } = networkAdapter.selectors;
export const { selectEntities, selectAll } = customersListAdapter.getSelectors();
export const getPagination = (state: ICustomersListState) => state.pagination;
export const getSearchTerm = (state: ICustomersListState) => state.searchTerm;
