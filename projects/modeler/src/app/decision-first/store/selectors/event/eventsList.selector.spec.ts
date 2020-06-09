import { TestBed } from '@angular/core/testing';
import { select, Store } from '@ngrx/store';
import { blankPages } from 'core/models';
import { Event } from '../../../models/events.model';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions/event/eventsList.action';
import * as fromReducers from '../../reducers';
import * as fromSelectors from './eventsList.selector';

describe('Events List Selectors', () => {
  let store: Store<fromReducers.IDecisionFirstState>;
  const event1 = {
    id: 'event1',
    name: 'Event One',
  } as Event;
  const event2 = {
    id: 'event2',
    name: 'Event Two',
  } as Event;
  const event3 = {
    id: 'event3',
    name: 'Event Three',
  } as Event;
  const events: Event[] = [event1, event2, event3];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
      ],
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getEventsEntities', () => {
    it('should return the events in entity form', () => {
      let result;

      store.pipe(select(fromSelectors.getEventsEntities)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual({});

      store.dispatch(new fromActions.LoadEventsListSuccess({ results: events, pagination: blankPages }));

      expect(result).toEqual({
        event1: {
          id: 'event1',
          name: 'Event One',
        },
        event2: {
          id: 'event2',
          name: 'Event Two',
        },
        event3: {
          id: 'event3',
          name: 'Event Three',
        },
      });
    });
  });

  describe('getEventsList', () => {
    it('should return the events in array form', () => {
      let result;

      store.pipe(select(fromSelectors.getEventsList)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual([]);

      store.dispatch(new fromActions.LoadEventsListSuccess({ results: events, pagination: blankPages }));

      expect(result).toEqual([...events]);
    });
  });

  describe('getEventsListNetworkActive', () => {
    it('should return if the network is active', () => {
      let result;

      store.pipe(select(fromSelectors.getEventsListNetworkActive)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(false);
    });
  });

  describe('getSelectedEventFromEventsList', () => {
    it('should return selected list item', () => {
      let result;

      store.pipe(select(fromSelectors.getSelectedEventFromEventsList(event1.id))).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(undefined);

      store.dispatch(new fromActions.LoadEventsListSuccess({pagination: blankPages, results: events }));

      expect(result).toEqual(event1);
    });
  });
});
