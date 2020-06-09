import { async, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { ValidationSuccessResponse } from 'core/models';
import { rootActions, rootReducers } from 'core/root-store';
import { APP_CONFIG } from 'core/services';
import { TestStoreModule } from 'core/testing';
import { AuthStompService } from './auth-stomp.service';

describe('Auth Stomp Service', () => {
  const config = {};
  let service: AuthStompService;
  let store: Store<rootReducers.IState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
     ],
      providers: [
        AuthStompService,
        { provide: APP_CONFIG, useFactory: () => config },
      ],
    });
    service = TestBed.get(AuthStompService);
    store = TestBed.get(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('connects with the access token when it is passed in', async(() => {
    spyOn(service, 'initAndConnect');

    store.dispatch(new rootActions.ValidationSuccess(getTestValidationSuccessResponse()));

    expect(service.initAndConnect).toHaveBeenCalled();
  }));

  it('disconnects if connected and the access token is blank (logged out)', () => {
    spyOn(service, 'initAndConnect');
    store.dispatch(new rootActions.ValidationSuccess(getTestValidationSuccessResponse()));
    spyOn(service, 'connected').and.returnValue(true);
    spyOn(service, 'disconnect');
    
    store.dispatch(new rootActions.LogoutSuccess());
    
    expect(service.disconnect).toHaveBeenCalled();
  });

  it('does nothing if the access token is blank and the service is already disconnected', () => {
    spyOn(service, 'initAndConnect');
    store.dispatch(new rootActions.ValidationSuccess(getTestValidationSuccessResponse()));
    spyOn(service, 'connected').and.returnValue(false);
    spyOn(service, 'disconnect');
    
    store.dispatch(new rootActions.Logout());
    
    expect(service.disconnect).not.toHaveBeenCalled();
  });

  describe('onDestroy', () => {
    it('unsubscribes', () => {
      spyOn(service.subscriptions[0], 'unsubscribe');
     
      service.ngOnDestroy();
      
      expect(service.subscriptions[0].unsubscribe).toHaveBeenCalled();
    });
  });

  function getTestValidationSuccessResponse(): ValidationSuccessResponse {
    return {
      accessToken: 'accessToken',
      expiresAt: +new Date().toUTCString(),
      accountId: 'id',
      email: 'email',
      encodedToken: 'token',
      expiresIn: 10,
      redirectToUrl: 'url',
      refreshToken: 'token',
      userId: 'id',
      userType: 'ADMIN',
    };
  }
});
