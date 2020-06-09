import { createSelector } from '@ngrx/store';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import * as fromFeature from '../../reducers';
import * as fromKnowledgeSourcesList from '../../reducers/knowledge-source/knowledgeSourcesList.reducer';

export const getKnowledgeSourcesListState = createSelector(
  fromFeature.getDecisionFirstState,
  (state: fromFeature.IDecisionFirstState) => state.knowledgeSourcesList,
);

export const getKnowledgeSources = createSelector(
  getKnowledgeSourcesListState,
  fromKnowledgeSourcesList.selectEntities,
);
export const getKnowledgeSourcesList = createSelector(getKnowledgeSourcesListState, fromKnowledgeSourcesList.selectAll);
export const getKnowledgeSourcesListNetworkActive = createSelector(
  getKnowledgeSourcesListState,
  fromKnowledgeSourcesList.selectAnyNetworkActive,
);

export const getKnowledgeSourcesListSearchTerm = createSelector(
  getKnowledgeSourcesListState,
  fromKnowledgeSourcesList.getSearchTerm,
);

export const getKnowledgeSourcesListPagination = createSelector(
  getKnowledgeSourcesListState,
  fromKnowledgeSourcesList.getPagination,
);

export const getSelectedKnowledgeSourceFromKnowledgeSourcesList = (id: string) =>
  createSelector(
    getKnowledgeSourcesListState,
    (decisionState): KnowledgeSource => decisionState.entities[id],
  );

