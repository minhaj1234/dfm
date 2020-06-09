import { Decision } from '../../../models/decision.model';
import { ObjectRelationsNames } from '../../../models/objects.model';
import { ISystemUpdate, System } from '../../../models/system.model';
import * as systemActions from './system.action';

describe('System Actions', () => {
  describe('Load System', () => {
    it('should create an action', () => {
      const payload = '12345';
      
      const action = new systemActions.LoadSystem(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: systemActions.LOAD_SYSTEM,
      });
    });
  });

  describe('Load System Success', () => {
    it('should create an action', () => {
      const payload: System = {} as any;
      
      const action = new systemActions.LoadSystemSuccess(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: systemActions.LOAD_SYSTEM_SUCCESS,
      });
    });
  });

  describe('Add System', () => {
    it('should create an action', () => {
      const payload = {
        name: 'test name',
        description: 'test description',
        url: 'test url'
      };

      const action = new systemActions.AddSystem(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: systemActions.ADD_SYSTEM,
      });
    });
  });

  describe('Update System', () => {
    it('should create an action', () => {
      const payload: ISystemUpdate = {
        system: {
          id: 'test id',
          name: 'test name',
          description: 'test description',
          url: 'test url',
          _links: {} as any,
        }
      };

      const action = new systemActions.UpdateSystem(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: systemActions.UPDATE_SYSTEM,
      });
    });
  });

  describe('Delete System', () => {
    it('should create an action', () => {
      const payload: System = {} as any;
      const action = new systemActions.DeleteSystem(payload);
      expect({ ...action }).toEqual({
        payload,
        type: systemActions.DELETE_SYSTEM,
      });
    });
  });

  describe('Add Related Object To System', () => {
    it('should create an action', () => {
      const payload = {
        sourceObject: new System(),
        relatedObject: new Decision(),
        relatedPath: ObjectRelationsNames.Decisions,
      } as any;

      const action = new systemActions.AddRelatedObjectToSystem(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: systemActions.ADD_RELATED_OBJECT_TO_SYSTEM,
      });
    });
  });

  describe('Update System Related Object', () => {
    it('should create an action', () => {
      const payload = {object: new Decision(), paths: ['test path']};
      
      const action = new systemActions.UpdateSystemRelatedObject(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: systemActions.UPDATE_SYSTEM_RELATED_OBJECT,
      });
    });
  });

  describe('Remove Related Object From System', () => {
    it('should create an action', () => {
      const payload = {
        sourceObject: new System(),
        relatedObject: new Decision(),
        relatedPath: ObjectRelationsNames.Decisions,
      } as any;

      const action = new systemActions.RemoveRelatedObjectFromSystem(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: systemActions.REMOVE_RELATED_OBJECT_FROM_SYSTEM,
      });
    });
  });

  describe('Load System As Child', () => {
    it('should create an action', () => {
      const payload = 'test id';
      
      const action = new systemActions.LoadSystemAsChild(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: systemActions.LOAD_SYSTEM_AS_CHILD,
      });
    });
  });

  describe('Finished Network Request For System', () => {
    it('should create an action', () => {
      const payload = 'systemTestId';
      
      const action = new systemActions.FinishedNetworkRequestForSystem(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: systemActions.FINISHED_NETWORK_REQUEST_FOR_SYSTEM,
      });
    });
  });

  describe('Finished Generic Network Request For System', () => {
    it('should create an action', () => {
      const action = new systemActions.FinishedGenericNetworkRequestForSystem();
      
      expect({ ...action }).toEqual({
        type: systemActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_SYSTEM,
      });
    });
  });

  describe('System Failure', () => {
    it('should create an action', () => {
      const payload = { error: new Error('Fail message'), id: '1234' };
      
      const action = new systemActions.SystemFailure(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: systemActions.SYSTEM_FAILURE,
      });
    });
  });

  describe('Generic System Failure', () => {
    it('should create an action', () => {
      const payload = new Error('test error message');
      
      const action = new systemActions.GenericSystemFailure(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: systemActions.GENERIC_SYSTEM_FAILURE,
      });
    });
  });

  describe('Remove System From Local Memory', () => {
    it('should create an action', () => {
      const payload = 'test id';
      
      const action = new systemActions.RemoveSystemFromLocalMemory(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: systemActions.REMOVE_SYSTEM_FROM_LOCAL_MEMORY,
      });
    });
  });

  describe('Remove Preview System From Local Memory', () => {
    it('should create an action', () => {
      const payload = '12345';
      
      const action = new systemActions.RemovePreviewSystemFromLocalMemory(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: systemActions.REMOVE_PREVIEW_SYSTEM_FROM_LOCAL_MEMORY,
      });
    });
  });
});
