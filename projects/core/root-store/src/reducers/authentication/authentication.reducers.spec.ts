import { ValidationSuccessResponse } from 'core/models';
import { rootReducers } from 'core/root-store';
import * as fromActions from '../../actions/authentication/authentication.actions';
import * as fromUser from './authentication.reducer';

describe('Authentication Reducer', () => {
  const someTimeInterval = 7200;

  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromUser;
      const action = {} as any;

      const state = fromUser.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('validationSuccess', () => {
    it('should add the user information to the state', () => {
      const date = new Date().getTime() + someTimeInterval;

      const { initialState } = fromUser;
      const action = new fromActions.ValidationSuccess({
        ...getTestVAlidationSuccessResponce(),
        expiresAt: date,
      });

      const state = fromUser.reducer(initialState, action);

      expect(state).toEqual(<rootReducers.authenticationReducer.IAuthenticationState>{
        accessToken: 'accessToken',
        expiresAt: date,
        isReadOnlySession: false,
        email: 'email',
        accountId: 'id',
        encodedToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwOi8vdGVzdC10ZXN0d3cuY29tL3RlbmFudElkIjoiZGVmYXVsdCIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ.qVgGfthtzcQBkJrkBE8CXgkCLrfIGQe9x7BK7ZmcrRY',
        expiresIn: 10,
        refreshToken: 'token',
        userId: 'id',
        authenticationInProgress: false,
        forgotPasswordInProgress: false,
        authenticationError: false,
        authorizationError: false,
        userType: 'ADMIN',
      });
    });
  });

  describe('validation failure', () => {
    it('removes the user information', () => {
      const { initialState } = fromUser;
      const setupAction = new fromActions.ValidationSuccess(getTestVAlidationSuccessResponce());
      const stateWithUserInfo = fromUser.reducer(initialState, setupAction);

      const action = new fromActions.ValidationFailure(new Error('some error'));

      const state = fromUser.reducer(stateWithUserInfo, action);

      expect(state).toEqual({
        ...initialState,
        authenticationError: true,
      });
    });
  });

  describe('LogoutSuccess', () => {
    it('removes the user information', () => {
      const { initialState } = fromUser;
      const setupAction = new fromActions.ValidationSuccess(getTestVAlidationSuccessResponce());
      const stateWithUserInfo = fromUser.reducer(initialState, setupAction);

      const action = new fromActions.LogoutSuccess();

      const state = fromUser.reducer(stateWithUserInfo, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('ForgotPassword', () => {
    it('should set forgotPasswordInProgress to true', () => {
      const { initialState } = fromUser;
      const action = new fromActions.ForgotPassword('email');
      
      const state = fromUser.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        forgotPasswordInProgress: true
      });
    });
  });

  describe('ForgotPasswordFailure', () => {
    it('should set forgotPasswordInProgress to false', () => {
      const { initialState } = fromUser;
      const action = new fromActions.ForgotPasswordFailure(new Error());
      
      const state = fromUser.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        forgotPasswordInProgress: false
      });
    });
  });

  
  describe('ForgotPasswordSuccess', () => {
    it('should set forgotPasswordInProgress to false', () => {
      const { initialState } = fromUser;
      const action = new fromActions.ForgotPasswordSuccess();
      
      const state = fromUser.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        forgotPasswordInProgress: false
      });
    });
  });

  function getTestVAlidationSuccessResponce(): ValidationSuccessResponse {
    return {
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
    };
  }
});
