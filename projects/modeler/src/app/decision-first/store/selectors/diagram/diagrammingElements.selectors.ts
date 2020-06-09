import { createSelector } from '@ngrx/store';
import { Decision } from '../../../models/decision.model';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import { convertGraphableToDiagramNode } from '../../../utilitites/goJsHelpers';
import * as fromFeature from '../../reducers';
import * as fromDiagrammingElements from '../../reducers/diagram/diagrammingElements.reducer';

export const getDiagrammingElementsState = createSelector(
  fromFeature.getDecisionFirstState,
  (state: fromFeature.IDecisionFirstState) => state.diagrammingElements,
);

export const getDiagrammingElements = createSelector(getDiagrammingElementsState, fromDiagrammingElements.selectAll);

export const getPaletteList = createSelector(getDiagrammingElements, (graphables) =>
  graphables.map(convertGraphableToDiagramNode),
);

export const getDiagrammingElementsNetworkActive = createSelector(
  getDiagrammingElementsState,
  fromDiagrammingElements.selectAnyNetworkActive,
);

export const getDiagrammingElementsPagination = createSelector(
  getDiagrammingElementsState,
  fromDiagrammingElements.getPagination,
);

export const getDiagrammingElementsSearchTerm = createSelector(
  getDiagrammingElementsState,
  fromDiagrammingElements.getSearchTerm,
);

export const getDiagrammingElementsDecisions = createSelector(getDiagrammingElements, (graphables) => {
  return graphables.filter((graphable) => graphable.className === 'Decision') as Decision[];
});

export const getDiagrammingElementsKnowledgeSources = createSelector(getDiagrammingElements, (graphables) => {
  return graphables.filter((graphable) => graphable.className === 'KnowledgeSource') as KnowledgeSource[];
});
