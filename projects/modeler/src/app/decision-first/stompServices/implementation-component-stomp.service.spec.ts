import { async, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { rootActions } from 'core/root-store';
import { AuthStompService } from 'core/stomp-services';
import { FakeAuthStompService } from 'core/testing';
import { Decision } from '../models/decision.model';
import { ImplementationComponent } from '../models/implementationComponent.model';
import { IDecisionFirstState } from '../store';
import * as fromStore from '../store';
import { TestStoreModule } from '../testing/test-store-module.spec';
import { ImplementationComponentStompService } from './implementation-component-stomp.service';

describe('Implementation Component Stomp Service', () => {
  const someTimeInterval = 7200;
  let implementationComponentStompService: ImplementationComponentStompService;
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
        ImplementationComponentStompService,
        { provide: AuthStompService, useValue: fakeAuthStompService }
      ],
    });

    implementationComponentStompService = TestBed.get(ImplementationComponentStompService);
    spyOn(implementationComponentStompService, 'updateSelfPageForSearchLists');
    spyOn(implementationComponentStompService, 'updateSelfPageObjectsList');
    spyOn(implementationComponentStompService, 'updateObjectTab');
    spyOn(implementationComponentStompService, 'updateRelationObjects');

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
    expect(implementationComponentStompService).toBeTruthy();
  });

  describe('create event', () => {
    it('should update search lists and object list', () => {
      fakeAuthStompService._next({
        eventType: 'create',
        resourceId: 'implementationComponent1',
      });

      expect(implementationComponentStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(implementationComponentStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getImplementationComponentsListPagination, fromStore.LoadSpecificPageForImplementationComponentsList);
    });
  });

  describe('update event', () => {
    it('should update search lists, object list and object tab', () => {
      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'implementationComponent1',
      });

      expect(implementationComponentStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(implementationComponentStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getImplementationComponentsListPagination, fromStore.LoadSpecificPageForImplementationComponentsList);
      expect(implementationComponentStompService.updateObjectTab).toHaveBeenCalledWith('implementationComponent1', fromStore.LoadImplementationComponent);
    });

    it('should update implementation component in decision', () => {
      const implementationComponent = new ImplementationComponent();
      implementationComponent.id = 'implementationComponent1';

      const decision = new Decision();
      decision.id = 'decision1';
      decision.implementationComponents = [implementationComponent];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadDecisionSuccess(decision));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'implementationComponent1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadImplementationComponentAsChild('implementationComponent1'));
    });
  });

  describe('delete event', () => {
    it('should remove tab, update search lists and object list', () => {
      fakeAuthStompService._next({
        eventType: 'delete',
        resourceId: 'implementationComponent1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.RemoveTab('implementationComponent1'));
      expect(implementationComponentStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(implementationComponentStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getImplementationComponentsListPagination, fromStore.LoadSpecificPageForImplementationComponentsList);
    });
  });

  describe('link update event', () => {
    it('should update object tab and relation objects', () => {
      fakeAuthStompService._next({
        eventType: 'linkUpdate',
        resourceId: 'implementationComponent1',
        linkData: ['123,321']
      });

      expect(implementationComponentStompService.updateObjectTab).toHaveBeenCalledWith('implementationComponent1', fromStore.LoadImplementationComponent);
      expect(implementationComponentStompService.updateRelationObjects).toHaveBeenCalledWith(['123,321']);
    });
  });

  describe('link delete event', () => {
    it('should update object tab and relation objects', () => {
      fakeAuthStompService._next({
        eventType: 'linkDelete',
        resourceId: 'implementationComponent1',
        linkData: ['123,321']
      });

      expect(implementationComponentStompService.updateObjectTab).toHaveBeenCalledWith('implementationComponent1', fromStore.LoadImplementationComponent);
      expect(implementationComponentStompService.updateRelationObjects).toHaveBeenCalledWith(['123,321']);
    });
  });
});
