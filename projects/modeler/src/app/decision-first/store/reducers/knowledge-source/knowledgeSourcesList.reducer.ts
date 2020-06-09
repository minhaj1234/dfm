import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap, IPagination } from 'core/models';
import { createNetworkAdapter, StateWithNetworkActive } from 'core/utilities';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import * as fromActions from '../../actions/knowledge-source/knowledgeSourcesList.actions';

export interface IKnowledgeSourceListState extends EntityState<KnowledgeSource>, StateWithNetworkActive {
  pagination: IPagination;
  searchTerm: string;
}

export const knowledgeSourcesAdapter: EntityAdapter<KnowledgeSource> = createEntityAdapter<KnowledgeSource>();
export const networkAdapter = createNetworkAdapter();

export const initialState: IKnowledgeSourceListState = {
  ...knowledgeSourcesAdapter.getInitialState(),
  ...networkAdapter.initialState,
  pagination: {
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  },
  searchTerm: '',
};

const actionMap: IActionMap<IKnowledgeSourceListState, fromActions.KnowledgeSourcesListActions> = {
  [fromActions.LOAD_KNOWLEDGE_SOURCES_LIST]: loadKnowledgeSourceListHandler,
  [fromActions.LOAD_SPECIFIC_PAGE_FOR_KNOWLEDGE_SOURCES_LIST]: loadSpecificPageForKnowledgeSourcesListHandler,
  [fromActions.LOAD_KNOWLEDGE_SOURCES_LIST_SUCCESS]: loadKnowledgeSourceListSuccessHandler,
  [fromActions.LOAD_SINGLE_KNOWLEDGE_SOURCE_FOR_KNOWLEDGE_SOURCES_LIST]: loadSingleKnowledgeSourceForKnowledgeSourcesList,
  [fromActions.LOAD_SINGLE_KNOWLEDGE_SOURCE_FOR_KNOWLEDGE_SOURCES_LIST_SUCCESS]: loadSingleKnowledgeSourceForKnowledgeSourcesListSuccess,
  [fromActions.REMOVE_SINGLE_KNOWLEDGE_SOURCE_FROM_KNOWLEDGE_SOURCES_LIST]: removeSingleKnowledgeSourceFromList,
  [fromActions.UPDATE_SEARCH_FOR_KNOWLEDGE_SOURCES_LIST]: updateSearchForKnowledgeSourcesListHandler,
  [fromActions.KNOWLEDGE_SOURCES_LIST_FAILURE]: knowledgeSourcesListFailureHandler,
};

export function reducer(
  state: IKnowledgeSourceListState = initialState,
  action: fromActions.KnowledgeSourcesListActions,
): IKnowledgeSourceListState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function loadKnowledgeSourceListHandler(
  state: IKnowledgeSourceListState,
  action: fromActions.LoadKnowledgeSourcesList,
): IKnowledgeSourceListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadSpecificPageForKnowledgeSourcesListHandler(
  state: IKnowledgeSourceListState,
  action: fromActions.LoadSpecificPageForKnowledgeSourcesList,
): IKnowledgeSourceListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadKnowledgeSourceListSuccessHandler(
  state: IKnowledgeSourceListState,
  action: fromActions.LoadKnowledgeSourcesListSuccess,
): IKnowledgeSourceListState {
  return {
    ...knowledgeSourcesAdapter.addAll(action.payload.results, state),
    ...networkAdapter.makeGenericInactive(state),
    pagination: action.payload.pagination,
  };
}

function loadSingleKnowledgeSourceForKnowledgeSourcesList(
  state: IKnowledgeSourceListState,
  action: fromActions.LoadSingleKnowledgeSourceForKnowledgeSourcesList,
): IKnowledgeSourceListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadSingleKnowledgeSourceForKnowledgeSourcesListSuccess(
  state: IKnowledgeSourceListState,
  action: fromActions.LoadSingleKnowledgeSourceForKnowledgeSourcesListSuccess,
): IKnowledgeSourceListState {
  return {
    ...knowledgeSourcesAdapter.upsertOne(action.payload, state),
    ...networkAdapter.makeGenericInactive(state),
  };
}

function removeSingleKnowledgeSourceFromList(
  state: IKnowledgeSourceListState,
  action: fromActions.RemoveSingleKnowledgeSourceFromKnowledgeSourcesList,
): IKnowledgeSourceListState {
  return knowledgeSourcesAdapter.removeOne(action.payload, state);
}

function updateSearchForKnowledgeSourcesListHandler(
  state: IKnowledgeSourceListState,
  action: fromActions.UpdateSearchForKnowledgeSourcesList,
): IKnowledgeSourceListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
    searchTerm: action.payload,
  };
}

function knowledgeSourcesListFailureHandler(
  state: IKnowledgeSourceListState,
  action: fromActions.KnowledgeSourcesListFailure,
): IKnowledgeSourceListState {
  return {
    ...state,
    ...networkAdapter.makeGenericInactive(state),
  };
}

export const { selectAnyNetworkActive, selectGenericNetworkActive, selectNetworkActive } = networkAdapter.selectors;
export const { selectEntities, selectAll } = knowledgeSourcesAdapter.getSelectors();
export const getSearchTerm = (state: IKnowledgeSourceListState) => state.searchTerm;
export const getPagination = (state: IKnowledgeSourceListState) => state.pagination;
