import { async, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { rootActions } from 'core/root-store';
import { AuthStompService } from 'core/stomp-services';
import { FakeAuthStompService } from 'core/testing';
import { BusinessObjective } from '../models/businessObjective.model';
import { Decision } from '../models/decision.model';
import { Diagram } from '../models/diagram.model';
import { Event } from '../models/events.model';
import { ImplementationComponent } from '../models/implementationComponent.model';
import { InputData } from '../models/inputData.model';
import { KnowledgeSource } from '../models/knowledgeSource.model';
import { Organization } from '../models/organization.model';
import { Process } from '../models/process.model';
import { System } from '../models/system.model';
import * as fromStore from '../store';
import { IDecisionFirstState } from '../store';
import { TestStoreModule } from '../testing/test-store-module.spec';
import { DecisionStompService } from './decision-stomp.service';

describe('Decision Stomp Service', () => {
  const someTimeInterval = 7200;
  let decisionStompService: DecisionStompService;
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
        DecisionStompService,
        { provide: AuthStompService, useValue: fakeAuthStompService }
      ],
    });

    decisionStompService = TestBed.get(DecisionStompService);
    spyOn(decisionStompService, 'updateSelfPageForSearchLists');
    spyOn(decisionStompService, 'updateSelfPageObjectsList');
    spyOn(decisionStompService, 'updateSelfPageDiagrammingElementsList');
    spyOn(decisionStompService, 'updateObjectTab');
    spyOn(decisionStompService, 'updateRelationObjects');

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
    expect(decisionStompService).toBeTruthy();
  });

  describe('create event', () => {
    it('should update search lists, object list and diagramming elements list', () => {
      fakeAuthStompService._next({
        eventType: 'create',
        resourceId: 'decision1',
      });

      expect(decisionStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(decisionStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getDecisionsListPagination, fromStore.LoadSpecificPageForDecisionsList);
      expect(decisionStompService.updateSelfPageDiagrammingElementsList).toHaveBeenCalled();
    });
  });

  describe('update event', () => {
    it('should update search lists, object list, object tab and diagramming elements list', () => {
      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'decision1',
      });

      expect(decisionStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(decisionStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getDecisionsListPagination, fromStore.LoadSpecificPageForDecisionsList);
      expect(decisionStompService.updateSelfPageDiagrammingElementsList).toHaveBeenCalled();
      expect(decisionStompService.updateObjectTab).toHaveBeenCalledWith('decision1', fromStore.LoadDecision);
    });

    it('should update decision in diagram', () => {
      const decision = new Decision();
      decision.id = 'decision1';

      const diagram = new Diagram();
      diagram.id = 'diagram1';
      diagram.decisions = [decision];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadDiagramSuccess(diagram));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'decision1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadDecisionAsChild('decision1'));
    });

    it('should update decision in decision', () => {
      const targetDecision = new Decision();
      targetDecision.id = 'decision1';

      const sourceDecision = new Decision();
      sourceDecision.id = 'decision2';
      sourceDecision.requiresDecisions = [targetDecision];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadDecisionSuccess(sourceDecision));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'decision1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadDecisionAsChild('decision1'));
    });

    it('should update decision in input data', () => {
      const decision = new Decision();
      decision.id = 'decision1';

      const inputData = new InputData();
      inputData.id = 'inputData1';
      inputData.requiredByDecisions = [decision];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadInputDataSuccess(inputData));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'decision1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadDecisionAsChild('decision1'));
    });

    it('should update decision in knowledge source', () => {
      const decision = new Decision();
      decision.id = 'decision1';

      const knowledgeSource = new KnowledgeSource();
      knowledgeSource.id = 'inputData1';
      knowledgeSource.requiresDecisions = [decision];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadKnowledgeSourceSuccess(knowledgeSource));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'decision1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadDecisionAsChild('decision1'));
    });

    it('should update decision in organization', () => {
      const decision = new Decision();
      decision.id = 'decision1';

      const organization = new Organization();
      organization.id = 'organization1';
      organization.ownsDecisions = [decision];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadOrganizationSuccess(organization));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'decision1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadDecisionAsChild('decision1'));
    });

    it('should update decision in business objective', () => {
      const decision = new Decision();
      decision.id = 'decision1';

      const businessObjective = new BusinessObjective();
      businessObjective.id = 'businessObjective1';
      businessObjective.decisions = [decision];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadBusinessObjectiveSuccess(businessObjective));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'decision1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadDecisionAsChild('decision1'));
    });

    it('should update decision in process', () => {
      const decision = new Decision();
      decision.id = 'decision1';

      const process = new Process();
      process.id = 'process1';
      process.decisions = [decision];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadProcessSuccess(process));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'decision1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadDecisionAsChild('decision1'));
    });

    it('should update decision in event', () => {
      const decision = new Decision();
      decision.id = 'decision1';

      const event = new Event();
      event.id = 'event1';
      event.decisions = [decision];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadEventSuccess(event));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'decision1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadDecisionAsChild('decision1'));
    });

    it('should update decision in system', () => {
      const decision = new Decision();
      decision.id = 'decision1';

      const system = new System();
      system.id = 'system1';
      system.decisions = [decision];

      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadSystemSuccess(system));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'decision1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadDecisionAsChild('decision1'));
    });

    it('should update decision in implementation component', () => {
      const decision = new Decision();
      decision.id = 'decision1';
  
      const implementationComponent = new ImplementationComponent();
      implementationComponent.id = 'implementationComponent1';
      implementationComponent.decisions = [decision];
  
      dispatch.and.callThrough();
      store.dispatch(new fromStore.LoadImplementationComponentSuccess(implementationComponent));
  
      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'decision1',
      });
  
      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadDecisionAsChild('decision1'));
    });
  });

  describe('delete event', () => {
    it('should remove tab and update search lists, object list, diagramming elements list', () => {
      fakeAuthStompService._next({
        eventType: 'delete',
        resourceId: 'decision1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromStore.RemoveTab('decision1'));
      expect(decisionStompService.updateSelfPageForSearchLists).toHaveBeenCalled();
      expect(decisionStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getDecisionsListPagination, fromStore.LoadSpecificPageForDecisionsList);
      expect(decisionStompService.updateSelfPageDiagrammingElementsList).toHaveBeenCalled();
    });
  });

  describe('link update event', () => {
    it('should update object tab and relation objects', () => {
      fakeAuthStompService._next({
        eventType: 'linkUpdate',
        resourceId: 'decision1',
        linkData: ['123,321']
      });

      expect(decisionStompService.updateObjectTab).toHaveBeenCalledWith('decision1', fromStore.LoadDecision);
      expect(decisionStompService.updateRelationObjects).toHaveBeenCalledWith(['123,321']);
    });
  });

  describe('link delete event', () => {
    it('should update object tab and relation objects', () => {
      fakeAuthStompService._next({
        eventType: 'linkDelete',
        resourceId: 'decision1',
        linkData: ['123,321']
      });

      expect(decisionStompService.updateObjectTab).toHaveBeenCalledWith('decision1', fromStore.LoadDecision);
      expect(decisionStompService.updateRelationObjects).toHaveBeenCalledWith(['123,321']);
    });
  });
});
