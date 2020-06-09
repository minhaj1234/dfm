import { blankPages } from 'core/models';
import { System } from '../../../models/system.model';
import * as systemsListActions from './systemsList.action';

describe('Systems List Actions', () => {
  describe('Load Systems List', () => {
    it('should create an action', () => {
      const action = new systemsListActions.LoadSystemsList();
      expect({ ...action }).toEqual({
        type: systemsListActions.LOAD_SYSTEMS_LIST,
      });
    });
  });

  describe('Load Systems List Success', () => {
    it('should create an action', () => {
      const system1: System = {} as any;
      const system2: System = {} as any;
      const payload = { results: [system1, system2], pagination: blankPages };
      const action = new systemsListActions.LoadSystemsListSuccess(payload);
      expect({ ...action }).toEqual({
        payload,
        type: systemsListActions.LOAD_SYSTEMS_LIST_SUCCESS,
      });
    });
  });

  describe('Load Specific Page For Systems List', () => {
    it('should create an action', () => {
      const payload = 'https://test.test';
      const action = new systemsListActions.LoadSpecificPageForSystemsList(payload);
      expect({ ...action }).toEqual({
        payload,
        type: systemsListActions.LOAD_SPECIFIC_PAGE_FOR_SYSTEMS_LIST,
      });
    });
  });

  describe('Systems List Failure', () => {
    it('should create an action', () => {
      const action = new systemsListActions.SystemsListFailure(new Error('a message'));
      expect({ ...action }).toEqual({
        payload: new Error('a message'),
        type: systemsListActions.SYSTEMS_LIST_FAILURE,
      });
    });
  });
});
