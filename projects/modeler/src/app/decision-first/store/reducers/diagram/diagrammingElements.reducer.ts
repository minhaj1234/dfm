import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap, IPagination } from 'core/models';
import { createNetworkAdapter, StateWithNetworkActive } from 'core/utilities';
import { Graphable } from '../../../models/graphable.model';
import * as fromActions from '../../actions/diagram/diagrammingElements.actions';

export interface IDigrammingElementsState extends EntityState<Graphable>, StateWithNetworkActive {
  pagination: IPagination;
  searchTerm: string;
}

export const diagrammingElementsAdapter: EntityAdapter<Graphable> = createEntityAdapter<Graphable>();
export const networkAdapter = createNetworkAdapter();

export const initialState: IDigrammingElementsState = {
  ...diagrammingElementsAdapter.getInitialState(),
  ...networkAdapter.initialState,
  pagination: {
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  },
  searchTerm: '',
};

const actionMap: IActionMap<IDigrammingElementsState, fromActions.DiagrammingElementsListActions> = {
  [fromActions.UPDATE_SEARCH_FOR_DIAGRAMMING_ELEMENTS]: updateSearchTermHandler,
  [fromActions.LOAD_SPECIFIC_PAGE_FOR_DIAGRAMMING_ELEMENTS_LIST]: loadSpecificPageForDiagrammingElementsListHandler,
  [fromActions.UPDATE_SINGLE_DIAGRAMMING_ELEMENT_IF_NEEDED]: updateSingleIfNeededHandler,
  [fromActions.REMOVE_SINGLE_DIAGRAMMING_ELEMENT_IF_NEEDED]: removeSingleIfNeededHandler,
  [fromActions.LOAD_DIAGRAMMING_ELEMENTS_LIST_FAIL]: failureHandler,
  [fromActions.LOAD_DIAGRAMMING_ELEMENTS_LIST_SUCCESS]: loadElementsSuccessHandler,
  [fromActions.LOAD_MISSING_DIAGRAMMING_ELEMENTS_FOR_NODE]: loadMissingDiagrammingElementsForNodeHandler,
};

export function reducer(
  state: IDigrammingElementsState = initialState,
  action: fromActions.DiagrammingElementsListActions,
): IDigrammingElementsState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function updateSearchTermHandler(
  state: IDigrammingElementsState,
  action: fromActions.UpdateSearchForDiagrammingElements,
): IDigrammingElementsState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
    searchTerm: action.payload.searchTerm,
  };
}

function loadSpecificPageForDiagrammingElementsListHandler(
  state: IDigrammingElementsState,
  action: fromActions.LoadSpecificPageForDiagrammingElementsList,
): IDigrammingElementsState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadMissingDiagrammingElementsForNodeHandler(
  state: IDigrammingElementsState,
  action: fromActions.LoadSpecificPageForDiagrammingElementsList,
): IDigrammingElementsState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function updateSingleIfNeededHandler(
  state: IDigrammingElementsState,
  action: fromActions.UpdateSingleDiagrammingElementIfNeeded,
): IDigrammingElementsState {
  return diagrammingElementsAdapter.updateOne({ id: action.payload.id, changes: action.payload }, state);
}

function removeSingleIfNeededHandler(
  state: IDigrammingElementsState,
  action: fromActions.RemoveSingleElementFromDiagrammingElementsList,
): IDigrammingElementsState {
  return diagrammingElementsAdapter.removeOne(action.payload, state);
}

function failureHandler(
  state: IDigrammingElementsState,
  action: fromActions.LoadDiagrammingElementsListFail,
): IDigrammingElementsState {
  return {
    ...state,
    ...networkAdapter.makeGenericInactive(state),
  };
}

function loadElementsSuccessHandler(
  state: IDigrammingElementsState,
  action: fromActions.LoadDiagrammingElementsListSuccess,
): IDigrammingElementsState {
  return {
    ...diagrammingElementsAdapter.addAll(action.payload.results, state),
    ...networkAdapter.makeGenericInactive(state),
    pagination: action.payload.pagination,
  };
}

export const { selectAnyNetworkActive, selectGenericNetworkActive, selectNetworkActive } = networkAdapter.selectors;
export const { selectEntities, selectAll } = diagrammingElementsAdapter.getSelectors();
export const getSearchTerm = (state: IDigrammingElementsState) => state.searchTerm;
export const getPagination = (state: IDigrammingElementsState) => state.pagination;
