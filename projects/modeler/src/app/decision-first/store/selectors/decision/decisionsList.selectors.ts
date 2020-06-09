import { createSelector } from '@ngrx/store';
import { Decision } from '../../../models/decision.model';
import * as fromFeature from '../../reducers';
import * as fromDecisionsList from '../../reducers/decision/decisionsList.reducer';

export const getDecisionsListState = createSelector(
  fromFeature.getDecisionFirstState,
  (state: fromFeature.IDecisionFirstState) => state.decisionsList,
);

export const getDecisionsListEntities = createSelector(getDecisionsListState, fromDecisionsList.selectEntities);
export const getDecisionsList = createSelector(getDecisionsListState, fromDecisionsList.selectAll);
export const getDecisionsListNetworkActive = createSelector(
  getDecisionsListState,
  fromDecisionsList.selectAnyNetworkActive,
);
export const getDecisionsListSearchTerm = createSelector(getDecisionsListState, fromDecisionsList.getSearchTerm);

export const getDecisionsListPagination = createSelector(getDecisionsListState, fromDecisionsList.getPagination);

export const getSelectedDecisionFromDecisionsList = (id: string) =>
  createSelector(
    getDecisionsListState,
    (decisionState): Decision => decisionState.entities[id],
  );
