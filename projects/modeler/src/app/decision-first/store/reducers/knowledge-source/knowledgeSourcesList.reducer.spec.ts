import { blankPages } from 'core/models';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import * as fromActions from '../../actions/knowledge-source/knowledgeSourcesList.actions';
import * as fromKnowledgeSources from './knowledgeSourcesList.reducer';

describe('KnowledgeSources Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromKnowledgeSources;
      const action = {} as any;

      const state = fromKnowledgeSources.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe(`${fromActions.LOAD_KNOWLEDGE_SOURCES_LIST} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromKnowledgeSources;
      const action = new fromActions.LoadKnowledgeSourcesList();

      const state = fromKnowledgeSources.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.LOAD_SPECIFIC_PAGE_FOR_KNOWLEDGE_SOURCES_LIST} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromKnowledgeSources;
      const action = new fromActions.LoadSpecificPageForKnowledgeSourcesList('https://example.com/');

      const state = fromKnowledgeSources.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.KNOWLEDGE_SOURCES_LIST_FAILURE} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromKnowledgeSources;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.KnowledgeSourcesListFailure({} as any);

      const state = fromKnowledgeSources.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
    });
  });

  describe(`${fromActions.LOAD_KNOWLEDGE_SOURCES_LIST_SUCCESS} action`, () => {
    it('should have genericNetworkActive be false and ids', () => {
      const { initialState } = fromKnowledgeSources;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.LoadKnowledgeSourcesListSuccess({
        pagination: blankPages,
        results: [{ id: 'knowledgeSource1' } as any, { id: 'knowledgeSource2' } as any],
      });

      const state = fromKnowledgeSources.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
      expect(state.ids).toEqual(['knowledgeSource1', 'knowledgeSource2']);
    });
  });

  describe(`${fromActions.LOAD_SINGLE_KNOWLEDGE_SOURCE_FOR_KNOWLEDGE_SOURCES_LIST} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromKnowledgeSources;
      const action = new fromActions.LoadSingleKnowledgeSourceForKnowledgeSourcesList('some id');

      const state = fromKnowledgeSources.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.LOAD_SINGLE_KNOWLEDGE_SOURCE_FOR_KNOWLEDGE_SOURCES_LIST_SUCCESS} action`, () => {
    it('should have genericNetworkActive be true and ids', () => {
      const { initialState } = fromKnowledgeSources;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const decision = new KnowledgeSource();
      decision.id = 'some id';
      const action = new fromActions.LoadSingleKnowledgeSourceForKnowledgeSourcesListSuccess(decision);

      const state = fromKnowledgeSources.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
      expect(state.ids).toEqual(['some id']);
      expect(state.entities['some id']).toEqual(decision);
    });
  });

  describe(`${fromActions.REMOVE_SINGLE_KNOWLEDGE_SOURCE_FROM_KNOWLEDGE_SOURCES_LIST} action`, () => {
    it('should have no longer have the decision', () => {
      const { initialState } = fromKnowledgeSources;
      const setupAction = new fromActions.LoadKnowledgeSourcesListSuccess({
        pagination: blankPages,
        results: [{ id: 'knowledgeSource1' } as any, { id: 'knowledgeSource2' } as any],
      });
      const stateWithDecisions = fromKnowledgeSources.reducer(initialState, setupAction);

      const action = new fromActions.RemoveSingleKnowledgeSourceFromKnowledgeSourcesList('knowledgeSource1');
      const state = fromKnowledgeSources.reducer(stateWithDecisions, action);

      expect(state.ids).toEqual(['knowledgeSource2']);
      expect(state.entities['knowledgeSource1']).toBeUndefined();
    });
  });

  describe(`${fromActions.UPDATE_SEARCH_FOR_KNOWLEDGE_SOURCES_LIST} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromKnowledgeSources;
      const action = new fromActions.UpdateSearchForKnowledgeSourcesList('some string');

      const state = fromKnowledgeSources.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
      expect(state.searchTerm).toBe('some string');
    });
  });

  describe('getSearchTerm', () => {
    it('returns the search term', () => {
      const state = {
        ...fromKnowledgeSources.initialState,
        searchTerm: 'a string',
      };

      expect(fromKnowledgeSources.getSearchTerm(state)).toEqual('a string');
    });
  });

  describe('getPagination', () => {
    it('returns the pagination', () => {
      const { initialState } = fromKnowledgeSources;

      expect(fromKnowledgeSources.getPagination(initialState)).toEqual({
        number: 0,
        size: 0,
        totalElements: 0,
        totalPages: 0,
      });
    });
  });
});
