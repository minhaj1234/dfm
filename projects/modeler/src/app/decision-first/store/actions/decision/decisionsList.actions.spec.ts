import { blankPages } from 'core/models';
import { Decision } from '../../../models/decision.model';
import * as decisionsListActions from './decisionsList.actions';

describe('Decision List Actions', () => {
  describe('Load Decisions List', () => {
    it('should create an action', () => {
      const action = new decisionsListActions.LoadDecisionsList();
      expect({ ...action }).toEqual({
        type: decisionsListActions.LOAD_DECISIONS_LIST,
      });
    });
  });

  describe('Load Specific Page For Decisions List', () => {
    it('should create an action', () => {
      const payload = 'https://test.test';
      const action = new decisionsListActions.LoadSpecificPageForDecisionsList(payload);
      expect({ ...action }).toEqual({
        payload,
        type: decisionsListActions.LOAD_SPECIFIC_PAGE_FOR_DECISIONS_LIST,
      });
    });
  });

  describe('Load Decisions List Success', () => {
    it('should create an action', () => {
      const decision1: Decision = {} as any;
      const decision2: Decision = {} as any;
      const payload = { results: [decision1, decision2], pagination: blankPages };
      const action = new decisionsListActions.LoadDecisionsListSuccess(payload);
      expect({ ...action }).toEqual({
        payload,
        type: decisionsListActions.LOAD_DECISIONS_LIST_SUCCESS,
      });
    });
  });

  describe('Update Search For Decisions List', () => {
    it('should create an action with an empty payload', () => {
      const action = new decisionsListActions.UpdateSearchForDecisionsList();
      expect({ ...action }).toEqual({
        payload: '',
        type: decisionsListActions.UPDATE_SEARCH_FOR_DECISIONS_LIST,
      });
    });

    it('should create an action', () => {
      const payload = 'abc';
      const action = new decisionsListActions.UpdateSearchForDecisionsList(payload);
      expect({ ...action }).toEqual({
        payload,
        type: decisionsListActions.UPDATE_SEARCH_FOR_DECISIONS_LIST,
      });
    });
  });

  describe('Load Single Decision For Decisions List', () => {
    it('should create an action', () => {
      const action = new decisionsListActions.LoadSingleDecisionForDecisionsList('decision1');
      expect({ ...action }).toEqual({
        payload: 'decision1',
        type: decisionsListActions.LOAD_SINGLE_DECISION_FOR_DECISIONS_LIST,
      });
    });
  });

  describe('Load Single Decision For Decisions List Success', () => {
    it('should create an action', () => {
      const payload = new Decision();
      const action = new decisionsListActions.LoadSingleDecisionForDecisionsListSuccess(payload);
      expect({ ...action }).toEqual({
        payload,
        type: decisionsListActions.LOAD_SINGLE_DECISION_FOR_DECISIONS_LIST_SUCCESS,
      });
    });
  });

  describe('Remove Single Decision From Decisions List', () => {
    it('should create an action', () => {
      const payload = 'decision1';
      const action = new decisionsListActions.RemoveSingleDecisionFromDecisionsList(payload);
      expect({ ...action }).toEqual({
        payload,
        type: decisionsListActions.REMOVE_SINGLE_DECISION_FROM_DECISIONS_LIST,
      });
    });
  });

  describe('Decisions List Failure', () => {
    it('should create an action', () => {
      const payload = new Error('test error');
      const action = new decisionsListActions.DecisionsListFailure(payload);
      expect({ ...action }).toEqual({
        payload,
        type: decisionsListActions.DECISIONS_LIST_FAILURE,
      });
    });
  });
});
