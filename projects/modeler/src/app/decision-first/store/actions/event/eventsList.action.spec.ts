import { blankPages } from 'core/models';
import { Event } from '../../../models/events.model';
import * as eventListActions from './eventsList.action';

describe('Events List Actions', () => {
  describe('Load Events List', () => {
    it('should create an action', () => {
      const action = new eventListActions.LoadEventsList();
      expect({ ...action }).toEqual({
        type: eventListActions.LOAD_EVENTS_LIST,
      });
    });
  });

  describe('Load Specific Page For Events List', () => {
    it('should create an action', () => {
      const payload = 'https://test.test';
      const action = new eventListActions.LoadSpecificPageForEventsList(payload);
      expect({ ...action }).toEqual({
        payload,
        type: eventListActions.LOAD_SPECIFIC_PAGE_FOR_EVENTS_LIST,
      });
    });
  });

  describe('Load Events List Success', () => {
    it('should create an action', () => {
      const event1: Event = {} as any;
      const event2: Event = {} as any;
      const payload = { results: [event1, event2], pagination: blankPages };
      const action = new eventListActions.LoadEventsListSuccess(payload);
      expect({ ...action }).toEqual({
        payload,
        type: eventListActions.LOAD_EVENTS_LIST_SUCCESS,
      });
    });
  });

  describe('Events List Failure', () => {
    it('should create an action', () => {
      const action = new eventListActions.EventsListFailure(new Error('a message'));
      expect({ ...action }).toEqual({
        payload: new Error('a message'),
        type: eventListActions.EVENTS_LIST_FAILURE,
      });
    });
  });
});
