import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { AutocompleteListItem, IActionMap, IPagination } from 'core/models';
import { createNetworkAdapter, StateWithNetworkActive } from 'core/utilities';
import * as fromAutocompleteSearchListActions from '../../actions/search/autocompleteSearchList.actions';

export interface IAutocompleteSearchListState extends EntityState<AutocompleteListItem>, StateWithNetworkActive {
  pagination: IPagination;
  searchTerm: string;
}

export const homeSearchListAdapter: EntityAdapter<AutocompleteListItem> = createEntityAdapter<AutocompleteListItem>();
export const networkAdapter = createNetworkAdapter();

export const initialState: IAutocompleteSearchListState = {
  ...homeSearchListAdapter.getInitialState(),
  ...networkAdapter.initialState,
  pagination: {
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  },
  searchTerm: '',
};

const actionMap: IActionMap<IAutocompleteSearchListState, fromAutocompleteSearchListActions.AutocompleteSearchListActions> = {
  [fromAutocompleteSearchListActions.UPDATE_SEARCH_FOR_AUTOCOMPLETE_SEARCH_LIST]: updateSearchForAutocompleteSearchListHandler,
  [fromAutocompleteSearchListActions.LOAD_AUTOCOMPLETE_SEARCH_LIST_SUCCESS]: loadAutocompleteSearchListSuccessHandler,
  [fromAutocompleteSearchListActions.USER_MANAGEMENT_LOAD_AUTOCOMPLETE_SEARCH_LIST_SUCCESS]: loadAutocompleteSearchListSuccessHandler,
  [fromAutocompleteSearchListActions.SET_AUTOCOMPLETE_SEARCH_LIST_INITIAL_STATE]: setAutocompleteSearchListInitialStateHandler,
  [fromAutocompleteSearchListActions.LOAD_GROUPS_TO_AUTOCOMPLETE_SEARCH_LIST]: loadGroupsToAutocompleteSearchListHandler,
  [fromAutocompleteSearchListActions.LOAD_USERS_TO_AUTOCOMPLETE_SEARCH_LIST]: loadUsersToAutocompleteSearchListHandler,


};

export function reducer(
  state: IAutocompleteSearchListState = initialState,
  action: fromAutocompleteSearchListActions.AutocompleteSearchListActions,
): IAutocompleteSearchListState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function updateSearchForAutocompleteSearchListHandler(
  state: IAutocompleteSearchListState,
  action: fromAutocompleteSearchListActions.UpdateSearchForAutocompleteSearchList,
): IAutocompleteSearchListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
    searchTerm: action.payload.searchTerm,
  };
}

function loadAutocompleteSearchListSuccessHandler(
  state: IAutocompleteSearchListState,
  action: fromAutocompleteSearchListActions.LoadAutocompleteSearchListSuccess,
): IAutocompleteSearchListState {
  return {
    ...homeSearchListAdapter.addAll(action.payload.results, state),
    ...networkAdapter.makeGenericInactive(state),
    pagination: action.payload.pagination,
  };
}

function setAutocompleteSearchListInitialStateHandler(
  state: IAutocompleteSearchListState,
  action: fromAutocompleteSearchListActions.SetAutocompleteSearchListInitialState,
): IAutocompleteSearchListState {
  return initialState;
}

function loadGroupsToAutocompleteSearchListHandler(
  state: IAutocompleteSearchListState, 
  action: fromAutocompleteSearchListActions.LoadGroupsToAutocompleteSearchList
): IAutocompleteSearchListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadUsersToAutocompleteSearchListHandler(
  state: IAutocompleteSearchListState, 
  action: fromAutocompleteSearchListActions.LoadUsersToAutocompleteSearchList
): IAutocompleteSearchListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

export const { selectAnyNetworkActive, selectGenericNetworkActive, selectNetworkActive } = networkAdapter.selectors;
export const { selectEntities, selectAll } = homeSearchListAdapter.getSelectors();
