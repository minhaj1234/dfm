import { BusinessObjective, IBusinessObjectiveUpdate } from '../../../models/businessObjective.model';
import { Comment } from '../../../models/comment.model';
import { Decision } from '../../../models/decision.model';
import { ObjectRelationsNames } from '../../../models/objects.model';
import { Organization } from '../../../models/organization.model';
import * as businessObjectiveAcions from './businessObjective.action';

describe('BusinessObjectiveAcions', () => {
  describe('Load Business Objective', () => {
    it('should create an action', () => {
      const payload = '12345';
     
      const action = new businessObjectiveAcions.LoadBusinessObjective(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: businessObjectiveAcions.LOAD_BUSINESS_OBJECTIVE,
      });
    });
  });

  describe('Load Business Objective Success', () => {
    it('should create an action', () => {
      const payload: BusinessObjective = {} as any;
      
      const action = new businessObjectiveAcions.LoadBusinessObjectiveSuccess(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: businessObjectiveAcions.LOAD_BUSINESS_OBJECTIVE_SUCCESS,
      });
    });
  });

  describe('Add Business Objective', () => {
    it('should create an action', () => {
      const payload = {
        name: 'test name',
        description: 'test description',
        url: 'test url'
      };

      const action = new businessObjectiveAcions.AddBusinessObjective(payload);
    
      expect({ ...action }).toEqual({
        payload,
        type: businessObjectiveAcions.ADD_BUSINESS_OBJECTIVE,
      });
    });
  });

  describe('Update Business Objective', () => {
    it('should create an action', () => {
      const payload: IBusinessObjectiveUpdate = {
        businessObjective: {
          id: 'test id',
          name: 'test name',
          description: 'test description',
          url: 'test url',
          _links: {} as any,
        }
      };

      const action = new businessObjectiveAcions.UpdateBusinessObjective(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: businessObjectiveAcions.UPDATE_BUSINESS_OBJECTIVE,
      });
    });
  });

  describe('Delete Business Objective', () => {
    it('should create an action', () => {
      const payload: BusinessObjective = {} as any;
     
      const action = new businessObjectiveAcions.DeleteBusinessObjective(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: businessObjectiveAcions.DELETE_BUSINESS_OBJECTIVE,
      });
    });
  });

  describe('Add Related Object To Business Objective', () => {
    it('should create an action', () => {
      const payload = {
        sourceObject: new BusinessObjective(),
        relatedObject: new Decision(),
        relatedPath: ObjectRelationsNames.Decisions,
      } as any;

      const action = new businessObjectiveAcions.AddRelatedObjectToBusinessObjective(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: businessObjectiveAcions.ADD_RELATED_OBJECT_TO_BUSINESS_OBJECTIVE,
      });
    });
  });

  describe('Update Business Objective Related Object', () => {
    it('should create an action', () => {
      const payload = {object: new Organization(), paths: ['test path']};
     
      const action = new businessObjectiveAcions.UpdateBusinessObjectiveRelatedObject(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: businessObjectiveAcions.UPDATE_BUSINESS_OBJECTIVE_RELATED_OBJECT,
      });
    });
  });

  describe('Remove Related Object From Business Objective', () => {
    it('should create an action', () => {
      const payload = {
        sourceObject: new BusinessObjective(),
        relatedObject: new Decision(),
        relatedPath: ObjectRelationsNames.Decisions,
      } as any;

      const action = new businessObjectiveAcions.RemoveRelatedObjectFromBusinessObjective(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: businessObjectiveAcions.REMOVE_RELATED_OBJECT_FROM_BUSINESS_OBJECTIVE,
      });
    });
  });

  describe('Load Business Objective As Child', () => {
    it('should create an action', () => {
      const payload = 'test id';
      const action = new businessObjectiveAcions.LoadBusinessObjectiveAsChild(payload);
      expect({ ...action }).toEqual({
        payload,
        type: businessObjectiveAcions.LOAD_BUSINESS_OBJECTIVE_AS_CHILD,
      });
    });
  });

  describe('Update Business Objective Related Object', () => {
    it('should create an action', () => {
      const payload = {object: new Organization(), paths: ['test path']};
     
      const action = new businessObjectiveAcions.UpdateBusinessObjectiveRelatedObject(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: businessObjectiveAcions.UPDATE_BUSINESS_OBJECTIVE_RELATED_OBJECT,
      });
    });
  });

  describe('Finished Network Request For Business Objective', () => {
    it('should create an action', () => {
      const payload = 'businessObjectiveTestId';
      const action = new businessObjectiveAcions.FinishedNetworkRequestForBusinessObjective(payload);
      expect({ ...action }).toEqual({
        payload,
        type: businessObjectiveAcions.FINISHED_NETWORK_REQUEST_FOR_BUSINESS_OBJECTIVE,
      });
    });
  });

  describe('Finished Generic Network Request For Business Objective', () => {
    it('should create an action', () => {
      const action = new businessObjectiveAcions.FinishedGenericNetworkRequestForBusinessObjective();
     
      expect({ ...action }).toEqual({
        type: businessObjectiveAcions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_BUSINESS_OBJECTIVE,
      });
    });
  });

  describe('Business Objective Failure', () => {
    it('should create an action', () => {
      const payload = { error: new Error('Fail message'), id: '1234' };
     
      const action = new businessObjectiveAcions.BusinessObjectiveFailure(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: businessObjectiveAcions.BUSINESS_OBJECTIVE_FAILURE,
      });
    });
  });

  describe('Generic Business Objective Failure', () => {
    it('should create an action', () => {
      const payload = new Error('test error message');
   
      const action = new businessObjectiveAcions.GenericBusinessObjectiveFailure(payload);
    
      expect({ ...action }).toEqual({
        payload,
        type: businessObjectiveAcions.GENERIC_BUSINESS_OBJECTIVE_FAILURE,
      });
    });
  });

  describe('Remove Business Objective From Local Memory', () => {
    it('should create an action', () => {
      const payload = 'test id';
     
      const action = new businessObjectiveAcions.RemoveBusinessObjectiveFromLocalMemory(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: businessObjectiveAcions.REMOVE_BUSINESS_OBJECTIVE_FROM_LOCAL_MEMORY,
      });
    });
  });

  describe('Remove Preview Business Objective From Local Memory', () => {
    it('should create an action', () => {
      const payload = '12345';
      
      const action = new businessObjectiveAcions.RemovePreviewBusinessObjectiveFromLocalMemory(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: businessObjectiveAcions.REMOVE_PREVIEW_BUSINESS_OBJECTIVE_FROM_LOCAL_MEMORY,
      });
    });
  });
});
