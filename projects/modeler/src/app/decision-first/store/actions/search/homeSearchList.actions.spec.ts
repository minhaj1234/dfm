import { blankPages } from 'core/models';
import { ObjectClassNames } from '../../../models/objects.model';
import { Search } from '../../../models/search.model';
import { System } from '../../../models/system.model';
import * as homeSearchListActions from './homeSearchList.actions';

describe('Home Search List Actions', () => {
  describe('Load Home Search List', () => {
    it('should create an action', () => {
      const action = new homeSearchListActions.LoadHomeSearchList();
      expect({ ...action }).toEqual({
        type: homeSearchListActions.LOAD_HOME_SEARCH_LIST,
      });
    });
  });

  describe('Load Specific Page For Home Search List', () => {
    it('should create an action', () => {
      const payload = 'https://test.test';
      const action = new homeSearchListActions.LoadSpecificPageForHomeSearchList(payload);
      expect({ ...action }).toEqual({
        payload,
        type: homeSearchListActions.LOAD_SPECIFIC_PAGE_FOR_HOME_SEARCH_LIST,
      });
    });
  });

  describe('Load Home Search List Success', () => {
    it('should create an action', () => {
      const search1: Search = {} as any;
      const search2: Search = {} as any;
      const payload = { results: [search1, search2], pagination: blankPages };
      const action = new homeSearchListActions.LoadHomeSearchListSuccess(payload);
      expect({ ...action }).toEqual({
        payload,
        type: homeSearchListActions.LOAD_HOME_SEARCH_LIST_SUCCESS,
      });
    });
  });

  describe('Update Search For Home Search List', () => {
    it('should create an action', () => {
      const action = new homeSearchListActions.UpdateSearchForHomeSearchList({
        searchTerm: 'string for test',
      });
      expect({ ...action }).toEqual({
        payload: {
          searchTerm: 'string for test',
        },
        type: homeSearchListActions.UPDATE_SEARCH_FOR_HOME_SEARCH_LIST,
      });
    });
  });

  describe('Home Search List Failure', () => {
    it('should create an action', () => {
      const action = new homeSearchListActions.HomeSearchListFailure(new Error('error message for test'));
      expect({ ...action }).toEqual({
        payload: new Error('error message for test'),
        type: homeSearchListActions.HOME_SEARCH_LIST_FAILURE,
      });
    });
  });
});
