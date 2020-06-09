import { createSelector } from '@ngrx/store';
import { Decision } from '../../../models/decision.model';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import * as fromFeature from '../../reducers';
import * as fromKnowledgeSources from '../../reducers/knowledge-source/knowledgeSources.reducer';

export const getKnowledgeSourcesState = createSelector(
  fromFeature.getDecisionFirstState,
  (state: fromFeature.IDecisionFirstState) => state.knowledgeSources,
);

export const getKnowledgeSourceNetworkActive = createSelector(
  getKnowledgeSourcesState,
  fromKnowledgeSources.selectAnyNetworkActive,
);

export const getSelectedKnowledgeSource = (id: string) =>
  createSelector(
    getKnowledgeSourcesState,
    (decisionState): KnowledgeSource => decisionState.entities[id],
  );

export const getSelectedKnowledgeSourceNetworkActive = (id: string) =>
  createSelector(
    getKnowledgeSourcesState,
    (decisionState): boolean => decisionState.networkActive[id] || false,
  );

export const getLoadedKnowledgeSources = createSelector(
  getKnowledgeSourcesState,
  fromKnowledgeSources.selectEntities,
);

export const getLoadedKnowledgeSourcesAsArray = createSelector(
  getKnowledgeSourcesState,
  fromKnowledgeSources.selectAll,
);

export const getLoadedKnowledgeSourcesDiagrams = createSelector(
  getLoadedKnowledgeSourcesAsArray,
  (knowledgeSources: KnowledgeSource[]) => {
    return [].concat.apply([], knowledgeSources.map((knowledgeSource: KnowledgeSource) => [...knowledgeSource.diagrams]));
  },
);

export const getLoadedKnowledgeSourcesDecisions = createSelector(
  getLoadedKnowledgeSourcesAsArray,
  (knowledgeSources) => {
    return [].concat.apply(
      [],
      knowledgeSources.map((knowledgeSource: KnowledgeSource) => [
        ...knowledgeSource.requiresDecisions,
        ...knowledgeSource.requiredByDecisions,
      ]),
    ) as Decision[];
  },
);

export const getLoadedKnowledgeSourcesInputData = createSelector(
  getLoadedKnowledgeSourcesAsArray,
  (knowledgeSources: KnowledgeSource[]) => {
    return [].concat.apply([], knowledgeSources.map((knowledgeSource: KnowledgeSource) => [...knowledgeSource.requiresInputData]));
  },
);

export const getLoadedKnowledgeSourcesKnowledgeSources = createSelector(
  getLoadedKnowledgeSourcesAsArray,
  (knowledgeSources) => {
    return [].concat.apply(
      [],
      knowledgeSources.map((knowledgeSource: KnowledgeSource) => [
        ...knowledgeSource.requiresKnowledgeSources,
        ...knowledgeSource.requiredByKnowledgeSources,
      ]),
    ) as KnowledgeSource[];
  },
);

export const getLoadedKnowledgeSourcesOrganizations = createSelector(
  getLoadedKnowledgeSourcesAsArray,
  (knowledgeSources: KnowledgeSource[]) => {
    return [].concat.apply([], knowledgeSources.map((knowledgeSource: KnowledgeSource) => [...knowledgeSource.organizations]));
  },
);
