import { Decision } from '../../../models/decision.model';
import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import { System } from '../../../models/system.model';
import * as fromActions from '../../actions';
import * as fromSystems from './systems.reducer';

describe('Events Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromSystems;
      const action = {} as any;

      const state = fromSystems.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe(`${fromActions.LOAD_SYSTEM} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromSystems;
      const action = new fromActions.LoadSystem('abc');

      const state = fromSystems.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.LOAD_SYSTEM_SUCCESS} action`, () => {
    it('should have loaded systems', () => {
      const { initialState } = fromSystems;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.LoadSystemSuccess({ id: 'abc' } as any);

      const state = fromSystems.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
      expect(state.entities).toEqual({ abc: { id: 'abc' } } as any);
    });
  });

  describe(`${fromActions.ADD_SYSTEM} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromSystems;
      const action = new fromActions.AddSystem({} as any);

      const state = fromSystems.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.UPDATE_SYSTEM} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromSystems;
      const action = new fromActions.UpdateSystem({
        system: { id: 'abc' }
      });

      const state = fromSystems.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.DELETE_SYSTEM} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromSystems;
      const action = new fromActions.DeleteSystem({ id: 'abc' } as any);

      const state = fromSystems.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.ADD_RELATED_OBJECT_TO_SYSTEM} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromSystems;
      const action = new fromActions.AddRelatedObjectToSystem({
        sourceObject: {id: 'sourceObjectId'} as System,
        relatedObject: {id: 'relatedObjectId'} as Decision,
        relationPath: ObjectRelationsNames.Decisions,
      });

      const state = fromSystems.reducer(initialState, action);

      expect(state.networkActive).toEqual({ sourceObjectId: true });
    });
  });

  describe(`${fromActions.UPDATE_SYSTEM_RELATED_OBJECT} action`, () => {
    it('should update decision', () => {
      const { initialState } = fromSystems;
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
      const action = new fromActions.UpdateSystemRelatedObject({object: newDecision, paths: [ObjectRelationsNames.Decisions]});

      const state = fromSystems.reducer(loadedState as any, action);

      expect(state.entities.object1.decisions[0].name).toEqual('new name');
      expect(state.entities.object2.decisions[0].name).toEqual('do not change');
    });
  });

  describe(`${fromActions.REMOVE_RELATED_OBJECT_FROM_SYSTEM} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromSystems;
      const action = new fromActions.RemoveRelatedObjectFromSystem({
        sourceObject: {id: 'sourceObjectId'} as System,
        relatedObject: {id: 'relatedObjectId'} as Decision,
        relationPath: ObjectRelationsNames.Decisions,
      });

      const state = fromSystems.reducer(initialState, action);

      expect(state.networkActive).toEqual({ sourceObjectId: true });
    });
  });

  describe(`${fromActions.UPDATE_OBJECT_TAGS} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromSystems;
      const action = new fromActions.UpdateObjectTags({
        id: 'objectId',
        missingTagNames: [],
        extraTagIds: [],
        type: ObjectClassNames.System
      });

      const state = fromSystems.reducer(initialState, action);

      expect(state.networkActive).toEqual({ objectId: true });
    });
  });

  describe(`${fromActions.FINISHED_NETWORK_REQUEST_FOR_SYSTEM} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromSystems;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.FinishedNetworkRequestForSystem('abc');

      const state = fromSystems.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
    });
  });

  describe(`${fromActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_SYSTEM} action`, () => {
    it('should have genericNetworkLoading be false', () => {
      const { initialState } = fromSystems;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.FinishedGenericNetworkRequestForSystem();

      const state = fromSystems.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toEqual(false);
    });
  });

  describe(`${fromActions.SYSTEM_FAILURE} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromSystems;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.SystemFailure({ id: 'abc', error: new Error('some message') });

      const state = fromSystems.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
    });
  });

  describe(`${fromActions.REMOVE_SYSTEM_FROM_LOCAL_MEMORY} action`, () => {
    it('should remove system from local memory', () => {
      const { initialState } = fromSystems;
      const stateWithEntityLoaded = { ...initialState, entities: { abc: { id: 'abc' } as any } };
      const action = new fromActions.RemoveSystemFromLocalMemory('abc');

      const state = fromSystems.reducer(stateWithEntityLoaded, action);

      expect(state.entities).toEqual({});
    });
  });
});
