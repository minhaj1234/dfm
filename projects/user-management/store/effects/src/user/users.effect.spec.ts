import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { Actions } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { rootReducers } from 'core/root-store';
import { APP_CONFIG, MessageService } from 'core/services';
import { FakeExternalService, FakeMessageService, FakeToastrService  } from 'core/testing'
import { cold, hot } from 'jasmine-marbles';
import { of, throwError, EMPTY, Observable } from 'rxjs';
import { User, USER_MANAGEMENT_OBJECTS } from 'user-management/models';
import { UsersService } from 'user-management/services';
import * as fromActions from 'user-management/store/actions';
import * as fromEffects from './users.effect';

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

describe('Users Effects', () => {
  let actions$: TestActions;
  let service: UsersService;
  let effects: fromEffects.UsersEffects;
  let toastrService: NbToastrService;
  const config = { pageSize: 10 };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AngularHalModule, StoreModule.forRoot(rootReducers.reducers)],
      providers: [
        UsersService,
        fromEffects.UsersEffects,
        NbToastrService,
        { provide: APP_CONFIG, useFactory: () => config },
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: NbToastrService, useValue: new FakeToastrService() },
        { provide: MessageService, useValue: new FakeMessageService(),}
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(UsersService);
    effects = TestBed.get(fromEffects.UsersEffects);
    toastrService = TestBed.get(NbToastrService);

    spyOn(service, 'getSingleMinimal').and.returnValue(of({ id: '12345' } as any));
    spyOn(service, 'getSingleEdit').and.returnValue(of({ id: '12345' } as any));
    spyOn(service, 'create').and.returnValue(of({} as any));
    spyOn(service, 'patch').and.returnValue(of({} as any));
    spyOn(service, 'delete').and.returnValue(of({}));
    spyOn(service, 'withRelatedObjects').and.returnValue(of({ id: '12345' } as any));
    spyOn(service, 'createUser').and.returnValue(of({}));
  });

  describe('loadUser$', () => {
    it('should dispatch LoadUserSuccess', () => {
      const action = new fromActions.LoadUser('12345');
      const completion = new fromActions.LoadUserSuccess({ id: '12345' } as any);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadUser$).toBeObservable(expected);
    });

    it('should dispatch UserFailure if the service throws an error', () => {
      (service.getSingleEdit as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.LoadUser('12345');
      const completion = new fromActions.UserFailure({
        id: '12345',
        error: new Error('error message'),
      });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadUser$).toBeObservable(expected);
    });
  });

  describe('addUser$', () => {
    it('should dispatch FinishedGenericNetworkRequestForUser', () => {
      const action = new fromActions.AddUser({
        user: createTestUser(),
        accountId: 'abc'
      });
      const completion = new fromActions.FinishedGenericNetworkRequestForUser();
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addUser$).toBeObservable(expected);
    });

    it('should dispatch GenericUserFailure if the service throws an error', () => {
      (service.createUser as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.AddUser({
        user: createTestUser(),
        accountId: 'abc'
      });
      const completion = new fromActions.GenericUserFailure(new Error('error message'));
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addUser$).toBeObservable(expected);
    });
  });

  describe('updateUser$', () => {
    it('should dispatch FinishedNetworkRequestForUser', () => {
      const action = new fromActions.UpdateUser(createTestUser());
      const completion = new fromActions.FinishedNetworkRequestForUser('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateUser$).toBeObservable(expected);
    });

    it('should dispatch UserFailure if the service throws an error', () => {
      (service.patch as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.UpdateUser(createTestUser());
      const completion = new fromActions.UserFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateUser$).toBeObservable(expected);
    });
  });

  describe('loadUserAsChild$', () => {
    it('should dispatch UpdateRelatedObjectInCustomer', () => {
      const action = new fromActions.LoadUserAsChild('12345');
      const completion = new fromActions.UpdateRelatedObjectInCustomer({object: {id: '12345'} as User, paths: [USER_MANAGEMENT_OBJECTS.User.resourceName]});
      const expected = cold('-(bc)', { 
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadUserAsChild$).toBeObservable(expected);
    });

    it('should dispatch UpdateRelatedObjectInGroup', () => {
      const action = new fromActions.LoadUserAsChild('12345');
      const completion = new fromActions.UpdateRelatedObjectInGroup({object: {id: '12345'} as User, paths: [USER_MANAGEMENT_OBJECTS.User.resourceName]});
      const expected = cold('-(bc)', { 
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadUserAsChild$).toBeObservable(expected);
    });

    it('should dispatch UserFailure if the service throws an error', () => {
      (service.getSingleMinimal as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.LoadUserAsChild('12345');
      const completion = new fromActions.UserFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadUserAsChild$).toBeObservable(expected);
    });
  });

  function createTestUser(): User {
    const user = new User();
    user.id = '12345';
    user.firstName = 'user firstname';
    user.lastName = 'user lastname';
    user.email = 'email';

    return user;
  }
});
