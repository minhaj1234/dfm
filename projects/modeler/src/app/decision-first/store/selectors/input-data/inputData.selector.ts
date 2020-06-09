import { createSelector } from '@ngrx/store';
import { InputData } from '../../../models/inputData.model';
import * as fromFeature from '../../reducers';
import * as fromInputDatas from '../../reducers/input-data/inputData.reducer';

export const getInputDatasState = createSelector(
  fromFeature.getDecisionFirstState,
  (state: fromFeature.IDecisionFirstState) => state.inputDatas,
);

export const getLoadedInputDatas = createSelector(
  getInputDatasState,
  fromInputDatas.selectEntities
);

export const getLoadedInputDatasAsArray = createSelector(getInputDatasState, fromInputDatas.selectAll);

export const getInputDatasAnyNetworkActive = createSelector(getInputDatasState, fromInputDatas.selectAnyNetworkActive);

export const getSelectedInputData = (id) =>
  createSelector(getInputDatasState, (inputDataState): InputData => inputDataState.entities[id]);

export const getSelectedInputDataNetworkActive = (id) =>
  createSelector(getInputDatasState, (inputDataState): boolean => inputDataState.networkActive[id] || false);

export const getLoadedInputDataDiagrams = createSelector(
  getLoadedInputDatasAsArray,
  (inputData: InputData[]) => {
    return [].concat.apply([], inputData.map((value: InputData) => [...value.diagrams]));
  },
);

export const getLoadedInputDataDecisions = createSelector(
  getLoadedInputDatasAsArray,
  (inputData: InputData[]) => {
    return [].concat.apply([], inputData.map((value: InputData) => [...value.requiredByDecisions]));
  },
);

export const getLoadedInputDataKnowledgeSources = createSelector(
  getLoadedInputDatasAsArray,
  (inputData: InputData[]) => {
    return [].concat.apply([], inputData.map((value: InputData) => [...value.requiredByKnowledgeSources]));
  },
);

export const getLoadedInputDataOrganizations = createSelector(
  getLoadedInputDatasAsArray,
  (inputData: InputData[]) => {
    return [].concat.apply([], inputData.map((value: InputData) => [...value.organizations]));
  },
);
