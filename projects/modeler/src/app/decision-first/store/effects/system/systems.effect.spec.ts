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
import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import { System } from '../../../models/system.model';
import { SystemsService } from '../../../services';
import * as fromModelerStoreReducers from '../../../store/reducers';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { getPreventDuplicateNameMessage } from '../../../utilitites/getPreventDuplicateNameMessage';
import * as fromActions from '../../actions';
import { AddTab } from '../../actions';
import * as fromEffects from './systems.effect';

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

describe('Systems Effects', () => {
  let actions$: TestActions;
  let service: SystemsService;
  let effects: fromEffects.SystemsEffects;
  let messageService: MessageService;
  let store: Store<fromModelerStoreReducers.IDecisionFirstState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AngularHalModule, TestStoreModule],
      providers: [
        SystemsService,
        fromEffects.SystemsEffects,
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: MessageService, useValue: new FakeMessageService() },
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(SystemsService);
    effects = TestBed.get(fromEffects.SystemsEffects);
    messageService = TestBed.get(MessageService);
    store = TestBed.get(Store);
    store.dispatch(new rootActions.ValidationSuccess({ userId: 'userId' } as any));
    store.dispatch(new AddTab({
      id: '12345',
      type: ObjectTabType.System,
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

  describe('loadSystem$', () => {
    it('should dispatch LoadSystemSuccess', () => {
      const action = new fromActions.LoadSystem('12345');
      const completion = new fromActions.LoadSystemSuccess({ id: '12345' } as any);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadSystem$).toBeObservable(expected);
    });

    it('should dispatch SystemFailure if the service throws an error', () => {
      (service.getSingleEdit as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.LoadSystem('12345');
      const completion = new fromActions.SystemFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadSystem$).toBeObservable(expected);
    });
  });

  describe('addSystem$', () => {
    it('should dispatch FinishedGenericNetworkRequestForSystem', () => {
      const action = new fromActions.AddSystem({name: '', description: ''} as any);
      const completion = new fromActions.FinishedGenericNetworkRequestForSystem();
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addSystem$).toBeObservable(expected);
    });

    
    it('should dispatch UpdateObjectTags if there are tags', () => {
      const action = new fromActions.AddSystem({name: '#newtag', description: ''} as any);
      const completion = new fromActions.UpdateObjectTags({ missingTagNames: ['#newtag'], id: '12345', type: ObjectClassNames.System});
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });
     
      expect(effects.addSystem$).toBeObservable(expected);
    });

    it('should dispatch GenericSystemFailure if the service throws an error', () => {
      (service.create as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.AddSystem({name: '', description: ''} as any);
      const completion = new fromActions.GenericSystemFailure(new Error('error message'));
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addSystem$).toBeObservable(expected);
    });
  });

  describe('updateSystem$', () => {
    it('should dispatch FinishedNetworkRequestForSystem', () => {
      const action = new fromActions.UpdateSystem({
        system: { _links: {} as any, name: 'new name', id: 'some id' },
      });
      const completion = new fromActions.FinishedNetworkRequestForSystem('some id');
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateSystem$).toBeObservable(expected);
    });

    it('should dispatch UpdateObjectTags if tags is changed', () => {
      const action = new fromActions.UpdateSystem({
        system: createTestSystem({id: '12345'}),
        objectTagsUpdate: {
          tags: [],
          name: 'name #newtag name',
          description: ''
        }   
      });
      const completion = new fromActions.UpdateObjectTags({ missingTagNames: ['#newtag'], extraTagIds: [], id: '12345', type: ObjectClassNames.System});
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateSystem$).toBeObservable(expected);
    });

    it('should dispatch NoOpAction if tags are not changed', () => {
      const action = new fromActions.UpdateSystem({
        system: createTestSystem({id: '12345'}),
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

      expect(effects.updateSystem$).toBeObservable(expected);
    });

    it('should dispatch SystemFailure if the service throws an error', () => {
      (service.patch as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.UpdateSystem({
        system: { _links: {} as any, name: 'new name', id: 'some id' }
      });
      const completion = new fromActions.SystemFailure({ error: new Error('error message'), id: 'some id' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateSystem$).toBeObservable(expected);
    });

    it('should call messageService.showWarning', () => {
      (service.patch as jasmine.Spy).and.returnValue(of({id: '12345', name: 'changed name'}));
      const action = new fromActions.UpdateSystem({
        system: { _links: {} as any, name: 'new name', id: 'some id' },
      });
      const completion = new fromActions.FinishedNetworkRequestForSystem('some id');
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateSystem$).toBeObservable(expected);
      expect(messageService.showWarning).toHaveBeenCalledWith(getPreventDuplicateNameMessage('changed name'), 'resources.system');
    });
  });

  describe('deleteSystem$', () => {
    it('should dispatch FinishedNetworkRequestForSystem', () => {
      const action = new fromActions.DeleteSystem({ id: '12345' } as any);
      const completion = new fromActions.FinishedNetworkRequestForSystem('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.deleteSystem$).toBeObservable(expected);
    });

    it('should dispatch SystemFailure if the service throws an error', () => {
      (service.delete as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.DeleteSystem({ id: '12345' } as any);
      const completion = new fromActions.SystemFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.deleteSystem$).toBeObservable(expected);
    });
  });

  describe('addRelatedObjectToSystem$', () => {
    it('should dispatch FinishedNetworkRequestForSystem', () => {
      const action = new fromActions.AddRelatedObjectToSystem({
        sourceObject: createTestSystem({id: '12345'}),
        relatedObject: createTestDecison(),
        relationPath: ObjectRelationsNames.Decisions,
      });
      const completion = new fromActions.FinishedNetworkRequestForSystem('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addRelatedObjectToSystem$).toBeObservable(expected);
    });

    it('should dispatch SystemFailure if the service throws an error', () => {
      (service.addRelatedObject as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.AddRelatedObjectToSystem({
        sourceObject: createTestSystem({id: '12345'}),
        relatedObject: createTestDecison(),
        relationPath: ObjectRelationsNames.Decisions,
      });
      const completion = new fromActions.SystemFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addRelatedObjectToSystem$).toBeObservable(expected);
    });
  });

  describe('removeRelatedObjectFromSystem$', () => {
    it('should dispatch FinishedNetworkRequestForSystem', () => {
      const action = new fromActions.RemoveRelatedObjectFromSystem({
        sourceObject: createTestSystem({id: '12345'}),
        relatedObject: createTestDecison(),
        relationPath: ObjectRelationsNames.Decisions,
      });
      const completion = new fromActions.FinishedNetworkRequestForSystem('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removeRelatedObjectFromSystem$).toBeObservable(expected);
    });

    it('should dispatch SystemFailure if the service throws an error', () => {
      (service.removeRelatedObject as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.RemoveRelatedObjectFromSystem({
        sourceObject: createTestSystem({id: '12345'}),
        relatedObject: createTestDecison(),
        relationPath: ObjectRelationsNames.Decisions,
      });
      const completion = new fromActions.SystemFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removeRelatedObjectFromSystem$).toBeObservable(expected);
    });
  });

  describe('loadSystemAsChild$', () => {
    it('should dispatch UpdateDecisionRelatedObject for update Systems', () => {
      const action = new fromActions.LoadSystemAsChild('12345');
      const completion = new fromActions.UpdateDecisionRelatedObject({object: { id: '12345' } as any, paths: [ObjectRelationsNames.Systems]});
      const expected = cold('-(b)', {
        b: completion,
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadSystemAsChild$).toBeObservable(expected);
    });

    it('should dispatch SystemFailure if the service throws an error', () => {
      (service.getSingleMinimal as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.LoadSystemAsChild('12345');
      const completion = new fromActions.SystemFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadSystemAsChild$).toBeObservable(expected);
    });
  });

  describe('systemFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const action = new fromActions.SystemFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: action });

      actions$.stream = hot('-a', { a: action });

      expect(effects.systemFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(new Error('error message'), 'resources.system');
    });
  });

  describe('genericSystemFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const action = new fromActions.GenericSystemFailure(new Error('error message'));
      const expected = cold('-b', { b: action });

      actions$.stream = hot('-a', { a: action });

      expect(effects.genericSystemFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(new Error('error message'), 'resources.system');
    });
  });

  describe('removePreviewSystemFromLocalMemory$', () => {
    it('should dispatch should dispatch RemoveSystemFromLocalMemory', () => {
      const action = new fromActions.RemovePreviewSystemFromLocalMemory('123');
      const completion = new fromActions.RemoveSystemFromLocalMemory('123');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removePreviewSystemFromLocalMemory$).toBeObservable(expected);
    });

    it('should dispatch should dispatch NoOpAction', () => {
      const action = new fromActions.RemovePreviewSystemFromLocalMemory('12345');
      const completion = new fromActions.NoOpAction();
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removePreviewSystemFromLocalMemory$).toBeObservable(expected);
    });
  });

  function createTestSystem(inputData: {id: string}): System {
    return {   
      name: 'new name', 
      description: 'new description', 
      id: inputData.id,
      _links: {
        self: {
          href: 'https://'
        },
        decisions: {
          href: 'https://'
        }
      } as any,
    } as System;
  }

  function createTestDecison(): Decision {
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
