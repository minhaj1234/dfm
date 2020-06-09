import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap } from 'core/models';
import { AutocompleteListItem } from 'core/models';
import { createNetworkAdapter, StateWithNetworkActive } from 'core/utilities';
import * as fromActions from 'user-management/store/actions';

export interface IAutocompleteSearchListState extends EntityState<AutocompleteListItem>, StateWithNetworkActive {}

export const AutocompleteSearchListAdapter: EntityAdapter<AutocompleteListItem> = createEntityAdapter<AutocompleteListItem>();
export const networkAdapter = createNetworkAdapter();

export const initialState: IAutocompleteSearchListState = {
  ...AutocompleteSearchListAdapter.getInitialState(),
  ...networkAdapter.initialState,
};

const actionMap: IActionMap<IAutocompleteSearchListState, fromActions.AutocompleteSearchListActions> = {
  [fromActions.LOAD_GROUPS_TO_AUTOCOMPLETE_SEARCH_LIST]: loadGroupsToAutocompleteSearchListHandler,
  [fromActions.LOAD_USERS_TO_AUTOCOMPLETE_SEARCH_LIST]: loadUsersToAutocompleteSearchListHandler,
  [fromActions.LOAD_AUTOCOMPLETE_SEARCH_LIST_SUCCESS]: loadAutocompleteSearchListSuccessHandler,
  [fromActions.SET_AUTOCOMPLETE_SEARCH_LIST_INITIAL_STATE]: setAutocompleteSearchListInitialStateHandler,
  [fromActions.USER_MANAGEMENT_AUTOCOMPLETE_SEARCH_LIST_FAILURE]: autocompleteSearchListFailureHandler,
};

export function reducer(
  state: IAutocompleteSearchListState = initialState,
  action: fromActions.AutocompleteSearchListActions,
): IAutocompleteSearchListState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function loadGroupsToAutocompleteSearchListHandler(
  state: IAutocompleteSearchListState, 
  action: fromActions.LoadGroupsToAutocompleteSearchList
): IAutocompleteSearchListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadUsersToAutocompleteSearchListHandler(
  state: IAutocompleteSearchListState, 
  action: fromActions.LoadUsersToAutocompleteSearchList
): IAutocompleteSearchListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadAutocompleteSearchListSuccessHandler(
  state: IAutocompleteSearchListState, 
  action: fromActions.LoadAutocompleteSearchListSuccess
): IAutocompleteSearchListState {
  return {
    ...AutocompleteSearchListAdapter.addAll(action.payload.results, state),
    ...networkAdapter.makeGenericInactive(state)
  };
}
  
function setAutocompleteSearchListInitialStateHandler(
  state: IAutocompleteSearchListState, 
  action: fromActions.SetAutocompleteSearchListInitialState
): IAutocompleteSearchListState {
  return {
    ...AutocompleteSearchListAdapter.removeAll(state),
    ...networkAdapter.makeGenericInactive(state),
  };
}

function autocompleteSearchListFailureHandler(
  state: IAutocompleteSearchListState, 
  action: fromActions.AutocompleteSearchListFailure
): IAutocompleteSearchListState {
  return {
    ...state,
    ...networkAdapter.makeGenericInactive(state),
  };
}

export const { selectAnyNetworkActive, selectGenericNetworkActive, selectNetworkActive } = networkAdapter.selectors;
export const { selectEntities, selectAll } = AutocompleteSearchListAdapter.getSelectors();
