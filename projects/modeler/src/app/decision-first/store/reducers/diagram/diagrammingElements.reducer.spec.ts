import { blankPages } from 'core/models';
import * as fromActions from '../../actions/diagram/diagrammingElements.actions';
import * as fromDiagrammingElements from './diagrammingElements.reducer';

describe('Decisions List Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromDiagrammingElements;
      const action = {} as any;

      const state = fromDiagrammingElements.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe(`${fromActions.UPDATE_SEARCH_FOR_DIAGRAMMING_ELEMENTS} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromDiagrammingElements;
      const action = new fromActions.UpdateSearchForDiagrammingElements({ searchTerm: '' });

      const state = fromDiagrammingElements.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.LOAD_SPECIFIC_PAGE_FOR_DIAGRAMMING_ELEMENTS_LIST} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromDiagrammingElements;
      const action = new fromActions.LoadSpecificPageForDiagrammingElementsList('https://example.com/');

      const state = fromDiagrammingElements.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.LOAD_DIAGRAMMING_ELEMENTS_LIST_FAIL} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromDiagrammingElements;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.LoadDiagrammingElementsListFail({} as any);

      const state = fromDiagrammingElements.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
    });
  });

  describe(`${fromActions.LOAD_DIAGRAMMING_ELEMENTS_LIST_SUCCESS} action`, () => {
    it('should have networkLoading be false and have the ids', () => {
      const { initialState } = fromDiagrammingElements;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.LoadDiagrammingElementsListSuccess({
        pagination: blankPages,
        results: [{ id: 'decision1' } as any, { id: 'decision2' } as any],
      });

      const state = fromDiagrammingElements.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
      expect(state.ids).toEqual(['decision1', 'decision2']);
    });
  });

  describe(`${fromActions.UPDATE_SINGLE_DIAGRAMMING_ELEMENT_IF_NEEDED} action`, () => {
    it('it updates the list if the element is in there', () => {
      const { initialState } = fromDiagrammingElements;
      const setupAction = new fromActions.LoadDiagrammingElementsListSuccess({
        pagination: blankPages,
        results: [{ id: 'decision1', name: 'd1' } as any, { id: 'decision2', name: 'd2' } as any],
      });
      const setupState = fromDiagrammingElements.reducer(initialState, setupAction);

      const action = new fromActions.UpdateSingleDiagrammingElementIfNeeded({
        id: 'decision1',
        name: 'new name',
      } as any);

      const state = fromDiagrammingElements.reducer(setupState, action);

      expect(state.entities.decision1.name).toEqual('new name');
    });
  });

  describe(`${fromActions.REMOVE_SINGLE_DIAGRAMMING_ELEMENT_IF_NEEDED} action`, () => {
    it('should have no longer have the decision', () => {
      const { initialState } = fromDiagrammingElements;
      const setupAction = new fromActions.LoadDiagrammingElementsListSuccess({
        pagination: blankPages,
        results: [{ id: 'decision1' } as any, { id: 'decision2' } as any],
      });
      const stateWithDecisions = fromDiagrammingElements.reducer(initialState, setupAction);

      const action = new fromActions.RemoveSingleElementFromDiagrammingElementsList('decision1');
      const state = fromDiagrammingElements.reducer(stateWithDecisions, action);

      expect(state.ids).toEqual(['decision2']);
      expect(state.entities['decision1']).toBeUndefined();
    });
  });

  describe('getSearchTerm', () => {
    it('returns the search term', () => {
      const state = {
        ...fromDiagrammingElements.initialState,
        searchTerm: 'a string',
      };

      expect(fromDiagrammingElements.getSearchTerm(state)).toEqual('a string');
    });
  });

  describe('getPagination', () => {
    it('returns the search term', () => {
      const { initialState } = fromDiagrammingElements;

      expect(fromDiagrammingElements.getPagination(initialState)).toEqual({
        number: 0,
        size: 0,
        totalElements: 0,
        totalPages: 0,
      });
    });
  });
});
