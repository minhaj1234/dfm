import { createSelector } from '@ngrx/store';
import { InputData } from '../../../models/inputData.model';
import * as fromFeature from '../../reducers';
import * as fromInputDatasList from '../../reducers/input-data/inputDatasList.reducer';

export const getInputDatasListState = createSelector(
  fromFeature.getDecisionFirstState,
  (state: fromFeature.IDecisionFirstState) => state.inputDatasList,
);

export const getInputDatasList = createSelector(getInputDatasListState, fromInputDatasList.selectAll);
export const getInputDatasListNetworkActive = createSelector(
  getInputDatasListState,
  fromInputDatasList.selectAnyNetworkActive,
);
export const getInputDatasEntities = createSelector(getInputDatasListState, fromInputDatasList.selectEntities);

export const getInputDataListPagination = createSelector(getInputDatasListState, fromInputDatasList.getPagination);

export const getSelectedInputDataFromInputDataList = (id) =>
  createSelector(getInputDatasListState, (inputDataState): InputData => inputDataState.entities[id]);
