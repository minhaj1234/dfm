import { createSelector } from '@ngrx/store';
import { Customer } from 'user-management/models';
import * as fromReducers from 'user-management/store/reducers';
import{ fromCustomers } from 'user-management/store/reducers';

export const getCustomersState = createSelector(
  fromReducers.getDecisionFirstState,
  (state: fromReducers.IDecisionFirstState) => state.customers,
);

export const getLoadedCustomers = createSelector(
  getCustomersState,
  fromCustomers.selectEntities,
);

export const getLoadedCustomersAsArray = createSelector(
  getCustomersState,
  fromCustomers.selectAll,
);

export const getCustomersAnyNetworkActive = createSelector(
  getCustomersState,
  fromCustomers.selectAnyNetworkActive,
);

export const getSelectedCustomer = (id) =>
  createSelector(
    getCustomersState,
    (customerState): Customer => customerState.entities[id],
  );

export const getSelectedCustomerNetworkActive = (id) =>
  createSelector(
    getCustomersState,
    (customerState): boolean => customerState.networkActive[id] || false,
  );

export const getLoadedCustomersUsers = createSelector(
  getLoadedCustomersAsArray,
  (customers: Customer[]) => {
    return [].concat.apply([], customers.map((customer: Customer) => [...customer.users]));
  },
);

export const getLoadedCustomersGroups = createSelector(
  getLoadedCustomersAsArray,
  (customers: Customer[]) => {
    return [].concat.apply([], customers.map((customer: Customer) => [...customer.groups]));
  },
);
