import { blankPages } from 'core/models';
import * as fromActions from '../../actions/process/processesList.actions';
import * as fromProcessesList from './processesList.reducer';

describe('Process List Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromProcessesList;
      const action = {} as any;

      const state = fromProcessesList.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe(`${fromActions.LOAD_PROCESSES_LIST} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromProcessesList;
      const action = new fromActions.LoadProcessesList();

      const state = fromProcessesList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.LOAD_SPECIFIC_PAGE_FOR_PROCESSES_LIST} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromProcessesList;
      const action = new fromActions.LoadSpecificPageForProcessesList('https://example.com/');

      const state = fromProcessesList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.PROCESSES_LIST_FAILURE} action`, () => {
    it('should have genericNetworkActive be false', () => {
      const { initialState } = fromProcessesList;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.ProcessesListFailure({} as any);

      const state = fromProcessesList.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
    });
  });

  describe(`${fromActions.LOAD_PROCESSES_LIST_SUCCESS} action`, () => {
    it('should have genericNetworkActive be false', () => {
      const { initialState } = fromProcessesList;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.LoadProcessesListSuccess({
        pagination: blankPages,
        results: [{ id: 'process1' } as any, { id: 'process2' } as any],
      });

      const state = fromProcessesList.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
      expect(state.ids).toEqual(['process1', 'process2']);
    });
  });

  describe('getPagination', () => {
    it('returns the pagination', () => {
      const { initialState } = fromProcessesList;

      expect(fromProcessesList.getPagination(initialState)).toEqual({
        number: 0,
        size: 0,
        totalElements: 0,
        totalPages: 0,
      });
    });
  });
});
