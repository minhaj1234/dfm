import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { ValidationSuccessResponse } from 'core/models';
import { rootActions, rootReducers, } from 'core/root-store';
import { TestStoreModule } from '../testing/test-store-module.spec';
import { ONLY_ADMINISTRATORS_HAVE_ACCESS_ERROR_MESSAGE } from './admin-authenticated-guard.const';
import { AdminAuthenticatedGuardService } from './admin-authenticated-guard.service';

describe('AdminAuthenticatedGuardService', () => {
  let service: AdminAuthenticatedGuardService;
  let store: Store<rootReducers.IState>;
  let dispatch: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
      ],
      providers: [
        AdminAuthenticatedGuardService,
      ],
    });
    service = TestBed.get(AdminAuthenticatedGuardService);
    store = TestBed.get(Store);

    dispatch = spyOn(store, 'dispatch');
  });

  it('should be created', () => {   
    expect(service).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should be true', done => {
      dispatch.and.callThrough();
      store.dispatch(new rootActions.ValidationSuccess({ userId: 'userId',  userType: 'ADMIN', } as ValidationSuccessResponse));

      const result$ = service.canActivate(null);

      result$.subscribe((value) => {
        expect(value).toBeTruthy();
        done();
      });
    });

    it('should be false', done => {
      dispatch.and.callThrough();
      store.dispatch(new rootActions.ValidationSuccess({ userId: 'userId',  userType: 'STANDARD', } as ValidationSuccessResponse));
      dispatch.and.stub();

      const result$ = service.canActivate(null);

      result$.subscribe((value) => {
        expect(value).toBeFalsy();
        done();
      });
    });

    it('should dispatch ValidationFailure if user is not Admim', done => {
      dispatch.and.callThrough();
      store.dispatch(new rootActions.ValidationSuccess({ userId: 'userId',  userType: 'STANDARD', } as ValidationSuccessResponse));
      dispatch.and.stub();
      
      const expected = new rootActions.AuthorizationFailure(new Error(ONLY_ADMINISTRATORS_HAVE_ACCESS_ERROR_MESSAGE));

      const result$ = service.canActivate(null);

      result$.subscribe(() => {
        expect(dispatch).toHaveBeenCalledWith(expected);
        done();
      });
    });
  });
});
