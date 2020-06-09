import { createSelector } from '@ngrx/store';
import { AutocompleteListItem } from 'core/models';
import * as fromReducers from 'user-management/store/reducers';
import{ fromAutocompleteSearchList } from 'user-management/store/reducers';

export const getAutocompleteSearchListState = createSelector(
  fromReducers.getDecisionFirstState,
  (state: fromReducers.IDecisionFirstState) => state.autocompleteSearchList,
);

export const getAutocompleteSearchList = createSelector(
  getAutocompleteSearchListState,
  fromAutocompleteSearchList.selectAll,
);
