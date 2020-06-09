import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap, IPagination } from 'core/models';
import { createNetworkAdapter, StateWithNetworkActive } from 'core/utilities';
import { BusinessObjective } from '../../../models/businessObjective.model';
import * as fromActions from '../../actions/business-objective/businessObjectivesList.actions';

export interface IBusinessObjectivesListState extends EntityState<BusinessObjective>, StateWithNetworkActive {
  pagination: IPagination;
  searchTerm: string;
}

export const businessObjectivesListAdapter: EntityAdapter<BusinessObjective> = createEntityAdapter<BusinessObjective>();
export const networkAdapter = createNetworkAdapter();

export const initialState: IBusinessObjectivesListState = {
  ...businessObjectivesListAdapter.getInitialState(),
  ...networkAdapter.initialState,
  pagination: {
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  },
  searchTerm: '',
};

const actionMap: IActionMap<IBusinessObjectivesListState, fromActions.BusinessObjectivesListActions> = {
  [fromActions.LOAD_BUSINESS_OBJECTIVES_LIST]: loadBusinessObjectivesListHandler,
  [fromActions.LOAD_SPECIFIC_PAGE_FOR_BUSINESS_OBJECTIVES_LIST]: loadSpecificPageForBusinessObjectivesListHandler,
  [fromActions.LOAD_BUSINESS_OBJECTIVES_LIST_SUCCESS]: loadBusinessObjectivesListSuccessHandler,
  [fromActions.BUSINESS_OBJECTIVES_LIST_FAILURE]: businessObjectivesListFailureHandler,
};

export function reducer(
  state: IBusinessObjectivesListState = initialState,
  action: fromActions.BusinessObjectivesListActions,
): IBusinessObjectivesListState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function loadBusinessObjectivesListHandler(
  state: IBusinessObjectivesListState,
  action: fromActions.LoadBusinessObjectivesList,
): IBusinessObjectivesListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadSpecificPageForBusinessObjectivesListHandler(
  state: IBusinessObjectivesListState,
  action: fromActions.LoadSpecificPageForBusinessObjectivesList,
): IBusinessObjectivesListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadBusinessObjectivesListSuccessHandler(
  state: IBusinessObjectivesListState,
  action: fromActions.LoadBusinessObjectivesListSuccess,
): IBusinessObjectivesListState {
  return {
    ...businessObjectivesListAdapter.addAll(action.payload.results, state),
    ...networkAdapter.makeGenericInactive(state),
    pagination: action.payload.pagination,
  };
}

function businessObjectivesListFailureHandler(
  state: IBusinessObjectivesListState,
  action: fromActions.BusinessObjectivesListFailure,
): IBusinessObjectivesListState {
  return {
    ...state,
    ...networkAdapter.makeGenericInactive(state),
  };
}

export const { selectAnyNetworkActive, selectGenericNetworkActive, selectNetworkActive } = networkAdapter.selectors;
export const { selectEntities, selectAll } = businessObjectivesListAdapter.getSelectors();
export const getPagination = (state: IBusinessObjectivesListState) => state.pagination;
