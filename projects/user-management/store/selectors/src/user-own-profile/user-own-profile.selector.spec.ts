import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import { ChangePasswordFormState } from 'user-management/models';
import * as fromActions from 'user-management/store/actions';
import { fromUserOwnProfile } from 'user-management/store/reducers';
import { userOwnProfileReducer } from 'user-management/store/reducers';
import * as fromSelectors from './user-own-profile.selector';

describe('User Own Profile Selectors', () => {
  let store: Store<fromUserOwnProfile.IUserOwnProfileState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          userOwnProfile: userOwnProfileReducer,
        }),
      ],
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getChangePasswordFormState', () => {
    it('should return changePasswordFormState value', () => {
      let result: ChangePasswordFormState;

      store.pipe(select(fromSelectors.getChangePasswordFormState)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual({ displayChangePassword: false, changePasswordError: false });

      store.dispatch(new fromActions.OpenChangePasswordForm());

      expect(result).toEqual({ displayChangePassword: true, changePasswordError: false });
    });
  });
});
