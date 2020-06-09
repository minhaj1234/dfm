import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap, IPagination } from 'core/models';
import { createNetworkAdapter, StateWithNetworkActive } from 'core/utilities';
import { Search } from '../../../models/search.model';
import * as fromHomeSearchListActions from '../../actions/search/homeSearchList.actions';

export interface IHomeSearchListState extends EntityState<Search>, StateWithNetworkActive {
  pagination: IPagination;
  searchTerm: string;
}

export const homeSearchListAdapter: EntityAdapter<Search> = createEntityAdapter<Search>();
export const networkAdapter = createNetworkAdapter();

export const initialState: IHomeSearchListState = {
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

const actionMap: IActionMap<IHomeSearchListState, fromHomeSearchListActions.HomeActions> = {
  [fromHomeSearchListActions.LOAD_HOME_SEARCH_LIST]: loadHomeSearchListHandler,
  [fromHomeSearchListActions.LOAD_SPECIFIC_PAGE_FOR_HOME_SEARCH_LIST]: loadSpecificPageForHomeSearchListHandler,
  [fromHomeSearchListActions.LOAD_HOME_SEARCH_LIST_SUCCESS]: loadHomeSearchListSuccessHandler,
  [fromHomeSearchListActions.UPDATE_SEARCH_FOR_HOME_SEARCH_LIST]: updateSearchForHomeSearchListHandler,
};

export function reducer(
  state: IHomeSearchListState = initialState,
  action: fromHomeSearchListActions.HomeActions,
): IHomeSearchListState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function loadHomeSearchListHandler(
  state: IHomeSearchListState,
  action: fromHomeSearchListActions.LoadHomeSearchList,
): IHomeSearchListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadSpecificPageForHomeSearchListHandler(
  state: IHomeSearchListState,
  action: fromHomeSearchListActions.LoadSpecificPageForHomeSearchList,
): IHomeSearchListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadHomeSearchListSuccessHandler(
  state: IHomeSearchListState,
  action: fromHomeSearchListActions.LoadHomeSearchListSuccess,
): IHomeSearchListState {
  return {
    ...homeSearchListAdapter.addAll(action.payload.results, state),
    ...networkAdapter.makeGenericInactive(state),
    pagination: action.payload.pagination,
  };
}

function updateSearchForHomeSearchListHandler(
  state: IHomeSearchListState,
  action: fromHomeSearchListActions.UpdateSearchForHomeSearchList,
): IHomeSearchListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
    searchTerm: action.payload.searchTerm,
  };
}

export const { selectAnyNetworkActive, selectGenericNetworkActive, selectNetworkActive } = networkAdapter.selectors;
export const { selectEntities, selectAll } = homeSearchListAdapter.getSelectors();
export const getHomeSearchListSearchTerm = (state: IHomeSearchListState) => state.searchTerm;
export const getHomeSearchListPagination = (state: IHomeSearchListState) => state.pagination;
