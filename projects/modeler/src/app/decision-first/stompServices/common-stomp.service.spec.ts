import { async, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { IPagination, ISocketMessage, ObjectTabType } from 'core/models';
import { rootActions } from 'core/root-store';
import { IDecisionFirstState, } from '../store';
import * as fromStore from '../store';
import * as fromActions from '../store/actions';
import { TestStoreModule } from '../testing/test-store-module.spec';
import { CommonStompService } from './common-stomp.service';

describe('Common Stomp Service', () => {
  const someTimeInterval = 7200;
  let commonStompService: CommonStompService;
  let dispatch: jasmine.Spy;
  let store: Store<IDecisionFirstState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
      ],
      providers: [
        CommonStompService,
      ],
    });

    commonStompService = TestBed.get(CommonStompService);
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
        userId: 'userId',
        expiresAt: new Date().getTime() + someTimeInterval,
        userType: 'ADMIN',
      }),
    );
    dispatch = spyOn(store, 'dispatch');
  }));

  it('should be created', () => {
    expect(commonStompService).toBeTruthy();
  });

  it('should dispatch load specific page for home search list', () => {
    dispatch.and.callThrough();
    store.dispatch(new fromStore.LoadHomeSearchListSuccess({
      results: [], 
      pagination: getTestPagination(),
    }));

    commonStompService.updateSelfPageForSearchLists();

    expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadSpecificPageForHomeSearchList('https://'));
  });

  it('should dispatch load specific page for main search list', () => {
    dispatch.and.callThrough();
    store.dispatch(new fromStore.LoadMainSearchListSuccess({
      results: [], 
      pagination: getTestPagination(),
    }));

    commonStompService.updateSelfPageForSearchLists();

    expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadSpecificPageForMainSearchList('https://'));
  });

  it('should dispatch load specific page for object list', () => {
    dispatch.and.callThrough();
    store.dispatch(new fromStore.LoadDecisionsListSuccess({
      results: [], 
      pagination: getTestPagination(),
    }));

    commonStompService.updateSelfPageObjectsList(
      fromStore.getDecisionsListPagination, 
      fromStore.LoadSpecificPageForDecisionsList
    );

    expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadSpecificPageForDecisionsList('https://'));
  });

  it('should dispatch load specific page for diagramming elements list', () => {
    dispatch.and.callThrough();
    store.dispatch(new fromStore.LoadDiagrammingElementsListSuccess({
      results: [], 
      pagination: getTestPagination(),
    }));

    commonStompService.updateSelfPageDiagrammingElementsList();

    expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadSpecificPageForDiagrammingElementsList('https://'));
  });

  it('should dispatch load object tab', () => {
    dispatch.and.callThrough();
    store.dispatch(new fromStore.AddTab({
      id: 'diagram1000',
      type: ObjectTabType.Diagram,
    }));

    commonStompService.updateObjectTab('diagram1000', fromStore.LoadDiagram);
    
    expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadDiagram('diagram1000'));
  });

  describe('updateRelationObjects', () => {
    it('should update diagram', () => {
      dispatch.and.callThrough();
      store.dispatch(new fromStore.AddTab({
        id: 'diagram1000',
        type: ObjectTabType.Diagram,
      }));

      commonStompService.updateRelationObjects(['diagram1000']);

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadDiagram('diagram1000'));
    });

    it('should update decision', () => {
      dispatch.and.callThrough();
      store.dispatch(new fromStore.AddTab({
        id: 'decision1000',
        type: ObjectTabType.Decision,
      }));
  
      commonStompService.updateRelationObjects(['decision1000']);

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadDecision('decision1000'));
    });
  
    it('should update input data', () => {
      dispatch.and.callThrough();
      store.dispatch(new fromStore.AddTab({
        id: 'inputData1000',
        type: ObjectTabType.InputData,
      }));
  
      commonStompService.updateRelationObjects(['inputData1000']);

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadInputData('inputData1000'));
    });
  
    it('should update knowledge source', () => {
      dispatch.and.callThrough();
      store.dispatch(new fromStore.AddTab({
        id: 'knowledgeSource1000',
        type: ObjectTabType.KnowledgeSource,
      }));
  
      commonStompService.updateRelationObjects(['knowledgeSource1000']);

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadKnowledgeSource('knowledgeSource1000'));
    });
  
    it('should update organization', () => {
      dispatch.and.callThrough();
      store.dispatch(new fromStore.AddTab({
        id: 'organization1000',
        type: ObjectTabType.Organization,
      }));
  
      commonStompService.updateRelationObjects(['organization1000']);

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadOrganization('organization1000'));
    });
  
    it('should update businessObjective', () => {
      dispatch.and.callThrough();
      store.dispatch(new fromStore.AddTab({
        id: 'businessObjective1000',
        type: ObjectTabType.BusinessObjective,
      }));
  
      commonStompService.updateRelationObjects(['businessObjective1000']);

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadBusinessObjective('businessObjective1000'));
    });
  
    it('should update process', () => {
      dispatch.and.callThrough();
      store.dispatch(new fromStore.AddTab({
        id: 'process1000',
        type: ObjectTabType.Process,
      }));
  
      commonStompService.updateRelationObjects(['process1000']);

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadProcess('process1000'));
    });
  
    it('should update event', () => {
      dispatch.and.callThrough();
      store.dispatch(new fromStore.AddTab({
        id: 'event1000',
        type: ObjectTabType.Event,
      }));
  
      commonStompService.updateRelationObjects(['event1000']);

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadEvent('event1000'));
    });
  
    it('should update system', () => {
      dispatch.and.callThrough();
      store.dispatch(new fromStore.AddTab({
        id: 'system1000',
        type: ObjectTabType.System,
      }));
  
      commonStompService.updateRelationObjects(['system1000']);

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadSystem('system1000'));
    });
  
    it('should update implementation component', () => {
      dispatch.and.callThrough();
      store.dispatch(new fromStore.AddTab({
        id: 'implementationComponent1000',
        type: ObjectTabType.ImplementationComponent,
      }));
  
      commonStompService.updateRelationObjects(['implementationComponent1000']);

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadImplementationComponent('implementationComponent1000'));
    });
  });

  describe('updateObjectTabHandler', () => {
    beforeEach(() => {
      dispatch.and.callThrough();
      store.dispatch(new fromStore.AddTab({
        id: 'decisionId',
        type: ObjectTabType.Decision,
      }));
    });

    it('should dispatch load object action if user id is not equal with current user id', () => {
      commonStompService.actionsMapping = { loadObjectAction: fromActions.LoadDecision };

      commonStompService.updateObjectTabHandler({userId: 'differentUserId', resourceId: 'decisionId'} as ISocketMessage);

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadDecision('decisionId'));
    });

    it('should dispatch load object action if object tab needs to update', () => {
      commonStompService.notUpdatedEntitiesNames = [];
      commonStompService.actionsMapping = { loadObjectAction: fromActions.LoadDecision };

      commonStompService.updateObjectTabHandler({userId: 'userId', resourceId: 'decisionId', relatedEntityType: 'decision'} as ISocketMessage);

      expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadDecision('decisionId'));
    });

    it('should not dispatch load object action if object tab does not need to update', () => {
      commonStompService.notUpdatedEntitiesNames = ['decision'];
      commonStompService.actionsMapping = { loadObjectAction: fromActions.LoadDecision };

      commonStompService.updateObjectTabHandler({userId: 'userId', resourceId: 'decisionId', relatedEntityType: 'decision'} as ISocketMessage);

      expect(dispatch).not.toHaveBeenCalledWith(new fromStore.LoadDecision('decisionId'));
    });
  })
  
  function getTestPagination(): IPagination {
    return {
      selfUrl: 'https://',
      number: 0,
      size: 0,
      totalElements: 0,
      totalPages: 0,
    }
  }
});
