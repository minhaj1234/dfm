import { blankPages } from 'core/models';
import { Process } from '../../../models/process.model';
import * as processesListActions from './processesList.actions';

describe('Processes List Actions', () => {
  describe('Load Processes List', () => {
    it('should create an action', () => {
      const action = new processesListActions.LoadProcessesList();
      expect({ ...action }).toEqual({
        type: processesListActions.LOAD_PROCESSES_LIST,
      });
    });
  });

  describe('Load Specific Page For Processes List', () => {
    it('should create an action', () => {
      const payload = 'https://test.test';
      const action = new processesListActions.LoadSpecificPageForProcessesList(payload);
      expect({ ...action }).toEqual({
        payload,
        type: processesListActions.LOAD_SPECIFIC_PAGE_FOR_PROCESSES_LIST,
      });
    });
  });

  describe('Load Processes List Success', () => {
    it('should create an action', () => {
      const process1: Process = {} as any;
      const process2: Process = {} as any;
      const payload = { results: [process1, process2], pagination: blankPages };
      const action = new processesListActions.LoadProcessesListSuccess(payload);
      expect({ ...action }).toEqual({
        payload,
        type: processesListActions.LOAD_PROCESSES_LIST_SUCCESS,
      });
    });
  });

  describe('Processes List Failure', () => {
    it('should create an action', () => {
      const action = new processesListActions.ProcessesListFailure(new Error('a message'));
      expect({ ...action }).toEqual({
        payload: new Error('a message'),
        type: processesListActions.PROCESSES_LIST_FAILURE,
      });
    });
  });
});
