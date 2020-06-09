import { Action } from '@ngrx/store';
import { IPagination } from 'core/models';
import { InputData } from '../../../models/inputData.model';

export const LOAD_INPUT_DATAS_LIST = '[DMS] Load Input Datas List';
export const LOAD_SPECIFIC_PAGE_FOR_INPUT_DATA_LIST = '[DMS] Load Specific Page For Input Data List';
export const LOAD_INPUT_DATAS_LIST_SUCCESS = '[DMS] Load Input Datas List Success';
export const INPUT_DATAS_LIST_FAILURE = '[DMS] Input Datas List Failure';

export class LoadInputDatasList implements Action {
  readonly type = LOAD_INPUT_DATAS_LIST;
}

export class LoadSpecificPageForInputDataList implements Action {
  readonly type = LOAD_SPECIFIC_PAGE_FOR_INPUT_DATA_LIST;
  constructor(public payload: string) { }
}

export class LoadInputDatasListSuccess implements Action {
  readonly type = LOAD_INPUT_DATAS_LIST_SUCCESS;
  constructor(public payload: { results: InputData[]; pagination: IPagination }) { }
}

export class InputDatasListFailure implements Action {
  readonly type = INPUT_DATAS_LIST_FAILURE;
  constructor(public payload: Error) { }
}

export type InputDatasListActions = 
  | LoadInputDatasList
  | LoadSpecificPageForInputDataList
  | LoadInputDatasListSuccess
  | InputDatasListFailure;
