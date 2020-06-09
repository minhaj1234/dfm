import { async, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { rootActions } from 'core/root-store';
import { MessageService } from 'core/services';
import { AuthStompService } from 'core/stomp-services';
import { FakeAuthStompService, FakeMessageService } from 'core/testing';
import { Decision } from '../models/decision.model';
import { Diagram } from '../models/diagram.model';
import { InputData } from '../models/inputData.model';
import { KnowledgeSource } from '../models/knowledgeSource.model';
import { IDecisionFirstState } from '../store';
import * as fromStore from '../store';
import { TestStoreModule } from '../testing/test-store-module.spec';
import { DiagramStompService } from './diagram-stomp.service';


describe('Diagram Stomp Service', () => {
  const someTimeInterval = 7200;
  let diagramStompService: DiagramStompService;
  let dispatch: jasmine.Spy;
  let store: Store<IDecisionFirstState>;
  let fakeAuthStompService: FakeAuthStompService;
  let messageService: MessageService;

  beforeEach(async(() => {
    fakeAuthStompService = new FakeAuthStompService();
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
      ],
      providers: [
        DiagramStompService,
        { provide: AuthStompService, useValue: fakeAuthStompService },
        { provide: MessageService, useValue: new FakeMessageService() },
      ],
    });
    diagramStompService = TestBed.get(DiagramStompService);
    spyOn(diagramStompService, 'updateSelfPageForSearchLists');
    spyOn(diagramStompService, 'updateSelfPageObjectsList');
    spyOn(diagramStompService, 'updateObjectTab');
    spyOn(diagramStompService, 'updateRelationObjects');

    messageService = TestBed.get(MessageService);
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
    expect(diagramStompService).toBeTruthy();
  });

  describe('create event', () => {
    it('should update search lists and object list', () => {
      fakeAuthStompService._next({
        eventType: 'create',
        resourceId: 'diagram1',
      });

      expect(diagramStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(diagramStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getDiagramsListPagination, fromStore.LoadSpecificPageForDiagramsList);
    });
  });

  describe('update event', () => {
    it('should update search lists, object list and object tab', () => {
      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'diagram1',
      });

      expect(diagramStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(diagramStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getDiagramsListPagination, fromStore.LoadSpecificPageForDiagramsList);
      expect(diagramStompService.updateObjectTab).toHaveBeenCalledWith('diagram1', fromStore.LoadDiagram);
    });

    it('should update diagram in decisions', () => {
      const diagram = new Diagram();
      diagram.id = 'diagram1';

      const decision = new Decision();
      decision.id = 'decision1';
      decision.diagrams = [diagram];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadDecisionSuccess(decision));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'diagram1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadDiagramAsChild('diagram1'));
    });

    it('should update diagram in input data', () => {
      const diagram = new Diagram();
      diagram.id = 'diagram1';

      const inputData = new InputData();
      inputData.id = 'decision1';
      inputData.diagrams = [diagram];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadInputDataSuccess(inputData));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'diagram1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadDiagramAsChild('diagram1'));
    });

    it('should update diagram in knowledge sources', () => {
      const diagram = new Diagram();
      diagram.id = 'diagram1';

      const knowledgeSource = new KnowledgeSource();
      knowledgeSource.id = 'knowledgeSource1';
      knowledgeSource.diagrams = [diagram];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadKnowledgeSourceSuccess(knowledgeSource));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'diagram1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadDiagramAsChild('diagram1'));
    });
  });

  describe('delete event', () => {
    it('should remove tab and update search lists and object list', () => {
      fakeAuthStompService._next({
        eventType: 'delete',
        resourceId: 'diagram1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.RemoveTab('diagram1'));
      expect(diagramStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(diagramStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getDiagramsListPagination, fromStore.LoadSpecificPageForDiagramsList);
    });
  });

  describe('link update event', () => {
    it('should update object tab and relation objects', () => {
      fakeAuthStompService._next({
        eventType: 'linkUpdate',
        resourceId: 'diagram1',
        linkData: ['123,321']
      });

      expect(diagramStompService.updateObjectTab).toHaveBeenCalledWith('diagram1', fromStore.LoadDiagram);
      expect(diagramStompService.updateRelationObjects).toHaveBeenCalledWith(['123,321']);
    });
  });

  describe('link delete event', () => {
    it('should update object tab and relation objects', () => {
      fakeAuthStompService._next({
        eventType: 'linkDelete',
        resourceId: 'diagram1',
        linkData: ['123,321']
      });

      expect(diagramStompService.updateObjectTab).toHaveBeenCalledWith('diagram1', fromStore.LoadDiagram);
      expect(diagramStompService.updateRelationObjects).toHaveBeenCalledWith(['123,321']);
    });
  });
});
