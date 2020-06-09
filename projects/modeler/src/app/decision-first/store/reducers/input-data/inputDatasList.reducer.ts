import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap, IPagination } from 'core/models';
import { createNetworkAdapter, StateWithNetworkActive } from 'core/utilities';
import { InputData } from '../../../models/inputData.model';
import * as fromActions from '../../actions/input-data/inputDatasList.actions';

export interface IInputDatasListState extends EntityState<InputData>, StateWithNetworkActive {
  pagination: IPagination;
  searchTerm: string;
}

export const inputDatasListAdapter: EntityAdapter<InputData> = createEntityAdapter<InputData>();
export const networkAdapter = createNetworkAdapter();

export const initialState: IInputDatasListState = {
  ...inputDatasListAdapter.getInitialState(),
  ...networkAdapter.initialState,
  pagination: {
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  },
  searchTerm: '',
};

const actionMap: IActionMap<IInputDatasListState, fromActions.InputDatasListActions> = {
  [fromActions.LOAD_INPUT_DATAS_LIST]: loadInputDatasListHandler,
  [fromActions.LOAD_SPECIFIC_PAGE_FOR_INPUT_DATA_LIST]: loadSpecificPageForInputDataListHandler,
  [fromActions.LOAD_INPUT_DATAS_LIST_SUCCESS]: loadInputDatasListSuccessHandler,
  [fromActions.INPUT_DATAS_LIST_FAILURE]: inputDatasListFailureHandler,
};

export function reducer(
  state: IInputDatasListState = initialState,
  action: fromActions.InputDatasListActions,
): IInputDatasListState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function loadInputDatasListHandler(
  state: IInputDatasListState,
  action: fromActions.LoadInputDatasList,
): IInputDatasListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadSpecificPageForInputDataListHandler(
  state: IInputDatasListState,
  action: fromActions.LoadSpecificPageForInputDataList,
): IInputDatasListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadInputDatasListSuccessHandler(
  state: IInputDatasListState,
  action: fromActions.LoadInputDatasListSuccess,
): IInputDatasListState {
  return {
    ...inputDatasListAdapter.addAll(action.payload.results, state),
    ...networkAdapter.makeGenericInactive(state),
    pagination: action.payload.pagination,
  };
}

function inputDatasListFailureHandler(
  state: IInputDatasListState,
  action: fromActions.InputDatasListFailure,
): IInputDatasListState {
  return {
    ...state,
    ...networkAdapter.makeGenericInactive(state),
  };
}

export const { selectAnyNetworkActive, selectGenericNetworkActive, selectNetworkActive } = networkAdapter.selectors;
export const { selectEntities, selectAll } = inputDatasListAdapter.getSelectors();
export const getPagination = (state: IInputDatasListState) => state.pagination;
