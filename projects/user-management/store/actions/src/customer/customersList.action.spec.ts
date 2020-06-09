import { blankPages } from 'core/models';
import { Customer } from 'user-management/models';
import * as customerListActions from './customersList.action';

describe('Customer Actions', () => {
    describe('Load Customers List', () => {
        it('should create an action', () => {
            const action = new customerListActions.LoadCustomersList();
    
            expect({ ...action }).toEqual({
                type: customerListActions.LOAD_CUSTOMERS_LIST,
            });
        });
    });

    describe('Load Specific Page For Customers List', () => {
        it('should create an action', () => {
            const payload = '12345';

            const action = new customerListActions.LoadSpecificPageForCustomersList(payload);
    
            expect({ ...action }).toEqual({
                payload,
                type: customerListActions.LOAD_SPECIFIC_PAGE_FOR_CUSTOMERS_LIST,
            });
        });
    });

    describe('Update Search For Customers List', () => {
        it('should create an action', () => {
            const payload = {
                searchTerm: 'searchTerm',
            };

            const action = new customerListActions.UpdateSearchForCustomersList(payload);
    
            expect({ ...action }).toEqual({
                payload,
                type: customerListActions.UPDATE_SEARCH_FOR_CUSTOMERS_LIST,
            });
        });
    });

    describe('Load Customers List Success', () => {
        it('should create an action', () => {
            const payload = { 
                results: [{id: '12345', name: 'name'} as Customer],
                pagination: blankPages, 
            };

            const action = new customerListActions.LoadCustomersListSuccess(payload);
    
            expect({ ...action }).toEqual({
                payload,
                type: customerListActions.LOAD_CUSTOMERS_LIST_SUCCESS,
            });
        });
    });

    describe('Customers List Failure', () => {
        it('should create an action', () => {
            const payload = new Error();

            const action = new customerListActions.CustomersListFailure(payload);
    
            expect({ ...action }).toEqual({
                payload,
                type: customerListActions.CUSTOMERS_LIST_FAILURE,
            });
        });
    });
});