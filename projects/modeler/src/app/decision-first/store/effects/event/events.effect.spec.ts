import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { ObjectTabType } from 'core/models';
import { rootActions } from 'core/root-store';
import { MessageService } from 'core/services';
import { FakeExternalService  } from 'core/testing'
import { FakeMessageService } from 'core/testing'
import { cold, hot } from 'jasmine-marbles';
import { of, throwError, EMPTY, Observable } from 'rxjs';
import { Decision } from '../../../models/decision.model';
import { Event } from '../../../models/events.model';
import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import { EventsService } from '../../../services';
import * as fromModelerStoreReducers from '../../../store/reducers';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { getPreventDuplicateNameMessage } from '../../../utilitites/getPreventDuplicateNameMessage';
import { AddTab } from '../../actions';
import * as fromActions from '../../actions';
import * as fromEffects from './events.effect';

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

describe('Events Effects', () => {
  let actions$: TestActions;
  let service: EventsService;
  let effects: fromEffects.EventsEffects;
  let messageService: MessageService;
  let store: Store<fromModelerStoreReducers.IDecisionFirstState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AngularHalModule, TestStoreModule],
      providers: [
        EventsService,
        fromEffects.EventsEffects,
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: MessageService, useValue: new FakeMessageService() },
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(EventsService);
    effects = TestBed.get(fromEffects.EventsEffects);
    messageService = TestBed.get(MessageService);
    store = TestBed.get(Store);
    store.dispatch(new rootActions.ValidationSuccess({ userId: 'userId' } as any));
    store.dispatch(new AddTab({
      id: '12345',
      type: ObjectTabType.Event,
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

  describe('loadEvent$', () => {
    it('should dispatch LoadEventSuccess', () => {
      const action = new fromActions.LoadEvent('12345');
      const completion = new fromActions.LoadEventSuccess({ id: '12345' } as any);

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadEvent$).toBeObservable(expected);
    });

    it('should dispatch EventFailure if the service throws an error', () => {
      (service.getSingleEdit as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.LoadEvent('12345');
      const completion = new fromActions.EventFailure({ error: new Error('error message'), id: '12345' });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadEvent$).toBeObservable(expected);
    });
  });

  describe('addEvent$', () => {
    it('should dispatch FinishedGenericNetworkRequestForEvent', () => {
      const action = new fromActions.AddEvent({name: '', description: ''} as any);
      const completion = new fromActions.FinishedGenericNetworkRequestForEvent();
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addEvent$).toBeObservable(expected);
    });

    it('should dispatch UpdateObjectTags if there are tags', () => {
      const action = new fromActions.AddEvent({name: '#newtag', description: ''} as any);
      const completion = new fromActions.UpdateObjectTags({ missingTagNames: ['#newtag'], id: '12345', type: ObjectClassNames.Event});
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });
     
      expect(effects.addEvent$).toBeObservable(expected);
    });

    it('should dispatch NoOpAction if there are no tags', () => {
      const action = new fromActions.AddEvent({name: '', description: ''} as any);
      const completion = new fromActions.NoOpAction();
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });
     
      expect(effects.addEvent$).toBeObservable(expected);
    });

    it('should dispatch GenericEventFailure if the service throws an error', () => {
      (service.create as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.AddEvent(createTestEvent({id: '12345'}));
      const completion = new fromActions.GenericEventFailure(new Error('error message'));
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addEvent$).toBeObservable(expected);
    });
  });

  describe('updateEvent$', () => {
    it('should dispatch FinishedNetworkRequestForEvent', () => {
      const action = new fromActions.UpdateEvent({
        event: createTestEvent({id: '12345'}),
      });
      const completion = new fromActions.FinishedNetworkRequestForEvent('12345');
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateEvent$).toBeObservable(expected);
    });

    it('should dispatch UpdateObjectTags if tags is changed', () => {
      const action = new fromActions.UpdateEvent({
        event: createTestEvent({id: '12345'}),
        objectTagsUpdate: {
          tags: [],
          name: 'name #newtag name',
          description: ''
        }   
      });
      const completion = new fromActions.UpdateObjectTags({ missingTagNames: ['#newtag'], extraTagIds: [], id: '12345', type: ObjectClassNames.Event});
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateEvent$).toBeObservable(expected);
    });

    it('should dispatch NoOpAction if tags are not changed', () => {
      const action = new fromActions.UpdateEvent({
        event: createTestEvent({id: '12345'}),
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

      expect(effects.updateEvent$).toBeObservable(expected);
    });

    it('should dispatch EventFailure if the service throws an error', () => {
      (service.patch as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.UpdateEvent({
        event: createTestEvent({id: '12345'})
      });
      const completion = new fromActions.EventFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateEvent$).toBeObservable(expected);
    });

    it('should call messageService.showWarning', () => {
      (service.patch as jasmine.Spy).and.returnValue(of({id: '12345', name: 'changed name'}));
      const action = new fromActions.UpdateEvent({
        event: createTestEvent({id: '12345'}),
      });
      const completion = new fromActions.FinishedNetworkRequestForEvent('12345');
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateEvent$).toBeObservable(expected);
      expect(messageService.showWarning).toHaveBeenCalledWith(getPreventDuplicateNameMessage('changed name'), 'resources.event');
    });
  });

  describe('deleteEvent$', () => {
    it('should dispatch FinishedNetworkRequestForEvent', () => {
      const action = new fromActions.DeleteEvent({ id: '12345' } as any);
      const completion = new fromActions.FinishedNetworkRequestForEvent('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.deleteEvent$).toBeObservable(expected);
    });

    it('should dispatch EventFailure if the service throws an error', () => {
      (service.delete as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.DeleteEvent({ id: '12345' } as any);
      const completion = new fromActions.EventFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.deleteEvent$).toBeObservable(expected);
    });
  });

  describe('addRelatedObjectToEvent$', () => {
    it('should dispatch FinishedNetworkRequestForEvent', () => {
      const action = new fromActions.AddRelatedObjectToEvent({
        sourceObject: createTestEvent({id: '12345'}),
        relatedObject: createTestDecision(),
        relationPath: ObjectRelationsNames.Decisions,
      });
      const completion = new fromActions.FinishedNetworkRequestForEvent('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addRelatedObjectToEvent$).toBeObservable(expected);
    });

    it('should dispatch EventFailure if the service throws an error', () => {
      (service.addRelatedObject as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.AddRelatedObjectToEvent({
        sourceObject: createTestEvent({id: '12345'}),
        relatedObject: createTestDecision(),
        relationPath: ObjectRelationsNames.Decisions,
      });
      const completion = new fromActions.EventFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addRelatedObjectToEvent$).toBeObservable(expected);
    });
  });

  describe('removeRelatedObjectFromEvent$', () => {
    it('should dispatch FinishedNetworkRequestForEvent', () => {
      const action = new fromActions.RemoveRelatedObjectFromEvent({
        sourceObject: createTestEvent({id: '12345'}),
        relatedObject: createTestDecision(),
        relationPath: ObjectRelationsNames.Decisions,
      });
      const completion = new fromActions.FinishedNetworkRequestForEvent('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removeRelatedObjectFromEvent$).toBeObservable(expected);
    });

    it('should dispatch EventFailure if the service throws an error', () => {
      (service.removeRelatedObject as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.RemoveRelatedObjectFromEvent({
        sourceObject: createTestEvent({id: '12345'}),
        relatedObject: createTestDecision(),
        relationPath: ObjectRelationsNames.Decisions,
      });
      const completion = new fromActions.EventFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removeRelatedObjectFromEvent$).toBeObservable(expected);
    });
  });

  describe('loadEventAsChild$', () => {
    it('should dispatch UpdateDecisionRelatedObject for update Events', () => {
      const action = new fromActions.LoadEventAsChild('12345');
      const completion = new fromActions.UpdateDecisionRelatedObject({object: { id: '12345' } as any, paths: [ObjectRelationsNames.Events]});
      const expected = cold('-(b)', {
        b: completion,
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadEventAsChild$).toBeObservable(expected);
    });

    it('should dispatch EventFailure if the service throws an error', () => {
      (service.getSingleMinimal as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.LoadEventAsChild('12345');
      const completion = new fromActions.EventFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadEventAsChild$).toBeObservable(expected);
    });
  });

  describe('EventFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const action = new fromActions.EventFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: action });

      actions$.stream = hot('-a', { a: action });

      expect(effects.eventFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(new Error('error message'), 'resources.event');
    });
  });

  describe('genericEventFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const action = new fromActions.GenericEventFailure(new Error('error message'));
      const expected = cold('-b', { b: action });

      actions$.stream = hot('-a', { a: action });

      expect(effects.genericEventFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(new Error('error message'), 'resources.event');
    });
  });

  describe('removePreviewEventFromLocalMemory$', () => {
    it('should dispatch should dispatch RemoveEventFromLocalMemory', () => {
      const action = new fromActions.RemovePreviewEventFromLocalMemory('123');
      const completion = new fromActions.RemoveEventFromLocalMemory('123');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removePreviewEventFromLocalMemory$).toBeObservable(expected);
    });

    it('should dispatch should dispatch NoOpAction', () => {

      const action = new fromActions.RemovePreviewEventFromLocalMemory('12345');
      const completion = new fromActions.NoOpAction();
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removePreviewEventFromLocalMemory$).toBeObservable(expected);
    });
  });

  function createTestEvent(event: {id: string}): Event {
    return {   
      name: 'new name', 
      description: 'new description', 
      id: event.id,
      _links: {
        self: {
          href: 'https://'
        },
        decisions: {
          href: 'https://'
        },
      } as any,
    } as Event;
  }

  function createTestDecision(): Decision {
    return {   
      name: 'new name', 
      description: 'new description', 
      id: 'some id',
      _links: {
        self: {
          href: 'https://'
        },
      } as any,
    } as Decision;
  }
});
