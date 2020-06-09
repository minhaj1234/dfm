import { createSelector } from '@ngrx/store';
import * as fromFeature from '../../reducers';
import * as fromTagsList from '../../reducers/tags/tagsList.reducer';

export const getTagsListState = createSelector(
  fromFeature.getDecisionFirstState,
  (state: fromFeature.IDecisionFirstState) => state.tagsList,
);

export const getTagsList = createSelector(
  getTagsListState,
  fromTagsList.selectAll,
);

export const getTagsEntities = createSelector(
  getTagsListState,
  fromTagsList.selectEntities,
);

export const getTagsListPagination = createSelector(
  getTagsListState,
  fromTagsList.getPagination,
);
