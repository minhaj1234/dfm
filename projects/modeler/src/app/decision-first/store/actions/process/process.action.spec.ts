import { Decision } from '../../../models/decision.model';
import { ObjectRelationsNames } from '../../../models/objects.model';
import { IProcessUpdate, Process } from '../../../models/process.model';
import * as processActions from './process.action';

describe('Process Actions', () => {
  describe('Load Process', () => {
    it('should create an action', () => {
      const payload = '12345';
      
      const action = new processActions.LoadProcess(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: processActions.LOAD_PROCESS,
      });
    });
  });

  describe('Load Process Success', () => {
    it('should create an action', () => {
      const payload: Process = {} as any;
     
      const action = new processActions.LoadProcessSuccess(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: processActions.LOAD_PROCESS_SUCCESS,
      });
    });
  });

  describe('Add Process', () => {
    it('should create an action', () => {
      const payload = {
        name: 'test name',
        description: 'test description',
        url: 'test url'
      };

      const action = new processActions.AddProcess(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: processActions.ADD_PROCESS,
      });
    });
  });

  describe('Update Process', () => {
    it('should create an action', () => {
      const payload: IProcessUpdate = {
        process: {
          id: 'test id',
          name: 'test name',
          description: 'test description',
          url: 'test url',
          _links: {} as any,
        }
      };

      const action = new processActions.UpdateProcess(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: processActions.UPDATE_PROCESS,
      });
    });
  });

  describe('Delete Process', () => {
    it('should create an action', () => {
      const payload: Process = {} as any;
      
      const action = new processActions.DeleteProcess(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: processActions.DELETE_PROCESS,
      });
    });
  });

  describe('Add Related Object To Process', () => {
    it('should create an action', () => {
      const payload = {
        sourceObject: new Process(),
        relatedObject: new Decision(),
        relatedPath: ObjectRelationsNames.Decisions,
      } as any;

      const action = new processActions.AddRelatedObjectToProcess(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: processActions.ADD_RELATED_OBJECT_TO_PROCESS,
      });
    });
  });

  describe('Update Process Related Object', () => {
    it('should create an action', () => {
      const payload = {object: new Decision(), paths: ['test path']};
      
      const action = new processActions.UpdateProcessRelatedObject(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: processActions.UPDATE_PROCESS_RELATED_OBJECT,
      });
    });
  });

  describe('Remove Related Object From Process', () => {
    it('should create an action', () => {
      const payload = {
        sourceObject: new Process(),
        relatedObject: new Decision(),
        relatedPath: ObjectRelationsNames.Decisions,
      } as any;

      const action = new processActions.RemoveRelatedObjectFromProcess(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: processActions.REMOVE_RELATED_OBJECT_FROM_PROCESS,
      });
    });
  });

  describe('Load Process As Child', () => {
    it('should create an action', () => {
      const payload = 'test id';
     
      const action = new processActions.LoadProcessAsChild(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: processActions.LOAD_PROCESS_AS_CHILD,
      });
    });
  });

  describe('Finished Network Request For Process', () => {
    it('should create an action', () => {
      const payload = 'processTestId';
     
      const action = new processActions.FinishedNetworkRequestForProcess(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: processActions.FINISHED_NETWORK_REQUEST_FOR_PROCESS,
      });
    });
  });

  describe('Finished Generic Network Request For Process', () => {
    it('should create an action', () => {
      const action = new processActions.FinishedGenericNetworkRequestForProcess();
     
      expect({ ...action }).toEqual({
        type: processActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_PROCESS,
      });
    });
  });

  describe('Process Failure', () => {
    it('should create an action', () => {
      const payload = { error: new Error('Fail message'), id: '1234' };
     
      const action = new processActions.ProcessFailure(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: processActions.PROCESS_FAILURE,
      });
    });
  });

  describe('Generic Process Failure', () => {
    it('should create an action', () => {
      const payload = new Error('test error message');
      
      const action = new processActions.GenericProcessFailure(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: processActions.GENERIC_PROCESS_FAILURE,
      });
    });
  });

  describe('Remove Process From Local Memory', () => {
    it('should create an action', () => {
      const payload = 'test id';
      
      const action = new processActions.RemoveProcessFromLocalMemory(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: processActions.REMOVE_PROCESS_FROM_LOCAL_MEMORY,
      });
    });
  });

  describe('Remove Preview Process From Local Memory', () => {
    it('should create an action', () => {
      const payload = '12345';
      
      const action = new processActions.RemovePreviewProcessFromLocalMemory(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: processActions.REMOVE_PREVIEW_PROCESS_FROM_LOCAL_MEMORY,
      });
    });
  });
});
