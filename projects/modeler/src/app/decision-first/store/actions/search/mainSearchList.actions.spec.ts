import { blankPages } from 'core/models';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import { ObjectClassNames } from '../../../models/objects.model';
import { Search } from '../../../models/search.model';
import * as mainSearchListActions from './mainSearchList.actions';

describe('Main Search List Actions', () => {
  describe('Load Main Search List', () => {
    it('should create an action', () => {
      const action = new mainSearchListActions.LoadMainSearchList();
      expect({ ...action }).toEqual({
        type: mainSearchListActions.LOAD_MAIN_SEARCH_LIST,
      });
    });
  });

  describe('Load Specific Page For Main Search List', () => {
    it('should create an action', () => {
      const payload = 'https://test.test';
      const action = new mainSearchListActions.LoadSpecificPageForMainSearchList(payload);
      expect({ ...action }).toEqual({
        payload,
        type: mainSearchListActions.LOAD_SPECIFIC_PAGE_FOR_MAIN_SEARCH_LIST,
      });
    });
  });

  describe('Load Main Search List Success', () => {
    it('should create an action', () => {
      const search1: Search = {} as any;
      const search2: Search = {} as any;
      const payload = { results: [search1, search2], pagination: blankPages };
      const action = new mainSearchListActions.LoadMainSearchListSuccess(payload);
      expect({ ...action }).toEqual({
        payload,
        type: mainSearchListActions.LOAD_MAIN_SEARCH_LIST_SUCCESS,
      });
    });
  });

  describe('Update Search For Main Search List', () => {
    it('should create an action', () => {
      const action = new mainSearchListActions.UpdateSearchForMainSearchList({
        searchTerm: 'some string',
      });
      expect({ ...action }).toEqual({
        payload: {
          searchTerm: 'some string',
        },
        type: mainSearchListActions.UPDATE_SEARCH_FOR_MAIN_SEARCH_LIST,
      });
    });
  });

  describe('Get Main Search List Initial State', () => {
    it('should create an action', () => {
      const action = new mainSearchListActions.GetMainSearchListInitialState();
      expect({ ...action }).toEqual({
        type: mainSearchListActions.GET_MAIN_SEARCH_LIST_INITIAL_STATE,
      });
    });
  });

  describe('Main Search List Failure', () => {
    it('should create an action', () => {
      const action = new mainSearchListActions.MainSearchListFailure(new Error('error message for test'));
      expect({ ...action }).toEqual({
        payload: new Error('error message for test'),
        type: mainSearchListActions.MAIN_SEARCH_LIST_FAILURE,
      });
    });
  });
});
