import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap, IPagination } from 'core/models';
import { createNetworkAdapter, StateWithNetworkActive } from 'core/utilities';
import { ObjectClassNames } from '../../../models/objects.model';
import { defaultSearchFilterTypeObjects, defaultSearchSort, Search, SearchSort } from '../../../models/search.model';
import * as fromMainSearchListActions from '../../actions/search/mainSearchList.actions';

export interface IMainSearchListState extends EntityState<Search>, StateWithNetworkActive {
  pagination: IPagination;
  searchTerm: string;
  sort: SearchSort;
  typeObjects: ObjectClassNames[];
}

export const mainSearchListAdapter: EntityAdapter<Search> = createEntityAdapter<Search>();
export const networkAdapter = createNetworkAdapter();

export const initialState: IMainSearchListState = {
  ...mainSearchListAdapter.getInitialState(),
  ...networkAdapter.initialState,
  pagination: {
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  },
  searchTerm: '',
  sort: defaultSearchSort,
  typeObjects: defaultSearchFilterTypeObjects,
};

const actionMap: IActionMap<IMainSearchListState, fromMainSearchListActions.SearchListActions> = {
  [fromMainSearchListActions.LOAD_MAIN_SEARCH_LIST]: loadMainSearchListHandler,
  [fromMainSearchListActions.LOAD_SPECIFIC_PAGE_FOR_MAIN_SEARCH_LIST]: loadSpecificPageForMainSearchListHandler,
  [fromMainSearchListActions.LOAD_MAIN_SEARCH_LIST_SUCCESS]: loadMainSearchListSuccessHandler,
  [fromMainSearchListActions.UPDATE_SEARCH_FOR_MAIN_SEARCH_LIST]: updateSearchForMainSearchListHandler,
  [fromMainSearchListActions.GET_MAIN_SEARCH_LIST_INITIAL_STATE]: getMainSearchListInitialStateHandler,
};

export function reducer(
  state: IMainSearchListState = initialState,
  action: fromMainSearchListActions.SearchListActions,
): IMainSearchListState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function loadMainSearchListHandler(
  state: IMainSearchListState,
  action: fromMainSearchListActions.LoadMainSearchList,
): IMainSearchListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadSpecificPageForMainSearchListHandler(
  state: IMainSearchListState,
  action: fromMainSearchListActions.LoadSpecificPageForMainSearchList,
): IMainSearchListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadMainSearchListSuccessHandler(
  state: IMainSearchListState,
  action: fromMainSearchListActions.LoadMainSearchListSuccess,
): IMainSearchListState {
  return {
    ...mainSearchListAdapter.addAll(action.payload.results, state),
    ...networkAdapter.makeGenericInactive(state),
    pagination: action.payload.pagination,
  };
}

function updateSearchForMainSearchListHandler(
  state: IMainSearchListState,
  action: fromMainSearchListActions.UpdateSearchForMainSearchList,
): IMainSearchListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
    searchTerm: action.payload.searchTerm,
    sort: action.payload.sort ? action.payload.sort : state.sort,
    typeObjects: action.payload.typeObjects ? action.payload.typeObjects : state.typeObjects,
  };
}

function getMainSearchListInitialStateHandler(
  state: IMainSearchListState,
  action: fromMainSearchListActions.GetMainSearchListInitialState,
): IMainSearchListState {
  return initialState;
}

export const { selectAnyNetworkActive, selectGenericNetworkActive, selectNetworkActive } = networkAdapter.selectors;
export const { selectEntities, selectAll } = mainSearchListAdapter.getSelectors();
export const getMainSearchListSearchTerm = (state: IMainSearchListState) => state.searchTerm;
export const getMainSearchListSort = (state: IMainSearchListState) => state.sort;
export const getMainSearchListTypeObjects = (state: IMainSearchListState) => state.typeObjects;
export const getMainSearchListPagination = (state: IMainSearchListState) => state.pagination;
