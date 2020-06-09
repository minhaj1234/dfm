import { Action } from '@ngrx/store';
import { AddCustomerRequest } from 'user-management/models';
import { Customer, CustomerRelatedObject } from 'user-management/models';

export const LOAD_CUSTOMER = '[ADMIN] Load Customer';
export const LOAD_CUSTOMER_SUCCESS = '[ADMIN] Load Customer Success';
export const ADD_CUSTOMER = '[ADMIN] Add Customer';
export const UPDATE_CUSTOMER = '[ADMIN] Update Customer';
export const DELETE_CUSTOMER = '[ADMIN] Delete Customer';
export const UPDATE_RELATED_OBJECT_IN_CUSTOMER = '[ADMIN] Update Related Object In Customer';
export const FINISHED_NETWORK_REQUEST_FOR_CUSTOMER = '[ADMIN] Finished Network Request for Customer';
export const FINISHED_GENERIC_NETWORK_REQUEST_FOR_CUSTOMER = '[ADMIN] Finished Generic Network Request for Customer';
export const CUSTOMER_FAILURE = '[ADMIN] Customer Failure';
export const GENERIC_CUSTOMER_FAILURE = '[ADMIN] Generic Customer Failure';
export const REMOVE_CUSTOMER_FROM_LOCAL_MEMORY = '[ADMIN] Remove Customer From Local Memory';

export class LoadCustomer implements Action {
  readonly type = LOAD_CUSTOMER;
  constructor(public payload: string) { }
}

export class LoadCustomerSuccess implements Action {
  readonly type = LOAD_CUSTOMER_SUCCESS;
  constructor(public payload: Customer) { }
}

export class AddCustomer implements Action {
  readonly type = ADD_CUSTOMER;
  constructor(
    public payload: AddCustomerRequest
  ) { }
}

export class UpdateCustomer implements Action {
  readonly type = UPDATE_CUSTOMER;
  constructor(public payload: Customer) { }
}

export class DeleteCustomer implements Action {
  readonly type = DELETE_CUSTOMER;
  constructor(public payload: Customer) { }
}

export class UpdateRelatedObjectInCustomer implements Action {
  readonly type = UPDATE_RELATED_OBJECT_IN_CUSTOMER;
  constructor(public payload: {object: CustomerRelatedObject, paths: string[]}) {}
}

export class FinishedNetworkRequestForCustomer implements Action {
  readonly type = FINISHED_NETWORK_REQUEST_FOR_CUSTOMER;
  constructor(public payload: string) { }
}

export class FinishedGenericNetworkRequestForCustomer implements Action {
  readonly type = FINISHED_GENERIC_NETWORK_REQUEST_FOR_CUSTOMER;
}

export class CustomerFailure implements Action {
  readonly type = CUSTOMER_FAILURE;
  constructor(public payload: { id: string; error: Error }) { }
}

export class GenericCustomerFailure implements Action {
  readonly type = GENERIC_CUSTOMER_FAILURE;
  constructor(public payload: Error) { }
}

export class RemoveCustomerFromLocalMemory implements Action {
  readonly type = REMOVE_CUSTOMER_FROM_LOCAL_MEMORY;
  constructor(public payload: string) { }
}

export type CustomerActions = 
  | LoadCustomer
  | LoadCustomerSuccess
  | AddCustomer
  | UpdateCustomer
  | DeleteCustomer
  | UpdateRelatedObjectInCustomer
  | FinishedNetworkRequestForCustomer
  | FinishedGenericNetworkRequestForCustomer
  | CustomerFailure
  | GenericCustomerFailure
  | RemoveCustomerFromLocalMemory;
