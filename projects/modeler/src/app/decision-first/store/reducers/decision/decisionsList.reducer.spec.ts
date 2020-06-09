import { blankPages } from 'core/models';
import { Decision } from '../../../models/decision.model';
import * as fromActions from '../../actions/decision/decisionsList.actions';
import * as fromDecisionsList from './decisionsList.reducer';

describe('Decisions List Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromDecisionsList;
      const action = {} as any;

      const state = fromDecisionsList.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe(`${fromActions.LOAD_DECISIONS_LIST} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromDecisionsList;
      const action = new fromActions.LoadDecisionsList();

      const state = fromDecisionsList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.LOAD_SPECIFIC_PAGE_FOR_DECISIONS_LIST} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromDecisionsList;
      const action = new fromActions.LoadSpecificPageForDecisionsList('https://example.com');

      const state = fromDecisionsList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.DECISIONS_LIST_FAILURE} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromDecisionsList;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.DecisionsListFailure({} as any);

      const state = fromDecisionsList.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
    });
  });

  describe(`${fromActions.LOAD_DECISIONS_LIST_SUCCESS} action`, () => {
    it('should have genericNetworkActive be false', () => {
      const { initialState } = fromDecisionsList;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.LoadDecisionsListSuccess({
        pagination: blankPages,
        results: [{ id: 'decision1' } as any, { id: 'decision2' } as any],
      });

      const state = fromDecisionsList.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
      expect(state.ids).toEqual(['decision1', 'decision2']);
    });
  });

  describe(`${fromActions.LOAD_SINGLE_DECISION_FOR_DECISIONS_LIST} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromDecisionsList;
      const action = new fromActions.LoadSingleDecisionForDecisionsList('some id');

      const state = fromDecisionsList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.LOAD_SINGLE_DECISION_FOR_DECISIONS_LIST_SUCCESS} action`, () => {
    it('should have genericNetworkActive be false', () => {
      const { initialState } = fromDecisionsList;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const decision = new Decision();
      decision.id = 'some id';
      const action = new fromActions.LoadSingleDecisionForDecisionsListSuccess(decision);

      const state = fromDecisionsList.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
      expect(state.ids).toEqual(['some id']);
      expect(state.entities['some id']).toEqual(decision);
    });
  });

  describe(`${fromActions.REMOVE_SINGLE_DECISION_FROM_DECISIONS_LIST} action`, () => {
    it('should have no longer have the decision', () => {
      const { initialState } = fromDecisionsList;
      const setupAction = new fromActions.LoadDecisionsListSuccess({
        pagination: blankPages,
        results: [{ id: 'decision1' } as any, { id: 'decision2' } as any],
      });
      const stateWithDecisions = fromDecisionsList.reducer(initialState, setupAction);

      const action = new fromActions.RemoveSingleDecisionFromDecisionsList('decision1');
      const state = fromDecisionsList.reducer(stateWithDecisions, action);

      expect(state.ids).toEqual(['decision2']);
      expect(state.entities['decision1']).toBeUndefined();
    });
  });

  describe(`${fromActions.UPDATE_SEARCH_FOR_DECISIONS_LIST}`, () => {
    it('should make the network active and update the search terms', () => {
      const { initialState } = fromDecisionsList;
      const action = new fromActions.UpdateSearchForDecisionsList('some string');

      const state = fromDecisionsList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
      expect(state.searchTerm).toEqual('some string');
    });
  });

  describe('getSearchTerm', () => {
    it('returns the search term', () => {
      const state = {
        ...fromDecisionsList.initialState,
        searchTerm: 'a string',
      };

      expect(fromDecisionsList.getSearchTerm(state)).toEqual('a string');
    });
  });

  describe('getPagination', () => {
    it('returns the pagination', () => {
      const { initialState } = fromDecisionsList;

      expect(fromDecisionsList.getPagination(initialState)).toEqual({
        number: 0,
        size: 0,
        totalElements: 0,
        totalPages: 0,
      });
    });
  });
});
