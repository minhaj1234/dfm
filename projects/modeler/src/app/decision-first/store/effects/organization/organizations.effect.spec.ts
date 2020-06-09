import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import {  ObjectTabType } from 'core/models';
import { rootActions } from 'core/root-store';
import { MessageService } from 'core/services';
import { FakeExternalService  } from 'core/testing'
import { FakeMessageService } from 'core/testing';
import { cold, hot } from 'jasmine-marbles';
import { of, throwError, EMPTY, Observable } from 'rxjs';
import { BusinessObjective } from '../../../models/businessObjective.model';
import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import { Organization } from '../../../models/organization.model';
import { OrganizationsService } from '../../../services';
import * as fromModelerStoreReducers from '../../../store/reducers';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { getPreventDuplicateNameMessage } from '../../../utilitites/getPreventDuplicateNameMessage';
import { AddTab, NoOpAction } from '../../actions';
import * as fromActions from '../../actions';
import * as fromEffects from './organizations.effect';

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

describe('Organizations Effects', () => {
  let actions$: TestActions;
  let service: OrganizationsService;
  let effects: fromEffects.OrganizationsEffects;
  let messageService: MessageService;
  let store: Store<fromModelerStoreReducers.IDecisionFirstState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AngularHalModule, TestStoreModule],
      providers: [
        OrganizationsService,
        fromEffects.OrganizationsEffects,
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: MessageService, useValue: new FakeMessageService() },
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(OrganizationsService);
    effects = TestBed.get(fromEffects.OrganizationsEffects);
    messageService = TestBed.get(MessageService);
    store = TestBed.get(Store);
    store.dispatch(new rootActions.ValidationSuccess({   
      userId: 'userid',
      accountId: 'accountId',
      email: 'email',
      userType: 'ADMIN',
      isAuthenticated: true 
    } as any));
    store.dispatch(new AddTab({
      id: '12345',
      type: ObjectTabType.Organization,
    }));

    spyOn(service, 'create').and.returnValue(of({id: '12345'} as any));
    spyOn(service, 'delete').and.returnValue(of({}));
    spyOn(service, 'patch').and.returnValue(of({} as any));
    spyOn(service, 'getSingleMinimal').and.returnValue(of({ id: '12345' } as any));
    spyOn(service, 'getSingleEdit').and.returnValue(of({} as any));
    spyOn(service, 'addRelatedObject').and.returnValue(of({}));
    spyOn(service, 'removeRelatedObject').and.returnValue(of({}));
    spyOn(messageService, 'handleError');
    spyOn(messageService, 'showWarning');
  });

  describe('loadOrganization$', () => {
    it('should dispatch LoadOrganizationSuccess', () => {
      const organization: Organization = {} as any;
      const action = new fromActions.LoadOrganization('some uuid');
      const completion = new fromActions.LoadOrganizationSuccess(organization);

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadOrganization$).toBeObservable(expected);
    });

    it('should dispatch DecisionFailure if the service throws an error', () => {
      const error = new Error('some error');
      (service.getSingleEdit as jasmine.Spy).and.returnValue(throwError(error));
      const action = new fromActions.LoadOrganization('some uuid');
      const completion = new fromActions.OrganizationFailure({ error, id: 'some uuid' });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadOrganization$).toBeObservable(expected);
    });
  });

  describe('addOrganization$', () => {
    it('should dispatch FinishedGenericNetworkRequestForBusinessObjective', () => {
      const action = new fromActions.AddOrganization({name: '', description: ''} as any);
      const completion = new fromActions.FinishedGenericNetworkRequestForOrganization();
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });
      
      expect(effects.addOrganization$).toBeObservable(expected);
    });

    it('should dispatch UpdateObjectTags if there are tags', () => {
      const action = new fromActions.AddOrganization({name: '#newtag', description: ''} as any);
      const completion = new fromActions.UpdateObjectTags({ missingTagNames: ['#newtag'], id: '12345', type: ObjectClassNames.Organization});
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });
     
      expect(effects.addOrganization$).toBeObservable(expected);
    });

    it('should dispatch NoOpAction if there are no tags', () => {
      const action = new fromActions.AddOrganization({name: '', description: ''} as any);
      const completion = new fromActions.NoOpAction();
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });
     
      expect(effects.addOrganization$).toBeObservable(expected);
    });

    it('should dispatch OrganizationFailure if the service throws an error', () => {
      const error = new Error('error message');
      (service.create as jasmine.Spy).and.returnValue(throwError(error));
      const action = new fromActions.AddOrganization({name: '', description: ''} as any);
      const completion = new fromActions.OrganizationFailure({ error, id: '' });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.addOrganization$).toBeObservable(expected);
    });
  });

  describe('updateOrganization$', () => {
    it('should dispatch FinishedNetworkRequestForOrganization', () => {
      const action = new fromActions.UpdateOrganization({
        organization: ctreateTestOrganization({id: '12345'}),
      });
      const completion = new fromActions.FinishedNetworkRequestForOrganization('12345');
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateOrganization$).toBeObservable(expected);
    });

    it('should dispatch UpdateObjectTags if tags is changed', () => {
      const action = new fromActions.UpdateOrganization({
        organization: ctreateTestOrganization({id: '12345'}),
        objectTagsUpdate: {
          tags: [],
          name: 'name #newtag name',
          description: ''
        }
      });
      const completion = new fromActions.UpdateObjectTags({ missingTagNames: ['#newtag'], extraTagIds: [], id: '12345', type: ObjectClassNames.Organization});
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateOrganization$).toBeObservable(expected);
    });

    it('should dispatch NoOpAction if tags are not changed', () => {
      const action = new fromActions.UpdateOrganization({
        organization: ctreateTestOrganization({id: '12345'}),
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

      expect(effects.updateOrganization$).toBeObservable(expected);
    });

    it('should dispatch OrganizationFailure if the service throws an error', () => {
      (service.patch as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.UpdateOrganization({
        organization: { _links: {} as any, name: 'new name', id: 'some id' }
      });
      const completion = new fromActions.OrganizationFailure({ error: new Error('error message'), id: 'some id' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateOrganization$).toBeObservable(expected);
    });

    it('should call messageService.showWarning', () => {
      (service.patch as jasmine.Spy).and.returnValue(of({id: '12345', name: 'changed name'}));
      const action = new fromActions.UpdateOrganization({
        organization: ctreateTestOrganization({id: '12345'}),
      });
      const completion = new fromActions.FinishedNetworkRequestForOrganization('12345');
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateOrganization$).toBeObservable(expected);
      expect(messageService.showWarning).toHaveBeenCalledWith(getPreventDuplicateNameMessage('changed name'), 'resources.organization');
    });
  });

  describe('deleteOrganization$', () => {
    it('should dispatch FinishedNetworkRequestForOrganization', () => {
      const organization: Organization = { id: 'some uuid' } as any;
      const action = new fromActions.DeleteOrganization(organization);
      const completion = new NoOpAction();
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.deleteOrganization$).toBeObservable(expected);
    });

    it('should dispatch DecisionFailure if the service throws an error', () => {
      const organization: Organization = { id: 'some uuid' } as any;
      const error = new Error('some error');
      (service.delete as jasmine.Spy).and.returnValue(throwError(error));
      const action = new fromActions.DeleteOrganization(organization);
      const completion = new fromActions.OrganizationFailure({ error, id: 'some uuid' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.deleteOrganization$).toBeObservable(expected);
    });
  });

  describe('addRelatedObjectToOrganization$', () => {
    it('should dispatch FinishedNetworkRequestForOrganization', () => {
      const action = new fromActions.AddRelatedObjectToOrganization({
        sourceObject: ctreateTestOrganization({id: '12345'}),
        relatedObject: createTestBusinessObjective(),
        relationPath: ObjectRelationsNames.BusinessObjectives,
      });
      const completion = new fromActions.FinishedNetworkRequestForOrganization('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addRelatedObjectToOrganization$).toBeObservable(expected);
    });

    it('should dispatch OrganizationFailure if the service throws an error', () => {
      (service.addRelatedObject as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.AddRelatedObjectToOrganization({
        sourceObject: ctreateTestOrganization({id: '12345'}),
        relatedObject: createTestBusinessObjective(),
        relationPath: ObjectRelationsNames.BusinessObjectives,
      });
      const completion = new fromActions.OrganizationFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addRelatedObjectToOrganization$).toBeObservable(expected);
    });
  });

  describe('removeRelatedObjectFromOrganization$', () => {
    it('should dispatch FinishedNetworkRequestForOrganization', () => {
      const action = new fromActions.RemoveRelatedObjectFromOrganization({
        sourceObject: ctreateTestOrganization({id: '12345'}),
        relatedObject: createTestBusinessObjective(),
        relationPath: ObjectRelationsNames.BusinessObjectives,
      });
      const completion = new fromActions.FinishedNetworkRequestForOrganization('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removeRelatedObjectFromOrganization$).toBeObservable(expected);
    });

    it('should dispatch OrganizationFailure if the service throws an error', () => {
      (service.removeRelatedObject as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.RemoveRelatedObjectFromOrganization({
        sourceObject: ctreateTestOrganization({id: '12345'}),
        relatedObject: createTestBusinessObjective(),
        relationPath: ObjectRelationsNames.BusinessObjectives,
      });
      const completion = new fromActions.OrganizationFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removeRelatedObjectFromOrganization$).toBeObservable(expected);
    });
  });

  describe('loadOrganizationAsChild$', () => {
    it('should dispatch UpdateDecisionRelatedObject for update related Organzations', () => {
      const action = new fromActions.LoadOrganizationAsChild('12345');
      const completion = new fromActions.UpdateDecisionRelatedObject({object: { id: '12345' } as any, paths: [
        ObjectRelationsNames.OrganizationsOwnsDecisions,
        ObjectRelationsNames.OrganizationsMakesDecisions,
        ObjectRelationsNames.OrganizationsImpactedByDecisions,
      ]});
      const expected = cold('-(bcdef)', {
        b: completion,
        c: jasmine.anything(),
        d: jasmine.anything(),
        e: jasmine.anything(),
        f: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadOrganizationAsChild$).toBeObservable(expected);
    });

    it('should dispatch UpdateInputDataRelatedObject for update Organizations', () => {
      const action = new fromActions.LoadOrganizationAsChild('12345');
      const completion = new fromActions.UpdateInputDataRelatedObject({object: { id: '12345' } as any, paths: [ObjectRelationsNames.Organizations]});
      const expected = cold('-(bcdef)', {
        b: jasmine.anything(),
        c: completion,
        d: jasmine.anything(),
        e: jasmine.anything(),
        f: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });
      
      expect(effects.loadOrganizationAsChild$).toBeObservable(expected);
    });

    it('should dispatch UpdateKnowledgeSourceRelatedObject', () => {
      const action = new fromActions.LoadOrganizationAsChild('12345');
      const completion = new fromActions.UpdateKnowledgeSourceRelatedObject({object: { id: '12345' } as any, paths: [ObjectRelationsNames.Organizations]});
      const expected = cold('-(bcdef)', {
        b: jasmine.anything(),
        c: jasmine.anything(),
        d: completion,
        e: jasmine.anything(),
        f: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });
     
      expect(effects.loadOrganizationAsChild$).toBeObservable(expected);
    });

    it('should dispatch UpdateOrganizationRelatedObject', () => {
      const action = new fromActions.LoadOrganizationAsChild('12345');
      const completion = new fromActions.UpdateOrganizationRelatedObject({object: { id: '12345' } as any, paths: [
        ObjectRelationsNames.ParentOrganization,
        ObjectRelationsNames.ChildOrganizations,
      ]});
      const expected = cold('-(bcdef)', {
        b: jasmine.anything(),
        c: jasmine.anything(),
        d: jasmine.anything(),
        e: completion,
        f: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });
      
      expect(effects.loadOrganizationAsChild$).toBeObservable(expected);
    });

    it('should dispatch UpdateBusinessObjectiveRelatedObject', () => {
      const action = new fromActions.LoadOrganizationAsChild('12345');
      const completion = new fromActions.UpdateBusinessObjectiveRelatedObject({object: { id: '12345' } as any, paths: [ObjectRelationsNames.Organizations]});
      const expected = cold('-(bcdef)', {
        b: jasmine.anything(),
        c: jasmine.anything(),
        d: jasmine.anything(),
        e: jasmine.anything(),
        f: completion,
      });

      actions$.stream = hot('-a', { a: action });
      
      expect(effects.loadOrganizationAsChild$).toBeObservable(expected);
    });

    it('should dispatch OrganizationFailure if the service throws an error', () => {
      (service.getSingleMinimal as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.LoadOrganizationAsChild('12345');
      const completion = new fromActions.OrganizationFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadOrganizationAsChild$).toBeObservable(expected);
    });
  });

  describe('organizationFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const action = new fromActions.OrganizationFailure({
        error: new Error('error message'),
        id: 'some uuid',
      });
      const expected = cold('-b', { b: action });

      actions$.stream = hot('-a', { a: action });

      expect(effects.organizationsFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(new Error('error message'), 'resources.organization');
    });
  });

  describe('removePreviewOrganizationFromLocalMemory$', () => {
    it('should dispatch should dispatch RemoveOrganizationFromLocalMemory', () => {
      const action = new fromActions.RemovePreviewOrganizationFromLocalMemory('123');
      const completion = new fromActions.RemoveOrganizationFromLocalMemory('123');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removePreviewOrganizationFromLocalMemory$).toBeObservable(expected);
    });

    it('should dispatch should dispatch NoOpAction', () => {

      const action = new fromActions.RemovePreviewOrganizationFromLocalMemory('12345');
      const completion = new fromActions.NoOpAction();
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removePreviewOrganizationFromLocalMemory$).toBeObservable(expected);
    });
  });

  function ctreateTestOrganization(organization: {id: string}): Organization {
    return {   
      name: 'new name', 
      description: 'new description', 
      id: organization.id,
      _links: {
        self: {
          href: 'https://'
        },
        businessObjectives: {
          href: 'https://'
        },
      } as any,
    } as Organization;
  }

  function createTestBusinessObjective(): BusinessObjective {
    return {   
      name: 'new name', 
      description: 'new description', 
      id: 'some id',
      _links: {
        self: {
          href: 'https://'
        }
      } as any,
    } as BusinessObjective;
  }
});
