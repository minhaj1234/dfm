import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ExternalService } from 'angular4-hal';
import { JwtPayload, LoginRequest, ValidationSuccessResponse } from 'core/models';
import { AuthError } from 'core/models';
import * as _jwtDecode from "jwt-decode";
import { merge, partition, throwError, timer, Observable, Subscription } from 'rxjs';
import { filter, first, map, switchMap, tap } from 'rxjs/operators';
import { LogoutSuccess, ValidationFailure, ValidationSuccess } from '../../actions';
import { authenticationReducer, IState } from '../../reducers';
import { getAuthenticationState } from '../../selectors';
import { IUserInfoProvider, USER_INFO_PROVIDER } from '../user-info-provider';
import { 
  AUTH_BASE_URL, 
  AUTH_LOGIN_URL, 
  AUTH_LOGOUT_URL, 
  AUTH_RENEW_URL, 
  FORGOT_PASSWORD, 
  IGNORE_AUTHENTICATION_TOKEN_HEADER_KEY, 
  IGNORE_AUTHENTICATION_TOKEN_HEADER_VALUE 
} from './auth.constants';

(window as any).global = window;

const jwtDecode = _jwtDecode;

const IGNORE_AUTHENTICATION_TOKEN_HEADERS = {
  headers: {
    [IGNORE_AUTHENTICATION_TOKEN_HEADER_KEY]: IGNORE_AUTHENTICATION_TOKEN_HEADER_VALUE
  }
}

@Injectable()
export class AuthService {
  refreshSub: Subscription;
  private http: HttpClient;

  constructor(
    private store: Store<IState>,
    private router: Router,
    external: ExternalService,
    @Inject(USER_INFO_PROVIDER)
    private userProvider: IUserInfoProvider
  ) {
    this.http = external.getHttp();
  }

  public handleAuthentication(request: LoginRequest = null): Observable<ValidationSuccessResponse> {
    const [savedUser$, noSavedUser$] = partition(this.store.select(getAuthenticationState)
      .pipe(
        first(),
        map(user => request ? null : user),
      ), (user) => user != null && user.encodedToken !== '');

    const existingToken$ = savedUser$;
    const newToken$ = this.doAuthorizationRequest(noSavedUser$, request);

    return merge(existingToken$, newToken$).pipe(
      first(),
    );
  }

  private doAuthorizationRequest(newUser$: Observable<authenticationReducer.IAuthenticationState>, request: LoginRequest) {
    return newUser$.pipe(
      tap(() => {
        if (!request) {
          this.navigateToLogin(this.router.url);
        }
      }),
      filter(() => request != null),
      switchMap(() => this.userProvider.getUserInfoByEmail(request.username)),
      switchMap((userInfo: { userId: string, accountId: string, accountDomains: string }) => {
        return this.http.post(`${AUTH_BASE_URL}${AUTH_LOGIN_URL}`, {
          domain: userInfo.accountDomains.split('\n')[0],
          userName: request.username,
          password: request.password
        }, IGNORE_AUTHENTICATION_TOKEN_HEADERS);
      }),
      map((response: any) => this.parseJwt(response))
    );
  }

  private parseJwt(response: any): ValidationSuccessResponse {
    const token = response.DFMJwtToken;
    const payload = <JwtPayload>jwtDecode(token);

    return <ValidationSuccessResponse>{
      encodedToken: token,
      accessToken: payload.authData.access_token,
      email: payload.userData.email,
      expiresIn: payload.authData.expires_in,
      expiresAt: payload.exp,
      accountId: payload.accountInfo.accountId,
      userType: payload.userData.usertype,
      refreshToken: payload.authData.refresh_token,
      userId: payload.userData.userId
    };
  }

  public logout(): void {
    this.unscheduleRenewal();
    this.removeAuthToken();
  }

  public removeAuthToken() {
    const url = `${AUTH_BASE_URL}${AUTH_LOGOUT_URL}`;

    this.http.delete(url).subscribe({
      next: () => {
        this.router.navigateByUrl('/loggedOut');
        this.store.dispatch(new LogoutSuccess());
      },
      error: () => {
        this.router.navigateByUrl('/loggedOut');
      }
    });
  }

  public navigateToLogin(state: string): void {
    this.router.navigateByUrl('/login', { queryParams: { state } });
  }

  public scheduleRenewal(expiresAt: number) {
    this.unscheduleRenewal();
    const expiresIn$ = timer(Math.max(1, expiresAt * 1000 - Date.now()));

    this.refreshSub = expiresIn$.subscribe(() => {
      this.unscheduleRenewal();
      this.renewToken(null);
    });
  }

  public renewToken(state = '/'): void {
    const url = `${AUTH_BASE_URL}${AUTH_RENEW_URL}`;
    this.store.select(getAuthenticationState).pipe(
      first(),
      switchMap(user => {
        if (user && user.authorizationError) {
          return throwError(new Error(AuthError.AUTHORIZATION_ERROR));
        }
        if (!user || !user.encodedToken) {
          return throwError(new Error(AuthError.CANNOT_FIND_TOKEN));
        }

        return this.http.get(url, {
          headers: {
            'authToken': user.encodedToken,
            [IGNORE_AUTHENTICATION_TOKEN_HEADER_KEY]: IGNORE_AUTHENTICATION_TOKEN_HEADER_VALUE
          }
        });
      }),
      map((response: any) => this.parseJwt(response)),
      map((response: ValidationSuccessResponse) => ({ ...response, redirectToUrl: state })),
    ).subscribe({
      next: (user) => {
        this.store.dispatch(new ValidationSuccess(user));
      },
      error: (error) => {
        if (error.message !== AuthError.AUTHORIZATION_ERROR) {
          this.store.dispatch(new ValidationFailure(error));
        }
        this.navigateToLogin(state);
      }
    });
  }

  public unscheduleRenewal() {
    if (this.refreshSub) {
      this.refreshSub.unsubscribe();
    }
  }

  public forgotPassword(email: string): Observable<Object> {
    return this.http
      .post(`${AUTH_BASE_URL}${FORGOT_PASSWORD}`, { email }, IGNORE_AUTHENTICATION_TOKEN_HEADERS)
  }
}
