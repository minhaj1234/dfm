import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createFeatureSelector, select, Store } from '@ngrx/store';
import { AuthenticatedUser } from 'core/models';
import { rootReducers, rootSelectors, IGNORE_AUTHENTICATION_TOKEN_HEADER_KEY } from 'core/root-store';
import { Observable } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
  private accessToken: string;
  private authenticatedUser$: Observable<AuthenticatedUser>;

  constructor(private store: Store<rootReducers.IState>) {
    this.store
      .pipe(select(rootSelectors.getEncodedToken))
      .subscribe((accessToken) => (this.accessToken = accessToken));

    this.authenticatedUser$ = this.store
      .pipe(select(rootSelectors.getAuthenticatedUser));
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isExternalRequest(request) && this.requestRequiresAuthentication(request)) {
      return this.authenticatedUser$.pipe(
        first(current => current && current.isAuthenticated),
        switchMap(current => next.handle(this.extendRequestWithUserInfo(request, current)))
      );
    } else {
      return next.handle(request);
    }
  }

  private extendRequestWithUserInfo(request: HttpRequest<any>, userInfo: AuthenticatedUser): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        authToken: `${this.accessToken}`,
        userId: userInfo.userId,
        accountId: userInfo.accountId
      },
    });
  }

  private isExternalRequest(request: HttpRequest<any>): boolean {
    return request.url.startsWith('http');
  }

  private requestRequiresAuthentication(request: HttpRequest<any>): boolean {
    return !request.headers.has(IGNORE_AUTHENTICATION_TOKEN_HEADER_KEY);
  }
}
