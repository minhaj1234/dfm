import { Answer, Decision, IDecisionUpdate } from '../../../models/decision.model';
import * as decisionTable from '../../../models/decisionImplementationTable.model';
import { ObjectRelationsNames } from '../../../models/objects.model';
import { Process } from '../../../models/process.model';
import * as decisionActions from './decision.actions';

describe('DecisionActions', () => {
  describe('Update Decision', () => {
    it('should create an action', () => {
      const payload: IDecisionUpdate = {
        decision: {
          _links: {} as any,
          description: 'description',
          id: 'decision1',
          name: 'name',
          question: 'why?',
          type: 'type_1',
        }
      };

      const action = new decisionActions.UpdateDecision(payload);

      expect({ ...action }).toEqual({
        payload,
        type: decisionActions.UPDATE_DECISION,
      });
    });
  });

  describe('Add Decision', () => {
    it('should create an action', () => {
      const payload = {
        name: 'name',
        description: 'description',
        type: 'type_1',
        statusLevel: 'COMPLETED',
        url: 'http://example.com',
        question: 'why?',
      };

      const action = new decisionActions.AddDecision(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: decisionActions.ADD_DECISION,
      });
    });
  });

  describe('Delete Decision', () => {
    it('should create an action', () => {
      const payload: Decision = {} as any;
      
      const action = new decisionActions.DeleteDecision(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: decisionActions.DELETE_DECISION,
      });
    });
  });

  describe('Add Related Object To Decision', () => {
    it('should create an action', () => {
      const payload = {
        sourceObject: new Decision(),
        relatedObject: new Process(),
        relatedPath: ObjectRelationsNames.Processes,
      } as any;

      const action = new decisionActions.AddRelatedObjectToDecision(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: decisionActions.ADD_RELATED_OBJECT_TO_DECISION,
      });
    });
  });

  describe('Remove Related Object From Decision', () => {
    it('should create an action', () => {
      const payload = {
        sourceObject: new Decision(),
        relatedObject: new Process(),
        relatedPath: ObjectRelationsNames.Processes,
      } as any;

      const action = new decisionActions.RemoveRelatedObjectFromDecision(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: decisionActions.REMOVE_RELATED_OBJECT_FROM_DECISION,
      });
    });
  });

  describe('Add Implementation Table Entity', () => {
    it('should create an action', () => {
      const payload = {
        sourceObject: new Decision(),
        relatedPath: ObjectRelationsNames.Processes,
        requestBody: new decisionTable.Row(),
      } as any;

      const action = new decisionActions.AddImplementationTableEntity(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: decisionActions.ADD_IMPLEMENTATION_TABLE_ENTITY,
      });
    });
  });

  describe('Update Implementation Table Entity', () => {
    it('should create an action', () => {
      const payload = {
        sourceObject: new Decision(),
        relatedPath: ObjectRelationsNames.Processes,
        relatedObject: new decisionTable.Header(),
      } as any;

      const action = new decisionActions.UpdateImplementationTableEntity(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: decisionActions.UPDATE_IMPLEMENTATION_TABLE_ENTITY,
      });
    });
  });

  describe('Remove Implementation Table Entity', () => {
    it('should create an action', () => {
      const payload = {
        sourceObject: new Decision(),
        relatedPath: ObjectRelationsNames.Processes,
        relatedObjectId: 'relatedObjectId',
      } as any;

      const action = new decisionActions.RemoveImplementationTableEntity(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: decisionActions.REMOVE_IMPLEMENTATION_TABLE_ENTITY,
      });
    });
  });

  describe('Update Answer', () => {
    it('should create an action', () => {
      const payload = {
        decision: new Decision(),
        answer: new Answer(),
      } as any;
      
      const action = new decisionActions.UpdateAnswer(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: decisionActions.UPDATE_ANSWER,
      });
    });
  });

  describe('Generic Decision Failure', () => {
    it('should create an action', () => {
      const payload = new Error('Fail message');
     
      const action = new decisionActions.GenericDecisionFailure(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: decisionActions.GENERIC_DECISION_FAILURE,
      });
    });
  });

  describe('Decision Failure', () => {
    it('should create an action', () => {
      const payload = { error: new Error('Fail message'), id: '1234' };
      
      const action = new decisionActions.DecisionFailure(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: decisionActions.DECISION_FAILURE,
      });
    });
  });

  describe('Finished Network Request For Decision', () => {
    it('should create an action', () => {
      const payload = '12345';
      
      const action = new decisionActions.FinishedNetworkRequestForDecision(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: decisionActions.FINISHED_NETWORK_REQUEST_FOR_DECISION,
      });
    });
  });

  describe('Finished Generic Network Request For Decision', () => {
    it('should create an action', () => {
      const action = new decisionActions.FinishedGenericNetworkRequestForDecision();
     
      expect({ ...action }).toEqual({
        type: decisionActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_DECISION,
      });
    });
  });

  describe('Load Decision', () => {
    it('should create an action', () => {
      const payload = '12345';
     
      const action = new decisionActions.LoadDecision(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: decisionActions.LOAD_DECISION,
      });
    });
  });

  describe('Load Decision As Child', () => {
    it('should create an action', () => {
      const payload = '12345';
     
      const action = new decisionActions.LoadDecisionAsChild(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: decisionActions.LOAD_DECISION_AS_CHILD,
      });
    });
  });

  describe('Load Decision Success', () => {
    it('should create an action', () => {
      const payload: Decision = {} as any;
      
      const action = new decisionActions.LoadDecisionSuccess(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: decisionActions.LOAD_DECISION_SUCCESS,
      });
    });
  });

  describe('Update Decision Related Object', () => {
    it('should create an action', () => {
      const payload = {object: new Decision(), paths: ['test path']};
      
      const action = new decisionActions.UpdateDecisionRelatedObject(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: decisionActions.UPDATE_DECISION_RELATED_OBJECT,
      });
    });
  });

  describe('Remove Decision from Local Memory', () => {
    it('should create an action', () => {
      const payload = '12345';
     
      const action = new decisionActions.RemoveDecisionFromLocalMemory(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: decisionActions.REMOVE_DECISION_FROM_LOCAL_MEMORY,
      });
    });
  });

  describe('Remove Preview Decision From Local Memory', () => {
    it('should create an action', () => {
      const payload = '12345';
      
      const action = new decisionActions.RemovePreviewDecisionFromLocalMemory(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: decisionActions.REMOVE_PREVIEW_DECISION_FROM_LOCAL_MEMORY,
      });
    });
  });
});
