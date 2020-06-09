import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap, IPagination } from 'core/models';
import { createNetworkAdapter, StateWithNetworkActive } from 'core/utilities';
import { Process } from '../../../models/process.model';
import * as fromActions from '../../actions/process/processesList.actions';

export interface IProcessesListState extends EntityState<Process>, StateWithNetworkActive {
  pagination: IPagination;
  searchTerm: string;
}

export const processesListAdapter: EntityAdapter<Process> = createEntityAdapter<Process>();
export const networkAdapter = createNetworkAdapter();

export const initialState: IProcessesListState = {
  ...processesListAdapter.getInitialState(),
  ...networkAdapter.initialState,
  pagination: {
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  },
  searchTerm: '',
};

const actionMap: IActionMap<IProcessesListState, fromActions.ProcessesListActions> = {
  [fromActions.LOAD_PROCESSES_LIST]: loadProcessesListHandler,
  [fromActions.LOAD_SPECIFIC_PAGE_FOR_PROCESSES_LIST]: loadSpecificPageForProcessesListHandler,
  [fromActions.LOAD_PROCESSES_LIST_SUCCESS]: loadProcessesListSuccessHandler,
  [fromActions.PROCESSES_LIST_FAILURE]: processesListFailureHandler,
};

export function reducer(
  state: IProcessesListState = initialState,
  action: fromActions.ProcessesListActions,
): IProcessesListState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function loadProcessesListHandler(
  state: IProcessesListState,
  action: fromActions.LoadProcessesList,
): IProcessesListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadSpecificPageForProcessesListHandler(
  state: IProcessesListState,
  action: fromActions.LoadSpecificPageForProcessesList,
): IProcessesListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadProcessesListSuccessHandler(
  state: IProcessesListState,
  action: fromActions.LoadProcessesListSuccess,
): IProcessesListState {
  return {
    ...processesListAdapter.addAll(action.payload.results, state),
    ...networkAdapter.makeGenericInactive(state),
    pagination: action.payload.pagination,
  };
}

function processesListFailureHandler(
  state: IProcessesListState,
  action: fromActions.ProcessesListFailure,
): IProcessesListState {
  return {
    ...state,
    ...networkAdapter.makeGenericInactive(state),
  };
}

export const { selectAnyNetworkActive, selectGenericNetworkActive, selectNetworkActive } = networkAdapter.selectors;
export const { selectEntities, selectAll } = processesListAdapter.getSelectors();
export const getPagination = (state: IProcessesListState) => state.pagination;
