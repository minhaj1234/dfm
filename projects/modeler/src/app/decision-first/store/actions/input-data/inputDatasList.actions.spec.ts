import { blankPages } from 'core/models';
import { InputData } from '../../../models/InputData.model';
import * as inputDataListActions from './inputDatasList.actions';

describe('Input Data List Actions', () => {
  describe('Load Input Data List', () => {
    it('should create an action', () => {
      const action = new inputDataListActions.LoadInputDatasList();
      expect({ ...action }).toEqual({
        type: inputDataListActions.LOAD_INPUT_DATAS_LIST,
      });
    });
  });

  describe('Load Specific Page For Input Data List', () => {
    it('should create an action', () => {
      const payload = 'https://test.test';
      const action = new inputDataListActions.LoadSpecificPageForInputDataList(payload);
      expect({ ...action }).toEqual({
        payload,
        type: inputDataListActions.LOAD_SPECIFIC_PAGE_FOR_INPUT_DATA_LIST,
      });
    });
  });

  describe('Load Input Datas List Success', () => {
    it('should create an action', () => {
      const inputData1: InputData = {} as any;
      const inputData2: InputData = {} as any;
      const payload = { results: [inputData1, inputData2], pagination: blankPages };
      const action = new inputDataListActions.LoadInputDatasListSuccess(payload);
      expect({ ...action }).toEqual({
        payload,
        type: inputDataListActions.LOAD_INPUT_DATAS_LIST_SUCCESS,
      });
    });
  });

  describe('Input Datas List Failure', () => {
    it('should create an action', () => {
      const action = new inputDataListActions.InputDatasListFailure(new Error('a message'));
      expect({ ...action }).toEqual({
        payload: new Error('a message'),
        type: inputDataListActions.INPUT_DATAS_LIST_FAILURE,
      });
    });
  });
});
