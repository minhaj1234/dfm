import { createSelector } from '@ngrx/store';
import { System } from '../../../models/system.model';
import * as fromFeature from '../../reducers';
import * as fromSystems from '../../reducers/system/systems.reducer';

export const getSystemsState = createSelector(
  fromFeature.getDecisionFirstState,
  (state: fromFeature.IDecisionFirstState) => state.systems,
);

export const getLoadedSystems = createSelector(getSystemsState, fromSystems.selectEntities);

export const getLoadedSystemsAsArray = createSelector(getSystemsState, fromSystems.selectAll);

export const getSystemsAnyNetworkActive = createSelector(getSystemsState, fromSystems.selectAnyNetworkActive);

export const getSelectedSystem = (id) =>
  createSelector(getSystemsState, (systemState): System => systemState.entities[id]);

export const getSelectedSystemNetworkActive = (id) =>
  createSelector(getSystemsState, (systemState): boolean => systemState.networkActive[id] || false);

export const getLoadedSystemsDecisions = createSelector(
  getLoadedSystemsAsArray,
  (systems: System[]) => {
    return [].concat.apply([], systems.map((system: System) => [...system.decisions]));
  },
);