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
import { Decision } from '../../../models/decision.model';
import { ImplementationComponent } from '../../../models/implementationComponent.model';
import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import { ImplementationComponentsService } from '../../../services';
import * as fromModelerStoreReducers from '../../../store/reducers';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { getPreventDuplicateNameMessage } from '../../../utilitites/getPreventDuplicateNameMessage';
import * as fromActions from '../../actions';
import { AddTab } from '../../actions';
import * as fromEffects from './implementationComponents.effect';

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

describe('ImplementationComponents Effects', () => {
  let actions$: TestActions;
  let service: ImplementationComponentsService;
  let effects: fromEffects.ImplementationComponentsEffects;
  let messageService: MessageService;
  let store: Store<fromModelerStoreReducers.IDecisionFirstState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AngularHalModule, TestStoreModule],
      providers: [
        ImplementationComponentsService,
        fromEffects.ImplementationComponentsEffects,
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: MessageService, useValue: new FakeMessageService() },
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(ImplementationComponentsService);
    effects = TestBed.get(fromEffects.ImplementationComponentsEffects);
    messageService = TestBed.get(MessageService);
    store = TestBed.get(Store);
    store.dispatch(new rootActions.ValidationSuccess({ userId: 'userId' } as any));
    store.dispatch(new AddTab({
      id: '12345',
      type: ObjectTabType.ImplementationComponent,
    }));

    spyOn(service, 'getSingleMinimal').and.returnValue(of({ id: '12345' } as any));
    spyOn(service, 'getSingleEdit').and.returnValue(of({ id: '12345' } as any));
    spyOn(service, 'create').and.returnValue(of({id: '12345'} as any));
    spyOn(service, 'patch').and.returnValue(of({} as any));
    spyOn(service, 'delete').and.returnValue(of({}));
    spyOn(service, 'addRelatedObject').and.returnValue(of({}));
    spyOn(service, 'removeRelatedObject').and.returnValue(of({}));
    spyOn(messageService, 'handleError');
    spyOn(messageService, 'showWarning');
  });

  describe('loadImplementationComponent$', () => {
    it('should dispatch LoadImplementationComponentSuccess', () => {
      const action = new fromActions.LoadImplementationComponent('12345');
      const completion = new fromActions.LoadImplementationComponentSuccess({ id: '12345' } as any);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadImplementationComponent$).toBeObservable(expected);
    });

    it('should dispatch ImplementationComponentFailure if the service throws an error', () => {
      (service.getSingleEdit as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.LoadImplementationComponent('12345');
      const completion = new fromActions.ImplementationComponentFailure({
        error: new Error('error message'),
        id: '12345',
      });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadImplementationComponent$).toBeObservable(expected);
    });
  });

  describe('addImplementationComponent$', () => {
    it('should dispatch FinishedGenericNetworkRequestForImplementationComponent', () => {
      const action = new fromActions.AddImplementationComponent({name: '', description: ''} as any);
      const completion = new fromActions.FinishedGenericNetworkRequestForImplementationComponent();
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addImplementationComponent$).toBeObservable(expected);
    });
    

    it('should dispatch UpdateObjectTags if there are tags', () => {
      const action = new fromActions.AddImplementationComponent({name: '#newtag', description: ''} as any);
      const completion = new fromActions.UpdateObjectTags({ missingTagNames: ['#newtag'], id: '12345', type: ObjectClassNames.ImplementationComponent});
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });
     
      expect(effects.addImplementationComponent$).toBeObservable(expected);
    });

    it('should dispatch NoOpAction if there are no tags', () => {
      const action = new fromActions.AddImplementationComponent({name: '', description: ''} as any);
      const completion = new fromActions.NoOpAction();
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });
     
      expect(effects.addImplementationComponent$).toBeObservable(expected);
    });

    it('should dispatch GenericImplementationComponentFailure if the service throws an error', () => {
      (service.create as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.AddImplementationComponent({name: '', description: ''} as any);
      const completion = new fromActions.GenericImplementationComponentFailure(new Error('error message'));
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addImplementationComponent$).toBeObservable(expected);
    });
  });

  describe('updateImplementationComponent$', () => {
    it('should dispatch FinishedNetworkRequestForImplementationComponent', () => {
      const action = new fromActions.UpdateImplementationComponent({
        implementationComponent: createtTestImplementationComponent({id: '12345'}),
      });
      const completion = new fromActions.FinishedNetworkRequestForImplementationComponent('12345');
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateImplementationComponent$).toBeObservable(expected);
    });

    it('should dispatch UpdateObjectTags if tags is changed', () => {
      const action = new fromActions.UpdateImplementationComponent({
        implementationComponent: createtTestImplementationComponent({id: '12345'}),
        objectTagsUpdate: {
          tags: [],
          name: 'name #newtag name',
          description: ''
        }
      });
      const completion = new fromActions.UpdateObjectTags({ missingTagNames: ['#newtag'], extraTagIds: [], id: '12345', type: ObjectClassNames.ImplementationComponent});
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateImplementationComponent$).toBeObservable(expected);
    });

    it('should dispatch NoOpAction if tags are not changed', () => {
      const action = new fromActions.UpdateImplementationComponent({
        implementationComponent: createtTestImplementationComponent({id: '12345'}),
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

      expect(effects.updateImplementationComponent$).toBeObservable(expected);
    });

    it('should dispatch ImplementationComponentFailure if the service throws an error', () => {
      (service.patch as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.UpdateImplementationComponent({
        implementationComponent: { _links: {} as any, name: 'new name', id: 'some id' }
      });
      const completion = new fromActions.ImplementationComponentFailure({ error: new Error('error message'), id: 'some id' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateImplementationComponent$).toBeObservable(expected);
    });

    it('should call messageService.showWarning', () => {
      (service.patch as jasmine.Spy).and.returnValue(of({id: '12345', name: 'changed name'}));
      const action = new fromActions.UpdateImplementationComponent({
        implementationComponent: createtTestImplementationComponent({id: '12345'}),
      });
      const completion = new fromActions.FinishedNetworkRequestForImplementationComponent('12345');
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateImplementationComponent$).toBeObservable(expected);
      expect(messageService.showWarning).toHaveBeenCalledWith(getPreventDuplicateNameMessage('changed name'), 'resources.implementationComponent');
    });

  });

  describe('deleteImplementationComponent$', () => {
    it('should dispatch FinishedNetworkRequestForImplementationComponent', () => {
      const action = new fromActions.DeleteImplementationComponent({ id: '12345' } as any);
      const completion = new fromActions.FinishedNetworkRequestForImplementationComponent('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.deleteImplementationComponent$).toBeObservable(expected);
    });

    it('should dispatch ImplementationComponentFailure if the service throws an error', () => {
      (service.delete as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.DeleteImplementationComponent({ id: '12345' } as any);
      const completion = new fromActions.ImplementationComponentFailure({ error: new Error('error message'), id: '12345' });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.deleteImplementationComponent$).toBeObservable(expected);
    });
  });

  describe('addRelatedObjectToImplementationComponent$', () => {
    it('should dispatch FinishedNetworkRequestForImplementationComponent', () => {
      const action = new fromActions.AddRelatedObjectToImplementationComponent({
        sourceObject: createtTestImplementationComponent({id: '12345'}),
        relatedObject: createTestDecision(),
        relationPath: ObjectRelationsNames.Decisions,
      });
      const completion = new fromActions.FinishedNetworkRequestForImplementationComponent('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addRelatedObjectToImplementationComponent$).toBeObservable(expected);
    });

    it('should dispatch ImplementationComponentFailure if the service throws an error', () => {
      (service.addRelatedObject as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.AddRelatedObjectToImplementationComponent({
        sourceObject: createtTestImplementationComponent({id: '12345'}),
        relatedObject: createTestDecision(),
        relationPath: ObjectRelationsNames.Decisions,
      });
      const completion = new fromActions.ImplementationComponentFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addRelatedObjectToImplementationComponent$).toBeObservable(expected);
    });
  });

  describe('removeRelatedObjectFromImplementationComponent$', () => {
    it('should dispatch FinishedNetworkRequestForImplementationComponent', () => {
      const action = new fromActions.RemoveRelatedObjectFromImplementationComponent({
        sourceObject: createtTestImplementationComponent({id: '12345'}),
        relatedObject: createTestDecision(),
        relationPath: ObjectRelationsNames.Decisions,
      });
      const completion = new fromActions.FinishedNetworkRequestForImplementationComponent('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removeRelatedObjectFromImplementationComponent$).toBeObservable(expected);
    });

    it('should dispatch ImplementationComponentFailure if the service throws an error', () => {
      (service.removeRelatedObject as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.RemoveRelatedObjectFromImplementationComponent({
        sourceObject: createtTestImplementationComponent({id: '12345'}),
        relatedObject: createTestDecision(),
        relationPath: ObjectRelationsNames.Decisions,
      });
      const completion = new fromActions.ImplementationComponentFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removeRelatedObjectFromImplementationComponent$).toBeObservable(expected);
    });
  });

  describe('loadImplementationComponentAsChild$', () => {
    it('should dispatch UpdateDecisionRelatedObject for update ImplementationComponents', () => {
      const action = new fromActions.LoadImplementationComponentAsChild('12345');
      const completion = new fromActions.UpdateDecisionRelatedObject({object: { id: '12345' } as any, paths: [ObjectRelationsNames.ImplementationComponents]});
      const expected = cold('-(b)', {
        b: completion,
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadImplementationComponentAsChild$).toBeObservable(expected);
    });

    it('should dispatch ImplementationComponentFailure if the service throws an error', () => {
      (service.getSingleMinimal as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.LoadImplementationComponentAsChild('12345');
      const completion = new fromActions.ImplementationComponentFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadImplementationComponentAsChild$).toBeObservable(expected);
    });
  });

  describe('implementationComponentFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const action = new fromActions.ImplementationComponentFailure({
        error: new Error('error message'),
        id: '12345',
      });
      const expected = cold('-b', { b: action });

      actions$.stream = hot('-a', { a: action });

      expect(effects.implementationComponentFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(
        new Error('error message'),
        'resources.implementationComponent',
      );
    });
  });

  describe('genericImplementationComponentFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const action = new fromActions.GenericImplementationComponentFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: action });

      expect(effects.genericImplementationComponentFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(new Error('error message'), 'resources.implementationComponent');
    });
  });

  describe('removePreviewImplementationComponentFromLocalMemory$', () => {
    it('should dispatch should dispatch RemoveImplementationComponentFromLocalMemory', () => {
      const action = new fromActions.RemovePreviewImplementationComponentFromLocalMemory('123');
      const completion = new fromActions.RemoveImplementationComponentFromLocalMemory('123');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removePreviewImplementationComponentFromLocalMemory$).toBeObservable(expected);
    });

    it('should dispatch should dispatch NoOpAction', () => {

      const action = new fromActions.RemovePreviewImplementationComponentFromLocalMemory('12345');
      const completion = new fromActions.NoOpAction();
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removePreviewImplementationComponentFromLocalMemory$).toBeObservable(expected);
    });
  });

  function createtTestImplementationComponent(implementationComponent: {id: string}): ImplementationComponent {
    return {   
      name: 'new name', 
      description: 'new description', 
      id: implementationComponent.id,
      _links: {
        self: {
          href: 'https://'
        },
        decisions: {
          href: 'https://'
        }
      } as any,
    } as ImplementationComponent;
  }

  function createTestDecision(): Decision {
    return {   
      name: 'new name', 
      description: 'new description', 
      id: 'some id',
      _links: {
        self: {
          href: 'https://'
        }
      } as any,
    } as Decision;
  }
});
