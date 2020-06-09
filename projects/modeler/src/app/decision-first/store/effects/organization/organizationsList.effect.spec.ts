import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { blankPages } from 'core/models';
import { rootReducers } from 'core/root-store';
import { MessageService } from 'core/services';
import { FakeExternalService  } from 'core/testing'
import { FakeMessageService } from 'core/testing';
import { cold, hot } from 'jasmine-marbles';
import { of, throwError, EMPTY, Observable } from 'rxjs';
import { Organization } from '../../../models/organization.model';
import { OrganizationsService } from '../../../services';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions';
import * as fromOrganizationsListActions from '../../actions/organization/organizationsList.actions';
import * as fromReducers from '../../reducers';
import { IDecisionFirstState } from '../../reducers';
import * as fromEffects from './organizationsList.effect';

export class TestActions extends Actions {
  constructor() {
    super(EMPTY);
  }

  set stream(source: Observable<any>) {
    // tslint:disable-next-line
    this.source = source;
  }
}

const organizations: Organization[] = [{ id: 'org1' } as any, { id: 'org2' } as any];

export function getActions() {
  return new TestActions();
}

describe('Organizations List Effects', () => {
  let actions$: TestActions;
  let service: OrganizationsService;
  let effects: fromEffects.OrganizationsListEffects;
  let messageService: MessageService;
  let store: Store<IDecisionFirstState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        AngularHalModule,
        TestStoreModule,
      ],
      providers: [
        OrganizationsService,
        fromEffects.OrganizationsListEffects,
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: MessageService, useValue: new FakeMessageService() },
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(OrganizationsService);
    effects = TestBed.get(fromEffects.OrganizationsListEffects);
    messageService = TestBed.get(MessageService);
    store = TestBed.get(Store);

    spyOn(service, 'getSomeMinimalWithSearch').and.returnValue(of({ results: organizations, pagination: blankPages }));
    spyOn(service, 'getSingleMinimal').and.returnValue(of(organizations[0]));
    spyOn(service, 'getSingleEdit').and.returnValue(of(organizations[0]));
    spyOn(service, 'getByUrl').and.returnValue(of({ results: organizations, pagination: blankPages }));
    
    spyOn(messageService, 'handleError');
  });

  describe('updateSearchForOrganizations$', () => {
    it('should dispatch LoadOrganizationListSuccess', () => {
      const action = new fromActions.UpdateSearchForOrganizationsList();
      const completion = new fromOrganizationsListActions.LoadOrganizationsListSuccess({
        pagination: blankPages,
        results: organizations,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.updateSearchForOrganizations$).toBeObservable(expected);
    });

    it('should dispatch OrganizationFailure if the service throws an error', () => {
      (service.getSomeMinimalWithSearch as jasmine.Spy).and.returnValue(throwError('error message'));
      const action = new fromActions.UpdateSearchForOrganizationsList();
      const completion = new fromActions.OrganizationsListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.updateSearchForOrganizations$).toBeObservable(expected);
    });
  });

  describe('loadSpecificPageForOrganizationsList$', () => {
    it('should dispatch LoadOrganizationsListSuccess', () => {
      const action = new fromActions.LoadSpecificPageForOrganizationsList('https://example.com/43535');
      const completion = new fromActions.LoadOrganizationsListSuccess({
        pagination: blankPages,
        results: organizations,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSpecificPageForOrganizationsList$).toBeObservable(expected);
    });

    it('should dispatch OrganizationsListFailure if the service throws an error', () => {
      (service.getByUrl as jasmine.Spy).and.returnValue(throwError({ message: 'error message' }));
      const action = new fromActions.LoadSpecificPageForOrganizationsList('https://example.com/21345');
      const completion = new fromActions.OrganizationsListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSpecificPageForOrganizationsList$).toBeObservable(expected);
    });
  });

  describe('updateSearchForOrganizations$', () => {
    it('should dispatch LoadOrganizationListSuccess', () => {
      const action = new fromActions.UpdateSearchForOrganizationsList();
      const completion = new fromOrganizationsListActions.LoadOrganizationsListSuccess({
        pagination: blankPages,
        results: organizations,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.updateSearchForOrganizations$).toBeObservable(expected);
    });

    it('should dispatch OrganizationFailure if the service throws an error', () => {
      (service.getSomeMinimalWithSearch as jasmine.Spy).and.returnValue(throwError('error message'));
      const action = new fromActions.UpdateSearchForOrganizationsList();
      const completion = new fromActions.OrganizationsListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.updateSearchForOrganizations$).toBeObservable(expected);
    });
  });

  describe('loadSingleOrganizationForOrganizationList$', () => {
    it('should dispatch LoadSingleOrganizationForOrganizationsListSuccess', () => {
      const action = new fromActions.LoadSingleOrganizationForOrganizationsList('organization1');
      const completion = new fromOrganizationsListActions.LoadSingleOrganizationForOrganizationsListSuccess(
        organizations[0],
      );

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSingleOrganizationForOrganizationsList$).toBeObservable(expected);
    });

    it('should dispatch OrganizationFailure if the service throws an error', () => {
      (service.getSingleMinimal as jasmine.Spy).and.returnValue(throwError('error message'));
      const action = new fromActions.LoadSingleOrganizationForOrganizationsList('organization1');
      const completion = new fromActions.OrganizationsListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSingleOrganizationForOrganizationsList$).toBeObservable(expected);
    });
  });

  describe('organizationFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const error = new Error('error message');
      const action = new fromActions.OrganizationsListFailure(error);

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: action });

      expect(effects.organizationsListFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(
        new Error('error message'),
        'resources.organizationsList',
      );
    });
  });

  describe('loadOrganizationsList$', () => {
    it('should dispatch LoadSingleOrganizationForOrganizationsListSuccess', () => {
      const action = new fromActions.LoadOrganizationsList();
      const completion = new fromOrganizationsListActions.LoadOrganizationsListSuccess({
        pagination: blankPages,
        results: organizations,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadOrganizationsList$).toBeObservable(expected);
    });

    it('should dispatch OrganizationsListFailure if the service throws an error', () => {
      const error = new Error('some error');
      (service.getSomeMinimalWithSearch as jasmine.Spy).and.returnValue(throwError(error));
      const action = new fromActions.LoadOrganizationsList();
      const completion = new fromActions.OrganizationsListFailure(error);

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadOrganizationsList$).toBeObservable(expected);
    });
  });

  describe('loadOrganizationsList$', () => {
    it('should dispatch LoadSingleOrganizationForOrganizationsListSuccess', () => {
      const action = new fromActions.LoadOrganizationsList();
      const completion = new fromOrganizationsListActions.LoadOrganizationsListSuccess({
        pagination: blankPages,
        results: organizations,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadOrganizationsList$).toBeObservable(expected);
    });

    it('should dispatch OrganizationsListFailure if the service throws an error', () => {
      const error = new Error('some error');
      (service.getSomeMinimalWithSearch as jasmine.Spy).and.returnValue(throwError(error));
      const action = new fromActions.LoadOrganizationsList();
      const completion = new fromActions.OrganizationsListFailure(error);

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadOrganizationsList$).toBeObservable(expected);
    });
  });
});
