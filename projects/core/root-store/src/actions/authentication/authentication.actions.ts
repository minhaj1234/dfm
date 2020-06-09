import { Action } from '@ngrx/store';
import { LoginRequest, ValidationSuccessResponse } from 'core/models';

export const START_LOGIN = '[AUTH] Start Login';
export const START_VALIDATION = '[AUTH] Start Validation';
export const VALIDATION_SUCCESS = '[AUTH] Validation Success';
export const VALIDATION_FAILURE = '[AUTH] Validation Failure';
export const AUTHORIZATION_FAILURE = '[AUTH] Authorization Failure';
export const SET_IS_READ_ONLY_SESSION = '[AUTH] Set Is Read Only';
export const LOGOUT = '[AUTH] Logout';
export const LOGOUT_SUCCESS = '[AUTH] Logout Success';
export const FORGOT_PASSWORD = '[AUTH] Forgot Password';
export const FORGOT_PASSWORD_SUCCESS = '[AUTH] Forgot Password Success';
export const FORGOT_PASSWORD_FAILURE = '[AUTH] Forgot Password Failure';

export class StartLogin implements Action {
  readonly type = START_LOGIN;
}

export class StartValidation implements Action {
  readonly type = START_VALIDATION;
  constructor(public payload: LoginRequest = null) { }
}

export class ValidationSuccess implements Action {
  readonly type = VALIDATION_SUCCESS;
  constructor(public payload: ValidationSuccessResponse) { }
}

export class ValidationFailure implements Action {
  readonly type = VALIDATION_FAILURE;
  constructor(public payload: Error) { }
}

export class AuthorizationFailure implements Action {
  readonly type = AUTHORIZATION_FAILURE;
  constructor(public payload: Error) { }
}

export class SetIsReadOnlySession implements Action {
  readonly type = SET_IS_READ_ONLY_SESSION;
  constructor(public payload: boolean) { }
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LogoutSuccess implements Action {
  readonly type = LOGOUT_SUCCESS;
}

export class ForgotPassword implements Action {
  readonly type = FORGOT_PASSWORD;
  constructor(public payload: string) { }
}

export class ForgotPasswordSuccess implements Action {
  readonly type = FORGOT_PASSWORD_SUCCESS;
}

export class ForgotPasswordFailure implements Action {
  readonly type = FORGOT_PASSWORD_FAILURE;
  constructor(public payload: Error) { }
}

export type Auth0UserActions =
  | StartLogin
  | StartValidation
  | ValidationSuccess
  | ValidationFailure
  | AuthorizationFailure
  | SetIsReadOnlySession
  | Logout
  | LogoutSuccess
  | ForgotPassword
  | ForgotPasswordSuccess
  | ForgotPasswordFailure;
