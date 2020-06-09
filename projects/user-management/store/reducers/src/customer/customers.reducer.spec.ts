import { Customer, User, USER_MANAGEMENT_OBJECTS } from 'user-management/models';
import * as fromActions from 'user-management/store/actions';
import * as fromCustomer from './customers.reducer';

describe('Customer Reducer', () => {
  describe(`${fromActions.LOAD_CUSTOMER} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromCustomer;
      const action = new fromActions.LoadCustomer('customerId');

      const state = fromCustomer.reducer(initialState, action);

      expect(state.networkActive).toEqual({customerId: true});
    });
  });

  describe(`${fromActions.LOAD_CUSTOMER_SUCCESS} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromCustomer;
      const action = new fromActions.LoadCustomerSuccess({ id: 'abc' } as Customer);

      const state = fromCustomer.reducer(initialState, action);

      expect(state.networkActive).toEqual({});
      expect(state.entities).toEqual({ abc: { id: 'abc' } } as any); 
    });
  });

  describe(`${fromActions.ADD_CUSTOMER} action`, () => {
    it('should have genericNetworkLoading be true', () => {
      const { initialState } = fromCustomer;
      const action = new fromActions.AddCustomer({  
        name: 'name',
        numberOfUsers: 3,
        validDate: new Date(),
        createdBy: 'userId',
      });

      const state = fromCustomer.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.UPDATE_CUSTOMER} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromCustomer;
      const action = new fromActions.UpdateCustomer({ id: 'abc' } as Customer);

      const state = fromCustomer.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true});
    });
  });

  describe(`${fromActions.DELETE_CUSTOMER} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromCustomer;
      const action = new fromActions.DeleteCustomer({ id: 'abc' } as Customer);

      const state = fromCustomer.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true});
    });
  });

  describe(`${fromActions.UPDATE_RELATED_OBJECT_IN_CUSTOMER} action`, () => {
    it('should update user', () => {
      const { initialState } = fromCustomer;
      const updatedUser = { id: '12', firstName: 'new name' } as User;
      const currentState = getTestCurrentState(initialState);
      const action = new fromActions.UpdateRelatedObjectInCustomer({ object: updatedUser, paths: [USER_MANAGEMENT_OBJECTS.User.resourceName] });

      const state = fromCustomer.reducer(currentState as any, action);

      expect(state.entities.abc.users[0].firstName).toEqual('new name');
      expect(state.entities.def.users[0].firstName).toEqual('do not change');     
    });
  });

  describe(`${fromActions.FINISHED_NETWORK_REQUEST_FOR_CUSTOMER} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromCustomer;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.FinishedNetworkRequestForCustomer('abc');

      const state = fromCustomer.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
    });
  });

  describe(`${fromActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_CUSTOMER} action`, () => {
    it('should have genericNetworkLoading be false', () => {
      const { initialState } = fromCustomer;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.FinishedGenericNetworkRequestForCustomer();

      const state = fromCustomer.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
    });
  });

  describe(`${fromActions.REMOVE_CUSTOMER_FROM_LOCAL_MEMORY} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromCustomer;
      const stateWithEntityLoaded = { ...initialState, entities: { abc: { id: 'abc' } as Customer }, networkActive: { abc: true } };
      const action = new fromActions.RemoveCustomerFromLocalMemory('abc');

      const state = fromCustomer.reducer(stateWithEntityLoaded, action);

      expect(state.entities).toEqual({});
      expect(state.networkActive).toEqual({});
    });
  });
});

function getTestCurrentState(initialState: fromCustomer.ICustomersState) {
  return {
    ...initialState,
    entities: {
      abc: {
        id: 'abc',
        users: [{ id: '12', firstName: 'old name' } as User]
      } as Customer,
      def: {
        id: 'def',
        users: [{ id: '34', firstName: 'do not change' } as User]
      } as Customer,
    },
  }
}
