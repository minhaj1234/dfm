import { Decision } from '../../../models/decision.model';
import { IKnowledgeSourceUpdate, KnowledgeSource } from '../../../models/knowledgeSource.model';
import { ObjectRelationsNames } from '../../../models/objects.model';
import { Organization } from '../../../models/organization.model';
import * as knowledgeSourceActions from './knowledgeSource.actions';

describe('Knowledge Source Actions', () => {
  describe('Update Knowledge Source', () => {
    it('should create an action', () => {
      const payload: IKnowledgeSourceUpdate = {
        knowledgeSource: {
          _links: {}  as any,
          description: 'description',
          id: 'knowledgeSource1',
          name: 'name',
        }
      };

      const action = new knowledgeSourceActions.UpdateKnowledgeSource(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: knowledgeSourceActions.UPDATE_KNOWLEDGE_SOURCE,
      });
    });
  });

  describe('Add Knowledge Source', () => {
    it('should create an action', () => {
      const payload = { name: 'name', description: 'description', url: 'http://example.com', type: 'type_1' };
     
      const action = new knowledgeSourceActions.AddKnowledgeSource(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: knowledgeSourceActions.ADD_KNOWLEDGE_SOURCE,
      });
    });
  });

  describe('Delete Knowledge Source', () => {
    it('should create an action', () => {
      const payload: KnowledgeSource = {} as any;
    
      const action = new knowledgeSourceActions.DeleteKnowledgeSource(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: knowledgeSourceActions.DELETE_KNOWLEDGE_SOURCE,
      });
    });
  });

  describe('Add Related Object To Knowledge Source', () => {
    it('should create an action', () => {
      const payload = {
        sourceObject: new KnowledgeSource(),
        relatedObject: new Organization(),
        relatedPath: ObjectRelationsNames.Organizations,
      } as any;

      const action = new knowledgeSourceActions.AddRelatedObjectToKnowledgeSource(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: knowledgeSourceActions.ADD_RELATED_OBJECT_TO_KNOWLEDGE_SOURCE,
      });
    });
  });

  describe('Update Knowledge Source Related Object', () => {
    it('should create an action', () => {
      const payload = {object: new Decision(), paths: ['test path']};
      
      const action = new knowledgeSourceActions.UpdateKnowledgeSourceRelatedObject(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: knowledgeSourceActions.UPDATE_KNOWLEDGE_SOURCE_RELATED_OBJECT,
      });
    });
  });

  describe('Remove Related Object From Knowledge Source', () => {
    it('should create an action', () => {
      const payload = {
        sourceObject: new KnowledgeSource(),
        relatedObject: new Organization(),
        relatedPath: ObjectRelationsNames.Organizations,
      } as any;

      const action = new knowledgeSourceActions.RemoveRelatedObjectFromKnowledgeSource(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: knowledgeSourceActions.REMOVE_RELATED_OBJECT_FROM_KNOWLEDGE_SOURCE,
      });
    });
  });

  describe('Knowledge Source Failure', () => {
    it('should create an action', () => {
      const payload = { error: new Error('Fail message'), id: '12345' };
    
      const action = new knowledgeSourceActions.KnowledgeSourceFailure(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: knowledgeSourceActions.KNOWLEDGE_SOURCE_FAILURE,
      });
    });
  });

  describe('Finished Network Request For Knowledge Source', () => {
    it('should create an action', () => {
      const payload = '12345';
     
      const action = new knowledgeSourceActions.FinishedNetworkRequestForKnowledgeSource(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: knowledgeSourceActions.FINISHED_NETWORK_REQUEST_FOR_KNOWLEDGE_SOURCE,
      });
    });
  });

  describe('Load Knowledge Source', () => {
    it('should create an action', () => {
      const payload = '12345';
     
      const action = new knowledgeSourceActions.LoadKnowledgeSource(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: knowledgeSourceActions.LOAD_KNOWLEGE_SOURCE,
      });
    });
  });

  describe('Load Knowledge Source As Child', () => {
    it('should create an action', () => {
      const payload = '12345';
      
      const action = new knowledgeSourceActions.LoadKnowledgeSourceAsChild(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: knowledgeSourceActions.LOAD_KNOWLEGE_SOURCE_AS_CHILD,
      });
    });
  });

  describe('Load Knowledge Source Success', () => {
    it('should create an action', () => {
      const payload: KnowledgeSource = {} as any;
      
      const action = new knowledgeSourceActions.LoadKnowledgeSourceSuccess(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: knowledgeSourceActions.LOAD_KNOWLEGE_SOURCE_SUCCESS,
      });
    });
  });

  describe('Generic Knowlege Source Failure', () => {
    it('should create an action', () => {
      const payload = new Error('some message');
      
      const action = new knowledgeSourceActions.GenericKnowlegeSourceFailure(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: knowledgeSourceActions.GENERIC_KNOWLEDGE_SOURCE_FAILURE,
      });
    });
  });

  describe('Finished Generic Network Request For Knowledge Source', () => {
    it('should create an action', () => {
      const action = new knowledgeSourceActions.FinishedGenericNetworkRequestForKnowledgeSource();
      
      expect({ ...action }).toEqual({
        type: knowledgeSourceActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_KNOWLEGE_SOURCE,
      });
    });
  });

  describe('Remove Knowledge Source From Local Memory', () => {
    it('should create an action', () => {
      const payload = '12345';
     
      const action = new knowledgeSourceActions.RemoveKnowledgeSourceFromLocalMemory(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: knowledgeSourceActions.REMOVE_KNOWLEDGE_SOURCE_FROM_LOCAL_MEMORY,
      });
    });
  });

  describe('Remove Preview Knowledge Source From Local Memory', () => {
    it('should create an action', () => {
      const payload = '12345';
      
      const action = new knowledgeSourceActions.RemovePreviewKnowledgeSourceFromLocalMemory(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: knowledgeSourceActions.REMOVE_PREVIEW_KNOWLEDGE_SOURCE_FROM_LOCAL_MEMORY,
      });
    });
  });
});
