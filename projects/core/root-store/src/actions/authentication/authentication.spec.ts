import * as userActions from './authentication.actions';

describe('Authentication Actions', () => {
  const someTimeInterval = 7200;

  describe('StartLogin', () => {
    it('should create an action', () => {
      const action = new userActions.StartLogin();

      expect({ ...action }).toEqual({
        type: userActions.START_LOGIN,
      });
    });
  });

  describe('StartValidation', () => {
    it('should create an action', () => {
      const action = new userActions.StartValidation();

      expect({ ...action }).toEqual({
        type: userActions.START_VALIDATION,
        payload: null
      });
    });
  });

  describe('ValidationSuccess', () => {
    it('should create an action', () => {
      const payload = {
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

      const action = new userActions.ValidationSuccess(payload);

      expect({ ...action }).toEqual({
        payload,
        type: userActions.VALIDATION_SUCCESS,
      });
    });
  });

  describe('ValidationFailure', () => {
    it('should create an action', () => {
      const payload = new Error('error message');

      const action = new userActions.ValidationFailure(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: userActions.VALIDATION_FAILURE,
      });
    });
  });

  describe('Logout', () => {
    it('should create an action', () => {
      const action = new userActions.Logout();

      expect({ ...action }).toEqual({
        type: userActions.LOGOUT,
      });
    });
  });

  describe('ForgotPassword', () => {
    it('should create an action', () => {
      const payload = 'email';

      const action = new userActions.ForgotPassword(payload);

      expect({ ...action }).toEqual({
        payload,
        type: userActions.FORGOT_PASSWORD,
      });
    });
  });

  describe('ForgotPasswordSuccess', () => {
    it('should create an action', () => {
      const action = new userActions.ForgotPasswordSuccess();

      expect({ ...action }).toEqual({
        type: userActions.FORGOT_PASSWORD_SUCCESS,
      });
    });
  });

  describe('ForgotPasswordFailure', () => {
    it('should create an action', () => {
      const payload = new Error();

      const action = new userActions.ForgotPasswordFailure(payload);

      expect({ ...action }).toEqual({
        payload,
        type: userActions.FORGOT_PASSWORD_FAILURE,
      });
    });
  });
});
