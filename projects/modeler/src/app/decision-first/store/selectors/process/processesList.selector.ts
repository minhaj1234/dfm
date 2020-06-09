import { createSelector } from '@ngrx/store';
import { Process } from '../../../models/process.model';
import * as fromFeature from '../../reducers';
import * as fromProcessesList from '../../reducers/process/processesList.reducer';

export const getProcessesListState = createSelector(
  fromFeature.getDecisionFirstState,
  (state: fromFeature.IDecisionFirstState) => state.processesList,
);

export const getProcessesList = createSelector(getProcessesListState, fromProcessesList.selectAll);
export const getProcessesListNetworkActive = createSelector(
  getProcessesListState,
  fromProcessesList.selectAnyNetworkActive,
);
export const getProcessesEntities = createSelector(getProcessesListState, fromProcessesList.selectEntities);

export const getProcessesListPagination = createSelector(
  getProcessesListState,
  fromProcessesList.getPagination,
);

export const getSelectedProcessFromProcessesList = (id) =>
  createSelector(getProcessesListState, (processState): Process => processState.entities[id]);
