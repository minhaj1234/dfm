import { async, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { rootActions } from 'core/root-store';
import { AuthStompService } from 'core/stomp-services';
import { FakeAuthStompService } from 'core/testing';
import { BusinessObjective } from '../models/businessObjective.model';
import { Decision } from '../models/decision.model';
import { Organization } from '../models/organization.model';
import { IDecisionFirstState } from '../store';
import * as fromStore from '../store';
import { TestStoreModule } from '../testing/test-store-module.spec';
import { BusinessObjectiveStompService } from './business-objective-stomp.service';

describe('Business Objective Stomp Service', () => {
  const someTimeInterval = 7200;
  let businessObjectiveStompService: BusinessObjectiveStompService;
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
        BusinessObjectiveStompService,
        { provide: AuthStompService, useValue: fakeAuthStompService }
      ],
    });

    businessObjectiveStompService = TestBed.get(BusinessObjectiveStompService);
    spyOn(businessObjectiveStompService, 'updateSelfPageForSearchLists');
    spyOn(businessObjectiveStompService, 'updateSelfPageObjectsList');
    spyOn(businessObjectiveStompService, 'updateObjectTab');
    spyOn(businessObjectiveStompService, 'updateRelationObjects');

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
    expect(businessObjectiveStompService).toBeTruthy();
  });

  describe('create event', () => {
    it('should update search lists and object list', () => {
      fakeAuthStompService._next({
        eventType: 'create',
        resourceId: 'businessObjective1',
      });

      expect(businessObjectiveStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(businessObjectiveStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getBusinessObjectivesListPagination, fromStore.LoadSpecificPageForBusinessObjectivesList);
    });
  });

  describe('update event', () => {
    it('should update search lists, object list and object tab', () => {
      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'businessObjective1',
      });

      expect(businessObjectiveStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(businessObjectiveStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getBusinessObjectivesListPagination, fromStore.LoadSpecificPageForBusinessObjectivesList);
      expect(businessObjectiveStompService.updateObjectTab).toHaveBeenCalledWith('businessObjective1', fromStore.LoadBusinessObjective);
    });

    it('should update business objective in decision', () => {
      const businessObjective = new BusinessObjective();
      businessObjective.id = 'businessObjective1';

      const decision = new Decision();
      decision.id = 'decision1';
      decision.businessObjectives = [businessObjective];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadDecisionSuccess(decision));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'businessObjective1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadBusinessObjectiveAsChild('businessObjective1'));
    });

    it('should update business objective in organization', () => {
      const businessObjective = new BusinessObjective();
      businessObjective.id = 'businessObjective1';

      const organization = new Organization();
      organization.id = 'organization1';
      organization.businessObjectives = [businessObjective];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadOrganizationSuccess(organization));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'businessObjective1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadBusinessObjectiveAsChild('businessObjective1'));
    });
  });

  describe('delete event', () => {
    it('should remove tab, update search lists and object list', () => {
      fakeAuthStompService._next({
        eventType: 'delete',
        resourceId: 'businessObjective1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.RemoveTab('businessObjective1'));
      expect(businessObjectiveStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(businessObjectiveStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getBusinessObjectivesListPagination, fromStore.LoadSpecificPageForBusinessObjectivesList);
    });
  });

  describe('link update event', () => {
    it('should update object tab and relation objects', () => {
      fakeAuthStompService._next({
        eventType: 'linkUpdate',
        resourceId: 'businessObjective1',
        linkData: ['123,321']
      });

      expect(businessObjectiveStompService.updateObjectTab).toHaveBeenCalledWith('businessObjective1', fromStore.LoadBusinessObjective);
      expect(businessObjectiveStompService.updateRelationObjects).toHaveBeenCalledWith(['123,321']);
    });
  });

  describe('link delete event', () => {
    it('should update object tab and relation objects', () => {
      fakeAuthStompService._next({
        eventType: 'linkDelete',
        resourceId: 'businessObjective1',
        linkData: ['123,321']
      });

      expect(businessObjectiveStompService.updateObjectTab).toHaveBeenCalledWith('businessObjective1', fromStore.LoadBusinessObjective);
      expect(businessObjectiveStompService.updateRelationObjects).toHaveBeenCalledWith(['123,321']);
    });
  });
});
