import { blankPages } from 'core/models';
import * as fromActions from '../../actions/business-objective/businessObjectivesList.actions';
import * as fromBusinessObjectiveList from './businessObjectivesList.reducer';

describe('BusinessObjective List Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromBusinessObjectiveList;
      const action = {} as any;

      const state = fromBusinessObjectiveList.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe(`${fromActions.LOAD_BUSINESS_OBJECTIVES_LIST} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromBusinessObjectiveList;
      const action = new fromActions.LoadBusinessObjectivesList();

      const state = fromBusinessObjectiveList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.LOAD_SPECIFIC_PAGE_FOR_BUSINESS_OBJECTIVES_LIST} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromBusinessObjectiveList;
      const action = new fromActions.LoadSpecificPageForBusinessObjectivesList('https://example.com/');

      const state = fromBusinessObjectiveList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.BUSINESS_OBJECTIVES_LIST_FAILURE} action`, () => {
    it('should have genericNetworkActive be false', () => {
      const { initialState } = fromBusinessObjectiveList;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.BusinessObjectivesListFailure({} as any);

      const state = fromBusinessObjectiveList.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
    });
  });

  describe(`${fromActions.LOAD_BUSINESS_OBJECTIVES_LIST_SUCCESS} action`, () => {
    it('should have genericNetworkActive be false', () => {
      const { initialState } = fromBusinessObjectiveList;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.LoadBusinessObjectivesListSuccess({
        pagination: blankPages,
        results: [{ id: 'businessObjective1' } as any, { id: 'businessObjective2' } as any],
      });

      const state = fromBusinessObjectiveList.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
      expect(state.ids).toEqual(['businessObjective1', 'businessObjective2']);
    });
  });

  describe('getPagination', () => {
    it('returns the pagination', () => {
      const { initialState } = fromBusinessObjectiveList;

      expect(fromBusinessObjectiveList.getPagination(initialState)).toEqual({
        number: 0,
        size: 0,
        totalElements: 0,
        totalPages: 0,
      });
    });
  });
});
