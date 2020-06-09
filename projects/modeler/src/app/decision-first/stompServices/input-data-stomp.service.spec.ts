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
import * as fromStore from '../store';
import { IDecisionFirstState } from '../store';
import { TestStoreModule } from '../testing/test-store-module.spec';
import { InputDataStompService } from './input-data-stomp.service';

describe('Input Data Stomp Service', () => {
  const someTimeInterval = 7200;
  let inputDataStompService: InputDataStompService;
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
        InputDataStompService,
        { provide: AuthStompService, useValue: fakeAuthStompService }
      ],
    });

    inputDataStompService = TestBed.get(InputDataStompService);
    spyOn(inputDataStompService, 'updateSelfPageForSearchLists');
    spyOn(inputDataStompService, 'updateSelfPageObjectsList');
    spyOn(inputDataStompService, 'updateSelfPageDiagrammingElementsList');
    spyOn(inputDataStompService, 'updateObjectTab');
    spyOn(inputDataStompService, 'updateRelationObjects');

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
    expect(inputDataStompService).toBeTruthy();
  });

  describe('create event', () => {
    it('should update search lists, object list and diagramming elements list', () => {
      fakeAuthStompService._next({
        eventType: 'create',
        resourceId: 'inputData1',
      });

      expect(inputDataStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(inputDataStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getInputDataListPagination, fromStore.LoadSpecificPageForInputDataList);
      expect(inputDataStompService.updateSelfPageDiagrammingElementsList).toHaveBeenCalled();
    });
  });

  describe('update event', () => {
    it('should update search lists, object list, object tab and diagramming elements list', () => {
      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'inputData1',
      });

      expect(inputDataStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(inputDataStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getInputDataListPagination, fromStore.LoadSpecificPageForInputDataList);
      expect(inputDataStompService.updateSelfPageDiagrammingElementsList).toHaveBeenCalled();
      expect(inputDataStompService.updateObjectTab).toHaveBeenCalledWith('inputData1', fromStore.LoadInputData);
    });

    it('should update input data in diagram', () => {
      const inputData = new InputData();
      inputData.id = 'inputData1';

      const diagram = new Diagram();
      diagram.id = 'diagram1';
      diagram.inputDatas = [inputData];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadDiagramSuccess(diagram));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'inputData1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadInputDataAsChild('inputData1'));
    });

    it('should update input data in decision', () => {
      const inputData = new InputData();
      inputData.id = 'inputData1';

      const decision = new Decision();
      decision.id = 'decision1';
      decision.requiresInputData = [inputData];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadDecisionSuccess(decision));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'inputData1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadInputDataAsChild('inputData1'));
    });

    it('should update input data in knowledge source', () => {
      const inputData = new InputData();
      inputData.id = 'inputData1';

      const knowledgeSource = new KnowledgeSource();
      knowledgeSource.id = 'knowledgeSource1';
      knowledgeSource.requiresInputData = [inputData];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadKnowledgeSourceSuccess(knowledgeSource));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'inputData1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadInputDataAsChild('inputData1'));
    });

    it('should update input data in organization', () => {
      const inputData = new InputData();
      inputData.id = 'inputData1';

      const organization = new Organization();
      organization.id = 'knowledgeSource1';
      organization.inputDatas = [inputData];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadOrganizationSuccess(organization));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'inputData1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadInputDataAsChild('inputData1'));
    });
  });

  describe('delete event', () => {
    it('should remove tab and update search lists, object list, diagramming elements list', () => {
      fakeAuthStompService._next({
        eventType: 'delete',
        resourceId: 'inputData1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.RemoveTab('inputData1'));
      expect(inputDataStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(inputDataStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getInputDataListPagination, fromStore.LoadSpecificPageForInputDataList);
      expect(inputDataStompService.updateSelfPageDiagrammingElementsList).toHaveBeenCalled();
    });
  });

  describe('link update event', () => {
    it('should update object tab and relation objects', () => {
      fakeAuthStompService._next({
        eventType: 'linkUpdate',
        resourceId: 'inputData1',
        linkData: ['123,321']
      });

      expect(inputDataStompService.updateObjectTab).toHaveBeenCalledWith('inputData1', fromStore.LoadInputData);
      expect(inputDataStompService.updateRelationObjects).toHaveBeenCalledWith(['123,321']);
    });
  });

  describe('link delete event', () => {
    it('should update object tab and relation objects', () => {
      fakeAuthStompService._next({
        eventType: 'linkDelete',
        resourceId: 'inputData1',
        linkData: ['123,321']
      });

      expect(inputDataStompService.updateObjectTab).toHaveBeenCalledWith('inputData1', fromStore.LoadInputData);
      expect(inputDataStompService.updateRelationObjects).toHaveBeenCalledWith(['123,321']);
    });
  });
});
