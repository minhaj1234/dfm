import { createSelector } from '@ngrx/store';
import * as fromFeature from '../../reducers';
import * as fromHomeSearchList from '../../reducers/search/homeSearchList.reducer';

export const getHomeSearchListState = createSelector(
  fromFeature.getDecisionFirstState,
  (state: fromFeature.IDecisionFirstState) => state.homeSearchList,
);

export const getHomeSearchList = createSelector(
  getHomeSearchListState,
  fromHomeSearchList.selectAll,
);
export const getHomeSearchListNetworkActive = createSelector(
  getHomeSearchListState,
  fromHomeSearchList.selectAnyNetworkActive,
);
export const getHomeSearchListEntities = createSelector(
  getHomeSearchListState,
  fromHomeSearchList.selectEntities,
);
export const getHomeSearchListSearchTerm = createSelector(
  getHomeSearchListState,
  fromHomeSearchList.getHomeSearchListSearchTerm,
);

export const getHomeSearchListPagination = createSelector(
  getHomeSearchListState,
  fromHomeSearchList.getHomeSearchListPagination,
);
