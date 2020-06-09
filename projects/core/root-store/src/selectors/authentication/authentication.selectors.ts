import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthenticatedUser } from 'core/models';
import * as fromUser from '../../reducers/authentication/authentication.reducer';

export const getAuthenticationState = createFeatureSelector<fromUser.IAuthenticationState>('authentication');

export const getIsAuthorized = createSelector(getAuthenticationState, (state) => {
  return (!state.expiresAt || new Date().getTime() < state.expiresAt * 1000) && state.encodedToken !== '';
});

export const getAccessToken = createSelector(
  getAuthenticationState,
  state => state.accessToken
);

export const getEncodedToken = createSelector(
  getAuthenticationState,
  state => state.encodedToken
);

export const getIsReadOnlySession = createSelector(
  getAuthenticationState,
  state => state.isReadOnlySession
);

export const getAuthenticatedUser = createSelector(
  getAuthenticationState,
  state => (<AuthenticatedUser>{
    email: state.email,
    userType: state.userType,
    userId: state.userId,
    accountId: state.accountId,
    isAuthenticated: state.userId != null
  })
);

export const getAuthenticatedUserId = createSelector(
  getAuthenticatedUser,
  user => user.userId
);

export const getAuthenticatedUserType = createSelector(
  getAuthenticatedUser,
  user => user.userType
);