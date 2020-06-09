import { Decision } from '../../../models/decision.model';
import { Event } from '../../../models/events.model';
import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import * as fromActions from '../../actions';
import * as fromEvents from './events.reducer';

describe('Events Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromEvents;
      const action = {} as any;

      const state = fromEvents.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe(`${fromActions.LOAD_EVENT} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromEvents;
      const action = new fromActions.LoadEvent('abc');

      const state = fromEvents.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.LOAD_EVENT_SUCCESS} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromEvents;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.LoadEventSuccess({ id: 'abc' } as any);

      const state = fromEvents.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
      expect(state.entities).toEqual({ abc: { id: 'abc' } } as any);
    });
  });

  describe(`${fromActions.ADD_EVENT} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromEvents;
      const action = new fromActions.AddEvent({} as any);

      const state = fromEvents.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.UPDATE_EVENT} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromEvents;
      const action = new fromActions.UpdateEvent({
        event: { id: 'abc' }
      });

      const state = fromEvents.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.DELETE_EVENT} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromEvents;
      const action = new fromActions.DeleteEvent({ id: 'abc' } as any);

      const state = fromEvents.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.ADD_RELATED_OBJECT_TO_EVENT} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromEvents;
      const action = new fromActions.AddRelatedObjectToEvent({
        sourceObject: {id: 'sourceObjectId'} as Event,
        relatedObject: {id: 'relatedObjectId'} as Decision,
        relationPath: ObjectRelationsNames.Decisions,
      });

      const state = fromEvents.reducer(initialState, action);

      expect(state.networkActive).toEqual({ sourceObjectId: true });
    });
  });

  describe(`${fromActions.UPDATE_EVENT_RELATED_OBJECT} action`, () => {
    it('should update decision', () => {
      const { initialState } = fromEvents;
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
      const action = new fromActions.UpdateEventRelatedObject({object: newDecision, paths: [ObjectRelationsNames.Decisions]});

      const state = fromEvents.reducer(loadedState as any, action);

      expect(state.entities.object1.decisions[0].name).toEqual('new name');
      expect(state.entities.object2.decisions[0].name).toEqual('do not change');
    });
  });

  describe(`${fromActions.REMOVE_RELATED_OBJECT_FROM_EVENT} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromEvents;
      const action = new fromActions.RemoveRelatedObjectFromEvent({
        sourceObject: {id: 'sourceObjectId'} as Event,
        relatedObject: {id: 'relatedObjectId'} as Decision,
        relationPath: ObjectRelationsNames.Processes,
      });

      const state = fromEvents.reducer(initialState, action);

      expect(state.networkActive).toEqual({ sourceObjectId: true });
    });
  });

  describe(`${fromActions.UPDATE_OBJECT_TAGS} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromEvents;
      const action = new fromActions.UpdateObjectTags({
        id: 'objectId',
        missingTagNames: [],
        extraTagIds: [],
        type: ObjectClassNames.Event
      });

      const state = fromEvents.reducer(initialState, action);

      expect(state.networkActive).toEqual({ objectId: true });
    });
  });

  describe(`${fromActions.FINISHED_NETWORK_REQUEST_FOR_EVENT} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromEvents;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.FinishedNetworkRequestForEvent('abc');

      const state = fromEvents.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
    });
  });

  describe(`${fromActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_EVENT} action`, () => {
    it('should have genericNetworkLoading be false', () => {
      const { initialState } = fromEvents;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.FinishedGenericNetworkRequestForEvent();

      const state = fromEvents.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toEqual(false);
    });
  });

  describe(`${fromActions.EVENT_FAILURE} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromEvents;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.EventFailure({ id: 'abc', error: new Error('some message') });

      const state = fromEvents.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
    });
  });

  describe(`${fromActions.REMOVE_EVENT_FROM_LOCAL_MEMORY} action`, () => {
    it('should have genericNetworkLoading be false', () => {
      const { initialState } = fromEvents;
      const stateWithEntityLoaded = { ...initialState, entities: { abc: { id: 'abc' } as any } };
      const action = new fromActions.RemoveEventFromLocalMemory('abc');

      const state = fromEvents.reducer(stateWithEntityLoaded, action);

      expect(state.entities).toEqual({});
    });
  });
});
