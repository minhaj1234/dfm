import { async, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { rootActions } from 'core/root-store';
import { AuthStompService } from 'core/stomp-services';
import { FakeAuthStompService } from 'core/testing';
import { Decision } from '../models/decision.model';
import { System } from '../models/system.model';
import * as fromStore from '../store';
import { IDecisionFirstState } from '../store';
import { TestStoreModule } from '../testing/test-store-module.spec';
import { SystemStompService } from './system-stomp.service';

describe('System Stomp Service', () => {
  const someTimeInterval = 7200;
  let systemStompService: SystemStompService;
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
        SystemStompService,
        { provide: AuthStompService, useValue: fakeAuthStompService }
      ],
    });

    systemStompService = TestBed.get(SystemStompService);
    spyOn(systemStompService, 'updateSelfPageForSearchLists');
    spyOn(systemStompService, 'updateSelfPageObjectsList');
    spyOn(systemStompService, 'updateObjectTab');
    spyOn(systemStompService, 'updateRelationObjects');

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
    expect(systemStompService).toBeTruthy();
  });

  describe('create event', () => {
    it('should update search lists and object list', () => {
      fakeAuthStompService._next({
        eventType: 'create',
        resourceId: 'system1',
      });

      expect(systemStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(systemStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getSystemsListPagination, fromStore.LoadSpecificPageForSystemsList);
    });
  });

  describe('update event', () => {
    it('should update search lists, object list and object tab', () => {
      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'system1',
      });

      expect(systemStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(systemStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getSystemsListPagination, fromStore.LoadSpecificPageForSystemsList);
      expect(systemStompService.updateObjectTab).toHaveBeenCalledWith('system1', fromStore.LoadSystem);
    });

    it('should update system in decision', () => {
      const system = new System();
      system.id = 'system1';

      const decision = new Decision();
      decision.id = 'decision1';
      decision.systems = [system];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadDecisionSuccess(decision));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'system1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadSystemAsChild('system1'));
    });
  });

  describe('delete event', () => {
    it('should remove tab, update search lists and object list', () => {
      fakeAuthStompService._next({
        eventType: 'delete',
        resourceId: 'system1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.RemoveTab('system1'));
      expect(systemStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(systemStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getSystemsListPagination, fromStore.LoadSpecificPageForSystemsList);
    });
  });

  describe('link update event', () => {
    it('should update object tab and relation objects', () => {
      fakeAuthStompService._next({
        eventType: 'linkUpdate',
        resourceId: 'system1',
        linkData: ['123,321']
      });

      expect(systemStompService.updateObjectTab).toHaveBeenCalledWith('system1', fromStore.LoadSystem);
      expect(systemStompService.updateRelationObjects).toHaveBeenCalledWith(['123,321']);
    });
  });

  describe('link delete event', () => {
    it('should update object tab and relation objects', () => {
      fakeAuthStompService._next({
        eventType: 'linkDelete',
        resourceId: 'system1',
        linkData: ['123,321']
      });

      expect(systemStompService.updateObjectTab).toHaveBeenCalledWith('system1', fromStore.LoadSystem);
      expect(systemStompService.updateRelationObjects).toHaveBeenCalledWith(['123,321']);
    });
  });
});
