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
import { BusinessObjective } from '../../../models/businessObjective.model';
import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import { Organization } from '../../../models/organization.model';
import { BusinessObjectivesService } from '../../../services';
import * as fromModelerStoreReducers from '../../../store/reducers';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { getPreventDuplicateNameMessage } from '../../../utilitites/getPreventDuplicateNameMessage';
import * as fromActions from '../../actions';
import { AddTab } from '../../actions';
import * as fromEffects from './businessObjectives.effect';

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

describe('BusinessObjectives Effects', () => {
  let actions$: TestActions;
  let service: BusinessObjectivesService;
  let effects: fromEffects.BusinessObjectivesEffects;
  let messageService: MessageService;
  let store: Store<fromModelerStoreReducers.IDecisionFirstState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AngularHalModule, TestStoreModule],
      providers: [
        BusinessObjectivesService,
        fromEffects.BusinessObjectivesEffects,
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: MessageService, useValue: new FakeMessageService() },
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(BusinessObjectivesService);
    effects = TestBed.get(fromEffects.BusinessObjectivesEffects);
    messageService = TestBed.get(MessageService);
    store = TestBed.get(Store);
    store.dispatch(new rootActions.ValidationSuccess({ userId: 'userId' } as any));
    store.dispatch(new AddTab({
      id: '12345',
      type: ObjectTabType.BusinessObjective,
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

  describe('loadBusinessObjective$', () => {
    it('should dispatch LoadBusinessObjectiveSuccess', () => {
      const action = new fromActions.LoadBusinessObjective('12345');
      const completion = new fromActions.LoadBusinessObjectiveSuccess({ id: '12345' } as any);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadBusinessObjective$).toBeObservable(expected);
    });

    it('should dispatch BusinessObjectiveFailure if the service throws an error', () => {
      (service.getSingleEdit as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.LoadBusinessObjective('12345');
      const completion = new fromActions.BusinessObjectiveFailure({
        id: '12345',
        error: new Error('error message'),
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadBusinessObjective$).toBeObservable(expected);
    });
  });

  describe('addBusinessObjective$', () => {
    it('should dispatch FinishedGenericNetworkRequestForBusinessObjective', () => {
      const action = new fromActions.AddBusinessObjective({name: '', description: ''} as any);
      const completion = new fromActions.FinishedGenericNetworkRequestForBusinessObjective();
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });
      
      expect(effects.addBusinessObjective$).toBeObservable(expected);
    });

    it('should dispatch UpdateObjectTags if there are tags', () => {
      const action = new fromActions.AddBusinessObjective({name: '#newtag', description: ''} as any);
      const completion = new fromActions.UpdateObjectTags({ missingTagNames: ['#newtag'], id: '12345', type: ObjectClassNames.BusinessObjective});
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });
     
      expect(effects.addBusinessObjective$).toBeObservable(expected);
    });

    it('should dispatch NoOpAction if there are no tags', () => {
      const action = new fromActions.AddBusinessObjective({name: '', description: ''} as any);
      const completion = new fromActions.NoOpAction();
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });
     
      expect(effects.addBusinessObjective$).toBeObservable(expected);
    });

    it('should dispatch GenericBusinessObjectiveFailure if the service throws an error', () => {
      (service.create as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.AddBusinessObjective({name: '', description: ''}  as any);
      const completion = new fromActions.GenericBusinessObjectiveFailure(new Error('error message'));
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addBusinessObjective$).toBeObservable(expected);
    });
  });

  describe('updateBusinessObjective$', () => {
    it('should dispatch FinishedNetworkRequestForBusinessObjective', () => {
      const action = new fromActions.UpdateBusinessObjective({
        businessObjective: createTestBusinessObjective({id: '12345'}),
      });
      const completion = new fromActions.FinishedNetworkRequestForBusinessObjective('12345');
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateBusinessObjective$).toBeObservable(expected);
    });

    it('should dispatch UpdateObjectTags if tags is changed', () => {
      const action = new fromActions.UpdateBusinessObjective({
        businessObjective: createTestBusinessObjective({id: '12345', name: 'name #newtag name'}),
        objectTagsUpdate: {
          tags: [],
          name: 'name #newtag name',
          description: ''
        }      
      });
      const completion = new fromActions.UpdateObjectTags({ missingTagNames: ['#newtag'], extraTagIds: [], id: '12345', type: ObjectClassNames.BusinessObjective});
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateBusinessObjective$).toBeObservable(expected);
    });

    it('should dispatch NoOpAction if tags are not changed', () => {
      const action = new fromActions.UpdateBusinessObjective({
        businessObjective: createTestBusinessObjective({id: '12345'}),
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

      expect(effects.updateBusinessObjective$).toBeObservable(expected);
    });

    it('should dispatch BusinessObjectiveFailure if the service throws an error', () => {
      (service.patch as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.UpdateBusinessObjective({
        businessObjective: { _links: {} as any, name: 'new name', id: 'some id' }
      });
      const completion = new fromActions.BusinessObjectiveFailure({ error: new Error('error message'), id: 'some id' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateBusinessObjective$).toBeObservable(expected);
    });

    it('should call messageService.showWarning', () => {
      (service.patch as jasmine.Spy).and.returnValue(of({id: '12345', name: 'changed name'}));
      const action = new fromActions.UpdateBusinessObjective({
        businessObjective: createTestBusinessObjective({id: '12345'}),
      });
      const completion = new fromActions.FinishedNetworkRequestForBusinessObjective('12345');
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateBusinessObjective$).toBeObservable(expected);
      expect(messageService.showWarning).toHaveBeenCalledWith(getPreventDuplicateNameMessage('changed name'), 'resources.businessObjective');
    });
  });

  describe('deleteBusinessObjective$', () => {
    it('should dispatch FinishedNetworkRequestForBusinessObjective', () => {
      const action = new fromActions.DeleteBusinessObjective({ id: '12345' } as any);
      const completion = new fromActions.FinishedNetworkRequestForBusinessObjective('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.deleteBusinessObjective$).toBeObservable(expected);
    });

    it('should dispatch BusinessObjectiveFailure if the service throws an error', () => {
      (service.delete as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.DeleteBusinessObjective({ id: '12345' } as any);
      const completion = new fromActions.BusinessObjectiveFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.deleteBusinessObjective$).toBeObservable(expected);
    });
  });

  describe('addRelatedObjectToBusinessObjective$', () => {
    it('should dispatch FinishedNetworkRequestForBusinessObjective', () => {   
      const action = new fromActions.AddRelatedObjectToBusinessObjective({
        sourceObject: createTestBusinessObjective({id: '12345'}),
        relatedObject: getOrganization(),
        relationPath: ObjectRelationsNames.Organizations,
      });
      const completion = new fromActions.FinishedNetworkRequestForBusinessObjective('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addRelatedObjectToBusinessObjective$).toBeObservable(expected);
    });

    it('should dispatch BusinessObjectiveFailure if the service throws an error', () => {
      (service.addRelatedObject as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.AddRelatedObjectToBusinessObjective({
        sourceObject: createTestBusinessObjective({id: '12345'}),
        relatedObject: getOrganization(),
        relationPath: ObjectRelationsNames.Organizations,
      });
      const completion = new fromActions.BusinessObjectiveFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addRelatedObjectToBusinessObjective$).toBeObservable(expected);
    });
  });

  describe('removeRelatedObjectFromBusinessObjective$', () => {
    it('should dispatch FinishedNetworkRequestForBusinessObjective', () => {
      const action = new fromActions.RemoveRelatedObjectFromBusinessObjective({
        sourceObject: createTestBusinessObjective({id: '12345'}),
        relatedObject: getOrganization(),
        relationPath: ObjectRelationsNames.Organizations,
      });
      const completion = new fromActions.FinishedNetworkRequestForBusinessObjective('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removeRelatedObjectFromBusinessObjective$).toBeObservable(expected);
    });

    it('should dispatch BusinessObjectiveFailure if the service throws an error', () => {
      (service.removeRelatedObject as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.RemoveRelatedObjectFromBusinessObjective({
        sourceObject: createTestBusinessObjective({id: '12345'}),
        relatedObject: getOrganization(),
        relationPath: ObjectRelationsNames.Organizations,
      });
      const completion = new fromActions.BusinessObjectiveFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removeRelatedObjectFromBusinessObjective$).toBeObservable(expected);
    });
  });

  describe('loadBusinessObjectivesAsChild$', () => {
    it('should dispatch UpdateDecisionRelatedObject', () => {
      const action = new fromActions.LoadBusinessObjectiveAsChild('12345');
      const completion = new fromActions.UpdateDecisionRelatedObject({object: { id: '12345' } as BusinessObjective, paths:[ObjectRelationsNames.BusinessObjectives]});
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });     

      expect(effects.loadBusinessObjectivesAsChild$).toBeObservable(expected);
    });

    it('should dispatch UpdateOrganizationRelatedObject', () => {
      const action = new fromActions.LoadBusinessObjectiveAsChild('12345');
      const completion = new fromActions.UpdateOrganizationRelatedObject({object: { id: '12345' } as Organization, paths:[ObjectRelationsNames.BusinessObjectives]});
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });
      
      actions$.stream = hot('-a', { a: action });

      expect(effects.loadBusinessObjectivesAsChild$).toBeObservable(expected);
    });

    it('should dispatch BusinessObjectiveFailure if the service throws an error', () => {
      (service.getSingleMinimal as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.LoadBusinessObjectiveAsChild('12345');
      const completion = new fromActions.BusinessObjectiveFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadBusinessObjectivesAsChild$).toBeObservable(expected);
    });
  });

  describe('businessObjectiveFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const action = new fromActions.BusinessObjectiveFailure({
        id: '12345',
        error: new Error('error message'),
      });
      const expected = cold('-b', { b: action });

      actions$.stream = hot('-a', { a: action });

      expect(effects.businessObjectiveFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(
        new Error('error message'),
        'resources.businessObjective',
      );
    });
  });

  describe('genericBusinessObjectiveFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const action = new fromActions.GenericBusinessObjectiveFailure(new Error('error message'));
      const expected = cold('-b', { b: action });

      actions$.stream = hot('-a', { a: action });

      expect(effects.genericBusinessObjectiveFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(new Error('error message'), 'resources.businessObjective');
    });
  });

  describe('removePreviewBusinessObjectiveFromLocalMemory$', () => {
    it('should dispatch should dispatch RemoveBusinessObjectiveFromLocalMemory', () => {
      const action = new fromActions.RemovePreviewBusinessObjectiveFromLocalMemory('123');
      const completion = new fromActions.RemoveBusinessObjectiveFromLocalMemory('123');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removePreviewBusinessObjectiveFromLocalMemory$).toBeObservable(expected);
    });

    it('should dispatch should dispatch NoOpAction', () => {

      const action = new fromActions.RemovePreviewBusinessObjectiveFromLocalMemory('12345');
      const completion = new fromActions.NoOpAction();
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removePreviewBusinessObjectiveFromLocalMemory$).toBeObservable(expected);
    });
  });

  function createTestBusinessObjective(businessObjective: {id: string, name?: string}): BusinessObjective {
    return {   
      name: businessObjective.name || 'new name', 
      description: 'new description', 
      id: businessObjective.id,
      tags: [],
      _links: {
        self: {
          href: 'https://'
        },
        organizations: {
          href: 'https://'
        },
      } as any,
    } as BusinessObjective;
  }

  function getOrganization(): Organization {
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
