import { async, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { rootActions } from 'core/root-store';
import { AuthStompService } from 'core/stomp-services';
import { FakeAuthStompService } from 'core/testing';
import { BusinessObjective } from '../models/businessObjective.model';
import { Decision } from '../models/decision.model';
import { InputData } from '../models/inputData.model';
import { KnowledgeSource } from '../models/knowledgeSource.model';
import { Organization } from '../models/organization.model';
import * as fromStore from '../store';
import { IDecisionFirstState } from '../store';
import { TestStoreModule } from '../testing/test-store-module.spec';
import { OrganizationStompService } from './organization-stomp.service';

describe('Organization Stomp Service', () => {
  const someTimeInterval = 7200;
  let organizationStompService: OrganizationStompService;
  let dispatch: jasmine.Spy;
  let store: Store<IDecisionFirstState>;
  let fakeAuthStompService: FakeAuthStompService;

  beforeEach(async(() => {
    fakeAuthStompService = new FakeAuthStompService();
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
      ],
      providers: [
        OrganizationStompService,
        { provide: AuthStompService, useValue: fakeAuthStompService }
      ],
    });
    organizationStompService = TestBed.get(OrganizationStompService);
    spyOn(organizationStompService, 'updateSelfPageForSearchLists');
    spyOn(organizationStompService, 'updateSelfPageObjectsList');
    spyOn(organizationStompService, 'updateObjectTab');
    spyOn(organizationStompService, 'updateRelationObjects');

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
    expect(organizationStompService).toBeTruthy();
  });

  describe('create event', () => {
    it('should update search lists and object list', () => {
      fakeAuthStompService._next({
        eventType: 'create',
        resourceId: 'organization1',
      });

      expect(organizationStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(organizationStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getOrganizationsListPagination, fromStore.LoadSpecificPageForOrganizationsList);
    });
  });

  describe('update event', () => {
    it('should update search lists, object list and object tab', () => {
      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'organization1',
      });

      expect(organizationStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(organizationStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getOrganizationsListPagination, fromStore.LoadSpecificPageForOrganizationsList);
      expect(organizationStompService.updateObjectTab).toHaveBeenCalledWith('organization1', fromStore.LoadOrganization);
    });

    it('should update organization in input data', () => {
      const organization = new Organization();
      organization.id = 'organization1';

      const inputData = new InputData();
      inputData.id = 'decision1';
      inputData.organizations = [organization];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadInputDataSuccess(inputData));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'organization1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadOrganizationAsChild('organization1'));
    });

    it('should update organization in decision', () => {
      const organization = new Organization();
      organization.id = 'organization1';

      const decision = new Decision();
      decision.id = 'decision1';
      decision.organizationsOwnsDecisions = [];
      decision.organizationsMakesDecisions = [organization];
      decision.organizationsImpactedByDecisions = [];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadDecisionSuccess(decision));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'organization1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadOrganizationAsChild('organization1'));
    });

    it('should update organization in knowledge source', () => {
      const organization = new Organization();
      organization.id = 'organization1';

      const knowledgeSource = new KnowledgeSource();
      knowledgeSource.id = 'knowledgeSource1';
      knowledgeSource.organizations = [organization];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadKnowledgeSourceSuccess(knowledgeSource));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'organization1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadOrganizationAsChild('organization1'));
    });

    it('should update organization in organization', () => {
      const targetOrganization = new Organization();
      targetOrganization.id = 'organization1';

      const sourceOrganization = new Organization();
      sourceOrganization.id = 'organization2';
      sourceOrganization.parentOrganization = targetOrganization;

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadOrganizationSuccess(sourceOrganization));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'organization1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadOrganizationAsChild('organization1'));
    });

    it('should update organization in business objective', () => {
      const organization = new Organization();
      organization.id = 'organization1';

      const businessObjective = new BusinessObjective();
      businessObjective.id = 'organization2';
      businessObjective.organizations = [organization];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadBusinessObjectiveSuccess(businessObjective));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'organization1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadOrganizationAsChild('organization1'));
    });
  });

  describe('delete event', () => {
    it('should remove tab, update search lists and object list', () => {
      fakeAuthStompService._next({
        eventType: 'delete',
        resourceId: 'organization1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.RemoveTab('organization1'));
      expect(organizationStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(organizationStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getOrganizationsListPagination, fromStore.LoadSpecificPageForOrganizationsList);
    });
  });

  describe('link update event', () => {
    it('should update object tab and relation objects', () => {
      fakeAuthStompService._next({
        eventType: 'linkUpdate',
        resourceId: 'organization1',
        linkData: ['123,321']
      });

      expect(organizationStompService.updateObjectTab).toHaveBeenCalledWith('organization1', fromStore.LoadOrganization);
      expect(organizationStompService.updateRelationObjects).toHaveBeenCalledWith(['123,321']);
    });
  });

  describe('link delete event', () => {
    it('should update object tab and relation objects', () => {
      fakeAuthStompService._next({
        eventType: 'linkDelete',
        resourceId: 'organization1',
        linkData: ['123,321']
      });

      expect(organizationStompService.updateObjectTab).toHaveBeenCalledWith('organization1', fromStore.LoadOrganization);
      expect(organizationStompService.updateRelationObjects).toHaveBeenCalledWith(['123,321']);
    });
  });
});
