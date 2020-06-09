import * as fromActions from 'user-management/store/actions';
import * as fromUserOwnProfile from './user-own-profile.reducer';

describe('Users OwnProfile Reducer', () => {
  describe(`${fromActions.OpenChangePasswordForm} action`, () => {
    it('should have displayChangePassword be true', () => {
      const { initialState } = fromUserOwnProfile;
      const action = new fromActions.OpenChangePasswordForm();

      const state = fromUserOwnProfile.reducer(initialState, action);

      expect(state).toEqual({displayChangePassword: true, changePasswordError: false}); 
    });
  });

  describe(`${fromActions.CloseChangePasswordForm} action`, () => {
    it('should have displayChangePassword be false', () => {
      const { initialState } = fromUserOwnProfile;
      const currentState = { 
        ...initialState,
        displayChangePassword: true
      };
      const action = new fromActions.CloseChangePasswordForm();

      const state = fromUserOwnProfile.reducer(currentState, action);

      expect(state).toEqual({displayChangePassword: false, changePasswordError: false}); 
    });
  });

  describe(`${fromActions.ChangePasswordSuccess} action`, () => {
    it('should have displayChangePassword be false', () => {
      const { initialState } = fromUserOwnProfile;
      const currentState = { 
        ...initialState,
        displayChangePassword: true
      };
      const action = new fromActions.ChangePasswordSuccess();

      const state = fromUserOwnProfile.reducer(currentState, action);

      expect(state).toEqual({displayChangePassword: false, changePasswordError: false}); 
    });
  });

  describe(`${fromActions.ChangePasswordFailure} action`, () => {
    it('should have changePasswordError be true', () => {
      const { initialState } = fromUserOwnProfile;
      const currentState = { 
        ...initialState,
      };
      const action = new fromActions.ChangePasswordFailure(new Error());

      const state = fromUserOwnProfile.reducer(currentState, action);

      expect(state).toEqual({displayChangePassword: false, changePasswordError: true}); 
    });
  });
});
