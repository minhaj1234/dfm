import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { rootReducers } from 'core/root-store';
import { APP_CONFIG, MessageService } from 'core/services';
import { FakeExternalService, FakeMessageService  } from 'core/testing'
import { cold, hot } from 'jasmine-marbles';
import { of, throwError, EMPTY, Observable } from 'rxjs';
import { UsersService } from 'user-management/services';
import * as fromActions from 'user-management/store/actions';
import * as fromEffects from './user-own-profile.effect';

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

describe('Users Own Profile Effects', () => {
  let actions$: TestActions;
  let service: UsersService;
  let effects: fromEffects.UserOwnProfileEffects;
  let messageService: MessageService;
  const config = { pageSize: 10 };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AngularHalModule, StoreModule.forRoot(rootReducers.reducers)],
      providers: [
        UsersService,
        fromEffects.UserOwnProfileEffects,
        { provide: APP_CONFIG, useFactory: () => config },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: Actions, useFactory: getActions },
        { provide: MessageService, useValue: new FakeMessageService() }
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(UsersService);
    effects = TestBed.get(fromEffects.UserOwnProfileEffects);
    messageService = TestBed.get(MessageService);

    spyOn(messageService, 'showSuccess');
    spyOn(service, 'changePassword').and.returnValue(of({ } as any));
  });

  describe('changePassword$', () => {
    it('should dispatch ChangePasswordSuccess', () => {
      const action = new fromActions.ChangePassword({oldPassword: 'oldPassword', newPassword: 'newPassword'});
      const completion = new fromActions.ChangePasswordSuccess();
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.changePassword$).toBeObservable(expected);
    });

    it('should dispatch UserFailure if the service throws an error', () => {
      (service.changePassword as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.ChangePassword({oldPassword: 'oldPassword', newPassword: 'newPassword'});
      const completion = new fromActions.ChangePasswordFailure(new Error('error message'));

      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.changePassword$).toBeObservable(expected);
    });
  });

  describe('ChangePasswordSuccess$', () => {
    it('should dispatch ChangePasswordSuccess', () => {
      const action = new fromActions.ChangePasswordSuccess();
      const expected = cold('-b', { b: action });

      actions$.stream = hot('-a', { a: action });

      expect(effects.changePasswordSuccess$).toBeObservable(expected);
      expect(messageService.showSuccess).toHaveBeenCalledWith(['resources.passwordWasChangedSuccessfully'], 'resources.changePassword');
    });
  });
});
