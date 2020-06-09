import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { ObjectTabType } from 'core/models';
import { rootActions } from 'core/root-store';
import { MessageService } from 'core/services';
import { FakeExternalService  } from 'core/testing'
import { FakeMessageService } from 'core/testing';
import { cold, hot } from 'jasmine-marbles';
import { of, throwError, EMPTY, Observable } from 'rxjs';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import { Organization } from '../../../models/organization.model';
import { KnowledgeSourceService } from '../../../services';
import * as fromModelerStoreReducers from '../../../store/reducers';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { getPreventDuplicateNameMessage } from '../../../utilitites/getPreventDuplicateNameMessage';
import * as fromActions from '../../actions';
import { AddTab } from '../../actions';
import * as fromEffects from './knowledgeSource.effect';

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

describe('Knowledge Sources Effects', () => {
  let actions$: TestActions;
  let service: KnowledgeSourceService;
  let effects: fromEffects.KnowledgeSourceEffects;
  let messageService: MessageService;
  let store: Store<fromModelerStoreReducers.IDecisionFirstState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AngularHalModule, TestStoreModule],
      providers: [
        KnowledgeSourceService,
        fromEffects.KnowledgeSourceEffects,
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: MessageService, useValue: new FakeMessageService() },
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(KnowledgeSourceService);
    effects = TestBed.get(fromEffects.KnowledgeSourceEffects);
    messageService = TestBed.get(MessageService);
    store = TestBed.get(Store);
    store.dispatch(new rootActions.ValidationSuccess({ userId: 'userId' } as any));
    store.dispatch(new AddTab({
      id: '12345',
      type: ObjectTabType.KnowledgeSource,
    }));

    spyOn(service, 'create').and.returnValue(of({id: '12345'} as any));
    spyOn(service, 'delete').and.returnValue(of({}));
    spyOn(service, 'patch').and.returnValue(of({} as any));
    spyOn(service, 'getSingleMinimal').and.returnValue(of({ id: '12345' } as any));
    spyOn(service, 'getSingleObjectForDiagram').and.returnValue(of({ id: '12345' } as any));
    spyOn(service, 'getSingleEdit').and.returnValue(of({ id: '12345' } as any));
    spyOn(service, 'addRelatedObject').and.returnValue(of({}));
    spyOn(service, 'removeRelatedObject').and.returnValue(of({}));
    spyOn(messageService, 'handleError');
    spyOn(messageService, 'showWarning');
  });

  describe('loadKnowledgeSource$', () => {
    it('should dispatch LoadKnowledgeSourceSuccess', () => {
      const action = new fromActions.LoadKnowledgeSource('12345');
      const completion = new fromActions.LoadKnowledgeSourceSuccess({ id: '12345' } as any);

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      expect(effects.loadKnowledgeSource$).toBeObservable(expected);
    });

    it('should dispatch UpdateDiagramGraphableObject for update KnowledgeSources', () => {
      const action = new fromActions.LoadKnowledgeSource('12345');
      const completion = new fromActions.UpdateDiagramGraphableObject({object: { id: '12345' } as any, paths: [ObjectRelationsNames.KnowledgeSources]});

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      expect(effects.loadKnowledgeSource$).toBeObservable(expected);
    });

    it('should dispatch KnowledgeSourceFailure if the service throws an error', () => {
      (service.getSingleEdit as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.LoadKnowledgeSource('12345');
      const completion = new fromActions.KnowledgeSourceFailure({ error: new Error('error message'), id: '12345' });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadKnowledgeSource$).toBeObservable(expected);
    });
  });

  describe('addKnowledgeSource$', () => {
    it('should dispatch SetValueAction to clear the form', () => {
      const action = new fromActions.AddKnowledgeSource({name: '', description: ''}  as any);
      const completion = new fromActions.FinishedGenericNetworkRequestForKnowledgeSource();
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addKnowledgeSource$).toBeObservable(expected);
    });

    it('should dispatch UpdateObjectTags if there are tags', () => {
      const action = new fromActions.AddKnowledgeSource({name: '#newtag', description: ''} as any);
      const completion = new fromActions.UpdateObjectTags({ missingTagNames: ['#newtag'], id: '12345', type: ObjectClassNames.KnowledgeSource});
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });
     
      expect(effects.addKnowledgeSource$).toBeObservable(expected);
    });

    it('should dispatch NoOpAction if there are no tags', () => {
      const action = new fromActions.AddKnowledgeSource({name: '', description: ''} as any);
      const completion = new fromActions.NoOpAction();
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });
     
      expect(effects.addKnowledgeSource$).toBeObservable(expected);
    });

    it('should dispatch KnowledgeSourceFailure if the service throws an error', () => {
      (service.create as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.AddKnowledgeSource({name: '', description: ''}  as any);
      const completion = new fromActions.GenericKnowlegeSourceFailure(new Error('error message'));
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addKnowledgeSource$).toBeObservable(expected);
    });
  });

  describe('updateKnowledgeSource$', () => {
    it('should dispatch FinishedNetworkRequestForKnowledgeSource', () => {
      const action = new fromActions.UpdateKnowledgeSource({
        knowledgeSource: { _links: {} as any, name: 'new name', id: '12345' },
      });
      const completion = new fromActions.FinishedNetworkRequestForKnowledgeSource('12345');
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateKnowledgeSource$).toBeObservable(expected);
    });

    it('should dispatch UpdateObjectTags if tags is changed', () => {
      const action = new fromActions.UpdateKnowledgeSource({
        knowledgeSource: { _links: {} as any, name: 'new name', id: '12345' },
        objectTagsUpdate: {
          tags: [],
          name: 'name #newtag name',
          description: ''
        }  
      });
      const completion = new fromActions.UpdateObjectTags({ missingTagNames: ['#newtag'], extraTagIds: [], id: '12345', type: ObjectClassNames.KnowledgeSource});
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateKnowledgeSource$).toBeObservable(expected);
    });

    it('should dispatch NoOpAction if tags are not changed', () => {
      const action = new fromActions.UpdateKnowledgeSource({
        knowledgeSource: createTestKnowledgeSource({id: '12345'}),
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

      expect(effects.updateKnowledgeSource$).toBeObservable(expected);
    });

    it('should dispatch KnowledgeSourceFailure if the service throws an error', () => {
      (service.patch as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.UpdateKnowledgeSource({
        knowledgeSource: { _links: {} as any, name: 'new name', id: '12345' }
      });
      const completion = new fromActions.KnowledgeSourceFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateKnowledgeSource$).toBeObservable(expected);
    });

    it('should  call messageService.showWarning', () => {
      (service.patch as jasmine.Spy).and.returnValue(of({id: '12345', name: 'changed name'}));
      const action = new fromActions.UpdateKnowledgeSource({
        knowledgeSource: { _links: {} as any, name: 'new name', id: '12345' },
      });
      const completion = new fromActions.FinishedNetworkRequestForKnowledgeSource('12345');
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateKnowledgeSource$).toBeObservable(expected);
      expect(messageService.showWarning).toHaveBeenCalledWith(getPreventDuplicateNameMessage('changed name'), 'resources.knowledgeSource');
    });
  });

  describe('deleteKnowledgeSource$', () => {
    it('should dispatch FinishedNetworkRequestForKnowledgeSource', () => {
      const action = new fromActions.DeleteKnowledgeSource({ id: '12345' } as any);
      const completion = new fromActions.FinishedNetworkRequestForKnowledgeSource('12345');
      const expected = cold('-(b)', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.deleteKnowledgeSource$).toBeObservable(expected);
    });

    it('should dispatch KnowledgeSourceFailure if the service throws an error', () => {
      (service.delete as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.DeleteKnowledgeSource({ id: '12345' } as any);
      const completion = new fromActions.KnowledgeSourceFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.deleteKnowledgeSource$).toBeObservable(expected);
    });
  });

  describe('knowledgeSourceFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const action = new fromActions.KnowledgeSourceFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: action });

      actions$.stream = hot('-a', { a: action });

      expect(effects.knowledgeSourceFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(
        new Error('error message'),
        'resources.knowledgeSource',
      );
    });
  });

  describe('loadKnowledgeSourceAsChild$', () => {
    it('should dispatch UpdateDiagramGraphableObject for update KnowledgeSources', () => {
      const action = new fromActions.LoadKnowledgeSourceAsChild('12345');
      const completion = new fromActions.UpdateDiagramGraphableObject({object: { id: '12345' } as any, paths: [ObjectRelationsNames.KnowledgeSources]});
      const expected = cold('-(bcdef)', {
        b: completion,
        c: jasmine.anything(),
        d: jasmine.anything(),
        e: jasmine.anything(),
        f: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadKnowledgeSourceAsChild$).toBeObservable(expected);
    });

    it('should dispatch UpdateDecisionRelatedObject for update RequiresKnowledgeSources, RequiredByKnowledgeSources', () => {
      const action = new fromActions.LoadKnowledgeSourceAsChild('12345');
      const completion = new fromActions.UpdateDecisionRelatedObject({object: { id: '12345' } as any, paths: [
        ObjectRelationsNames.RequiresKnowledgeSources,
        ObjectRelationsNames.RequiredByKnowledgeSources,
      ]});
      const expected = cold('-(bcdef)', {
        b: jasmine.anything(),
        c: completion,
        d: jasmine.anything(),
        e: jasmine.anything(),
        f: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadKnowledgeSourceAsChild$).toBeObservable(expected);
    });

    it('should dispatch UpdateInputDataRelatedObject for update RequiredByKnowledgeSources', () => {
      const action = new fromActions.LoadKnowledgeSourceAsChild('12345');
      const completion = new fromActions.UpdateInputDataRelatedObject({object: { id: '12345' } as any, paths: [ObjectRelationsNames.RequiredByKnowledgeSources]});
      const expected = cold('-(bcdef)', {
        b: jasmine.anything(),
        c: jasmine.anything(),
        d: completion,
        e: jasmine.anything(),
        f: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadKnowledgeSourceAsChild$).toBeObservable(expected);
    });

    it('should dispatch UpdateKnowledgeSourceRelatedObject for update RequiresKnowledgeSources, RequiredByKnowledgeSources', () => {
      const action = new fromActions.LoadKnowledgeSourceAsChild('12345');
      const completion =  new fromActions.UpdateKnowledgeSourceRelatedObject({object: { id: '12345' } as any, paths: [
        ObjectRelationsNames.RequiresKnowledgeSources,
        ObjectRelationsNames.RequiredByKnowledgeSources,
      ]});
      const expected = cold('-(bcdef)', {
        b: jasmine.anything(),
        c: jasmine.anything(),
        d: jasmine.anything(),
        e: completion,
        f: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });
      
      expect(effects.loadKnowledgeSourceAsChild$).toBeObservable(expected);
    });

    it('should dispatch UpdateOrganizationRelatedObject for update KnowledgeSources', () => {
      const action = new fromActions.LoadKnowledgeSourceAsChild('12345');
      const completion = new fromActions.UpdateOrganizationRelatedObject({object: { id: '12345' } as any, paths: [ObjectRelationsNames.KnowledgeSources]});
      const expected = cold('-(bcdef)', {
        b: jasmine.anything(),
        c: jasmine.anything(),
        d: jasmine.anything(),
        e: jasmine.anything(),
        f: completion,
      });

      actions$.stream = hot('-a', { a: action });
      
      expect(effects.loadKnowledgeSourceAsChild$).toBeObservable(expected);
    });

    it('should dispatch KnowledgeSourceFailure if the service throws an error', () => {
      (service.getSingleMinimal as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.LoadKnowledgeSourceAsChild('12345');
      const completion = new fromActions.KnowledgeSourceFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadKnowledgeSourceAsChild$).toBeObservable(expected);
    });
  });

  describe('addRelatedObjectToKnowledgeSource$', () => {
    it('should dispatch FinishedNetworkRequestForKnowledgeSource', () => {
      const action = new fromActions.AddRelatedObjectToKnowledgeSource({
        sourceObject: createTestKnowledgeSource({id: '12345'}),
        relatedObject: createTestOrganization(),
        relationPath: ObjectRelationsNames.Organizations,
      });

      const completion = new fromActions.FinishedNetworkRequestForKnowledgeSource('12345');

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.addRelatedObjectToKnowledgeSource$).toBeObservable(expected);
    });

    it('should dispatch KnowledgeSourceFailure if the service throws an error', () => {
      (service.addRelatedObject as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.AddRelatedObjectToKnowledgeSource({
        sourceObject: createTestKnowledgeSource({id: '12345'}),
        relatedObject: createTestOrganization(),
        relationPath: ObjectRelationsNames.Organizations,
      });
      const completion = new fromActions.KnowledgeSourceFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addRelatedObjectToKnowledgeSource$).toBeObservable(expected);
    });
  });

  describe('removeRelatedObjectFromKnowledgeSource$', () => {
    it('should dispatch RemoveRelatedObjectFromKnowledgeSource', () => {
      const action = new fromActions.RemoveRelatedObjectFromKnowledgeSource({
        sourceObject: createTestKnowledgeSource({id: '12345'}),
        relatedObject: createTestOrganization(),
        relationPath: ObjectRelationsNames.Organizations,
      });
      const completion = new fromActions.FinishedNetworkRequestForKnowledgeSource('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removeRelatedObjectFromKnowledgeSource$).toBeObservable(expected);
    });

    it('should dispatch KnowledgeSourceFailure if the service throws an error', () => {
      (service.removeRelatedObject as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.RemoveRelatedObjectFromKnowledgeSource({
        sourceObject: createTestKnowledgeSource({id: '12345'}),
        relatedObject: createTestOrganization(),
        relationPath: ObjectRelationsNames.Organizations,
      });
      const completion = new fromActions.KnowledgeSourceFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removeRelatedObjectFromKnowledgeSource$).toBeObservable(expected);
    });
  });

  describe('knowledgeSourceGenericFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const action = new fromActions.GenericKnowlegeSourceFailure(new Error('error message'));
      const expected = cold('-b', { b: action });

      actions$.stream = hot('-a', { a: action });

      expect(effects.knowledgeSourceGenericFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(
        new Error('error message'),
        'resources.knowledgeSource',
      );
    });
  });

  describe('removePreviewKnowledgeSourceFromLocalMemory$', () => {
    it('should dispatch should dispatch RemoveKnowledgeSourceFromLocalMemory', () => {
      const action = new fromActions.RemovePreviewKnowledgeSourceFromLocalMemory('123');
      const completion = new fromActions.RemoveKnowledgeSourceFromLocalMemory('123');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removePreviewKnowledgeSourceFromLocalMemory$).toBeObservable(expected);
    });

    it('should dispatch should dispatch NoOpAction', () => {

      const action = new fromActions.RemovePreviewKnowledgeSourceFromLocalMemory('12345');
      const completion = new fromActions.NoOpAction();
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removePreviewKnowledgeSourceFromLocalMemory$).toBeObservable(expected);
    });
  });

  function createTestKnowledgeSource(knowledgeSource: {id: string}): KnowledgeSource {
    return {   
      name: 'new name', 
      description: 'new description', 
      id: knowledgeSource.id,
      _links: {
        self: {
          href: 'https://'
        },
        organizations: {
          href: 'https://'
        }
      } as any,
    } as KnowledgeSource;
  }

  function createTestOrganization(): Organization {
    return {   
      name: 'new name', 
      description: 'new description', 
      id: 'some id',
      _links: {
        self: {
          href: 'https://'
        }
      } as any,
    } as Organization;
  }
});
