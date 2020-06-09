import { ChangePasswordRequest } from 'core/models';
import * as usersActions from './user-own-profile.actions';

describe('User Own Profile Actions', () => {
  describe('Open Change Password Form', () => {
    it('should create an action', () => {
      const action = new usersActions.OpenChangePasswordForm();

      expect({ ...action }).toEqual({
        type: usersActions.OPEN_CHANGE_PASSWORD_FORM,
      });
    });
  });

  describe('Close Change Password Form', () => {
    it('should create an action', () => {
      const action = new usersActions.CloseChangePasswordForm();

      expect({ ...action }).toEqual({
        type: usersActions.CLOSE_CHANGE_PASSWORD_FORM,
      });
    });
  });

  describe('Change Password', () => {
    it('should create an action', () => {
      const payload: ChangePasswordRequest = {
        oldPassword: 'oldPassword',
        newPassword: 'newPassword',
      };
    
      const action = new usersActions.ChangePassword(payload);

      expect({ ...action }).toEqual({
        payload,
        type: usersActions.CHANGE_PASSWORD,
      });
    });
  });

  describe('Change Password Success', () => {
    it('should create an action', () => {
      const action = new usersActions.ChangePasswordSuccess();

      expect({ ...action }).toEqual({
        type: usersActions.CHANGE_PASSWORD_SUCCESS,
      });
    });
  });

  describe('Change assword Failure', () => {
    it('should create an action', () => {
      const payload = new Error();

      const action = new usersActions.ChangePasswordFailure(payload);

      expect({ ...action }).toEqual({
        payload,
        type: usersActions.CHANGE_PASSWORD_FAILURE,
      });
    });
  });
});
