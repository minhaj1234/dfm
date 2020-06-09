import { createSelector } from '@ngrx/store';
import { User } from 'user-management/models';
import * as fromReducers from 'user-management/store/reducers';
import{ fromUsers } from 'user-management/store/reducers';

export const getUsersState = createSelector(
  fromReducers.getDecisionFirstState,
  (state: fromReducers.IDecisionFirstState) => state.users,
);

export const getLoadedUsers = createSelector(
  getUsersState,
  fromUsers.selectEntities,
);

export const getLoadedUsersAsArray = createSelector(
  getUsersState,
  fromUsers.selectAll,
);

export const getUsersAnyNetworkActive = createSelector(
  getUsersState,
  fromUsers.selectAnyNetworkActive,
);

export const getSelectedUser = (id) =>
  createSelector(
    getUsersState,
    (userState): User => userState.entities[id],
  );

export const getSelectedUserNetworkActive = (id) =>
  createSelector(
    getUsersState,
    (userState): boolean => userState.networkActive[id] || false,
  );

export const getLoadedUsersGroups = createSelector(
  getLoadedUsersAsArray,
  (users: User[]) => {
    return [].concat.apply([], users.map((user: User) => [...user.groups]));
  },
);
