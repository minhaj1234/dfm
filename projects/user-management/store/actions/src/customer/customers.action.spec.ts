import { AddCustomerRequest, Customer, User } from 'user-management/models';
import * as customerActions from './customers.action';

describe('Customer Actions', () => {
    describe('Load Customer', () => {
        it('should create an action', () => {
            const payload = '12345'
        
            const action = new customerActions.LoadCustomer(payload);
    
            expect({ ...action }).toEqual({
                payload,
                type: customerActions.LOAD_CUSTOMER,
            });
        });
    });

    describe('Load Customer Success', () => {
        it('should create an action', () => {
            const payload = {
                id: '12345',
                name: 'customer',
            } as Customer;
        
            const action = new customerActions.LoadCustomerSuccess(payload);
    
            expect({ ...action }).toEqual({
                payload,
                type: customerActions.LOAD_CUSTOMER_SUCCESS,
            });
        });
    });

    describe('Add Customer', () => {
        it('should create an action', () => {
            const payload: AddCustomerRequest = {
                name: 'customer',
                numberOfUsers: 3,
                validDate: new Date,
                createdBy: 'userId',
            };
        
            const action = new customerActions.AddCustomer(payload);
    
            expect({ ...action }).toEqual({
                payload,
                type: customerActions.ADD_CUSTOMER,
            });
        });
    });

    describe('Update Customer', () => {
        it('should create an action', () => {
            const payload = {
                id: 'id',
                name: 'customer',
            } as Customer;
        
            const action = new customerActions.UpdateCustomer(payload);
    
            expect({ ...action }).toEqual({
                payload,
                type: customerActions.UPDATE_CUSTOMER,
            });
        });
    });

    describe('Delete Customer', () => {
        it('should create an action', () => {
            const payload = {
                id: 'id',
                name: 'customer',
            } as Customer;
        
            const action = new customerActions.DeleteCustomer(payload);
    
            expect({ ...action }).toEqual({
                payload,
                type: customerActions.DELETE_CUSTOMER,
            });
        });
    });

    describe('Update Related Object In Customer', () => {
        it('should create an action', () => {
            const payload = {
                object: {id: 'userId'} as User, 
                paths: ['path'],
            };
        
            const action = new customerActions.UpdateRelatedObjectInCustomer(payload);
    
            expect({ ...action }).toEqual({
                payload,
                type: customerActions.UPDATE_RELATED_OBJECT_IN_CUSTOMER,
            });
        });
    });

    describe('Finished Network Request For Customer', () => {
        it('should create an action', () => {
            const payload = '12345';
        
            const action = new customerActions.FinishedNetworkRequestForCustomer(payload);
    
            expect({ ...action }).toEqual({
                payload,
                type: customerActions.FINISHED_NETWORK_REQUEST_FOR_CUSTOMER,
            });
        });
    });

    describe('Finished Generic Network Request For Customer', () => {
        it('should create an action', () => {
            const action = new customerActions.FinishedGenericNetworkRequestForCustomer();
    
            expect({ ...action }).toEqual({
                type: customerActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_CUSTOMER,
            });
        });
    });

    describe('Customer Failure', () => {
        it('should create an action', () => {
            const payload = {
                id: '12345',
                error: new Error(),
            };
        
            const action = new customerActions.CustomerFailure(payload);
    
            expect({ ...action }).toEqual({
                payload,
                type: customerActions.CUSTOMER_FAILURE,
            });
        });
    });

    describe('Generic Customer Failure', () => {
        it('should create an action', () => {
            const payload = new Error();
        
            const action = new customerActions.GenericCustomerFailure(payload);
    
            expect({ ...action }).toEqual({
                payload,
                type: customerActions.GENERIC_CUSTOMER_FAILURE,
            });
        });
    });

    describe('Remove Customer From Local Memory', () => {
        it('should create an action', () => {
            const payload = '12345';
        
            const action = new customerActions.RemoveCustomerFromLocalMemory(payload);
    
            expect({ ...action }).toEqual({
                payload,
                type: customerActions.REMOVE_CUSTOMER_FROM_LOCAL_MEMORY,
            });
        });
    });
});