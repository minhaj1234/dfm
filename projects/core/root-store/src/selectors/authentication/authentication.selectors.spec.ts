import { TestBed } from '@angular/core/testing';
import { select, Store } from '@ngrx/store';
import { TestStoreModule } from 'core/testing';
import { ValidationSuccess } from '../../actions';
import { IState } from '../../reducers/state';
import * as fromSelectors from './authentication.selectors';

describe('Authentication Selectors', () => {
  const someTimeInterval = 7200;
  let store: Store<IState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
      ],
    });

    store = TestBed.get(Store);
  });

  describe('getIsAuthorized', () => {
    it('returns true if the token is valid', () => {
      let result;

      store.dispatch(
        new ValidationSuccess({
          accessToken: 'accessToken',
          accountId: 'id',
          email: 'email',
          encodedToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwOi8vdGVzdC10ZXN0d3cuY29tL3RlbmFudElkIjoiZGVmYXVsdCIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ.qVgGfthtzcQBkJrkBE8CXgkCLrfIGQe9x7BK7ZmcrRY',
          expiresIn: 10,
          redirectToUrl: 'url',
          refreshToken: 'token',
          userId: 'id',
          expiresAt: new Date().getTime() + someTimeInterval,
          userType: 'ADMIN',
        }),
      );

      store.pipe(select(fromSelectors.getIsAuthorized)).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(true);
    });

    it('returns false if the token is blank', () => {
      let result;

      store.dispatch(
        new ValidationSuccess({
          accessToken: 'accessToken',
          accountId: 'id',
          email: 'email',
          encodedToken: '',
          expiresIn: 10,
          redirectToUrl: 'url',
          refreshToken: 'token',
          userId: 'id',
          expiresAt: new Date().getTime() + someTimeInterval,
          userType: 'ADMIN',
        }),
      );

      store.pipe(select(fromSelectors.getIsAuthorized)).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(false);
    });

    it('returns false if the time has expired', () => {
      let result;

      store.dispatch(
        new ValidationSuccess({
          accessToken: 'accessToken',
          accountId: 'id',
          email: 'email',
          encodedToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwOi8vdGVzdC10ZXN0d3cuY29tL3RlbmFudElkIjoiZGVmYXVsdCIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ.qVgGfthtzcQBkJrkBE8CXgkCLrfIGQe9x7BK7ZmcrRY',
          expiresIn: 10,
          redirectToUrl: 'url',
          refreshToken: 'token',
          userId: 'id',
          expiresAt: new Date().getTime()/1000 - someTimeInterval,
          userType: 'ADMIN',
        }),
      );

      store.pipe(select(fromSelectors.getIsAuthorized)).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(false);
    });
  });

  describe('getAccessToken', () => {
    it('returns access token', () => {
      let result;

      store.dispatch(
        new ValidationSuccess({
          accessToken: 'accessToken',
          accountId: 'id',
          email: 'email',
          encodedToken: 'at',
          expiresIn: 10,
          redirectToUrl: 'url',
          refreshToken: 'token',
          userId: 'id',
          expiresAt: new Date().getTime() + someTimeInterval,
          userType: 'ADMIN'
        }),
      );

      store.pipe(select(fromSelectors.getAccessToken)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual('accessToken');
    });
  });
});
