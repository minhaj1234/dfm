import { createSelector } from '@ngrx/store';
import * as fromFeature from '../../reducers';

export const getActiveDiagramsState = createSelector(
  fromFeature.getDecisionFirstState,
  (state: fromFeature.IDecisionFirstState) => state.activeDiagrams,
);

export const getLinkTypeActiveDiagram = (id) =>
  createSelector(getActiveDiagramsState, (activeDiagrams) => activeDiagrams.entities[id].linkType);

export const getSelectedDiagramObjectsActiveDiagram = (id) =>
  createSelector(getActiveDiagramsState, (activeDiagrams) => activeDiagrams.entities[id].selectedDiagramObjects);

export const getSelectedSidebarTabTypeActiveDiagram = (id) =>
  createSelector(getActiveDiagramsState, (activeDiagrams) => activeDiagrams.entities[id].selectedSidebarTabType);

export const getDiagramImageActiveDiagram = (id) =>
  createSelector(getActiveDiagramsState, (activeDiagrams) => activeDiagrams.entities[id] ? activeDiagrams.entities[id].diagramImage : null);
