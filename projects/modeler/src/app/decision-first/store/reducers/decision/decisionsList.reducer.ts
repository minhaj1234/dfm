import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap, IPagination } from 'core/models';
import { createNetworkAdapter, StateWithNetworkActive } from 'core/utilities';
import { Decision } from '../../../models/decision.model';
import * as fromActions from '../../actions/decision/decisionsList.actions';

export interface IDecisionListState extends EntityState<Decision>, StateWithNetworkActive {
  pagination: IPagination;
  searchTerm: string;
}

export const decisionsAdapter: EntityAdapter<Decision> = createEntityAdapter<Decision>();
export const networkAdapter = createNetworkAdapter();

export const initialState: IDecisionListState = {
  ...decisionsAdapter.getInitialState(),
  ...networkAdapter.initialState,
  pagination: {
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  },
  searchTerm: '',
};

const actionMap: IActionMap<IDecisionListState, fromActions.DecisionsListActions> = {
  [fromActions.LOAD_DECISIONS_LIST]: loadDecisionsListHandler,
  [fromActions.LOAD_SPECIFIC_PAGE_FOR_DECISIONS_LIST]: loadSpecificPageForDecisionsListHandler,
  [fromActions.LOAD_DECISIONS_LIST_SUCCESS]: loadDecisionsListSuccessHandler,
  [fromActions.LOAD_SINGLE_DECISION_FOR_DECISIONS_LIST]: loadSingleDecisionForDecisionsList,
  [fromActions.LOAD_SINGLE_DECISION_FOR_DECISIONS_LIST_SUCCESS]: loadSingleDecisionForDecisionsListSuccess,
  [fromActions.REMOVE_SINGLE_DECISION_FROM_DECISIONS_LIST]: removeSingleDecisionFromList,
  [fromActions.UPDATE_SEARCH_FOR_DECISIONS_LIST]: updateSearchForDecisionsListHandler,
  [fromActions.DECISIONS_LIST_FAILURE]: decisionsListFailureHandler,
};

export function reducer(
  state: IDecisionListState = initialState,
  action: fromActions.DecisionsListActions,
): IDecisionListState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function loadDecisionsListHandler(
  state: IDecisionListState,
  action: fromActions.LoadDecisionsList,
): IDecisionListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadSpecificPageForDecisionsListHandler(
  state: IDecisionListState,
  action: fromActions.LoadSpecificPageForDecisionsList,
): IDecisionListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadDecisionsListSuccessHandler(
  state: IDecisionListState,
  action: fromActions.LoadDecisionsListSuccess,
): IDecisionListState {
  return {
    ...decisionsAdapter.addAll(action.payload.results, state),
    ...networkAdapter.makeGenericInactive(state),
    pagination: action.payload.pagination,
  };
}

function updateSearchForDecisionsListHandler(
  state: IDecisionListState,
  action: fromActions.UpdateSearchForDecisionsList,
): IDecisionListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
    searchTerm: action.payload,
  };
}

function loadSingleDecisionForDecisionsList(
  state: IDecisionListState,
  action: fromActions.LoadSingleDecisionForDecisionsList,
): IDecisionListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadSingleDecisionForDecisionsListSuccess(
  state: IDecisionListState,
  action: fromActions.LoadSingleDecisionForDecisionsListSuccess,
): IDecisionListState {
  return {
    ...decisionsAdapter.upsertOne(action.payload, state),
    ...networkAdapter.makeGenericInactive(state),
  };
}

function removeSingleDecisionFromList(
  state: IDecisionListState,
  action: fromActions.RemoveSingleDecisionFromDecisionsList,
): IDecisionListState {
  return decisionsAdapter.removeOne(action.payload, state);
}

function decisionsListFailureHandler(
  state: IDecisionListState,
  action: fromActions.DecisionsListFailure,
): IDecisionListState {
  return {
    ...state,
    ...networkAdapter.makeGenericInactive(state),
  };
}

export const { selectAnyNetworkActive, selectGenericNetworkActive, selectNetworkActive } = networkAdapter.selectors;
export const { selectEntities, selectAll } = decisionsAdapter.getSelectors();
export const getSearchTerm = (state: IDecisionListState) => state.searchTerm;
export const getPagination = (state: IDecisionListState) => state.pagination;
