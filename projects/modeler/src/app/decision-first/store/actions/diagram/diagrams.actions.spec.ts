import { Decision } from '../../../models/decision.model';
import { Diagram, IDiagramUpdate } from '../../../models/diagram.model';
import { InputData } from '../../../models/inputData.model';
import { ObjectRelationsNames } from '../../../models/objects.model';
import * as diagramsActions from './diagrams.actions';

describe('Diagrams Actions', () => {
  describe('Load Diagram', () => {
    it('should create an action', () => {
      const payload = 'diagram id';
      
      const action = new diagramsActions.LoadDiagram(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: diagramsActions.LOAD_DIAGRAM,
      });
    });
  });

  describe('Load Diagram Success', () => {
    it('should create an action', () => {
      const payload: Diagram = {} as any;
      
      const action = new diagramsActions.LoadDiagramSuccess(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: diagramsActions.LOAD_DIAGRAM_SUCCESS,
      });
    });
  });

  describe('Add Diagram', () => {
    it('should create an action', () => {
      const payload = { name: 'diagram name', description: 'diagram description' };
      
      const action = new diagramsActions.AddDiagram(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: diagramsActions.ADD_DIAGRAM,
      });
    });
  });

  describe('Update Diagram', () => {
    it('should create an action', () => {
      const payload: IDiagramUpdate = {
        diagram: {
          _links: {} as any,
          description: '',
          id: '',
          name: '',
        }
      };
     
      const action = new diagramsActions.UpdateDiagram(payload);
    
      expect({ ...action }).toEqual({
        payload,
        type: diagramsActions.UPDATE_DIAGRAM,
      });
    });
  });

  describe('Delete Diagram', () => {
    it('should create an action', () => {
      const payload: Diagram = {} as any;
      
      const action = new diagramsActions.DeleteDiagram(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: diagramsActions.DELETE_DIAGRAM,
      });
    });
  });

  describe('Add Graphable Object To Diagram', () => {
    it('should create an action', () => {
      const payload = {
        sourceObject: new Diagram(),
        relatedObject: new InputData(),
        relatedPath: ObjectRelationsNames.InputDatas,
        isNew: false,
      } as any;

      const action = new diagramsActions.AddGraphableObjectToDiagram(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: diagramsActions.ADD_GRAPHABLE_OBJECT_TO_DIAGRAM,
      });
    });
  });

  describe('Update Diagram Graphable Object', () => {
    it('should create an action', () => {
      const payload = {object: new Decision(), paths: ['test path']};
     
      const action = new diagramsActions.UpdateDiagramGraphableObject(payload);
    
      expect({ ...action }).toEqual({
        payload,
        type: diagramsActions.UPDATE_DIAGRAM_GRAPHABLE_OBJECT,
      });
    });
  });

  describe('Remove Graphable Object From Diagram', () => {
    it('should create an action', () => {
      const payload = {
        diagram: new Decision(),
        deletedGraphables: {
          graphable: new InputData(),
          relatedPath: ObjectRelationsNames.InputDatas,
        }
      } as any;

      const action = new diagramsActions.RemoveGraphableObjectsFromDiagram(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: diagramsActions.REMOVE_GRAPHABLE_OBJECTS_FROM_DIAGRAM,
      });
    });
  });

  describe('Load Diagram As Child', () => {
    it('should create an action', () => {
      const payload = '';
     
      const action = new diagramsActions.LoadDiagramAsChild(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: diagramsActions.LOAD_DIAGRAM_AS_CHILD,
      });
    });
  });

  describe('Update Sketch Object', () => {
    it('should create an action', () => {
      const sketch = {} as any;
      const diagram = {} as Diagram;
      const payload = { diagram, sketch };
      
      const action = new diagramsActions.UpdateSketchObject(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: diagramsActions.UPDATE_SKETCH_OBJECT,
      });
    });
  });

  describe('Update Go JSON', () => {
    it('should create an action', () => {
      const diagram: Diagram = {} as any;
      const goConnectors = '';
      const goLocations = '';
      const goNodes = '';
      const payload = { diagram, goLocations, goNodes, goConnectors };
     
      const action = new diagramsActions.UpdateGoJson(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: diagramsActions.UPDATE_GO_JSON,
      });
    });
  });

  describe('Finished Network Request For Diagram', () => {
    it('should create an action', () => {
      const payload = 'id';
     
      const action = new diagramsActions.FinishedNetworkRequestForDiagram(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: diagramsActions.FINISHED_NETWORK_REQUEST_FOR_DIAGRAM,
      });
    });
  });

  describe('Diagram Failure', () => {
    it('should create an action', () => {
      const payload = { error: new Error('error message'), id: 'diagram id' };
     
      const action = new diagramsActions.DiagramFailure(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: diagramsActions.DIAGRAM_FAILURE,
      });
    });
  });

  describe('Remove Diagram From Local Memory', () => {
    it('should create an action', () => {
      const payload = '12345';
      const action = new diagramsActions.RemoveDiagramFromLocalMemory(payload);
      expect({ ...action }).toEqual({
        payload,
        type: diagramsActions.REMOVE_DIAGRAM_FROM_LOCAL_MEMORY,
      });
    });
  });

  describe('Remove Preview Diagram From Local Memory', () => {
    it('should create an action', () => {
      const payload = '12345';
      
      const action = new diagramsActions.RemovePreviewDiagramFromLocalMemory(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: diagramsActions.REMOVE_PREVIEW_DIAGRAM_FROM_LOCAL_MEMORY,
      });
    });
  });
});
