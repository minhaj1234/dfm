import { createSelector } from '@ngrx/store';
import { ChangePasswordFormState } from 'user-management/models';
import * as fromReducers from 'user-management/store/reducers';
import { fromUserOwnProfile } from 'user-management/store/reducers';

export const getChangePasswordFormState = createSelector(
  fromReducers.getUserOwnProfileState,
  (state: fromUserOwnProfile.IUserOwnProfileState) => <ChangePasswordFormState>{
    displayChangePassword: state.displayChangePassword,
    changePasswordError: state.changePasswordError,
  },
);
