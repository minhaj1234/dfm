import { createSelector } from '@ngrx/store';
import { BusinessObjective } from '../../../models/businessObjective.model';
import * as fromFeature from '../../reducers';
import * as fromBusinessObjectivesList from '../../reducers/business-objective/businessObjectivesList.reducer';

export const getBusinessObjectivesListState = createSelector(
  fromFeature.getDecisionFirstState,
  (state: fromFeature.IDecisionFirstState) => state.businessObjectivesList,
);

export const getBusinessObjectivesList = createSelector(
  getBusinessObjectivesListState,
  fromBusinessObjectivesList.selectAll,
);
export const getBusinessObjectivesListNetworkActive = createSelector(
  getBusinessObjectivesListState,
  fromBusinessObjectivesList.selectAnyNetworkActive,
);
export const getBusinessObjectivesEntities = createSelector(
  getBusinessObjectivesListState,
  fromBusinessObjectivesList.selectEntities,
);

export const getBusinessObjectivesListPagination = createSelector(
  getBusinessObjectivesListState,
  fromBusinessObjectivesList.getPagination,
);

export const getSelectedBusinessObjectiveFromBusinessObjectivesList = (id) =>
  createSelector(
    getBusinessObjectivesListState,
    (businessObjectiveState): BusinessObjective => businessObjectiveState.entities[id],
  );
