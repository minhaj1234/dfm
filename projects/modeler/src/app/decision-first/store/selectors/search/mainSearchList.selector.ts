import { createSelector } from '@ngrx/store';
import * as fromFeature from '../../reducers';
import * as fromMainSearchList from '../../reducers/search/mainSearchList.reducer';

export const getMainSearchListState = createSelector(
  fromFeature.getDecisionFirstState,
  (state: fromFeature.IDecisionFirstState) => state.mainSearchList,
);

export const getMainSearchList = createSelector(
  getMainSearchListState,
  fromMainSearchList.selectAll,
);
export const getMainSearchListNetworkActive = createSelector(
  getMainSearchListState,
  fromMainSearchList.selectAnyNetworkActive,
);
export const getMainSearchListEntities = createSelector(
  getMainSearchListState,
  fromMainSearchList.selectEntities,
);
export const getMainSearchListSearchTerm = createSelector(
  getMainSearchListState,
  fromMainSearchList.getMainSearchListSearchTerm,
);

export const getMainSearchListSort = createSelector(
  getMainSearchListState,
  fromMainSearchList.getMainSearchListSort,
);

export const getMainSearchListTypeObjects = createSelector(
  getMainSearchListState,
  fromMainSearchList.getMainSearchListTypeObjects,
);

export const getMainSearchListPagination = createSelector(
  getMainSearchListState,
  fromMainSearchList.getMainSearchListPagination,
);
