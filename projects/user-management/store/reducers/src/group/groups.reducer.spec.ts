import { Group, User, USER_MANAGEMENT_OBJECTS } from 'user-management/models';
import * as fromActions from 'user-management/store/actions';
import * as fromGroups from './groups.reducer';

describe('Users Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromGroups;
      const action = {} as any;

      const state = fromGroups.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });
  
  describe(`${fromActions.LOAD_GROUP} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromGroups;
      const action = new fromActions.LoadGroup('abc');

      const state = fromGroups.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.LOAD_GROUP_SUCCESS} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromGroups;
      const action = new fromActions.LoadGroupSuccess({ id: 'abc' } as Group);

      const state = fromGroups.reducer(initialState, action);

      expect(state.networkActive).toEqual({});
      expect(state.entities).toEqual({ abc: { id: 'abc' } } as any); 
    });
  });

  describe(`${fromActions.ADD_GROUP} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromGroups;
      const action = new fromActions.AddGroup({
        group: { id: 'abc' } as Group,
        accountId: '12345'
      });

      const state = fromGroups.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.UPDATE_GROUP} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromGroups;
      const action = new fromActions.UpdateGroup({ id: 'abc' } as Group);

      const state = fromGroups.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

   describe(`${fromActions.UPDATE_RELATED_OBJECT_IN_GROUP} action`, () => {
    it('should update user', () => {
      const { initialState } = fromGroups;
      const currentState = {
        ...initialState,
        entities: {
          abc: {
            id: 'abc',
            users: [{ id: '12', firstName: 'old name' }]
          },
          def: {
            id: 'def',
            users: [{ id: '34', firstName: 'do not change' }]
          },
        },
      };
      const updatedUser = { id: '12', firstName: 'new name' } as User;
      const action = new fromActions.UpdateRelatedObjectInGroup({ object: updatedUser, paths: [USER_MANAGEMENT_OBJECTS.User.resourceName] });

      const state = fromGroups.reducer(currentState as any, action);

      expect(state.entities.abc.users[0].firstName).toEqual('new name');
      expect(state.entities.def.users[0].firstName).toEqual('do not change');    
    });
  });

  describe(`${fromActions.ADD_USERS_TO_GROUP} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromGroups;
      const action = new fromActions.AddUsersToGroup({ groupId: 'abc', usersIds: ['user1', 'user2'] });

      const state = fromGroups.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.REMOVE_USER_FROM_GROUP} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromGroups;
      const action = new fromActions.RemoveUserFromGroup({ groupId: 'abc', userId: 'user1' });

      const state = fromGroups.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.FINISHED_NETWORK_REQUEST_FOR_GROUP} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromGroups;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.FinishedNetworkRequestForGroup('abc');

      const state = fromGroups.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
    });
  });

  describe(`${fromActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_GROUP} action`, () => {
    it('should have genericNetworkLoading be false', () => {
      const { initialState } = fromGroups;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.FinishedGenericNetworkRequestForGroup();

      const state = fromGroups.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
    });
  });

  describe(`${fromActions.GROUP_FAILURE} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromGroups;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.GroupFailure({ error: new Error('some message'), id: 'abc' });

      const state = fromGroups.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
    });
  });

  describe(`${fromActions.REMOVE_GROUP_FROM_LOCAL_MEMORY} action`, () => {
    it('should have genericNetworkLoading be false', () => {
      const { initialState } = fromGroups;
      const stateWithEntityLoaded = { ...initialState, entities: { abc: { id: 'abc' } as any }, networkActive: { abc: true } };
      const action = new fromActions.RemoveGroupFromLocalMemory('abc');

      const state = fromGroups.reducer(stateWithEntityLoaded, action);

      expect(state.entities).toEqual({});
      expect(state.networkActive).toEqual({});
    });
  });
});
