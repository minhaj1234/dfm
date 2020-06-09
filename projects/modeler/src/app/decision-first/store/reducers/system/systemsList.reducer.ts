import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap, IPagination } from 'core/models';
import { createNetworkAdapter, StateWithNetworkActive } from 'core/utilities';
import { System } from '../../../models/system.model';
import * as fromActions from '../../actions/system/systemsList.action';

export interface ISystemsListState extends EntityState<System>, StateWithNetworkActive {
  pagination: IPagination;
  searchTerm: string;
}

export const systemListAdapter: EntityAdapter<System> = createEntityAdapter<System>();
export const networkAdapter = createNetworkAdapter();

export const initialState: ISystemsListState = {
  ...systemListAdapter.getInitialState(),
  ...networkAdapter.initialState,
  pagination: {
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  },
  searchTerm: '',
};

const actionMap: IActionMap<ISystemsListState, fromActions.SystemsListActions> = {
  [fromActions.LOAD_SYSTEMS_LIST]: loadSystemsListHandler,
  [fromActions.LOAD_SPECIFIC_PAGE_FOR_SYSTEMS_LIST]: loadSpecificPageForSystemsListHandler,
  [fromActions.LOAD_SYSTEMS_LIST_SUCCESS]: loadSystemsListSuccessHandler,
  [fromActions.SYSTEMS_LIST_FAILURE]: systemsListFailureHandler,
};

export function reducer(
  state: ISystemsListState = initialState,
  action: fromActions.SystemsListActions,
): ISystemsListState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function loadSystemsListHandler(
  state: ISystemsListState, 
  action: fromActions.LoadSystemsList
): ISystemsListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadSpecificPageForSystemsListHandler(
  state: ISystemsListState,
  action: fromActions.LoadSpecificPageForSystemsList,
): ISystemsListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadSystemsListSuccessHandler(
  state: ISystemsListState,
  action: fromActions.LoadSystemsListSuccess,
): ISystemsListState {
  return {
    ...systemListAdapter.addAll(action.payload.results, state),
    ...networkAdapter.makeGenericInactive(state),
    pagination: action.payload.pagination,
  };
}

function systemsListFailureHandler(
  state: ISystemsListState,
  action: fromActions.SystemsListFailure,
): ISystemsListState {
  return {
    ...state,
    ...networkAdapter.makeGenericInactive(state),
  };
}

export const { selectAnyNetworkActive, selectGenericNetworkActive, selectNetworkActive } = networkAdapter.selectors;
export const { selectEntities, selectAll } = systemListAdapter.getSelectors();
export const getPagination = (state: ISystemsListState) => state.pagination;
