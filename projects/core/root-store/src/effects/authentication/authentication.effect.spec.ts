import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { NbThemeModule, NbToastrModule, NbToastrService } from '@nebular/theme';
import { Actions } from '@ngrx/effects';
import { AngularHalModule } from 'angular4-hal';
import { WebAuth } from 'auth0-js';
import { MessageService } from 'core/services';
import { FakeMessageService, TestStoreModule } from 'core/testing';
import { createSpyFromClass } from 'jasmine-auto-spies';
import { cold, hot } from 'jasmine-marbles';
import { ExternalConfigurationService } from 'projects/admin/src/app/providers/externalConfigurationService.provider';
import { of, throwError, EMPTY, Observable } from 'rxjs';
import { UsersService } from 'user-management/services';
import * as fromActions from '../../actions/authentication/authentication.actions';
import { AuthService } from '../../services/auth/auth.service';
import * as fromEffects from './authentication.effect';

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

describe('Authentication Effects', () => {
  const someTimeInterval = 7200;
  let actions$: TestActions;
  let service: AuthService;
  let effects: fromEffects.UserEffects;
  let toastrService: NbToastrService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        AngularHalModule,
        NbThemeModule.forRoot(),
        NbToastrModule.forRoot(),
        RouterModule.forRoot([]),
        TestStoreModule,
      ],
      providers: [
        { provide: WebAuth, useValue: {} },
        AuthService,
        NbToastrService,
        fromEffects.UserEffects,
        { provide: Actions, useFactory: getActions },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: MessageService, useValue: new FakeMessageService() },
        { provide: 'ExternalConfigurationService', useValue: createSpyFromClass(ExternalConfigurationService)},
        { provide: 'userInfoProvider', userValue: createSpyFromClass(UsersService)}
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(AuthService);
    effects = TestBed.get(fromEffects.UserEffects);
    toastrService = TestBed.get(NbToastrService);
    router = TestBed.get(Router);

    spyOn(service, 'navigateToLogin').and.returnValue();
    spyOn(service, 'renewToken').and.returnValue();
    spyOn(service, 'logout').and.returnValue();
    spyOn(service, 'forgotPassword').and.returnValue(of({}));
    spyOn(service, 'handleAuthentication').and.returnValue(
      of({
        accessToken: 'accessToken',
        accountId: 'id',
        email: 'email',
        encodedToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwOi8vdGVzdC10ZXN0d3cuY29tL3RlbmFudElkIjoiZGVmYXVsdCIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ.qVgGfthtzcQBkJrkBE8CXgkCLrfIGQe9x7BK7ZmcrRY',
        expiresIn: 10,
        redirectToUrl: 'url',
        refreshToken: 'token',
        userId: 'id',
        expiresAt: new Date().getTime() + someTimeInterval,
        userType: 'ADMIN',
      }),
    );
    spyOn(toastrService, 'danger');
  });

  describe('startLogin$', () => {
    it('calls auth.login', () => {
      const action = new fromActions.StartLogin();

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: action });

      expect(effects.startLogin$).toBeObservable(expected);
      expect(service.renewToken).toHaveBeenCalled();
    });
  });

  describe('logout$', () => {
    it('calls auth.logout', () => {
      const action = new fromActions.Logout();

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: action });

      expect(effects.logout$).toBeObservable(expected);
      expect(service.logout).toHaveBeenCalled();
    });
  });

  describe('startValidation$', () => {
    
  });

  describe('validationFailure$', () => {
    
  });

  describe('validationSuccess$', () => {
    it('navigates to the correct url', () => {
      const action = new fromActions.ValidationSuccess({ redirectToUrl: '/blah' } as any);
      spyOn(router, 'navigateByUrl');

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: action });

      expect(effects.validationSuccess$).toBeObservable(expected);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/blah');
    });

    it('navigates to home if there is no state', () => {
      const action = new fromActions.ValidationSuccess({} as any);
      spyOn(router, 'navigateByUrl');

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: action });

      expect(effects.validationSuccess$).toBeObservable(expected);
      expect(router.navigateByUrl).toHaveBeenCalledWith('');
    });
  });

  describe('forgotPassword$', () => {
    it('should return ForgotPasswordSuccess', () => {
      const action = new fromActions.ForgotPassword('email');
      const completion = new fromActions.ForgotPasswordSuccess();

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.forgotPassword$).toBeObservable(expected);
    });

    it('should return ForgotPasswordFailure', () => {
      const error = new Error();
      (service.forgotPassword as jasmine.Spy).and.returnValue(throwError(error));
      const action = new fromActions.ForgotPassword('email');
      const completion = new fromActions.ForgotPasswordFailure(error);

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.forgotPassword$).toBeObservable(expected);
    });
  });
});
