import { createSelector } from '@ngrx/store';
import { System } from '../../../models/system.model';
import * as fromFeature from '../../reducers';
import * as fromSystemList from '../../reducers/system/systemsList.reducer';

export const getSystemsListState = createSelector(
  fromFeature.getDecisionFirstState,
  (state: fromFeature.IDecisionFirstState) => state.systemsList,
);

export const getSystemsList = createSelector(
  getSystemsListState, 
  fromSystemList.selectAll
);

export const getSystemsListNetworkActive = createSelector(
  getSystemsListState, 
  fromSystemList.selectAnyNetworkActive
);

export const getSystemsEntities = createSelector(
  getSystemsListState, 
  fromSystemList.selectEntities
);

export const getSystemsListPagination = createSelector(
  getSystemsListState,
  fromSystemList.getPagination,
);

export const getSelectedSystemFromSystemsList = (id) =>
  createSelector(getSystemsListState, (systemState): System => systemState.entities[id]);
