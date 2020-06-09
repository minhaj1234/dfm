import { Decision } from '../../../models/decision.model';
import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import { Process } from '../../../models/process.model';
import * as fromActions from '../../actions';
import * as fromProcesses from './processes.reducer';

describe('Process Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromProcesses;
      const action = {} as any;

      const state = fromProcesses.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe(`${fromActions.LOAD_PROCESS} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromProcesses;
      const action = new fromActions.LoadProcess('abc');

      const state = fromProcesses.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.LOAD_PROCESS_SUCCESS} action`, () => {
    it('should load processes', () => {
      const { initialState } = fromProcesses;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.LoadProcessSuccess({ id: 'abc' } as any);

      const state = fromProcesses.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
      expect(state.entities).toEqual({ abc: { id: 'abc' } } as any);
    });
  });

  describe(`${fromActions.ADD_PROCESS} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromProcesses;
      const action = new fromActions.AddProcess({} as any);

      const state = fromProcesses.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.UPDATE_PROCESS} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromProcesses;
      const action = new fromActions.UpdateProcess({
        process: { id: 'abc' }
      });

      const state = fromProcesses.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.DELETE_PROCESS} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromProcesses;
      const action = new fromActions.DeleteProcess({ id: 'abc' } as any);

      const state = fromProcesses.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.ADD_RELATED_OBJECT_TO_PROCESS} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromProcesses;
      const action = new fromActions.AddRelatedObjectToProcess({
        sourceObject: {id: 'sourceObjectId'} as Process,
        relatedObject: {id: 'relatedObjectId'} as Decision,
        relationPath: ObjectRelationsNames.Decisions,
      });

      const state = fromProcesses.reducer(initialState, action);

      expect(state.networkActive).toEqual({ sourceObjectId: true });
    });
  });

  describe(`${fromActions.UPDATE_PROCESS_RELATED_OBJECT} action`, () => {
    it('should update decision', () => {
      const { initialState } = fromProcesses;
      const loadedState = {
        ...initialState,
        entities: {
          object1: {
            id: 'object1',
            decisions: [{ id: 'a', name: 'old name' }],
          },
          object2: {
            id: 'object2',
            decisions: [{ id: 'b', name: 'do not change' }],
          },
        },
      };
      const newDecision = { id: 'a', name: 'new name' } as Decision;
      const action = new fromActions.UpdateProcessRelatedObject({object: newDecision, paths: [ObjectRelationsNames.Decisions]});

      const state = fromProcesses.reducer(loadedState as any, action);

      expect(state.entities.object1.decisions[0].name).toEqual('new name');
      expect(state.entities.object2.decisions[0].name).toEqual('do not change');
    });
  });

  describe(`${fromActions.REMOVE_RELATED_OBJECT_FROM_PROCESS} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromProcesses;
      const action = new fromActions.RemoveRelatedObjectFromProcess({
        sourceObject: {id: 'sourceObjectId'} as Process,
        relatedObject: {id: 'relatedObjectId'} as Decision,
        relationPath: ObjectRelationsNames.Decisions,
      });

      const state = fromProcesses.reducer(initialState, action);

      expect(state.networkActive).toEqual({ sourceObjectId: true });
    });
  });

  describe(`${fromActions.UPDATE_OBJECT_TAGS} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromProcesses;
      const action = new fromActions.UpdateObjectTags({
        id: 'objectId',
        missingTagNames: [],
        extraTagIds: [],
        type: ObjectClassNames.Process
      });

      const state = fromProcesses.reducer(initialState, action);

      expect(state.networkActive).toEqual({ objectId: true });
    });
  });

  describe(`${fromActions.FINISHED_NETWORK_REQUEST_FOR_PROCESS} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromProcesses;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.FinishedNetworkRequestForProcess('abc');

      const state = fromProcesses.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
    });
  });

  describe(`${fromActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_PROCESS} action`, () => {
    it('should have genericNetworkLoading be false', () => {
      const { initialState } = fromProcesses;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.FinishedGenericNetworkRequestForProcess();

      const state = fromProcesses.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toEqual(false);
    });
  });

  describe(`${fromActions.PROCESS_FAILURE} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromProcesses;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.ProcessFailure({ id: 'abc', error: new Error('some message') });

      const state = fromProcesses.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
    });
  });

  describe(`${fromActions.REMOVE_PROCESS_FROM_LOCAL_MEMORY} action`, () => {
    it('should remove process', () => {
      const { initialState } = fromProcesses;
      const stateWithEntityLoaded = { ...initialState, entities: { abc: { id: 'abc' } as any } };
      const action = new fromActions.RemoveProcessFromLocalMemory('abc');

      const state = fromProcesses.reducer(stateWithEntityLoaded, action);

      expect(state.entities).toEqual({});
    });
  });
});
