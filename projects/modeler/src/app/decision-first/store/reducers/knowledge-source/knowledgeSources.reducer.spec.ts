import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import { Organization } from '../../../models/organization.model';
import * as fromActions from '../../actions';
import * as fromKnowledgeSources from './knowledgeSources.reducer';

describe('KnowledgeSources Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromKnowledgeSources;
      const action = {} as any;

      const state = fromKnowledgeSources.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe(`${fromActions.ADD_KNOWLEDGE_SOURCE} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromKnowledgeSources;
      const action = new fromActions.AddKnowledgeSource({ id: 'abc' } as any);

      const state = fromKnowledgeSources.reducer(initialState, action);

      expect(state.genericNetworkActive).toEqual(true);
    });
  });

  describe(`${fromActions.DELETE_KNOWLEDGE_SOURCE} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromKnowledgeSources;
      const action = new fromActions.DeleteKnowledgeSource({ id: 'abc' } as any);

      const state = fromKnowledgeSources.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.ADD_RELATED_OBJECT_TO_KNOWLEDGE_SOURCE} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromKnowledgeSources;
      const action = new fromActions.AddRelatedObjectToKnowledgeSource({
        sourceObject: {id: 'sourceObjectId'} as KnowledgeSource,
        relatedObject: {id: 'relatedObjectId'} as Organization,
        relationPath: ObjectRelationsNames.Organizations,
      });

      const state = fromKnowledgeSources.reducer(initialState, action);

      expect(state.networkActive).toEqual({ sourceObjectId: true });
    });
  });

  describe(`${fromActions.UPDATE_KNOWLEDGE_SOURCE_RELATED_OBJECT} action`, () => {
    it('should update organization', () => {
      const { initialState } = fromKnowledgeSources;
      const loadedState = {
        ...initialState,
        entities: {
          object1: {
            id: 'object1',
            organizations: [{ id: 'a', name: 'old name' }],
          },
          object2: {
            id: 'object2',
            organizations: [{ id: 'b', name: 'do not change' }],
          },
        },
      };
      const newOrganization = { id: 'a', name: 'new name' } as Organization;
      const action = new fromActions.UpdateKnowledgeSourceRelatedObject({object: newOrganization, paths: [ObjectRelationsNames.Organizations]});

      const state = fromKnowledgeSources.reducer(loadedState as any, action);

      expect(state.entities.object1.organizations[0].name).toEqual('new name');
      expect(state.entities.object2.organizations[0].name).toEqual('do not change');
    });
  });

  describe(`${fromActions.REMOVE_RELATED_OBJECT_FROM_KNOWLEDGE_SOURCE} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromKnowledgeSources;
      const action = new fromActions.RemoveRelatedObjectFromKnowledgeSource({
        sourceObject: {id: 'sourceObjectId'} as KnowledgeSource,
        relatedObject: {id: 'relatedObjectId'} as Organization,
        relationPath: ObjectRelationsNames.Organizations,
      });

      const state = fromKnowledgeSources.reducer(initialState, action);

      expect(state.networkActive).toEqual({ sourceObjectId: true });
    });
  });

  describe(`${fromActions.UPDATE_OBJECT_TAGS} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromKnowledgeSources;
      const action = new fromActions.UpdateObjectTags({
        id: 'objectId',
        missingTagNames: [],
        extraTagIds: [],
        type: ObjectClassNames.KnowledgeSource
      });

      const state = fromKnowledgeSources.reducer(initialState, action);

      expect(state.networkActive).toEqual({ objectId: true });
    });
  });

  describe(`${fromActions.LOAD_KNOWLEGE_SOURCE} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromKnowledgeSources;
      const action = new fromActions.LoadKnowledgeSource('abc');

      const state = fromKnowledgeSources.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.LOAD_KNOWLEGE_SOURCE_SUCCESS} action`, () => {
    it('should have networkActive be false', () => {
      const { initialState } = fromKnowledgeSources;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.LoadKnowledgeSourceSuccess({ id: 'abc' } as any);

      const state = fromKnowledgeSources.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
      expect(state.entities).toEqual({ abc: { id: 'abc' } } as any);
    });
  });

  describe(`${fromActions.UPDATE_KNOWLEDGE_SOURCE} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromKnowledgeSources;
      const action = new fromActions.UpdateKnowledgeSource({
        knowledgeSource: { id: 'abc' }
      });

      const state = fromKnowledgeSources.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.FINISHED_NETWORK_REQUEST_FOR_KNOWLEDGE_SOURCE} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromKnowledgeSources;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.FinishedNetworkRequestForKnowledgeSource('abc');

      const state = fromKnowledgeSources.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
    });
  });

  describe(`${fromActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_KNOWLEGE_SOURCE} action`, () => {
    it('should have genericNetworkLoading be false', () => {
      const { initialState } = fromKnowledgeSources;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.FinishedGenericNetworkRequestForKnowledgeSource();

      const state = fromKnowledgeSources.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toEqual(false);
    });
  });

  describe(`${fromActions.REMOVE_KNOWLEDGE_SOURCE_FROM_LOCAL_MEMORY} action`, () => {
    it('should have genericNetworkLoading be false', () => {
      const { initialState } = fromKnowledgeSources;
      const stateWithEntityLoaded = { ...initialState, entities: { abc: { id: 'abc' } as any } };
      const action = new fromActions.RemoveKnowledgeSourceFromLocalMemory('abc');

      const state = fromKnowledgeSources.reducer(stateWithEntityLoaded, action);

      expect(state.entities).toEqual({});
    });
  });

  describe(`${fromActions.KNOWLEDGE_SOURCE_FAILURE} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromKnowledgeSources;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.KnowledgeSourceFailure({ error: new Error('some message'), id: 'abc' });

      const state = fromKnowledgeSources.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
    });
  });
});
