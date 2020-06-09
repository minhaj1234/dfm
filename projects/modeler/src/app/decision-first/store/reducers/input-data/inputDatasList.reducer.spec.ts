import { blankPages } from 'core/models';
import * as fromActions from '../../actions/input-data/inputDatasList.actions';
import * as fromInputDatasList from './inputDatasList.reducer';

describe('InputData List Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromInputDatasList;
      const action = {} as any;

      const state = fromInputDatasList.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe(`${fromActions.LOAD_INPUT_DATAS_LIST} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromInputDatasList;
      const action = new fromActions.LoadInputDatasList();

      const state = fromInputDatasList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.LOAD_SPECIFIC_PAGE_FOR_INPUT_DATA_LIST} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromInputDatasList;
      const action = new fromActions.LoadSpecificPageForInputDataList('https://example.com/');

      const state = fromInputDatasList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.INPUT_DATAS_LIST_FAILURE} action`, () => {
    it('should have genericNetworkActive be false', () => {
      const { initialState } = fromInputDatasList;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.InputDatasListFailure({} as any);

      const state = fromInputDatasList.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
    });
  });

  describe(`${fromActions.LOAD_INPUT_DATAS_LIST_SUCCESS} action`, () => {
    it('should have genericNetworkActive be false', () => {
      const { initialState } = fromInputDatasList;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.LoadInputDatasListSuccess({
        pagination: blankPages,
        results: [{ id: 'inputData1' } as any, { id: 'inputData2' } as any],
      });

      const state = fromInputDatasList.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
      expect(state.ids).toEqual(['inputData1', 'inputData2']);
    });
  });

  describe('getPagination', () => {
    it('returns the pagination', () => {
      const { initialState } = fromInputDatasList;

      expect(fromInputDatasList.getPagination(initialState)).toEqual({
        number: 0,
        size: 0,
        totalElements: 0,
        totalPages: 0,
      });
    });
  });
});
