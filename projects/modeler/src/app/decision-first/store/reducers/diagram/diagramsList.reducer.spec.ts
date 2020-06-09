import { blankPages } from 'core/models';
import { Diagram } from '../../../models/diagram.model';
import * as fromActions from '../../actions/diagram/diagramsList.actions';
import * as fromDiagramsList from './diagramsList.reducer';

describe('Diagrams List Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromDiagramsList;
      const action = {} as any;

      const state = fromDiagramsList.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe(`${fromActions.LOAD_DIAGRAMS_LIST} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromDiagramsList;
      const action = new fromActions.LoadDiagramsList();

      const state = fromDiagramsList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.LOAD_SPECIFIC_PAGE_FOR_DIAGRAMS_LIST} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromDiagramsList;
      const action = new fromActions.LoadSpecificPageForDiagramsList('https://example.com/');

      const state = fromDiagramsList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.DIAGRAMS_LIST_FAILURE} action`, () => {
    it('should have genericNetworkActive be false', () => {
      const { initialState } = fromDiagramsList;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.DiagramsListFailure({} as any);

      const state = fromDiagramsList.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
    });
  });

  describe(`${fromActions.LOAD_DIAGRAMS_LIST_SUCCESS} action`, () => {
    it('should set the diagrams', () => {
      const { initialState } = fromDiagramsList;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.LoadDiagramsListSuccess({
        pagination: blankPages,
        results: [{ id: 'diagram1' } as any, { id: 'diagram2' } as any],
      });

      const state = fromDiagramsList.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
      expect(state.ids).toEqual(['diagram1', 'diagram2']);
    });
  });

  describe(`${fromActions.LOAD_SINGLE_DIAGRAM_FOR_DIAGRAMS_LIST} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromDiagramsList;
      const action = new fromActions.LoadSingleDiagramForDiagramsList('some id');

      const state = fromDiagramsList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.LOAD_SINGLE_DIAGRAM_FOR_DIAGRAMS_LIST_SUCCESS} action`, () => {
    it('should have genericNetworkActive be false', () => {
      const { initialState } = fromDiagramsList;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const diagram = new Diagram();
      diagram.id = 'some id';
      const action = new fromActions.LoadSingleDiagramForDiagramsListSuccess(diagram);

      const state = fromDiagramsList.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
      expect(state.ids).toEqual(['some id']);
      expect(state.entities['some id']).toEqual(diagram);
    });
  });

  describe(`${fromActions.REMOVE_SINGLE_DIAGRAM_FROM_DIAGRAMS_LIST} action`, () => {
    it('should have no longer have the decision', () => {
      const { initialState } = fromDiagramsList;
      const setupAction = new fromActions.LoadDiagramsListSuccess({
        pagination: blankPages,
        results: [{ id: 'diagram1' } as any, { id: 'diagram2' } as any],
      });
      const stateWithDecisions = fromDiagramsList.reducer(initialState, setupAction);

      const action = new fromActions.RemoveSingleDiagramFromDiagramsList('diagram1');
      const state = fromDiagramsList.reducer(stateWithDecisions, action);

      expect(state.ids).toEqual(['diagram2']);
      expect(state.entities['diagram1']).toBeUndefined();
    });
  });

  describe(`${fromActions.UPDATE_SEARCH_FOR_DIAGRAMS_LIST}`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromDiagramsList;
      const action = new fromActions.UpdateSearchForDiagramsList('some string');

      const state = fromDiagramsList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
      expect(state.searchTerm).toBe('some string');
    });
  });

  describe('getSearchTerm', () => {
    it('returns the search term', () => {
      const state = {
        ...fromDiagramsList.initialState,
        searchTerm: 'a string',
      };

      expect(fromDiagramsList.getSearchTerm(state)).toEqual('a string');
    });
  });

  describe('getPagination', () => {
    it('should return pagination', () => {
      const { initialState } = fromDiagramsList;

      expect(fromDiagramsList.getPagination(initialState)).toEqual({
        number: 0,
        size: 0,
        totalElements: 0,
        totalPages: 0,
      });
    });
  });
});
