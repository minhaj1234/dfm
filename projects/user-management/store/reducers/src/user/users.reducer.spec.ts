import { Group, User, USER_MANAGEMENT_OBJECTS } from 'user-management/models';
import * as fromActions from 'user-management/store/actions';
import * as fromUsers from './users.reducer';

describe('Users Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromUsers;
      const action = {} as any;

      const state = fromUsers.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });
  
  describe(`${fromActions.LOAD_USER} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromUsers;
      const action = new fromActions.LoadUser('abc');

      const state = fromUsers.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.LOAD_USER_SUCCESS} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromUsers;
      const action = new fromActions.LoadUserSuccess({ id: 'abc' } as User);

      const state = fromUsers.reducer(initialState, action);

      expect(state.networkActive).toEqual({});
      expect(state.entities).toEqual({ abc: { id: 'abc' } } as any); 
    });
  });

  describe(`${fromActions.ADD_USER} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromUsers;
      const action = new fromActions.AddUser({
        user: { id: 'abc' } as User,
        accountId: '12345'
      });

      const state = fromUsers.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.UPDATE_USER} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromUsers;
      const action = new fromActions.UpdateUser({ id: 'abc' } as User);

      const state = fromUsers.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

   describe(`${fromActions.UPDATE_RELATED_OBJECT_IN_USER} action`, () => {
    it('should update group', () => {
      const { initialState } = fromUsers;
      const currentState = {
        ...initialState,
        entities: {
          abc: {
            id: 'abc',
            groups: [{ id: '12', name: 'old name' }]
          },
          def: {
            id: 'def',
            groups: [{ id: '34', name: 'do not change' }]
          },
        },
      };
      const updatedGroup = { id: '12', name: 'new name' } as Group;
      const action = new fromActions.UpdateRelatedObjectInUser({ object: updatedGroup, paths: [USER_MANAGEMENT_OBJECTS.Group.resourceName] });

      const state = fromUsers.reducer(currentState as any, action);

      expect(state.entities.abc.groups[0].name).toEqual('new name');
      expect(state.entities.def.groups[0].name).toEqual('do not change');    
    });
  });

  describe(`${fromActions.ADD_GROUPS_TO_USER} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromUsers;
      const action = new fromActions.AddGroupsToUser({ userId: 'abc', groupsIds: ['group1', 'group2'] });

      const state = fromUsers.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.REMOVE_GROUP_FROM_USER} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromUsers;
      const action = new fromActions.RemoveGroupFromUser({ userId: 'abc', groupId: 'group1' });

      const state = fromUsers.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });
  
  describe(`${fromActions.FINISHED_NETWORK_REQUEST_FOR_USER} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromUsers;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.FinishedNetworkRequestForUser('abc');

      const state = fromUsers.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
    });
  });

  describe(`${fromActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_USER} action`, () => {
    it('should have genericNetworkLoading be false', () => {
      const { initialState } = fromUsers;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.FinishedGenericNetworkRequestForUser();

      const state = fromUsers.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
    });
  });

  describe(`${fromActions.USER_FAILURE} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromUsers;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.UserFailure({ error: new Error('some message'), id: 'abc' });

      const state = fromUsers.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
    });
  });

  describe(`${fromActions.REMOVE_USER_FROM_LOCAL_MEMORY} action`, () => {
    it('should have genericNetworkLoading be false', () => {
      const { initialState } = fromUsers;
      const stateWithEntityLoaded = { ...initialState, entities: { abc: { id: 'abc' } as any }, networkActive: { abc: true } };
      const action = new fromActions.RemoveUserFromLocalMemory('abc');

      const state = fromUsers.reducer(stateWithEntityLoaded, action);

      expect(state.entities).toEqual({});
      expect(state.networkActive).toEqual({});
    });
  });
});
