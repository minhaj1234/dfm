import { Group, User } from 'user-management/models';
import * as usersActions from './users.action';

describe('Users Actions', () => {
  describe('Load User', () => {
    it('should create an action', () => {
      const payload = '12345';

      const action = new usersActions.LoadUser(payload);

      expect({ ...action }).toEqual({
        payload,
        type: usersActions.LOAD_USER,
      });
    });
  });

  describe('Load User Success', () => {
    it('should create an action', () => {
      const payload = createTestUser();

      const action = new usersActions.LoadUserSuccess(payload);

      expect({ ...action }).toEqual({
        payload,
        type: usersActions.LOAD_USER_SUCCESS,
      });
    });
  });

  describe('Add User', () => {
    it('should create an action', () => {
      const payload = {
        user: createTestUser(),
        accountId: 'abc'
      };

      const action = new usersActions.AddUser(payload);

      expect({ ...action }).toEqual({
        payload,
        type: usersActions.ADD_USER,
      });
    });
  });

  describe('Update User', () => {
    it('should create an action', () => {
      const payload = createTestUser();

      const action = new usersActions.UpdateUser(payload);

      expect({ ...action }).toEqual({
        payload,
        type: usersActions.UPDATE_USER,
      });
    });
  });

  describe('Update Related Object In User', () => {
    it('should create an action', () => {
      const payload = {
        object: {id: 'groupId'} as Group,
        paths: ['path']
      };

      const action = new usersActions.UpdateRelatedObjectInUser(payload);

      expect({ ...action }).toEqual({
        payload,
        type: usersActions.UPDATE_RELATED_OBJECT_IN_USER,
      });
    });
  });

  describe('Add Groups  To User', () => {
    it('should create an action', () => {
      const payload = {
        userId: '12345',
        groupsIds: ['123', '456']
      };

      const action = new usersActions.AddGroupsToUser(payload);

      expect({ ...action }).toEqual({
        payload,
        type: usersActions.ADD_GROUPS_TO_USER,
      });
    });
  });

  describe('Remove Group FromUser', () => {
    it('should create an action', () => {
      const payload = {
        userId: '12345',
        groupId: '67890',
      };

      const action = new usersActions.RemoveGroupFromUser(payload);

      expect({ ...action }).toEqual({
        payload,
        type: usersActions.REMOVE_GROUP_FROM_USER,
      });
    });
  });

  describe('Load User As Child', () => {
    it('should create an action', () => {
      const payload = 'id';

      const action = new usersActions.LoadUserAsChild(payload);

      expect({ ...action }).toEqual({
        payload,
        type: usersActions.LOAD_USER_AS_CHILD,
      });
    });
  });

  describe('Finished Network Request For User', () => {
    it('should create an action', () => {
      const payload = 'id';

      const action = new usersActions.FinishedNetworkRequestForUser(payload);

      expect({ ...action }).toEqual({
        payload,
        type: usersActions.FINISHED_NETWORK_REQUEST_FOR_USER,
      });
    });
  });

  describe('Finished Generic Network Request For User', () => {
    it('should create an action', () => {
      const action = new usersActions.FinishedGenericNetworkRequestForUser();

      expect({ ...action }).toEqual({
        type: usersActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_USER,
      });
    });
  });

  describe('User Failure', () => {
    it('should create an action', () => {
      const payload = {id: '12345', error: new Error('message')};

      const action = new usersActions.UserFailure(payload);

      expect({ ...action }).toEqual({
        payload,
        type: usersActions.USER_FAILURE,
      });
    });
  });

  describe('Generic User Failure', () => {
    it('should create an action', () => {
      const payload = new Error('message');

      const action = new usersActions.GenericUserFailure(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: usersActions.GENERIC_USER_FAILURE,
      });
    });
  });

  
  describe('Remove User From Local Memory', () => {
    it('should create an action', () => {
      const payload = '12345';

      const action = new usersActions.RemoveUserFromLocalMemory(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: usersActions.REMOVE_USER_FROM_LOCAL_MEMORY,
      });
    });
  });


  function createTestUser(): User {
    const user = new User();
    user.id = '12345';
    user.firstName = 'user firstname';
    user.lastName = 'user lastname';
    user.email = 'email';

    return user;
  }
});
