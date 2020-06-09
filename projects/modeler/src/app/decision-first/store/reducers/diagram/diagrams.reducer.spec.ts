import { Decision } from '../../../models/decision.model';
import { Diagram } from '../../../models/diagram.model';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import * as fromActions from '../../actions';
import * as fromDiagrams from './diagrams.reducer';

describe('Diagrams Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromDiagrams;
      const action = {} as any;

      const state = fromDiagrams.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe(`${fromActions.LOAD_DIAGRAM} action`, () => {
    it('sets the correct network active key to true', () => {
      const { initialState } = fromDiagrams;
      const action = new fromActions.LoadDiagram('diagram1');

      const state = fromDiagrams.reducer(initialState, action);

      expect(state.networkActive.diagram1).toBe(true);
    });
  });

  describe(`${fromActions.DIAGRAM_FAILURE} action`, () => {
    it('sets the correct network active key to false', () => {
      const { initialState } = fromDiagrams;
      let state = fromDiagrams.reducer(initialState, new fromActions.LoadDiagram('diagram1'));
      const action = new fromActions.DiagramFailure({ id: 'diagram1' } as any);

      state = fromDiagrams.reducer(state, action);

      expect(state.networkActive.diagram1).toBeUndefined();
    });
  });

  describe(`${fromActions.LOAD_DIAGRAM_SUCCESS} action`, () => {
    it('sets the correct network active key to false and adds the diagram', () => {
      const { initialState } = fromDiagrams;
      const diagram: Diagram = { id: 'diagram1' } as any;
      const action = new fromActions.LoadDiagramSuccess(diagram);

      const state = fromDiagrams.reducer(initialState, action);

      expect(state.entities.diagram1).toBe(diagram);
    });
  });

  describe(`${fromActions.FINISHED_NETWORK_REQUEST_FOR_DIAGRAM} action`, () => {
    it('sets the correct network active key to false', () => {
      const { initialState } = fromDiagrams;
      let state = fromDiagrams.reducer(initialState, new fromActions.LoadDiagram('diagram1'));
      const action = new fromActions.FinishedNetworkRequestForDiagram('diagram1');

      state = fromDiagrams.reducer(state, action);

      expect(state.networkActive.diagram1).toBeUndefined();
    });
  });

  describe(`${fromActions.UPDATE_DIAGRAM} action`, () => {
    it('sets the correct network active key to true', () => {
      const { initialState } = fromDiagrams;
      const diagram: Diagram = { id: 'diagram1' } as any;
      const action = new fromActions.UpdateDiagram({diagram});

      const state = fromDiagrams.reducer(initialState, action);

      expect(state.networkActive.diagram1).toBe(true);
    });
  });

  describe(`${fromActions.ADD_GRAPHABLE_OBJECT_TO_DIAGRAM} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromDiagrams;
      const action = new fromActions.AddGraphableObjectToDiagram({
        sourceObject: {id: 'sourceObjectId'} as Diagram,
        relatedObject: {id: 'relatedObjectId'} as KnowledgeSource,
        relationPath: ObjectRelationsNames.KnowledgeSources,
        isNew: false,
      });

      const state = fromDiagrams.reducer(initialState, action);

      expect(state.networkActive).toEqual({ sourceObjectId: true });
    });
  });

  describe(`${fromActions.REMOVE_GRAPHABLE_OBJECTS_FROM_DIAGRAM} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromDiagrams;
      const action = new fromActions.RemoveGraphableObjectsFromDiagram({
        diagram: {id: 'sourceObjectId'} as Diagram,
        deletedGraphables: [{
          graphable: {id: 'relatedObjectId'} as KnowledgeSource,
          relationPath: ObjectRelationsNames.KnowledgeSources,
        }]
      });

      const state = fromDiagrams.reducer(initialState, action);

      expect(state.networkActive).toEqual({ sourceObjectId: true });
    });
  });

  describe(`${fromActions.UPDATE_OBJECT_TAGS} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromDiagrams;
      const action = new fromActions.UpdateObjectTags({
        id: 'objectId',
        missingTagNames: [],
        extraTagIds: [],
        type: ObjectClassNames.Diagram
      });

      const state = fromDiagrams.reducer(initialState, action);

      expect(state.networkActive).toEqual({ objectId: true });
    });
  });

  describe(`${fromActions.REMOVE_DIAGRAM_FROM_LOCAL_MEMORY} action`, () => {
    it('removes the diagram from the entities', () => {
      const { initialState } = fromDiagrams;
      const stateWithEntities = {
        ...initialState,
        entities: {
          abc: { id: 'abc' },
        },
      };
      const action = new fromActions.RemoveDiagramFromLocalMemory('abc');

      const state = fromDiagrams.reducer(stateWithEntities as any, action);

      expect(state.entities).toEqual({});
    });
  });

  describe(`${fromActions.UPDATE_GO_JSON} action`, () => {
    it('sets the correct network active key to true', () => {
      const { initialState } = fromDiagrams;
      const diagram: Diagram = { id: 'diagram1' } as any;
      const action = new fromActions.UpdateGoJson({ diagram });

      const state = fromDiagrams.reducer(initialState, action);

      expect(state.networkActive.diagram1).toBe(true);
    });
  });

  describe(`${fromActions.UPDATE_DIAGRAM_GRAPHABLE_OBJECT} action`, () => {
    it('updates a decision in a diagram', () => {
      const { initialState } = fromDiagrams;
      const stateWithDiagramLoaded = {
        ...initialState,
        entities: {
          abc: {
            decisions: [{ id: 'ghi', name: 'old name' }],
            id: 'abc',
          },
          def: {
            decisions: [{ id: 'jkl', name: 'do not change' }],
            id: 'def',
          },
        },
      };
      const newDecision = { id: 'ghi', name: 'new name' } as Decision;
      const action = new fromActions.UpdateDiagramGraphableObject({object: newDecision, paths: [ObjectRelationsNames.Decisions]});

      const state = fromDiagrams.reducer(stateWithDiagramLoaded as any, action);

      expect(state.entities.abc.decisions[0].name).toEqual('new name');
      expect(state.entities.def.decisions.length).toEqual(1);
    });
  });
});
