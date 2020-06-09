import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap, IPagination } from 'core/models';
import { createNetworkAdapter, StateWithNetworkActive } from 'core/utilities';
import { Diagram } from '../../../models/diagram.model';
import * as fromActions from '../../actions/diagram/diagramsList.actions';

export interface IDiagramListState extends EntityState<Diagram>, StateWithNetworkActive {
  pagination: IPagination;
  searchTerm: string;
}

export const diagramsAdapter: EntityAdapter<Diagram> = createEntityAdapter<Diagram>();
export const networkAdapter = createNetworkAdapter();

export const initialState: IDiagramListState = {
  ...diagramsAdapter.getInitialState(),
  ...networkAdapter.initialState,
  pagination: {
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  },
  searchTerm: '',
};

const actionMap: IActionMap<IDiagramListState, fromActions.DiagramsListActions> = {
  [fromActions.LOAD_DIAGRAMS_LIST]: loadDiagramsListHandler,
  [fromActions.LOAD_SPECIFIC_PAGE_FOR_DIAGRAMS_LIST]: loadSpecificPageForDiagramsListHandler,
  [fromActions.LOAD_DIAGRAMS_LIST_SUCCESS]: loadDiagramsListSuccessHandler,
  [fromActions.UPDATE_SEARCH_FOR_DIAGRAMS_LIST]: updateSearchForDiagramsListHandler,
  [fromActions.LOAD_SINGLE_DIAGRAM_FOR_DIAGRAMS_LIST]: loadSingleDiagramForDiagramsList,
  [fromActions.LOAD_SINGLE_DIAGRAM_FOR_DIAGRAMS_LIST_SUCCESS]: loadSingleDiagramForDiagramsListSuccess,
  [fromActions.REMOVE_SINGLE_DIAGRAM_FROM_DIAGRAMS_LIST]: removeSingleDiagramFromList,
  [fromActions.DIAGRAMS_LIST_FAILURE]: diagramsListFailureHandler,
};

export function reducer(
  state: IDiagramListState = initialState,
  action: fromActions.DiagramsListActions,
): IDiagramListState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function loadDiagramsListHandler(state: IDiagramListState, action: fromActions.LoadDiagramsList): IDiagramListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadSpecificPageForDiagramsListHandler(
  state: IDiagramListState,
  action: fromActions.LoadSpecificPageForDiagramsList,
): IDiagramListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadDiagramsListSuccessHandler(
  state: IDiagramListState,
  action: fromActions.LoadDiagramsListSuccess,
): IDiagramListState {
  return {
    ...diagramsAdapter.addAll(action.payload.results, state),
    ...networkAdapter.makeGenericInactive(state),
    pagination: action.payload.pagination,
  };
}

function updateSearchForDiagramsListHandler(
  state: IDiagramListState,
  action: fromActions.UpdateSearchForDiagramsList,
): IDiagramListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
    searchTerm: action.payload,
  };
}

function loadSingleDiagramForDiagramsList(
  state: IDiagramListState,
  action: fromActions.LoadSingleDiagramForDiagramsList,
): IDiagramListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadSingleDiagramForDiagramsListSuccess(
  state: IDiagramListState,
  action: fromActions.LoadSingleDiagramForDiagramsListSuccess,
): IDiagramListState {
  return {
    ...diagramsAdapter.upsertOne(action.payload, state),
    ...networkAdapter.makeGenericInactive(state),
  };
}

function removeSingleDiagramFromList(
  state: IDiagramListState,
  action: fromActions.RemoveSingleDiagramFromDiagramsList,
): IDiagramListState {
  return diagramsAdapter.removeOne(action.payload, state);
}

function diagramsListFailureHandler(
  state: IDiagramListState,
  action: fromActions.DiagramsListFailure,
): IDiagramListState {
  return {
    ...state,
    ...networkAdapter.makeGenericInactive(state),
  };
}

export const { selectAnyNetworkActive, selectGenericNetworkActive, selectNetworkActive } = networkAdapter.selectors;

export const { selectAll, selectEntities } = diagramsAdapter.getSelectors();

export const getSearchTerm = (state: IDiagramListState) => state.searchTerm;
export const getPagination = (state: IDiagramListState) => state.pagination;
