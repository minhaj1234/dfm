import { createSelector } from '@ngrx/store';
import { Diagram } from '../../../models/diagram.model';
import * as fromFeature from '../../reducers';
import * as fromDiagramsList from '../../reducers/diagram/diagramsList.reducer';

export const getDiagramsListState = createSelector(
  fromFeature.getDecisionFirstState,
  (state: fromFeature.IDecisionFirstState) => state.diagramsList,
);

export const getDiagramsList = createSelector(
  getDiagramsListState, 
  fromDiagramsList.selectAll
);

export const getDiagramsListNetworkActive = createSelector(
  getDiagramsListState,
  fromDiagramsList.selectAnyNetworkActive,
);
export const getDiagramsEntities = createSelector(
  getDiagramsListState, 
  fromDiagramsList.selectEntities,
);

export const getDiagramsListSearchTerm = createSelector(
  getDiagramsListState, 
  fromDiagramsList.getSearchTerm,
);

export const getDiagramsListPagination = createSelector(
  getDiagramsListState, 
  fromDiagramsList.getPagination,
);

export const getSelectedDiagramFromDiagramsList = (id) =>
  createSelector(getDiagramsListState, (diagramState): Diagram => diagramState.entities[id]);