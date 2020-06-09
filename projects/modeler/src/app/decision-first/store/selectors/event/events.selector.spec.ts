import { TestBed } from '@angular/core/testing';
import { select, Store } from '@ngrx/store';
import { Event } from '../../../models/events.model';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions';
import * as fromReducers from '../../reducers';
import * as fromSelectors from './events.selector';

describe('Events Selectors', () => {
  let store: Store<fromReducers.IDecisionFirstState>;

  const events: Event[] = [
    {
      id: 'event1',
      name: 'Event One',
      decisions: [{ id: 'decision1' }, { id: 'decision2' }]
    } as any,
    {
      id: 'event2',
      name: 'Event Two',
      decisions: [{ id: 'decision3' }, { id: 'decision4' }]
    } as any,
    {
      id: 'event3',
      name: 'Event Three',
      decisions: [{ id: 'decision5' }, { id: 'decision6' }]
    } as any,
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
      ],
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getLoadedEventsAsArray', () => {
    it('should return the loaded events in array form', () => {
      let result;

      store.pipe(select(fromSelectors.getLoadedEventsAsArray)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual([]);

      store.dispatch(new fromActions.LoadEventSuccess(events[0]));
      store.dispatch(new fromActions.LoadEventSuccess(events[1]));
      store.dispatch(new fromActions.LoadEventSuccess(events[2]));

      expect(result).toEqual([events[0], events[1], events[2]]);
    });
  });

  describe('getEventsAnyNetworkActive', () => {
    it('should return if the network is active', () => {
      let result;

      store.pipe(select(fromSelectors.getEventsAnyNetworkActive)).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(false);
    });
  });

  describe('getSelectedEvent', () => {
    it('should return the selected event', () => {
      store.dispatch(new fromActions.LoadEventSuccess(events[0]));
      store.dispatch(new fromActions.LoadEventSuccess(events[1]));
      store.dispatch(new fromActions.LoadEventSuccess(events[2]));

      let result;

      store.pipe(select(fromSelectors.getSelectedEvent('event1'))).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(events[0]);
    });
  });

  describe('getSelectedEventNetworkActive', () => {
    it('should return the selected event network active', () => {
      store.dispatch(new fromActions.LoadEvent('event1'));

      let result;

      store.pipe(select(fromSelectors.getSelectedEventNetworkActive('event1'))).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(true);
    });

    it('should return false if the event is not loaded', () => {
      let result;

      store.pipe(select(fromSelectors.getSelectedEventNetworkActive('event1'))).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(false);
    });
  });

  describe('getLoadedEventsDecisions', () => {
    it('should return decisions', () => {
      let result;

      store.dispatch(new fromActions.LoadEventSuccess(events[0]));
      store.dispatch(new fromActions.LoadEventSuccess(events[2]));
      store.dispatch(new fromActions.LoadEventSuccess(events[1]));

      store.pipe(select(fromSelectors.getLoadedEventsDecisions)).subscribe((value) => (result = value));

      expect(result).toEqual([...events[0].decisions, ...events[2].decisions, ...events[1].decisions]);
    });
  });
});
