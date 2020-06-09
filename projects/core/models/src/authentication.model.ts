export interface LoginRequest {
  username: string;
  password: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface JwtPayload {
  accountInfo: {
    accountId: string;
    accountToken: string;
  },
  userData: {
    firstname: string;
    lastname: string;
    userId: string;
    email: string;
    usertype: string;
  },
  authData: {
    access_token: string;
    refresh_token: string;
    isAuthenticated: boolean;
    expires_in: number;
  },
  exp: number;
}

export interface ValidationSuccessResponse {
  encodedToken: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  expiresIn: number;
  email: string;
  userId: string;
  accountId: string;
  userType: string;
  redirectToUrl?: string;
}

export interface AuthenticatedUser {
  email: string;
  userType: string;
  userId: string;
  accountId: string;
  isAuthenticated: boolean;
}

export enum AuthError {
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  CANNOT_FIND_TOKEN = 'Can\'t renew token since there is no token to renew'
}
