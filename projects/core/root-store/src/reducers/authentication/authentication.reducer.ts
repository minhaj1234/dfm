import { IActionMap } from 'core/models';
import * as fromActions from '../../actions/authentication/authentication.actions';

export interface IAuthenticationState {
  encodedToken: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  expiresIn: number;
  isReadOnlySession: boolean;
  email: string;
  userId: string;
  accountId: string;
  userType: string;
  authenticationInProgress?: boolean;
  forgotPasswordInProgress?: boolean;
  authenticationError?: boolean;
  authorizationError?: boolean;
}

export const initialState: IAuthenticationState = {
  encodedToken: '',
  accessToken: '',
  expiresAt: null,
  expiresIn: null,
  refreshToken: '',
  isReadOnlySession: false,
  email: null,
  userId: null,
  accountId: null,
  userType: null,
  authenticationInProgress: false,
  forgotPasswordInProgress: false,
  authenticationError: false,
  authorizationError: false
};

const actionMap: IActionMap<IAuthenticationState, fromActions.Auth0UserActions> = {
  [fromActions.VALIDATION_SUCCESS]: validationSuccess,
  [fromActions.START_VALIDATION]: startValidationHandler,
  [fromActions.VALIDATION_FAILURE]: validationFailureHandler,
  [fromActions.AUTHORIZATION_FAILURE]: authorizationFailureHandler,
  [fromActions.SET_IS_READ_ONLY_SESSION]: setIsReadOnlySessionHandler,
  [fromActions.LOGOUT_SUCCESS]: logoutSuccessHandler,
  [fromActions.FORGOT_PASSWORD]: forgotPasswordHandler,
  [fromActions.FORGOT_PASSWORD_FAILURE]: forgotPasswordFailureHandler,
  [fromActions.FORGOT_PASSWORD_SUCCESS]: forgotPasswordSuccessHandler,
};

export function reducer(state: IAuthenticationState = initialState, action: fromActions.Auth0UserActions): IAuthenticationState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function startValidationHandler(state: IAuthenticationState, action: fromActions.StartValidation): IAuthenticationState {
  return {
    ...state,
    authenticationError: false,
    authorizationError: false,
    authenticationInProgress: true,
  }
}

function validationSuccess(state: IAuthenticationState, action: fromActions.ValidationSuccess): IAuthenticationState {
  return {
    ...state,
    accessToken: action.payload.accessToken,
    expiresAt: action.payload.expiresAt,
    refreshToken: action.payload.refreshToken,
    email: action.payload.email,
    accountId: action.payload.accountId,
    encodedToken: action.payload.encodedToken,
    expiresIn: action.payload.expiresIn,
    userId: action.payload.userId,
    authenticationInProgress: false,
    authenticationError: false,
    authorizationError: false,
    userType: action.payload.userType
  };
}

function validationFailureHandler(state: IAuthenticationState, action: fromActions.ValidationFailure): IAuthenticationState {
  return {
    ...initialState,
    authenticationError: true,
    authenticationInProgress: false,
  };
}

function authorizationFailureHandler(state: IAuthenticationState, action: fromActions.AuthorizationFailure): IAuthenticationState {
  return {
    ...initialState,
    authorizationError: true,
    authenticationInProgress: false,
  };
}

function setIsReadOnlySessionHandler(
  state: IAuthenticationState,
  action: fromActions.SetIsReadOnlySession
): IAuthenticationState {
  return {
    ...state,
    isReadOnlySession: action.payload,
  }
}

function logoutSuccessHandler(state: IAuthenticationState, action: fromActions.LogoutSuccess): IAuthenticationState {
  return initialState;
}

function forgotPasswordHandler(
  state: IAuthenticationState,
  action: fromActions.ForgotPassword
): IAuthenticationState {
  return {
    ...state,
    forgotPasswordInProgress: true,
  }
}

function forgotPasswordFailureHandler(
  state: IAuthenticationState,
  action: fromActions.ForgotPasswordFailure
): IAuthenticationState {
  return {
    ...state,
    forgotPasswordInProgress: false,
  }
}

function forgotPasswordSuccessHandler(
  state: IAuthenticationState,
  action: fromActions.ForgotPasswordSuccess
): IAuthenticationState {
  return {
    ...state,
    forgotPasswordInProgress: false,
  }
}
