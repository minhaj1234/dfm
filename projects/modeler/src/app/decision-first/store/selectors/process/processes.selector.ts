import { createSelector } from '@ngrx/store';
import { Process } from '../../../models/process.model';
import * as fromFeature from '../../reducers';
import * as fromProcesses from '../../reducers/process/processes.reducer';

export const getProcessesState = createSelector(
  fromFeature.getDecisionFirstState,
  (state: fromFeature.IDecisionFirstState) => state.processes,
);

export const getLoadedProcesses = createSelector(getProcessesState, fromProcesses.selectEntities);

export const getLoadedProcessesAsArray = createSelector(getProcessesState, fromProcesses.selectAll);

export const getProcessesAnyNetworkActive = createSelector(getProcessesState, fromProcesses.selectAnyNetworkActive);

export const getSelectedProcess = (id) =>
  createSelector(getProcessesState, (processState): Process => processState.entities[id]);

export const getSelectedProcessNetworkActive = (id) =>
  createSelector(getProcessesState, (processState): boolean => processState.networkActive[id] || false);

export const getLoadedProcessesDecisions = createSelector(
  getLoadedProcessesAsArray,
  (processes: Process[]) => {
    return [].concat.apply([], processes.map((process: Process) => [...process.decisions]));
  },
);
