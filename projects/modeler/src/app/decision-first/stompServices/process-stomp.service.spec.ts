import { async, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { rootActions } from 'core/root-store';
import { AuthStompService } from 'core/stomp-services';
import { FakeAuthStompService } from 'core/testing';
import { Decision } from '../models/decision.model';
import { Process } from '../models/process.model';
import * as fromStore from '../store';
import { IDecisionFirstState } from '../store';
import { TestStoreModule } from '../testing/test-store-module.spec';
import { ProcessStompService } from './process-stomp.service';

describe('Process Stomp Service', () => {
  const someTimeInterval = 7200;
  let processStompService: ProcessStompService;
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
        ProcessStompService,
        { provide: AuthStompService, useValue: fakeAuthStompService }
      ],
    });

    processStompService = TestBed.get(ProcessStompService);
    spyOn(processStompService, 'updateSelfPageForSearchLists');
    spyOn(processStompService, 'updateSelfPageObjectsList');
    spyOn(processStompService, 'updateObjectTab');
    spyOn(processStompService, 'updateRelationObjects');

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
    expect(processStompService).toBeTruthy();
  });

  describe('create event', () => {
    it('should update search lists and object list', () => {
      fakeAuthStompService._next({
        eventType: 'create',
        resourceId: 'process1',
      });

      expect(processStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(processStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getProcessesListPagination, fromStore.LoadSpecificPageForProcessesList);
    });
  });

  describe('update event', () => {
    it('should update search lists, object list and object tab', () => {
      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'process1',
      });

      expect(processStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(processStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getProcessesListPagination, fromStore.LoadSpecificPageForProcessesList);
      expect(processStompService.updateObjectTab).toHaveBeenCalledWith('process1', fromStore.LoadProcess);
    });

    it('should update process in decision', () => {
      const process = new Process();
      process.id = 'process1';

      const decision = new Decision();
      decision.id = 'decision1';
      decision.processes = [process];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadDecisionSuccess(decision));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'process1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadProcessAsChild('process1'));
    });
  });

  describe('delete event', () => {
    it('should remove tab, update search lists and object list', () => {
      fakeAuthStompService._next({
        eventType: 'delete',
        resourceId: 'process1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.RemoveTab('process1'));
      expect(processStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(processStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getProcessesListPagination, fromStore.LoadSpecificPageForProcessesList);
    });
  });

  describe('link update event', () => {
    it('should update object tab and relation objects', () => {
      fakeAuthStompService._next({
        eventType: 'linkUpdate',
        resourceId: 'process1',
        linkData: ['123,321']
      });

      expect(processStompService.updateObjectTab).toHaveBeenCalledWith('process1', fromStore.LoadProcess);
      expect(processStompService.updateRelationObjects).toHaveBeenCalledWith(['123,321']);
    });
  });

  describe('link delete event', () => {
    it('should update object tab and relation objects', () => {
      fakeAuthStompService._next({
        eventType: 'linkDelete',
        resourceId: 'process1',
        linkData: ['123,321']
      });

      expect(processStompService.updateObjectTab).toHaveBeenCalledWith('process1', fromStore.LoadProcess);
      expect(processStompService.updateRelationObjects).toHaveBeenCalledWith(['123,321']);
    });
  });
});
