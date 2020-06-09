import { fakeAsync, tick, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { WebAuth } from 'auth0-js';
import { ValidationSuccess } from '../../actions';
import { reducers, IState } from '../../reducers/state';
import { AuthService } from './auth.service';

class WebAuthStub {
  authorize = jasmine.createSpy('authorize');
  callback: (err, authResult) => void;
  logout = jasmine.createSpy('logout');
  checkSession = jasmine.createSpy('checkSession');
  parseHash(fun: (err, authResult) => void) {
    this.callback = fun;
  }
}

describe('AuthService', () => {
  
});
