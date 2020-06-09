import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { ObjectTabType } from 'core/models';
import { rootActions } from 'core/root-store';
import { MessageService } from 'core/services';
import { FakeMessageService } from 'core/testing';
import { FakeExternalService  } from 'core/testing'
import { cold, hot } from 'jasmine-marbles';
import { of, throwError, EMPTY, Observable } from 'rxjs';
import { Answer, Decision } from '../../../models/decision.model';
import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import { System } from '../../../models/system.model';
import { DecisionsService } from '../../../services';
import * as fromModelerStoreReducers from '../../../store/reducers';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { getPreventDuplicateNameMessage } from '../../../utilitites/getPreventDuplicateNameMessage';
import * as fromActions from '../../actions';
import { AddTab } from '../../actions';
import * as fromEffects from './decisions.effect';

export class TestActions extends Actions {
  constructor() {
    super(EMPTY);
  }

  set stream(source: Observable<any>) {
    // tslint:disable-next-line
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}

describe('Decisions Effects', () => {
  let actions$: TestActions;
  let service: DecisionsService;
  let effects: fromEffects.DecisionsEffects;
  let messageService: MessageService;
  let store: Store<fromModelerStoreReducers.IDecisionFirstState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AngularHalModule, TestStoreModule],
      providers: [
        DecisionsService,
        fromEffects.DecisionsEffects,
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: MessageService, useValue: new FakeMessageService() },
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(DecisionsService);
    effects = TestBed.get(fromEffects.DecisionsEffects);
    messageService = TestBed.get(MessageService);
    store = TestBed.get(Store);
    store.dispatch(new rootActions.ValidationSuccess({ userId: 'userId' } as any));
    store.dispatch(new AddTab({
      id: '12345',
      type: ObjectTabType.Decision,
    }));

    spyOn(service, 'create').and.returnValue(of({id: '12345'} as any));
    spyOn(service, 'delete').and.returnValue(of({}));
    spyOn(service, 'patch').and.returnValue(of({} as any));
    spyOn(service, 'getSingleMinimal').and.returnValue(of({ id: '12345' } as any));
    spyOn(service, 'getSingleObjectForDiagram').and.returnValue(of({ id: '12345' } as any));
    spyOn(service, 'getSingleEdit').and.returnValue(of({ id: '12345' } as any));
    spyOn(service, 'addRelatedObject').and.returnValue(of({}));
    spyOn(service, 'updateRelatedObject').and.returnValue(of({}));
    spyOn(service, 'removeRelatedObject').and.returnValue(of({}));
    spyOn(messageService, 'handleError');
    spyOn(messageService, 'showWarning');
  });

  describe('addDecision$', () => {
    it('should dispatch FinishedGenericNetworkRequestForDecision', () => {
      const action = new fromActions.AddDecision({name: '', description: ''} as any);
      const completion = new fromActions.FinishedGenericNetworkRequestForDecision();
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addDecision$).toBeObservable(expected);
    });

    it('should dispatch UpdateObjectTags if there are tags', () => {
      const action = new fromActions.AddDecision({name: '#newtag', description: ''} as any);
      const completion = new fromActions.UpdateObjectTags({ missingTagNames: ['#newtag'], id: '12345', type: ObjectClassNames.Decision});
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });
     
      expect(effects.addDecision$).toBeObservable(expected);
    });

    it('should dispatch NoOpAction if there are no tags', () => {
      const action = new fromActions.AddDecision({name: '', description: ''} as any);
      const completion = new fromActions.NoOpAction();
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });
     
      expect(effects.addDecision$).toBeObservable(expected);
    });

    it('should dispatch GenericDecisionFailure if the service throws an error', () => {
      (service.create as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.AddDecision({name: '', description: ''} as any);
      const completion = new fromActions.GenericDecisionFailure(new Error('error message'));
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addDecision$).toBeObservable(expected);
    });
  });

  describe('updateDecision$', () => {
    it('should dispatch FinishedNetworkRequestForDecision', () => {
      const action = new fromActions.UpdateDecision({
        decision: createTestDecision('12345'),
      });
      const completion = new fromActions.FinishedNetworkRequestForDecision('12345');
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });      

      expect(effects.updateDecision$).toBeObservable(expected);
    });

    it('should dispatch UpdateObjectTags if tags is changed', () => {
      const action = new fromActions.UpdateDecision({
        decision: { _links: {} as any, name: 'new name', description: 'new description', id: 'some id' },
        objectTagsUpdate: {
          tags: [],
          name: 'name #newtag name',
          description: ''
        }
      });
      const completion = new fromActions.UpdateObjectTags({ missingTagNames: ['#newtag'], extraTagIds: [], id: 'some id', type: ObjectClassNames.Decision});

      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateDecision$).toBeObservable(expected);
    });

    it('should dispatch NoOpAction if tags are not changed', () => {
      const action = new fromActions.UpdateDecision({
        decision: createTestDecision('12345'),
        objectTagsUpdate: {
          tags: [],
          name: 'name',
          description: ''
        }       
      });
      const completion = new fromActions.NoOpAction();
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateDecision$).toBeObservable(expected);
    });

    it('should dispatch DecisionFailure if the service throws an error', () => {
      (service.patch as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.UpdateDecision({
        decision: { _links: {} as any, name: 'new name', description: 'new description', id: 'some id' }
      });
      const completion = new fromActions.DecisionFailure({ error: new Error('error message'), id: 'some id' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateDecision$).toBeObservable(expected);
    });

    it('should call messageService.showWarning', () => {
      (service.patch as jasmine.Spy).and.returnValue(of({id: '12345', name: 'changed name'}));
      const action = new fromActions.UpdateDecision({
        decision: createTestDecision('12345'),
      });
      const completion = new fromActions.FinishedNetworkRequestForDecision('12345');
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });      

      expect(effects.updateDecision$).toBeObservable(expected);
      expect(messageService.showWarning).toHaveBeenCalledWith(getPreventDuplicateNameMessage('changed name'), 'resources.decision');
    });
  });

  describe('deleteDecision$', () => {
    it('should dispatch FinishedNetworkRequestForDecision', () => {
      const action = new fromActions.DeleteDecision({ id: '12345' } as any);
      const completion = new fromActions.FinishedNetworkRequestForDecision('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.deleteDecision$).toBeObservable(expected);
    });

    it('should dispatch DecisionFailure if the service throws an error', () => {
      (service.delete as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.DeleteDecision({ id: '12345' } as any);
      const completion = new fromActions.DecisionFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });
     
      expect(effects.deleteDecision$).toBeObservable(expected);
    });
  });

  describe('addRelatedObjectToDecision$', () => {
    it('should dispatch FinishedNetworkRequestForDecision', () => {
      const action = new fromActions.AddRelatedObjectToDecision({
        sourceObject: createTestDecision('12345'),
        relatedObject: createTestSystem(),
        relationPath: ObjectRelationsNames.Processes,
      });
      const completion = new fromActions.FinishedNetworkRequestForDecision('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });
      
      expect(effects.addRelatedObjectToDecision$).toBeObservable(expected);
    });

    it('should dispatch DecisionFailure if the service throws an error', () => {
      (service.addRelatedObject as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.AddRelatedObjectToDecision({
        sourceObject: createTestDecision('12345'),
        relatedObject: createTestSystem(),
        relationPath: ObjectRelationsNames.Events,
      });
      const completion = new fromActions.DecisionFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });
      
      expect(effects.addRelatedObjectToDecision$).toBeObservable(expected);
    });
  });

  describe('removeRelatedObjectFromDecision$', () => {
    it('should dispatch FinishedNetworkRequestForDecision', () => {
      const action = new fromActions.RemoveRelatedObjectFromDecision({
        sourceObject: createTestDecision('12345'),
        relatedObject: createTestSystem(),
        relationPath: ObjectRelationsNames.Systems,
      });
      const completion = new fromActions.FinishedNetworkRequestForDecision('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });
      
      expect(effects.removeRelatedObjectFromDecision$).toBeObservable(expected);
    });

    it('should dispatch DecisionFailure if the service throws an error', () => {
      (service.removeRelatedObject as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.RemoveRelatedObjectFromDecision({
        sourceObject: createTestDecision('12345'),
        relatedObject: createTestSystem(),
        relationPath: ObjectRelationsNames.ImplementationComponents,
      });
      const completion = new fromActions.DecisionFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removeRelatedObjectFromDecision$).toBeObservable(expected);
    });
  });

  describe('addImplementationTableEntity$', () => {
    it('should dispatch FinishedNetworkRequestForDecision', () => {
      const sourceObject = createTestDecision('12345');
      const action = new fromActions.AddImplementationTableEntity({
        sourceObject: sourceObject,
        requestBody: {id: 'row1'} as any,
        relationPath: 'relation path',
      });
      const completion = new fromActions.FinishedNetworkRequestForDecision('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });
      
      expect(effects.addImplementationTableEntity$).toBeObservable(expected);
    });

    it('should dispatch DecisionFailure if the service throws an error', () => {
      (service.addRelatedObject as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.AddImplementationTableEntity({
        sourceObject: createTestDecision('12345'),
        requestBody: {id: 'row1'} as any,
        relationPath: 'relation path',
      });
      const completion = new fromActions.DecisionFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addImplementationTableEntity$).toBeObservable(expected);
    });
  });

  describe('updateImplementationTableEntity$', () => {
    it('should dispatch FinishedNetworkRequestForDecision', () => {
      const action = new fromActions.UpdateImplementationTableEntity({
        sourceObject: createTestDecision('12345'),
        relatedObject: {id: 'row1'} as any,
        relationPath: 'relation path',
      });
      const completion = new fromActions.FinishedNetworkRequestForDecision('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateImplementationTableEntity$).toBeObservable(expected);
    });

    it('should dispatch DecisionFailure if the service throws an error', () => {
      (service.updateRelatedObject as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.UpdateImplementationTableEntity({
        sourceObject: createTestDecision('12345'),
        relatedObject: {id: 'row1'} as any,
        relationPath: 'relation path',
      });
      const completion = new fromActions.DecisionFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateImplementationTableEntity$).toBeObservable(expected);
    });
  });

  describe('removeImplementationTableEntity$', () => {
    it('should dispatch FinishedNetworkRequestForDecision', () => {
      const action = new fromActions.RemoveImplementationTableEntity({
        sourceObject: createTestDecision('12345'),
        relationPath: 'relation path',
        relatedObjectId: 'relatedObjectId'
      });
      const completion = new fromActions.FinishedNetworkRequestForDecision('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removeImplementationTableEntity$).toBeObservable(expected);
    });

    it('should dispatch DecisionFailure if the service throws an error', () => {
      (service.removeRelatedObject as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.RemoveImplementationTableEntity({
        sourceObject: createTestDecision('12345'),
        relationPath: 'relation path',
        relatedObjectId: 'relatedObjectId'
      });
      const completion = new fromActions.DecisionFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removeImplementationTableEntity$).toBeObservable(expected);
    });
  });

  describe('updateAnswer$', () => {
    it('should dispatch FinishedNetworkRequestForDecision', () => {
      const action = new fromActions.UpdateAnswer({
        decision: createTestDecision('12345'),
        answer: createTestAnswer(),
      });
      const completion = new fromActions.FinishedNetworkRequestForDecision('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateAnswer$).toBeObservable(expected);
    });

    it('should dispatch DecisionFailure if the service throws an error', () => {
      (service.updateRelatedObject as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.UpdateAnswer({
        decision: createTestDecision('12345'),
        answer: createTestAnswer(),
      });
      const completion = new fromActions.DecisionFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateAnswer$).toBeObservable(expected);
    });
  });

  describe('loadDecision$', () => {
    it('should dispatch LoadDecisionSuccess', () => {
      const action = new fromActions.LoadDecision('12345');
      const completion = new fromActions.LoadDecisionSuccess({ id: '12345' } as any);
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });
      
      expect(effects.loadDecision$).toBeObservable(expected);
    });

    it('should dispatch UpdateDiagramGraphableObject for update Decisions', () => {
      const action = new fromActions.LoadDecision('12345');
      const completion = new fromActions.UpdateDiagramGraphableObject({object: {id: '12345'} as Decision, paths: [ObjectRelationsNames.Decisions]});
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });      

      expect(effects.loadDecision$).toBeObservable(expected);
    });

    it('should dispatch DecisionFailure if the service throws an error', () => {
      (service.getSingleEdit as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.LoadDecision('12345');
      const completion = new fromActions.DecisionFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });
      
      actions$.stream = hot('-a', { a: action });

      expect(effects.loadDecision$).toBeObservable(expected);
    });
  });

  describe('loadDecisionAsChild$', () => {
    it('should dispatch UpdateDiagramGraphableObject for update Decisions', () => {
      const action = new fromActions.LoadDecisionAsChild('12345');
      const completion = new fromActions.UpdateDiagramGraphableObject({object: {id: '12345'} as Decision, paths: [ObjectRelationsNames.Decisions]});
      const expected = cold('-(bcdefghijk)', {
        b: completion,
        c: jasmine.anything(),
        d: jasmine.anything(),
        e: jasmine.anything(),
        f: jasmine.anything(),
        g: jasmine.anything(),
        h: jasmine.anything(),
        i: jasmine.anything(),
        j: jasmine.anything(),
        k: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });      

      expect(effects.loadDecisionAsChild$).toBeObservable(expected);
    });

    it('should dispatch UpdateDecisionRelatedObject for update RequiresDecisions and RequiredByDecisions', () => {
      const action = new fromActions.LoadDecisionAsChild('12345');
      const completion = new fromActions.UpdateDecisionRelatedObject({object: {id: '12345'} as Decision, paths: [
        ObjectRelationsNames.RequiresDecisions,
        ObjectRelationsNames.RequiredByDecisions,
      ]});
      const expected = cold('-(bcdefghijk)', {
        b: jasmine.anything(),
        c: completion,
        d: jasmine.anything(),
        e: jasmine.anything(),
        f: jasmine.anything(),
        g: jasmine.anything(),
        h: jasmine.anything(),
        i: jasmine.anything(),
        j: jasmine.anything(),
        k: jasmine.anything(),
      });
      
      actions$.stream = hot('-a', { a: action });
      
      expect(effects.loadDecisionAsChild$).toBeObservable(expected);
    });

    it('should dispatch UpdateInputDataRelatedObject for update RequiredByDecisions', () => {
      const action = new fromActions.LoadDecisionAsChild('12345');
      const completion = new fromActions.UpdateInputDataRelatedObject({object: { id: '12345' } as any, paths: [ObjectRelationsNames.RequiredByDecisions]});
      const expected = cold('-(bcdefghijk)', {
        b: jasmine.anything(),
        c: jasmine.anything(),
        d: completion,
        e: jasmine.anything(),
        f: jasmine.anything(),
        g: jasmine.anything(),
        h: jasmine.anything(),
        i: jasmine.anything(),
        j: jasmine.anything(),
        k: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });
      
      expect(effects.loadDecisionAsChild$).toBeObservable(expected);
    });

    it('should dispatch UpdateDecisionInKnowledgeSources', () => {
      const action = new fromActions.LoadDecisionAsChild('12345');
      const completion = new fromActions.UpdateKnowledgeSourceRelatedObject({object: { id: '12345' } as any, paths: [
        ObjectRelationsNames.RequiresDecisions,
        ObjectRelationsNames.RequiredByDecisions,
      ]});
      const expected = cold('-(bcdefghijk)', {
        b: jasmine.anything(),
        c: jasmine.anything(),
        d: jasmine.anything(),
        e: completion,
        f: jasmine.anything(),
        g: jasmine.anything(),
        h: jasmine.anything(),
        i: jasmine.anything(),
        j: jasmine.anything(),
        k: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });
     
      expect(effects.loadDecisionAsChild$).toBeObservable(expected);
    });

    it('should dispatch UpdateOrganizationRelatedObject for update OwnsDecisions, MakesDecisions, ImpactedByDecisions', () => {
      const action = new fromActions.LoadDecisionAsChild('12345');
      const completion = new fromActions.UpdateOrganizationRelatedObject({object: { id: '12345' } as any, paths: [
        ObjectRelationsNames.OwnsDecisions,
        ObjectRelationsNames.MakesDecisions,
        ObjectRelationsNames.ImpactedByDecisions,
      ]});
      const expected = cold('-(bcdefghijk)', {
        b: jasmine.anything(),
        c: jasmine.anything(),
        d: jasmine.anything(),
        e: jasmine.anything(),
        f: completion,
        g: jasmine.anything(),
        h: jasmine.anything(),
        i: jasmine.anything(),
        j: jasmine.anything(),
        k: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });
      
      expect(effects.loadDecisionAsChild$).toBeObservable(expected);
    });

    it('should dispatch UpdateBusinessObjectiveRelatedObject for update Decisions', () => {
      const action = new fromActions.LoadDecisionAsChild('12345');
      const completion = new fromActions.UpdateBusinessObjectiveRelatedObject({object: { id: '12345' } as any, paths: [ObjectRelationsNames.Decisions]});
      const expected = cold('-(bcdefghijk)', {
        b: jasmine.anything(),
        c: jasmine.anything(),
        d: jasmine.anything(),
        e: jasmine.anything(),
        f: jasmine.anything(),
        g: completion,
        h: jasmine.anything(),
        i: jasmine.anything(),
        j: jasmine.anything(),
        k: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadDecisionAsChild$).toBeObservable(expected);
    });

    it('should dispatch UpdateProcessRelatedObject for update Decisions', () => {
      const action = new fromActions.LoadDecisionAsChild('12345');
      const completion = new fromActions.UpdateProcessRelatedObject({object: { id: '12345' } as any, paths: [ObjectRelationsNames.Decisions]});
      const expected = cold('-(bcdefghijk)', {
        b: jasmine.anything(),
        c: jasmine.anything(),
        d: jasmine.anything(),
        e: jasmine.anything(),
        f: jasmine.anything(),
        g: jasmine.anything(),
        h: completion,
        i: jasmine.anything(),
        j: jasmine.anything(),
        k: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadDecisionAsChild$).toBeObservable(expected);
    });

    it('should dispatch UpdateEventRelatedObject', () => {
      const action = new fromActions.LoadDecisionAsChild('12345');
      const completion = new fromActions.UpdateEventRelatedObject({object: { id: '12345' } as any, paths: [ObjectRelationsNames.Decisions]});
      const expected = cold('-(bcdefghijk)', {
        b: jasmine.anything(),
        c: jasmine.anything(),
        d: jasmine.anything(),
        e: jasmine.anything(),
        f: jasmine.anything(),
        g: jasmine.anything(),
        h: jasmine.anything(),
        i: completion,
        j: jasmine.anything(),
        k: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadDecisionAsChild$).toBeObservable(expected);
    });

    it('should dispatch UpdateDecisionInSystems for update Decisions', () => {
      const action = new fromActions.LoadDecisionAsChild('12345');
      const completion = new fromActions.UpdateSystemRelatedObject({object: { id: '12345' } as any, paths: [ObjectRelationsNames.Decisions]});
      const expected = cold('-(bcdefghijk)', {
        b: jasmine.anything(),
        c: jasmine.anything(),
        d: jasmine.anything(),
        e: jasmine.anything(),
        f: jasmine.anything(),
        g: jasmine.anything(),
        h: jasmine.anything(),
        i: jasmine.anything(),
        j: completion,
        k: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadDecisionAsChild$).toBeObservable(expected);
    });

    it('should dispatch UpdateImplementationComponentRelatedObject for update Decisions', () => {
      const action = new fromActions.LoadDecisionAsChild('12345');
      const completion = new fromActions.UpdateImplementationComponentRelatedObject({object: { id: '12345' } as any, paths: [ObjectRelationsNames.Decisions]});
      const expected = cold('-(bcdefghijk)', {
        b: jasmine.anything(),
        c: jasmine.anything(),
        d: jasmine.anything(),
        e: jasmine.anything(),
        f: jasmine.anything(),
        g: jasmine.anything(),
        h: jasmine.anything(),
        i: jasmine.anything(),
        j: jasmine.anything(),
        k: completion,
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadDecisionAsChild$).toBeObservable(expected);
    });

    it('should dispatch DecisionFailure if the service throws an error', () => {
      (service.getSingleMinimal as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.LoadDecisionAsChild('12345');
      const completion = new fromActions.DecisionFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });
      
      actions$.stream = hot('-a', { a: action });

      expect(effects.loadDecisionAsChild$).toBeObservable(expected);
    });
  });

  describe('decisionFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const action = new fromActions.DecisionFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: action });

      actions$.stream = hot('-a', { a: action });

      expect(effects.decisionFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(new Error('error message'), 'resources.decision');
    });
  });

  describe('genericDecisionFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const action = new fromActions.GenericDecisionFailure(new Error('error message'));
      const expected = cold('-b', { b: action });

      actions$.stream = hot('-a', { a: action });

      expect(effects.genericDecisionFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(new Error('error message'), 'resources.decision');
    });
  });

  describe('removePreviewDecisionFromLocalMemory$', () => {
    it('should dispatch should dispatch RemoveDecisionFromLocalMemory', () => {
      const action = new fromActions.RemovePreviewDecisionFromLocalMemory('123');
      const completion = new fromActions.RemoveDecisionFromLocalMemory('123');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removePreviewDecisionFromLocalMemory$).toBeObservable(expected);
    });

    it('should dispatch should dispatch NoOpAction', () => {

      const action = new fromActions.RemovePreviewDecisionFromLocalMemory('12345');
      const completion = new fromActions.NoOpAction();
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removePreviewDecisionFromLocalMemory$).toBeObservable(expected);
    });
  });

  function createTestDecision(id: string): Decision {
    const decision = new Decision();
    decision.id = id;
    decision.answer = createTestAnswer();
    decision._links = {
      self: {
        href: 'https://'
      },
      processes: {
        href: 'https://'
      },
      events: {
        href: 'https://'
      },
      systems: {
        href: 'https://'
      },
      implementationComponents: {
        href: 'https://'
      }
    } as any;
    
    return decision;
  }

  function createTestSystem(): System {
    const system = new System();
    system._links = {
      self: {
        href: 'https://'
      }
    } as any;

    return system;
  }

  function createTestAnswer(): Answer {
    const answer = new Answer();
    answer._links = {
      self: {
        href: 'https://'
      }
    } as any;

    return answer;
  }
});
