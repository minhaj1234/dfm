import { IActionMap } from 'core/models';
import * as fromActions from 'user-management/store/actions';

export interface IUserOwnProfileState {
  displayChangePassword: boolean;
  changePasswordError: boolean;
}

export const initialState: IUserOwnProfileState = {
  displayChangePassword: false,
  changePasswordError: false,
};

const actionMap: IActionMap<IUserOwnProfileState, fromActions.UserOwnProfileActions> = {
  [fromActions.OPEN_CHANGE_PASSWORD_FORM]: openChangePasswordFormHandler,
  [fromActions.CLOSE_CHANGE_PASSWORD_FORM]: closeChangePasswordFormHandler,
  [fromActions.CHANGE_PASSWORD_SUCCESS]: changePasswordSuccessHandler,
  [fromActions.CHANGE_PASSWORD_FAILURE]: ChangePasswordFailureHandler,
};

export function reducer(
  state: IUserOwnProfileState = initialState,
  action: fromActions.UserOwnProfileActions,
): IUserOwnProfileState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function openChangePasswordFormHandler(
  state: IUserOwnProfileState, 
  action: fromActions.OpenChangePasswordForm
): IUserOwnProfileState {
  return {
    ...state,
    displayChangePassword: true,
  };
}

function closeChangePasswordFormHandler(
  state: IUserOwnProfileState, 
  action: fromActions.CloseChangePasswordForm
): IUserOwnProfileState {
  return {
    ...state,
    displayChangePassword: false,
    changePasswordError: false,
  };
}

function changePasswordSuccessHandler(
  state: IUserOwnProfileState, 
  action: fromActions.ChangePasswordSuccess
): IUserOwnProfileState {
  return {
    ...state,
    displayChangePassword: false,
    changePasswordError: false,
  };
}

function ChangePasswordFailureHandler(
  state: IUserOwnProfileState, 
  action: fromActions.ChangePasswordFailure
): IUserOwnProfileState {
  return {
    ...state,
    changePasswordError: true,
  };
}
