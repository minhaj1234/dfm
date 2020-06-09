import { createSelector } from '@ngrx/store';
import { Decision } from '../../../models/decision.model';
import { Diagram } from '../../../models/diagram.model';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import * as fromFeature from '../../reducers';
import * as fromDiagrams from '../../reducers/diagram/diagrams.reducer';

export const getDiagramsState = createSelector(
  fromFeature.getDecisionFirstState,
  (state: fromFeature.IDecisionFirstState) => state.diagrams,
);

export const getLoadedDiagrams = createSelector(getDiagramsState, fromDiagrams.selectEntities);

export const getLoadedDiagramsAsArray = createSelector(getDiagramsState, fromDiagrams.selectAll);

export const getDiagramsAnyNetworkActive = createSelector(getDiagramsState, fromDiagrams.selectAnyNetworkActive);

export const getSelectedDiagram = (id) =>
  createSelector(getDiagramsState, (diagramState): Diagram => diagramState.entities[id]);

export const getLoadedDiagramsDecisions = createSelector(getLoadedDiagramsAsArray, (diagrams) => {
  return [].concat.apply([], diagrams.map((diagram) => diagram.decisions)) as Decision[];
});

export const getLoadedDiagramsInputData = createSelector(
  getLoadedDiagramsAsArray,
  (diagrams: Diagram[]) => {
    return [].concat.apply([], diagrams.map((diagram: Diagram) => [...diagram.inputDatas]));
  },
);

export const getLoadedDiagramsKnowledgeSources = createSelector(getLoadedDiagramsAsArray, (diagrams) => {
  return [].concat.apply([], diagrams.map((diagram) => diagram.knowledgeSources)) as KnowledgeSource[];
});

export const getSelectedDiagramNetworkActive = (id) =>
  createSelector(getDiagramsState, (diagramState): boolean => diagramState.networkActive[id] || false);
