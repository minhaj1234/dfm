import { Answer, Decision } from '../../../models/decision.model';
import * as decisionTable from '../../../models/decisionImplementationTable.model';
import { Diagram } from '../../../models/diagram.model';
import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import { Process } from '../../../models/process.model';
import * as fromActions from '../../actions';
import * as fromDecisions from './decisions.reducer';

describe('Decisions Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromDecisions;
      const action = {} as any;

      const state = fromDecisions.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe(`${fromActions.ADD_DECISION} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromDecisions;
      const action = new fromActions.AddDecision({} as any);

      const state = fromDecisions.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.DELETE_DECISION} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromDecisions;
      const action = new fromActions.DeleteDecision({ id: 'abc' } as any);

      const state = fromDecisions.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.ADD_RELATED_OBJECT_TO_DECISION} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromDecisions;
      const action = new fromActions.AddRelatedObjectToDecision({
        sourceObject: {id: 'sourceObjectId'} as Decision,
        relatedObject:  {id: 'sourceObjectId'} as Process,
        relationPath: ObjectRelationsNames.Processes,
      });

      const state = fromDecisions.reducer(initialState, action);

      expect(state.networkActive).toEqual({ sourceObjectId: true });
    });
  });

  describe(`${fromActions.REMOVE_RELATED_OBJECT_FROM_DECISION} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromDecisions;
      const action = new fromActions.RemoveRelatedObjectFromDecision({
        sourceObject: {id: 'sourceObjectId'} as Decision,
        relatedObject:  {id: 'sourceObjectId'} as Process,
        relationPath: ObjectRelationsNames.Processes,
      });

      const state = fromDecisions.reducer(initialState, action);

      expect(state.networkActive).toEqual({ sourceObjectId: true });
    });
  });

  describe(`${fromActions.UPDATE_OBJECT_TAGS} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromDecisions;
      const action = new fromActions.UpdateObjectTags({
        id: 'objectId',
        missingTagNames: [],
        extraTagIds: [],
        type: ObjectClassNames.Decision
      });

      const state = fromDecisions.reducer(initialState, action);

      expect(state.networkActive).toEqual({ objectId: true });
    });
  });

  describe(`${fromActions.ADD_IMPLEMENTATION_TABLE_ENTITY} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromDecisions;
      const action = new fromActions.AddImplementationTableEntity({
        sourceObject: {id: 'sourceObjectId'} as Decision,
        requestBody: new decisionTable.Row(),
        relationPath: ObjectRelationsNames.Processes,
      });

      const state = fromDecisions.reducer(initialState, action);

      expect(state.networkActive).toEqual({ sourceObjectId: true });
    });
  });

  describe(`${fromActions.ADD_IMPLEMENTATION_TABLE_ENTITY} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromDecisions;
      const action = new fromActions.UpdateImplementationTableEntity({
        sourceObject: {id: 'sourceObjectId'} as Decision,
        relatedObject: new decisionTable.Row(),
        relationPath: ObjectRelationsNames.Processes,
      });

      const state = fromDecisions.reducer(initialState, action);

      expect(state.networkActive).toEqual({ sourceObjectId: true });
    });
  });

  describe(`${fromActions.ADD_IMPLEMENTATION_TABLE_ENTITY} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromDecisions;
      const action = new fromActions.RemoveImplementationTableEntity({
        sourceObject: {id: 'sourceObjectId'} as Decision,
        relatedObjectId: 'relatedObjectId',
        relationPath: ObjectRelationsNames.Processes,
      });

      const state = fromDecisions.reducer(initialState, action);

      expect(state.networkActive).toEqual({ sourceObjectId: true });
    });
  });

  describe(`${fromActions.UPDATE_ANSWER} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromDecisions;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.UpdateAnswer({
        decision: {id: 'decisionId'} as Decision,
        answer: {} as Answer
      });

      const state = fromDecisions.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({ decisionId: true });
    });
  });

  describe(`${fromActions.LOAD_DECISION} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromDecisions;
      const action = new fromActions.LoadDecision('abc');

      const state = fromDecisions.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.LOAD_DECISION_SUCCESS} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromDecisions;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.LoadDecisionSuccess({ id: 'abc' } as any);

      const state = fromDecisions.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
      expect(state.entities).toEqual({ abc: { id: 'abc' } } as any);
    });
  });

  describe(`${fromActions.UPDATE_DECISION} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromDecisions;
      const action = new fromActions.UpdateDecision({
        decision: { id: 'abc' }
      });

      const state = fromDecisions.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.FINISHED_NETWORK_REQUEST_FOR_DECISION} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromDecisions;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.FinishedNetworkRequestForDecision('abc');

      const state = fromDecisions.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
    });
  });

  describe(`${fromActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_DECISION} action`, () => {
    it('should have genericNetworkLoading be false', () => {
      const { initialState } = fromDecisions;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.FinishedGenericNetworkRequestForDecision();

      const state = fromDecisions.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toEqual(false);
    });
  });

  describe(`${fromActions.REMOVE_DECISION_FROM_LOCAL_MEMORY} action`, () => {
    it('should have genericNetworkLoading be false', () => {
      const { initialState } = fromDecisions;
      const stateWithEntityLoaded = { ...initialState, entities: { abc: { id: 'abc' } as any } };
      const action = new fromActions.RemoveDecisionFromLocalMemory('abc');

      const state = fromDecisions.reducer(stateWithEntityLoaded, action);

      expect(state.entities).toEqual({});
    });
  });

  describe(`${fromActions.UPDATE_DECISION_RELATED_OBJECT} action`, () => {
    it('should update decision', () => {
      const currentState = getCurrentState();
      const newDiagram = { id: 'diagram1', name: 'new name' } as Diagram;
      const action = new fromActions.UpdateDecisionRelatedObject({object: newDiagram, paths: [ObjectRelationsNames.Diagrams]});

      const state = fromDecisions.reducer(currentState as any, action);

      expect(state.entities.abc.diagrams[0].name).toEqual('new name');
      expect(state.entities.def.diagrams[0].name).toEqual('do not change');
    });
  });

  describe(`${fromActions.DECISION_FAILURE} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromDecisions;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.DecisionFailure({ error: new Error('some message'), id: 'abc' });

      const state = fromDecisions.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
    });
  });

  function getCurrentState() {
    const { initialState } = fromDecisions;

    return {
      ...initialState,
      entities: {
        abc: {
          id: 'abc',
          diagrams: [{ id: 'diagram1', name: 'old name' }]
        },
        def: {
          id: 'def',
          diagrams: [{ id: 'diagram2', name: 'do not change' }]
        },
      },
    };
  }
});
