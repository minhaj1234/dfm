import { BusinessObjective } from '../../../models/businessObjective.model';
import { Decision } from '../../../models/decision.model';
import { ObjectRelationsNames } from '../../../models/objects.model';
import { IOrganizationUpdate, Organization } from '../../../models/organization.model';
import * as organizationActions from './organization.actions';

describe('Organizations Actions', () => {
  describe('Load Organization', () => {
    it('should create an action', () => {
      const payload = 'organization id';
      
      const action = new organizationActions.LoadOrganization(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: organizationActions.LOAD_ORGANIZATION,
      });
    });
  });

  describe('Organization Failure', () => {
    it('should create an action', () => {
      const payload = { error: new Error('error message'), id: 'organization id' };
     
      const action = new organizationActions.OrganizationFailure(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: organizationActions.ORGANIZATION_FAILURE,
      });
    });
  });

  describe('Load Organization Success', () => {
    it('should create an action', () => {
      const payload: Organization = {} as any;
      
      const action = new organizationActions.LoadOrganizationSuccess(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: organizationActions.LOAD_ORGANIZATION_SUCCESS,
      });
    });
  });

  describe('Add Organization', () => {
    it('should create an action', () => {
      const payload = { name: 'organization name', description: 'organization description', type: 'ROLE', url: 'http://example.com' };
      
      const action = new organizationActions.AddOrganization(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: organizationActions.ADD_ORGANIZATION,
      });
    });
  });

  describe('Update Organization', () => {
    it('should create an action', () => {
      const payload: IOrganizationUpdate = {
        organization: {
          _links: {} as any,
          description: '',
          id: '',
        }
      };
      
      const action = new organizationActions.UpdateOrganization(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: organizationActions.UPDATE_ORGANIZATION,
      });
    });
  });

  describe('Delete Organization', () => {
    it('should create an action', () => {
      const payload: Organization = {} as any;
     
      const action = new organizationActions.DeleteOrganization(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: organizationActions.DELETE_ORGANIZATION,
      });
    });
  });

  describe('Add Related Object To Organization', () => {
    it('should create an action', () => {
      const payload = {
        sourceObject: new Organization(),
        relatedObject: new BusinessObjective(),
        relatedPath: ObjectRelationsNames.BusinessObjectives,
      } as any;

      const action = new organizationActions.AddRelatedObjectToOrganization(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: organizationActions.ADD_RELATED_OBJECT_TO_ORGANIZATION,
      });
    });
  });

  describe('Update Organization Related Object', () => {
    it('should create an action', () => {
      const payload = {object: new Decision(), paths: ['test path']};
     
      const action = new organizationActions.UpdateOrganizationRelatedObject(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: organizationActions.UPDATE_ORGANIZATION_RELATED_OBJECT,
      });
    });
  });

  describe('Remove Related Object From Organization', () => {
    it('should create an action', () => {
      const payload = {
        sourceObject: new Organization(),
        relatedObject: new BusinessObjective(),
        relatedPath: ObjectRelationsNames.BusinessObjectives,
      } as any;

      const action = new organizationActions.RemoveRelatedObjectFromOrganization(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: organizationActions.REMOVE_RELATED_OBJECT_FROM_ORGANIZATION,
      });
    });
  });

  describe('Load Organization As Child', () => {
    it('should create an action', () => {
      const payload = 'test id';
     
      const action = new organizationActions.LoadOrganizationAsChild(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: organizationActions.LOAD_ORGANIZATION_AS_CHILD,
      });
    });
  });

  describe('Finished Network Request For Organization', () => {
    it('should create an action', () => {
      const payload = 'test id';
     
      const action = new organizationActions.FinishedNetworkRequestForOrganization(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: organizationActions.FINISHED_NETWORK_REQUEST_FOR_ORGANIZATION,
      });
    });
  });

  describe('Remove Organization From Local Memory', () => {
    it('should create an action', () => {
      const payload = '12345';
      
      const action = new organizationActions.RemoveOrganizationFromLocalMemory(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: organizationActions.REMOVE_ORGANIZATION_FROM_LOCAL_MEMORY,
      });
    });
  });

  describe('Remove Preview Organization From Local Memory', () => {
    it('should create an action', () => {
      const payload = '12345';
      
      const action = new organizationActions.RemovePreviewOrganizationFromLocalMemory(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: organizationActions.REMOVE_PREVIEW_ORGANIZATION_FROM_LOCAL_MEMORY,
      });
    });
  });
});
