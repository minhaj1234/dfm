import { Group, User } from 'user-management/models';
import * as groupsActions from './groups.action';

describe('Groups Actions', () => {
  describe('Load Group', () => {
    it('should create an action', () => {
      const payload = '12345';

      const action = new groupsActions.LoadGroup(payload);

      expect({ ...action }).toEqual({
        payload,
        type: groupsActions.LOAD_GROUP,
      });
    });
  });

  describe('Load Group Success', () => {
    it('should create an action', () => {
      const payload = createTestGroup();

      const action = new groupsActions.LoadGroupSuccess(payload);

      expect({ ...action }).toEqual({
        payload,
        type: groupsActions.LOAD_GROUP_SUCCESS,
      });
    });
  });

  describe('Add Group', () => {
    it('should create an action', () => {
      const payload = {
        group: createTestGroup(),
        accountId: '12345',
      };

      const action = new groupsActions.AddGroup(payload);

      expect({ ...action }).toEqual({
        payload,
        type: groupsActions.ADD_GROUP,
      });
    });
  });

  describe('Update Group', () => {
    it('should create an action', () => {
      const payload = createTestGroup();

      const action = new groupsActions.UpdateGroup(payload);

      expect({ ...action }).toEqual({
        payload,
        type: groupsActions.UPDATE_GROUP,
      });
    });
  });

  describe('Update Related Object In Group', () => {
    it('should create an action', () => {
      const payload = {
        object: {id: '12345'} as User,
        paths: ['path'],
      };

      const action = new groupsActions.UpdateRelatedObjectInGroup(payload);

      expect({ ...action }).toEqual({
        payload,
        type: groupsActions.UPDATE_RELATED_OBJECT_IN_GROUP,
      });
    });
  });

  describe('Add Users To Group', () => {
    it('should create an action', () => {
      const payload = {
        groupId: '12345',
        usersIds: ['123', '456'],
      };

      const action = new groupsActions.AddUsersToGroup(payload);

      expect({ ...action }).toEqual({
        payload,
        type: groupsActions.ADD_USERS_TO_GROUP,
      });
    });
  });

  describe('Remove User From Group', () => {
    it('should create an action', () => {
      const payload = {
        groupId: '12345',
        userId: '67890',
      };

      const action = new groupsActions.RemoveUserFromGroup(payload);

      expect({ ...action }).toEqual({
        payload,
        type: groupsActions.REMOVE_USER_FROM_GROUP,
      });
    });
  });

  describe('Load Group As Child', () => {
    it('should create an action', () => {
      const payload = '12345';

      const action = new groupsActions.LoadGroupAsChild(payload);

      expect({ ...action }).toEqual({
        payload,
        type: groupsActions.LOAD_GROUP_AS_CHILD,
      });
    });
  });

  describe('Finished Network Request For Group', () => {
    it('should create an action', () => {
      const payload = '12345';

      const action = new groupsActions.FinishedNetworkRequestForGroup(payload);

      expect({ ...action }).toEqual({
        payload,
        type: groupsActions.FINISHED_NETWORK_REQUEST_FOR_GROUP,
      });
    });
  });

  describe('Finished Generic Network Request For Group', () => {
    it('should create an action', () => {
      const action = new groupsActions.FinishedGenericNetworkRequestForGroup();

      expect({ ...action }).toEqual({
        type: groupsActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_GROUP,
      });
    });
  });

  describe('Group Failure', () => {
    it('should create an action', () => {
      const payload = {id: '12345', error: new Error('message')};

      const action = new groupsActions.GroupFailure(payload);

      expect({ ...action }).toEqual({
        payload,
        type: groupsActions.GROUP_FAILURE,
      });
    });
  });

  describe('Generic Group Failure', () => {
    it('should create an action', () => {
      const payload = new Error('message');

      const action = new groupsActions.GenericGroupFailure(payload);

      expect({ ...action }).toEqual({
        payload,
        type: groupsActions.GENERIC_GROUP_FAILURE,
      });
    });
  });

  
  describe('Remove Group From Local Memory', () => {
    it('should create an action', () => {
      const payload = '12345';

      const action = new groupsActions.RemoveGroupFromLocalMemory(payload);

      expect({ ...action }).toEqual({
        payload,
        type: groupsActions.REMOVE_GROUP_FROM_LOCAL_MEMORY,
      });
    });
  });

  function createTestGroup(): Group {
    const group = new Group();
    group.id = '12345';
    group.name = 'group name';

    return group;
  }
});
