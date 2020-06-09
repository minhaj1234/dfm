import { createSelector } from '@ngrx/store';
import { AutocompleteListItem } from 'core/models';
import { DfmObjects } from '../../../models/objects.model';
import * as fromFeature from '../../reducers';
import * as fromAutocompleteSearchList from '../../reducers/search/autocompleteSearchList.reducer';

export const getAutocompleteSearchListState = createSelector(
  fromFeature.getDecisionFirstState,
  (state: fromFeature.IDecisionFirstState) => state.autocompleteSearchList,
);

export const getAutocompleteSearchList = createSelector(
  getAutocompleteSearchListState,
  fromAutocompleteSearchList.selectAll,
);

export const getAutocompleteSearchListNetworkActive = createSelector(
  getAutocompleteSearchListState,
  fromAutocompleteSearchList.selectAnyNetworkActive,
);

export const getAutocompleteSearchListEntities = createSelector(
  getAutocompleteSearchListState,
  fromAutocompleteSearchList.selectEntities,
);

export const getSelectedItemFromAutocompleteSearchList = (id) =>
  createSelector(getAutocompleteSearchListState, (autocompleteListState): AutocompleteListItem => {
    return autocompleteListState.entities[id];
  });
