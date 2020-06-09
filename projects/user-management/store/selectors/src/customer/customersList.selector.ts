import { createSelector } from '@ngrx/store';
import { IPagination } from 'core/models';
import { Customer } from 'user-management/models';
import * as fromReducers from 'user-management/store/reducers';
import{ fromCustomersList } from 'user-management/store/reducers';

export const getCustomersListState = createSelector(
  fromReducers.getDecisionFirstState,
  (state: fromReducers.IDecisionFirstState) => state.customersList,
);

export const getCustomersList = createSelector(
  getCustomersListState,
  fromCustomersList.selectAll,
);
export const getCustomersListNetworkActive = createSelector(
  getCustomersListState,
  fromCustomersList.selectAnyNetworkActive,
);
export const getCustomersListEntities = createSelector(
  getCustomersListState,
  fromCustomersList.selectEntities,
);

export const getCustomersListPagination = createSelector(
  getCustomersListState,
  fromCustomersList.getPagination,
);

export const getCustomersListSearchTerm = createSelector(
  getCustomersListState,
  fromCustomersList.getSearchTerm,
);
