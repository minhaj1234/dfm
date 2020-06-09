import { blankPages } from 'core/models';
import * as fromActions from '../../actions/event/eventsList.action';
import * as fromEventList from './eventsList.reducer';

describe('Events List Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromEventList;
      const action = {} as any;

      const state = fromEventList.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe(`${fromActions.LOAD_EVENTS_LIST} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromEventList;
      const action = new fromActions.LoadEventsList();

      const state = fromEventList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.LOAD_SPECIFIC_PAGE_FOR_EVENTS_LIST} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromEventList;
      const action = new fromActions.LoadSpecificPageForEventsList('https://example.com/');

      const state = fromEventList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.EVENTS_LIST_FAILURE} action`, () => {
    it('should have genericNetworkActive be false', () => {
      const { initialState } = fromEventList;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.EventsListFailure({} as any);

      const state = fromEventList.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
    });
  });

  describe(`${fromActions.LOAD_EVENTS_LIST_SUCCESS} action`, () => {
    it('should have genericNetworkActive be false', () => {
      const { initialState } = fromEventList;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.LoadEventsListSuccess({
        pagination: blankPages,
        results: [{ id: 'event1' } as any, { id: 'event2' } as any],
      });

      const state = fromEventList.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
      expect(state.ids).toEqual(['event1', 'event2']);
    });
  });

  describe('getPagination', () => {
    it('returns the pagination', () => {
      const { initialState } = fromEventList;

      expect(fromEventList.getPagination(initialState)).toEqual({
        number: 0,
        size: 0,
        totalElements: 0,
        totalPages: 0,
      });
    });
  });
});
