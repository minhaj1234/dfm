import { Action } from '@ngrx/store';
import { IPagination } from 'core/models';
import { Customer } from 'user-management/models';

export const LOAD_CUSTOMERS_LIST = '[ADMIN] Load Customers List';
export const LOAD_SPECIFIC_PAGE_FOR_CUSTOMERS_LIST = '[ADMIN] Load Specific Page For Customers List';
export const UPDATE_SEARCH_FOR_CUSTOMERS_LIST = '[ADMIN] Update Search For Customers List';
export const LOAD_CUSTOMERS_LIST_SUCCESS = '[ADMIN] Load Customers List Success';
export const CUSTOMERS_LIST_FAILURE = '[ADMIN] Customers List Failure';

export class LoadCustomersList implements Action {
  readonly type = LOAD_CUSTOMERS_LIST;
}

export class LoadSpecificPageForCustomersList implements Action {
  readonly type = LOAD_SPECIFIC_PAGE_FOR_CUSTOMERS_LIST;
  constructor(public payload: string) { }
}

export class UpdateSearchForCustomersList implements Action {
  readonly type = UPDATE_SEARCH_FOR_CUSTOMERS_LIST;
  constructor(public payload: { searchTerm: string }) { }
}

export class LoadCustomersListSuccess implements Action {
  readonly type = LOAD_CUSTOMERS_LIST_SUCCESS;
  constructor(public payload: { results: Customer[]; pagination: IPagination }) { }
}

export class CustomersListFailure implements Action {
  readonly type = CUSTOMERS_LIST_FAILURE;
  constructor(public payload: Error) {}
}

export type CustomersListActions =
  | LoadCustomersList
  | LoadSpecificPageForCustomersList
  | UpdateSearchForCustomersList
  | LoadCustomersListSuccess
  | CustomersListFailure;
