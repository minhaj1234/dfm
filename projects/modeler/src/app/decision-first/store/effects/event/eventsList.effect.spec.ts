import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { blankPages } from 'core/models';
import { MessageService } from 'core/services';
import { FakeExternalService  } from 'core/testing'
import { FakeMessageService } from 'core/testing';
import { cold, hot } from 'jasmine-marbles';
import { of, throwError, EMPTY, Observable } from 'rxjs';
import { Event } from '../../../models/events.model';
import { EventsService } from '../../../services';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions';
import * as fromEventsListActions from '../../actions/event/eventsList.action';
import { IDecisionFirstState } from '../../reducers';
import * as fromEffects from './eventsList.effect';

export class TestActions extends Actions {
  constructor() {
    super(EMPTY);
  }

  set stream(source: Observable<any>) {
    // tslint:disable-next-line
    this.source = source;
  }
}

const events: Event[] = [{} as any, {} as any];

export function getActions() {
  return new TestActions();
}

describe('Events List Effects', () => {
  let actions$: TestActions;
  let service: EventsService;
  let effects: fromEffects.EventsListEffects;
  let messageService: MessageService;
  let store: Store<IDecisionFirstState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        AngularHalModule,
        TestStoreModule,
      ],
      providers: [
        EventsService,
        fromEffects.EventsListEffects,
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: MessageService, useValue: new FakeMessageService() },
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(EventsService);
    effects = TestBed.get(fromEffects.EventsListEffects);
    messageService = TestBed.get(MessageService);
    store = TestBed.get(Store);

    spyOn(service, 'getSomeMinimalWithSearch').and.returnValue(of({ results: events, pagination: blankPages }));
    spyOn(service, 'getByUrl').and.returnValue(of({ results: events, pagination: blankPages }));
    spyOn(messageService, 'handleError');
  });

  describe('loadEventsList$', () => {
    it('should dispatch LoadEventsListSuccess', () => {
      const action = new fromActions.LoadEventsList();
      const completion = new fromEventsListActions.LoadEventsListSuccess({
        pagination: blankPages,
        results: events,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadEventsList$).toBeObservable(expected);
    });

    it('should dispatch EventsListFailure if the service throws an error', () => {
      (service.getSomeMinimalWithSearch as jasmine.Spy).and.returnValue(throwError({ message: 'error message' }));
      const action = new fromActions.LoadEventsList();
      const completion = new fromActions.EventsListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadEventsList$).toBeObservable(expected);
    });
  });

  describe('loadSpecificPageForEventsList$', () => {
    it('should dispatch LoadEventsListSuccess', () => {
      const action = new fromActions.LoadSpecificPageForEventsList('https://example.com/23567522');
      const completion = new fromActions.LoadEventsListSuccess({
        pagination: blankPages,
        results: events,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSpecificPageForEventsList$).toBeObservable(expected);
    });

    it('should dispatch EventsListFailure if the service throws an error', () => {
      (service.getByUrl as jasmine.Spy).and.returnValue(throwError({ message: 'error message' }));
      const action = new fromActions.LoadSpecificPageForEventsList('https://example.com/345333');
      const completion = new fromActions.EventsListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSpecificPageForEventsList$).toBeObservable(expected);
    });
  });

  describe('eventsListFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const action = new fromActions.EventsListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: action });

      expect(effects.eventsListFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(new Error('error message'), 'resources.eventsList');
    });
  });
});
