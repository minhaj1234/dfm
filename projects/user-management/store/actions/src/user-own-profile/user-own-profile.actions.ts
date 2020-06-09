import { Action } from '@ngrx/store';
import { ChangePasswordRequest } from 'core/models';

export const OPEN_CHANGE_PASSWORD_FORM = '[ADMIN] Open Change Password Form';
export const CLOSE_CHANGE_PASSWORD_FORM = '[ADMIN] Close Change Password Form';
export const CHANGE_PASSWORD = '[ADMIN] Change Password';
export const CHANGE_PASSWORD_SUCCESS = '[ADMIN] Change Password Success';
export const CHANGE_PASSWORD_FAILURE = '[ADMIN] Change Password Failure';

export class OpenChangePasswordForm implements Action {
  readonly type = OPEN_CHANGE_PASSWORD_FORM;
}

export class CloseChangePasswordForm implements Action {
  readonly type = CLOSE_CHANGE_PASSWORD_FORM;
}

export class ChangePassword implements Action {
  readonly type = CHANGE_PASSWORD;
  constructor(public payload: ChangePasswordRequest) {}
}

export class ChangePasswordSuccess implements Action {
  readonly type = CHANGE_PASSWORD_SUCCESS;
}

export class ChangePasswordFailure implements Action {
  readonly type = CHANGE_PASSWORD_FAILURE;
  constructor(public payload: Error) {}
}

export type UserOwnProfileActions = 
  | OpenChangePasswordForm
  | CloseChangePasswordForm
  | ChangePassword
  | ChangePasswordSuccess
  | ChangePasswordFailure;
