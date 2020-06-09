import { async, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { rootActions } from 'core/root-store';
import { AuthStompService } from 'core/stomp-services';
import { FakeAuthStompService } from 'core/testing';
import { Decision } from '../models/decision.model';
import { Event } from '../models/events.model';
import * as fromStore from '../store';
import { IDecisionFirstState } from '../store';
import { TestStoreModule } from '../testing/test-store-module.spec';
import { EventStompService } from './event-stomp.service';

describe('Event Stomp Service', () => {
  const someTimeInterval = 7200;
  let eventStompService: EventStompService;
  let dispatch: jasmine.Spy;
  let fakeAuthStompService: FakeAuthStompService;
  let store: Store<IDecisionFirstState>;

  beforeEach(async(() => {
    fakeAuthStompService = new FakeAuthStompService();
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
      ],
      providers: [
        EventStompService,
        { provide: AuthStompService, useValue: fakeAuthStompService }
      ],
    });

    eventStompService = TestBed.get(EventStompService);
    spyOn(eventStompService, 'updateSelfPageForSearchLists');
    spyOn(eventStompService, 'updateSelfPageObjectsList');
    spyOn(eventStompService, 'updateObjectTab');
    spyOn(eventStompService, 'updateRelationObjects');

    store = TestBed.get(Store);
    store.dispatch(
      new rootActions.ValidationSuccess({
        accessToken: 'accessToken',
        accountId: 'id',
        email: 'email',
        encodedToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwOi8vdGVzdC10ZXN0d3cuY29tL3RlbmFudElkIjoiZGVmYXVsdCIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ.qVgGfthtzcQBkJrkBE8CXgkCLrfIGQe9x7BK7ZmcrRY',
        expiresIn: 10,
        redirectToUrl: 'url',
        refreshToken: 'token',
        userId: 'id',
        expiresAt: new Date().getTime() + someTimeInterval,
        userType: 'ADMIN',
      }),
    );
    dispatch = spyOn(store, 'dispatch');
  }));

  it('should be created', () => {
    expect(eventStompService).toBeTruthy();
  });

  describe('create event', () => {
    it('should update search lists and object list', () => {
      fakeAuthStompService._next({
        eventType: 'create',
        resourceId: 'event1',
      });

      expect(eventStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(eventStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getEventsListPagination, fromStore.LoadSpecificPageForEventsList);
    });
  });

  describe('update event', () => {
    it('should update search lists, object list and object tab', () => {
      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'event1',
      });

      expect(eventStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(eventStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getEventsListPagination, fromStore.LoadSpecificPageForEventsList);
      expect(eventStompService.updateObjectTab).toHaveBeenCalledWith('event1', fromStore.LoadEvent);
    });

    it('should update process in decision', () => {
      const event = new Event();
      event.id = 'event1';

      const decision = new Decision();
      decision.id = 'decision1';
      decision.events = [event];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadDecisionSuccess(decision));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'event1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadEventAsChild('event1'));
    });
  });

  describe('delete event', () => {
    it('should remove tab, update search lists and object list', () => {
      fakeAuthStompService._next({
        eventType: 'delete',
        resourceId: 'event1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.RemoveTab('event1'));
      expect(eventStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(eventStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getEventsListPagination, fromStore.LoadSpecificPageForEventsList);
    });
  });

  describe('link update event', () => {
    it('should update object tab and relation objects', () => {
      fakeAuthStompService._next({
        eventType: 'linkUpdate',
        resourceId: 'event1',
        linkData: ['123,321']
      });

      expect(eventStompService.updateObjectTab).toHaveBeenCalledWith('event1', fromStore.LoadEvent);
      expect(eventStompService.updateRelationObjects).toHaveBeenCalledWith(['123,321']);
    });
  });

  describe('link delete event', () => {
    it('should update object tab and relation objects', () => {
      fakeAuthStompService._next({
        eventType: 'linkDelete',
        resourceId: 'event1',
        linkData: ['123,321']
      });

      expect(eventStompService.updateObjectTab).toHaveBeenCalledWith('event1', fromStore.LoadEvent);
      expect(eventStompService.updateRelationObjects).toHaveBeenCalledWith(['123,321']);
    });
  });
});
