import { createSelector } from '@ngrx/store';
import { BusinessObjective } from '../../../models/businessObjective.model';
import * as fromFeature from '../../reducers';
import * as fromBusinessObjectives from '../../reducers/business-objective/businessObjectives.reducer';

export const getBusinessObjectivesState = createSelector(
  fromFeature.getDecisionFirstState,
  (state: fromFeature.IDecisionFirstState) => state.businessObjectives,
);

export const getLoadedBusinessObjectives = createSelector(
  getBusinessObjectivesState,
  fromBusinessObjectives.selectEntities,
);

export const getLoadedBusinessObjectivesAsArray = createSelector(
  getBusinessObjectivesState,
  fromBusinessObjectives.selectAll,
);

export const getBusinessObjectivesAnyNetworkActive = createSelector(
  getBusinessObjectivesState,
  fromBusinessObjectives.selectAnyNetworkActive,
);

export const getSelectedBusinessObjective = (id) =>
  createSelector(
    getBusinessObjectivesState,
    (businessObjectiveState): BusinessObjective => businessObjectiveState.entities[id],
  );

export const getSelectedBusinessObjectiveNetworkActive = (id) =>
  createSelector(
    getBusinessObjectivesState,
    (businessObjectiveState): boolean => businessObjectiveState.networkActive[id] || false,
  );

export const getLoadedBusinessObjectivesDecisions = createSelector(
  getLoadedBusinessObjectivesAsArray,
  (businessObjectives: BusinessObjective[]) => {
    return [].concat.apply([], businessObjectives.map((businessObjective: BusinessObjective) => [...businessObjective.decisions]));
  },
);

export const getLoadedBusinessObjectivesOrganizations = createSelector(
  getLoadedBusinessObjectivesAsArray,
  (businessObjectives: BusinessObjective[]) => {
    return [].concat.apply([], businessObjectives.map((businessObjective: BusinessObjective) => [...businessObjective.organizations]));
  },
);
