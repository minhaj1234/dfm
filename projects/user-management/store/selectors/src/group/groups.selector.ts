import { createSelector } from '@ngrx/store';
import { Group } from 'user-management/models';
import * as fromReducers from 'user-management/store/reducers';
import{ fromGroups } from 'user-management/store/reducers';

export const getGroupsState = createSelector(
  fromReducers.getDecisionFirstState,
  (state: fromReducers.IDecisionFirstState) => state.groups,
);

export const getLoadedGroups = createSelector(
  getGroupsState,
  fromGroups.selectEntities,
);

export const getLoadedGroupsAsArray = createSelector(
  getGroupsState,
  fromGroups.selectAll,
);

export const getGroupsAnyNetworkActive = createSelector(
  getGroupsState,
  fromGroups.selectAnyNetworkActive,
);

export const getSelectedGroup = (id) =>
  createSelector(
    getGroupsState,
    (groupState): Group => groupState.entities[id],
  );

export const getSelectedGroupNetworkActive = (id) =>
  createSelector(
    getGroupsState,
    (groupState): boolean => groupState.networkActive[id] || false,
  );

export const getLoadedGroupsUsers = createSelector(
  getLoadedGroupsAsArray,
  (groups: Group[]) => {
    return [].concat.apply([], groups.map((group: Group) => [...group.users]));
  },
);
