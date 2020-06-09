import { createSelector } from '@ngrx/store';
import * as fromFeature from '../../reducers';
import * as fromTags from '../../reducers/tags/tags.reducer';

export const getTagsState = createSelector(
  fromFeature.getDecisionFirstState,
  (state: fromFeature.IDecisionFirstState) => state.tags,
);

export const getLoadedTags = createSelector(
  getTagsState,
  fromTags.selectEntities,
);

export const getSelectedTag = (id) =>
  createSelector(getTagsState, (tagState) => tagState.entities[id]);
