import { async, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { rootActions } from 'core/root-store';
import { AuthStompService } from 'core/stomp-services';
import { FakeAuthStompService } from 'core/testing';
import { Decision } from '../models/decision.model';
import { Diagram } from '../models/diagram.model';
import { InputData } from '../models/inputData.model';
import { KnowledgeSource } from '../models/knowledgeSource.model';
import { Organization } from '../models/organization.model';
import { IDecisionFirstState } from '../store';
import * as fromStore from '../store';
import { TestStoreModule } from '../testing/test-store-module.spec';
import { KnowledgeSourceStompService } from './knowledge-source-stomp.service';

describe('Knowledge Source Stomp Service', () => {
  const someTimeInterval = 7200;
  let knowledgeSourceStompService: KnowledgeSourceStompService;
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
        KnowledgeSourceStompService,
        { provide: AuthStompService, useValue: fakeAuthStompService }
      ],
    });

    knowledgeSourceStompService = TestBed.get(KnowledgeSourceStompService);
    spyOn(knowledgeSourceStompService, 'updateSelfPageForSearchLists');
    spyOn(knowledgeSourceStompService, 'updateSelfPageObjectsList');
    spyOn(knowledgeSourceStompService, 'updateSelfPageDiagrammingElementsList');
    spyOn(knowledgeSourceStompService, 'updateObjectTab');
    spyOn(knowledgeSourceStompService, 'updateRelationObjects');

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
    expect(knowledgeSourceStompService).toBeTruthy();
  });

  describe('create event', () => {
    it('should update search lists, object list and diagramming objects', () => {
      fakeAuthStompService._next({
        eventType: 'create',
        resourceId: 'knowledgeSource1',
      });

      expect(knowledgeSourceStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(knowledgeSourceStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getKnowledgeSourcesListPagination, fromStore.LoadSpecificPageForKnowledgeSourcesList);
      expect(knowledgeSourceStompService.updateSelfPageDiagrammingElementsList).toHaveBeenCalled();
    });
  });

  describe('update event', () => {
    it('should update search lists, object list, object tab and diagramming objects list', () => {
      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'knowledgeSource1',
      });

      expect(knowledgeSourceStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(knowledgeSourceStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getKnowledgeSourcesListPagination, fromStore.LoadSpecificPageForKnowledgeSourcesList);
      expect(knowledgeSourceStompService.updateSelfPageDiagrammingElementsList).toHaveBeenCalled();
      expect(knowledgeSourceStompService.updateObjectTab).toHaveBeenCalledWith('knowledgeSource1', fromStore.LoadKnowledgeSource);
    });

    it('should update knowledge source in diagram', () => {
      const knowledgeSource = new KnowledgeSource();
      knowledgeSource.id = 'knowledgeSource1';

      const diagram = new Diagram();
      diagram.id = 'diagram1';
      diagram.knowledgeSources = [knowledgeSource];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadDiagramSuccess(diagram));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'knowledgeSource1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadKnowledgeSourceAsChild('knowledgeSource1'));
    });

    it('should update knowledge source in decision', () => {
      const knowledgeSource = new KnowledgeSource();
      knowledgeSource.id = 'knowledgeSource1';

      const decision = new Decision();
      decision.id = 'decision1';
      decision.requiresKnowledgeSources = [knowledgeSource];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadDecisionSuccess(decision));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'knowledgeSource1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadKnowledgeSourceAsChild('knowledgeSource1'));
    });

    it('should update knowledge source in input data', () => {
      const knowledgeSource = new KnowledgeSource();
      knowledgeSource.id = 'knowledgeSource1';

      const inputData = new InputData();
      inputData.id = 'inputData1';
      inputData.requiredByKnowledgeSources = [knowledgeSource];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadInputDataSuccess(inputData));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'knowledgeSource1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadKnowledgeSourceAsChild('knowledgeSource1'));
    });

    it('should update knowledge source in knowledge source', () => {
      const targetKnowledgeSource = new KnowledgeSource();
      targetKnowledgeSource.id = 'knowledgeSource1';

      const sourceKnowledgeSource = new KnowledgeSource();
      sourceKnowledgeSource.id = 'knowledgeSource2';
      sourceKnowledgeSource.requiresKnowledgeSources = [];
      sourceKnowledgeSource.requiredByKnowledgeSources = [targetKnowledgeSource];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadKnowledgeSourceSuccess(sourceKnowledgeSource));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'knowledgeSource1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadKnowledgeSourceAsChild('knowledgeSource1'));
    });

    it('should update knowledge source in organization', () => {
      const knowledgeSource = new KnowledgeSource();
      knowledgeSource.id = 'knowledgeSource1';

      const organization = new Organization();
      organization.id = 'organization1';
      organization.knowledgeSources = [knowledgeSource];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadOrganizationSuccess(organization));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'knowledgeSource1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadKnowledgeSourceAsChild('knowledgeSource1'));
    });
  });

  describe('delete event', () => {
    it('should remove tab and update search lists, object list, diagramming objects list', () => {
      fakeAuthStompService._next({
        eventType: 'delete',
        resourceId: 'knowledgeSource1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.RemoveTab('knowledgeSource1'));
      expect(knowledgeSourceStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(knowledgeSourceStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getKnowledgeSourcesListPagination, fromStore.LoadSpecificPageForKnowledgeSourcesList);
      expect(knowledgeSourceStompService.updateSelfPageDiagrammingElementsList).toHaveBeenCalled();
    });
  });

  describe('link update event', () => {
    it('should update object tab and relation objects', () => {
      fakeAuthStompService._next({
        eventType: 'linkUpdate',
        resourceId: 'knowledgeSource1',
        linkData: ['123,321']
      });

      expect(knowledgeSourceStompService.updateObjectTab).toHaveBeenCalledWith('knowledgeSource1', fromStore.LoadKnowledgeSource);
      expect(knowledgeSourceStompService.updateRelationObjects).toHaveBeenCalledWith(['123,321']);
    });
  });

  describe('link delete event', () => {
    it('should update object tab and relation objects', () => {
      fakeAuthStompService._next({
        eventType: 'linkDelete',
        resourceId: 'knowledgeSource1',
        linkData: ['123,321']
      });

      expect(knowledgeSourceStompService.updateObjectTab).toHaveBeenCalledWith('knowledgeSource1', fromStore.LoadKnowledgeSource);
      expect(knowledgeSourceStompService.updateRelationObjects).toHaveBeenCalledWith(['123,321']);
    });
  });
});
