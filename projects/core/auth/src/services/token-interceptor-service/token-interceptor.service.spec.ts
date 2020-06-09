import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing'
import { rootActions, rootReducers } from 'core/root-store';
import { createSpyFromClass, Spy } from 'jasmine-auto-spies';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { of, Observable } from 'rxjs';
import { TokenInterceptorService } from './token-interceptor.service';

class RequestType extends HttpRequest<any> { }
class HandlerType extends HttpHandler {
  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return of(null);
  }
}
interface MockState {
  authentication: Partial<rootReducers.authenticationReducer.IAuthenticationState>,
}

describe('TokenInterceptorService', () => {
  const initialState: MockState = {
    authentication: {
      accessToken: 'testToken'
    },
  }
  const testRequestResult = 'result';
  const testUserId = 'testuserid';
  const testAccountId = 'testAccountId';
  const authenticationHeader = 'authToken';
  const userIdHeader = 'userId';
  const accountIdHeader = 'accountId';

  let service: TokenInterceptorService;
  let store: MockStore<MockState>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      providers: [TokenInterceptorService, provideMockStore({ initialState })],
    });
    service = TestBed.get(TokenInterceptorService);
    store = TestBed.get(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe(`intercept`, () => {
    describe(`Given the HTTP request, and auth token in store`, () => {
      let request: RequestType;
      let next: Spy<HandlerType>;
      beforeEach(() => {
        request = new RequestType("GET", "");
        next = createSpyFromClass(HandlerType);
        next.handle.and.returnValue(of(testRequestResult));
      });

      describe(`When it is not the external request`, () => {
        beforeEach(() => {
          request = request.clone({ url: '/assets/something' });
        });

        assertCases_RequestCompletedWithoutUserInfo();
      });

      describe(`When no authorization is required for this request and a correcponding header is present`, () => {
        beforeEach(() => {
          request = request.clone({ url: 'http://fakeapi.com/api/resource', setHeaders: { 'no-auth': 'no-auth' } });
        });

        assertCases_RequestCompletedWithoutUserInfo();
      });

      describe(`When it is a routine request to the API`, () => {
        beforeEach(() => {
          request = request.clone({ url: 'http://fakeapi.com/api/resource' });
        });

        it(`should not complete the request before user info is in store`, () => {
          const requestResult = service.intercept(request, next);

          expect(next.handle).not.toHaveBeenCalled();
        });

        it(`should wait for user info and then complete the request`, () => {
          const expected = cold('(a|)', { a: testRequestResult });

          const requestResult = service.intercept(request, next);
          emulateUserAuthorized();

          expect(requestResult).toBeObservable(expected);
        });

        it(`should append Authentication header with the current token`, (done) => {
          emulateUserAuthorized();

          const requestResult = service.intercept(request, next);

          requestResult.subscribe(x => {
            const transformedRequest: RequestType = next.handle.calls.mostRecent().args[0];
            expect(transformedRequest.headers.has(authenticationHeader)).toBeTruthy();
            done();
          });
        });

        it(`should append user info headers`, (done) => {
          emulateUserAuthorized();

          const requestResult = service.intercept(request, next);

          requestResult.subscribe(x => {
            const transformedRequest: RequestType = next.handle.calls.mostRecent().args[0];
            expect(transformedRequest.headers.has(userIdHeader)).toBeTruthy();
            expect(transformedRequest.headers.get(userIdHeader)).toEqual(testUserId);
            expect(transformedRequest.headers.has(accountIdHeader)).toBeTruthy();
            expect(transformedRequest.headers.get(accountIdHeader)).toEqual(testAccountId);
            done();
          });
        });
      });

      function assertCases_RequestCompletedWithoutUserInfo() {
        it(`should complete the request without user info available`, () => {
          const expected = cold('(a|)', { a: testRequestResult });

          const requestResult = service.intercept(request, next);

          expect(requestResult).toBeObservable(expected);
        });

        it(`should not append Authentication header`, () => {
          const requestResult = service.intercept(request, next);

          const transformedRequest: RequestType = next.handle.calls.mostRecent().args[0];
          expect(transformedRequest.headers.has(authenticationHeader)).toBeFalsy();
        });

        it(`should not append user info headers`, () => {
          const requestResult = service.intercept(request, next);

          const transformedRequest: RequestType = next.handle.calls.mostRecent().args[0];
          expect(transformedRequest.headers.has(userIdHeader)).toBeFalsy();
          expect(transformedRequest.headers.has(accountIdHeader)).toBeFalsy();
        });
      }

      function emulateUserAuthorized() {
        store.setState({
          ...initialState,
          authentication: {
            ...initialState.authentication,
            accountId: testAccountId,
            userId: testUserId
          }
        });
        store.setState({
          ...initialState,
          authentication: {
            ...initialState.authentication,
            accountId: testAccountId,
            userId: testUserId
          }
        });
      }
    });
  });
});
