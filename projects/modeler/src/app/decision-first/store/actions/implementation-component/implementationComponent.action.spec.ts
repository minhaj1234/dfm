import { Decision } from '../../../models/decision.model';
import { ImplementationComponent, IImplementationComponentUpdate } from '../../../models/implementationComponent.model';
import { ObjectRelationsNames } from '../../../models/objects.model';
import * as implementationComponentActions from './implementationComponent.action';

describe('ImplementationComponent Actions', () => {
  describe('Load Implementation Component', () => {
    it('should create an action', () => {
      const payload = '12345';
     
      const action = new implementationComponentActions.LoadImplementationComponent(payload);
    
      expect({ ...action }).toEqual({
        payload,
        type: implementationComponentActions.LOAD_IMPLEMENTATION_COMPONENT,
      });
    });
  });

  describe('Load Implementation Component Success', () => {
    it('should create an action', () => {
      const payload: ImplementationComponent = {} as any;
     
      const action = new implementationComponentActions.LoadImplementationComponentSuccess(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: implementationComponentActions.LOAD_IMPLEMENTATION_COMPONENT_SUCCESS,
      });
    });
  });

  describe('Add Implementation Component', () => {
    it('should create an action', () => {
      const payload = {
        name: 'test name',
        description: 'test description',
        url: 'test url',
        iconId: 'test icon Id'
      };

      const action = new implementationComponentActions.AddImplementationComponent(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: implementationComponentActions.ADD_IMPLEMENTATION_COMPONENT,
      });
    });
  });

  describe('Update Implementation Component', () => {
    it('should create an action', () => {
      const payload: IImplementationComponentUpdate = {
        implementationComponent: {
          id: 'test id',
          name: 'test name',
          description: 'test description',
          url: 'test url',
          _links: {} as any,
        }
      };

      const action = new implementationComponentActions.UpdateImplementationComponent(payload);
    
      expect({ ...action }).toEqual({
        payload,
        type: implementationComponentActions.UPDATE_IMPLEMENTATION_COMPONENT,
      });
    });
  });

  describe('Delete Implementation Component', () => {
    it('should create an action', () => {
      const payload: ImplementationComponent = {} as any;
      
      const action = new implementationComponentActions.DeleteImplementationComponent(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: implementationComponentActions.DELETE_IMPLEMENTATION_COMPONENT,
      });
    });
  });

  describe('Add Related Object To Implementation Component', () => {
    it('should create an action', () => {
      const payload = {
        sourceObject: new ImplementationComponent(),
        relatedObject: new Decision(),
        relatedPath: ObjectRelationsNames.Decisions,
      } as any;

      const action = new implementationComponentActions.AddRelatedObjectToImplementationComponent(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: implementationComponentActions.ADD_RELATED_OBJECT_TO_IMPLEMENTATION_COMPONENT,
      });
    });
  });

  describe('Update Implementation Component Related Object', () => {
    it('should create an action', () => {
      const payload = {object: new Decision(), paths: ['test path']};
     
      const action = new implementationComponentActions.UpdateImplementationComponentRelatedObject(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: implementationComponentActions.UPDATE_IMPLEMENTATION_COMPONENT_RELATED_OBJECT,
      });
    });
  });

  describe('Remove Related Object From Implementation Component', () => {
    it('should create an action', () => {
      const payload = {
        sourceObject: new ImplementationComponent(),
        relatedObject: new Decision(),
        relatedPath: ObjectRelationsNames.Decisions,
      } as any;

      const action = new implementationComponentActions.RemoveRelatedObjectFromImplementationComponent(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: implementationComponentActions.REMOVE_RELATED_OBJECT_FROM_IMPLEMENTATION_COMPONENT,
      });
    });
  });

  describe('Load Implementation Component As Child', () => {
    it('should create an action', () => {
      const payload = 'test id';
     
      const action = new implementationComponentActions.LoadImplementationComponentAsChild(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: implementationComponentActions.LOAD_IMPLEMENTATION_COMPONENT_AS_CHILD,
      });
    });
  });

  describe('Finished Network Request For Implementation Component', () => {
    it('should create an action', () => {
      const payload = 'implementationComponentTestId';
      const action = new implementationComponentActions.FinishedNetworkRequestForImplementationComponent(payload);
      expect({ ...action }).toEqual({
        payload,
        type: implementationComponentActions.FINISHED_NETWORK_REQUEST_FOR_IMPLEMENTATION_COMPONENT,
      });
    });
  });

  describe('Finished Generic Network Request For Implementation Component', () => {
    it('should create an action', () => {
      const action = new implementationComponentActions.FinishedGenericNetworkRequestForImplementationComponent();
      expect({ ...action }).toEqual({
        type: implementationComponentActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_IMPLEMENTATION_COMPONENT,
      });
    });
  });

  describe('Implementation Component Failure', () => {
    it('should create an action', () => {
      const payload = { error: new Error('Fail message'), id: '1234' };
    
      const action = new implementationComponentActions.ImplementationComponentFailure(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: implementationComponentActions.IMPLEMENTATION_COMPONENT_FAILURE,
      });
    });
  });

  describe('Generic Implementation Component Failure', () => {
    it('should create an action', () => {
      const payload = new Error('test error message');
    
      const action = new implementationComponentActions.GenericImplementationComponentFailure(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: implementationComponentActions.GENERIC_IMPLEMENTATION_COMPONENT_FAILURE,
      });
    });
  });

  describe('Remove Implementation Component From Local Memory', () => {
    it('should create an action', () => {
      const payload = 'test id';
    
      const action = new implementationComponentActions.RemoveImplementationComponentFromLocalMemory(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: implementationComponentActions.REMOVE_IMPLEMENTATION_COMPONENT_FROM_LOCAL_MEMORY,
      });
    });
  });

  describe('Remove Preview Implementation Component From Local Memory', () => {
    it('should create an action', () => {
      const payload = '12345';
      
      const action = new implementationComponentActions.RemovePreviewImplementationComponentFromLocalMemory(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: implementationComponentActions.REMOVE_PREVIEW_IMPLEMENTATION_COMPONENT_FROM_LOCAL_MEMORY,
      });
    });
  });
});
