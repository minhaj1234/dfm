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
import { Process } from '../../../models/process.model';
import { ProcessesService } from '../../../services';
import * as fromModelerStoreReducers from '../../../store/reducers';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { getPreventDuplicateNameMessage } from '../../../utilitites/getPreventDuplicateNameMessage';
import * as fromActions from '../../actions';
import { AddTab } from '../../actions';
import * as fromEffects from './processes.effect';

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

describe('Processes Effects', () => {
  let actions$: TestActions;
  let service: ProcessesService;
  let effects: fromEffects.ProcessesEffects;
  let messageService: MessageService;
  let store: Store<fromModelerStoreReducers.IDecisionFirstState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AngularHalModule, TestStoreModule],
      providers: [
        ProcessesService,
        fromEffects.ProcessesEffects,
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: MessageService, useValue: new FakeMessageService() },
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(ProcessesService);
    effects = TestBed.get(fromEffects.ProcessesEffects);
    messageService = TestBed.get(MessageService);
    store = TestBed.get(Store);
    store.dispatch(new rootActions.ValidationSuccess({ userId: 'userId' } as any));
    store.dispatch(new AddTab({
      id: '12345',
      type: ObjectTabType.Process,
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

  describe('loadProcess$', () => {
    it('should dispatch LoadProcessSuccess', () => {
      const action = new fromActions.LoadProcess('12345');
      const completion = new fromActions.LoadProcessSuccess({ id: '12345' } as any);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadProcess$).toBeObservable(expected);
    });

    it('should dispatch ProcessFailure if the service throws an error', () => {
      (service.getSingleEdit as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.LoadProcess('12345');
      const completion = new fromActions.ProcessFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadProcess$).toBeObservable(expected);
    });
  });

  describe('addProcess$', () => {
    it('should dispatch FinishedGenericNetworkRequestForProcess', () => {
      const action = new fromActions.AddProcess({name: '', description: ''} as any);
      const completion = new fromActions.FinishedGenericNetworkRequestForProcess();
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addProcess$).toBeObservable(expected);
    });

    it('should dispatch UpdateObjectTags if there are tags', () => {
      const action = new fromActions.AddProcess({name: '#newtag', description: ''} as any);
      const completion = new fromActions.UpdateObjectTags({ missingTagNames: ['#newtag'], id: '12345', type: ObjectClassNames.Process});
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });
     
      expect(effects.addProcess$).toBeObservable(expected);
    });

    
    it('should dispatch NoOpAction if there are no tags', () => {
      const action = new fromActions.AddProcess({name: '', description: ''} as any);
      const completion = new fromActions.NoOpAction();
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });
     
      expect(effects.addProcess$).toBeObservable(expected);
    });

    it('should dispatch GenericProcessFailure if the service throws an error', () => {
      (service.create as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.AddProcess({name: '', description: ''} as any);
      const completion = new fromActions.GenericProcessFailure(new Error('error message'));
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addProcess$).toBeObservable(expected);
    });
  });

  describe('updateProcess$', () => {
    it('should dispatch FinishedNetworkRequestForProcess', () => {
      const action = new fromActions.UpdateProcess({
        process: createTestProcess({id: '12345'}),
      });
      const completion = new fromActions.FinishedNetworkRequestForProcess('12345');
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateProcess$).toBeObservable(expected);
    });

    it('should dispatch UpdateObjectTags if tags is changed', () => {
      const action = new fromActions.UpdateProcess({
        process: createTestProcess({id: '12345'}),
        objectTagsUpdate: {
          tags: [],
          name: 'name #newtag name',
          description: ''
        } 
      });
      const completion = new fromActions.UpdateObjectTags({ missingTagNames: ['#newtag'], extraTagIds: [], id: '12345', type: ObjectClassNames.Process});
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateProcess$).toBeObservable(expected);
    });

    it('should dispatch NoOpAction if tags are not changed', () => {
      const action = new fromActions.UpdateProcess({
        process: createTestProcess({id: '12345'}),
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

      expect(effects.updateProcess$).toBeObservable(expected);
    });

    it('should dispatch ProcessFailure if the service throws an error', () => {
      (service.patch as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.UpdateProcess({
        process: { _links: {} as any, name: 'new name', id: 'some id' }
      });
      const completion = new fromActions.ProcessFailure({ error: new Error('error message'), id: 'some id' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateProcess$).toBeObservable(expected);
    });

    it('should call messageService.showWarning', () => {
      (service.patch as jasmine.Spy).and.returnValue(of({id: '12345', name: 'changed name'}));
      const action = new fromActions.UpdateProcess({
        process: createTestProcess({id: '12345'}),
      });
      const completion = new fromActions.FinishedNetworkRequestForProcess('12345');
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateProcess$).toBeObservable(expected);
      expect(messageService.showWarning).toHaveBeenCalledWith(getPreventDuplicateNameMessage('changed name'), 'resources.process');
    });
  });

  describe('deleteProcess$', () => {
    it('should dispatch FinishedNetworkRequestForProcess', () => {
      const action = new fromActions.DeleteProcess({ id: '12345' } as any);
      const completion = new fromActions.FinishedNetworkRequestForProcess('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.deleteProcess$).toBeObservable(expected);
    });

    it('should dispatch ProcessFailure if the service throws an error', () => {
      (service.delete as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.DeleteProcess({ id: '12345' } as any);
      const completion = new fromActions.ProcessFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.deleteProcess$).toBeObservable(expected);
    });
  });

  describe('addRelatedObjectToProcess$', () => {
    it('should dispatch FinishedNetworkRequestForProcess', () => {
      const action = new fromActions.AddRelatedObjectToProcess({
        sourceObject: createTestProcess({id: '12345'}),
        relatedObject: createTestDecison(),
        relationPath: ObjectRelationsNames.Decisions,
      });
      const completion = new fromActions.FinishedNetworkRequestForProcess('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addRelatedObjectToProcess$).toBeObservable(expected);
    });

    it('should dispatch ProcessFailure if the service throws an error', () => {
      (service.addRelatedObject as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.AddRelatedObjectToProcess({
        sourceObject: createTestProcess({id: '12345'}),
        relatedObject: createTestDecison(),
        relationPath: ObjectRelationsNames.Decisions,
      });
      const completion = new fromActions.ProcessFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addRelatedObjectToProcess$).toBeObservable(expected);
    });
  });

  describe('removeRelatedObjectFromProcess$', () => {
    it('should dispatch FinishedNetworkRequestForProcess', () => {
      const action = new fromActions.RemoveRelatedObjectFromProcess({
        sourceObject: createTestProcess({id: '12345'}),
        relatedObject: createTestDecison(),
        relationPath: ObjectRelationsNames.Decisions,
      });
      const completion = new fromActions.FinishedNetworkRequestForProcess('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removeRelatedObjectFromProcess$).toBeObservable(expected);
    });

    it('should dispatch ProcessFailure if the service throws an error', () => {
      (service.removeRelatedObject as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.RemoveRelatedObjectFromProcess({
        sourceObject: createTestProcess({id: '12345'}),
        relatedObject: createTestDecison(),
        relationPath: ObjectRelationsNames.Decisions,
      });
      const completion = new fromActions.ProcessFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removeRelatedObjectFromProcess$).toBeObservable(expected);
    });
  });

  describe('loadProcessAsChild$', () => {
    it('should dispatch UpdateDecisionRelatedObject for update Processes', () => {
      const action = new fromActions.LoadProcessAsChild('12345');
      const completion = new fromActions.UpdateDecisionRelatedObject({object: { id: '12345' } as any, paths: [ObjectRelationsNames.Processes]});
      const expected = cold('-(b)', {
        b: completion,
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadProcessAsChild$).toBeObservable(expected);
    });

    it('should dispatch ProcessFailure if the service throws an error', () => {
      (service.getSingleMinimal as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.LoadProcessAsChild('12345');
      const completion = new fromActions.ProcessFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadProcessAsChild$).toBeObservable(expected);
    });
  });

  describe('processFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const action = new fromActions.ProcessFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: action });

      actions$.stream = hot('-a', { a: action });

      expect(effects.processFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(new Error('error message'), 'resources.process');
    });
  });

  describe('genericProcessFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const action = new fromActions.GenericProcessFailure(new Error('error message'));
      const expected = cold('-b', { b: action });

      actions$.stream = hot('-a', { a: action });

      expect(effects.genericProcessFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(new Error('error message'), 'resources.process');
    });
  });

  describe('removePreviewProcessFromLocalMemory$', () => {
    it('should dispatch should dispatch RemoveProcessFromLocalMemory', () => {
      const action = new fromActions.RemovePreviewProcessFromLocalMemory('123');
      const completion = new fromActions.RemoveProcessFromLocalMemory('123');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removePreviewProcessFromLocalMemory$).toBeObservable(expected);
    });

    it('should dispatch should dispatch NoOpAction', () => {

      const action = new fromActions.RemovePreviewProcessFromLocalMemory('12345');
      const completion = new fromActions.NoOpAction();
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removePreviewProcessFromLocalMemory$).toBeObservable(expected);
    });
  });

  function createTestProcess(process: {id: string}): Process {
    return {   
      name: 'new name', 
      description: 'new description', 
      id: process.id,
      _links: {
        self: {
          href: 'https://'
        },
        decisions: {
          href: 'https://'
        }
      } as any,
    } as Process;
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
