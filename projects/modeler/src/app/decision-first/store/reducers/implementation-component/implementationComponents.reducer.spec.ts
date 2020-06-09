import { Decision } from '../../../models/decision.model';
import { ImplementationComponent } from '../../../models/implementationComponent.model';
import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import * as fromActions from '../../actions';
import * as fromImplementationComponents from './implementationComponents.reducer';

describe('ImplementationComponent Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromImplementationComponents;
      const action = {} as any;

      const state = fromImplementationComponents.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe(`${fromActions.LOAD_IMPLEMENTATION_COMPONENT} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromImplementationComponents;
      const action = new fromActions.LoadImplementationComponent('abc');

      const state = fromImplementationComponents.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.LOAD_IMPLEMENTATION_COMPONENT_SUCCESS} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromImplementationComponents;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.LoadImplementationComponentSuccess({ id: 'abc' } as any);

      const state = fromImplementationComponents.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
      expect(state.entities).toEqual({ abc: { id: 'abc' } } as any);
    });
  });

  describe(`${fromActions.ADD_IMPLEMENTATION_COMPONENT} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromImplementationComponents;
      const action = new fromActions.AddImplementationComponent({} as any);

      const state = fromImplementationComponents.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.UPDATE_IMPLEMENTATION_COMPONENT} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromImplementationComponents;
      const action = new fromActions.UpdateImplementationComponent({
        implementationComponent: { id: 'abc' }
      });

      const state = fromImplementationComponents.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.DELETE_IMPLEMENTATION_COMPONENT} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromImplementationComponents;
      const action = new fromActions.DeleteImplementationComponent({ id: 'abc' } as any);

      const state = fromImplementationComponents.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.ADD_RELATED_OBJECT_TO_IMPLEMENTATION_COMPONENT} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromImplementationComponents;
      const action = new fromActions.AddRelatedObjectToImplementationComponent({
        sourceObject: {id: 'sourceObjectId'} as ImplementationComponent,
        relatedObject: {id: 'relatedObjectId'} as Decision,
        relationPath: ObjectRelationsNames.Decisions,
      });

      const state = fromImplementationComponents.reducer(initialState, action);

      expect(state.networkActive).toEqual({ sourceObjectId: true });
    });
  });

  describe(`${fromActions.UPDATE_IMPLEMENTATION_COMPONENT_RELATED_OBJECT} action`, () => {
    it('should update decision', () => {
      const { initialState } = fromImplementationComponents;
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
      const action = new fromActions.UpdateImplementationComponentRelatedObject({object: newDecision, paths: [ObjectRelationsNames.Decisions]});

      const state = fromImplementationComponents.reducer(loadedState as any, action);

      expect(state.entities.object1.decisions[0].name).toEqual('new name');
      expect(state.entities.object2.decisions[0].name).toEqual('do not change');
    });
  });

  describe(`${fromActions.REMOVE_RELATED_OBJECT_FROM_IMPLEMENTATION_COMPONENT} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromImplementationComponents;
      const action = new fromActions.RemoveRelatedObjectFromImplementationComponent({
        sourceObject: {id: 'sourceObjectId'} as ImplementationComponent,
        relatedObject: {id: 'relatedObjectId'} as Decision,
        relationPath: ObjectRelationsNames.Decisions,
      });

      const state = fromImplementationComponents.reducer(initialState, action);

      expect(state.networkActive).toEqual({ sourceObjectId: true });
    });
  });

  describe(`${fromActions.UPDATE_OBJECT_TAGS} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromImplementationComponents;
      const action = new fromActions.UpdateObjectTags({
        id: 'objectId',
        missingTagNames: [],
        extraTagIds: [],
        type: ObjectClassNames.ImplementationComponent
      });

      const state = fromImplementationComponents.reducer(initialState, action);

      expect(state.networkActive).toEqual({ objectId: true });
    });
  });

  describe(`${fromActions.FINISHED_NETWORK_REQUEST_FOR_IMPLEMENTATION_COMPONENT} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromImplementationComponents;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.FinishedNetworkRequestForImplementationComponent('abc');

      const state = fromImplementationComponents.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
    });
  });

  describe(`${fromActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_IMPLEMENTATION_COMPONENT} action`, () => {
    it('should have genericNetworkLoading be false', () => {
      const { initialState } = fromImplementationComponents;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.FinishedGenericNetworkRequestForImplementationComponent();

      const state = fromImplementationComponents.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toEqual(false);
    });
  });

  describe(`${fromActions.IMPLEMENTATION_COMPONENT_FAILURE} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromImplementationComponents;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.ImplementationComponentFailure({
        error: new Error('some message'),
        id: 'abc',
      });

      const state = fromImplementationComponents.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
    });
  });

  describe(`${fromActions.REMOVE_IMPLEMENTATION_COMPONENT_FROM_LOCAL_MEMORY} action`, () => {
    it('should have genericNetworkLoading be false', () => {
      const { initialState } = fromImplementationComponents;
      const stateWithEntityLoaded = { ...initialState, entities: { abc: { id: 'abc' } as any } };
      const action = new fromActions.RemoveImplementationComponentFromLocalMemory('abc');

      const state = fromImplementationComponents.reducer(stateWithEntityLoaded, action);

      expect(state.entities).toEqual({});
    });
  });
});
