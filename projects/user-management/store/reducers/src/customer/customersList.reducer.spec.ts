import { blankPages } from 'core/models';
import * as fromActions from 'user-management/store/actions';
import * as fromCustomerList from './customersList.reducer';

describe('Customer List Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromCustomerList;
      const action = {} as any;

      const state = fromCustomerList.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe(`${fromActions.LOAD_CUSTOMERS_LIST} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromCustomerList;
      const action = new fromActions.LoadCustomersList();

      const state = fromCustomerList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.LOAD_SPECIFIC_PAGE_FOR_CUSTOMERS_LIST} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromCustomerList;
      const action = new fromActions.LoadSpecificPageForCustomersList('https://example.com');

      const state = fromCustomerList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.UPDATE_SEARCH_FOR_CUSTOMERS_LIST}`, () => {
    it('should make the network active and update the search terms', () => {
      const { initialState } = fromCustomerList;
      const action = new fromActions.UpdateSearchForCustomersList({searchTerm: 'some string'});

      const state = fromCustomerList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
      expect(state.searchTerm).toEqual('some string');
    });
  });

  describe(`${fromActions.LOAD_CUSTOMERS_LIST_SUCCESS} action`, () => {
    it('should have genericNetworkActive be false', () => {
      const { initialState } = fromCustomerList;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.LoadCustomersListSuccess({
        pagination: blankPages,
        results: [{ id: 'customer1' } as any, { id: 'customer2' } as any],
      });

      const state = fromCustomerList.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
      expect(state.ids).toEqual(['customer1', 'customer2']);
      expect(state.pagination).toEqual(blankPages);
    });
  });
  
  describe(`${fromActions.CUSTOMERS_LIST_FAILURE} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromCustomerList;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.CustomersListFailure({} as any);

      const state = fromCustomerList.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
    });
  });
});