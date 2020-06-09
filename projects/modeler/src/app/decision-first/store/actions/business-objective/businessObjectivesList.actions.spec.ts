import { blankPages } from 'core/models';
import { BusinessObjective } from '../../../models/businessObjective.model';
import * as businessObjectiveListActions from './businessObjectivesList.actions';

describe('BusinessObjective List Actions', () => {
  describe('Load Business Objectives List', () => {
    it('should create an action', () => {
      const action = new businessObjectiveListActions.LoadBusinessObjectivesList();
      expect({ ...action }).toEqual({
        type: businessObjectiveListActions.LOAD_BUSINESS_OBJECTIVES_LIST,
      });
    });
  });

  describe('Load Specific Page For Business Objectives List', () => {
    it('should create an action', () => {
      const payload = 'https://test.test';
      const action = new businessObjectiveListActions.LoadSpecificPageForBusinessObjectivesList(payload);
      expect({ ...action }).toEqual({
        payload,
        type: businessObjectiveListActions.LOAD_SPECIFIC_PAGE_FOR_BUSINESS_OBJECTIVES_LIST,
      });
    });
  });

  describe('Load Business Objectives List Success', () => {
    it('should create an action', () => {
      const businessObjective1: BusinessObjective = {} as any;
      const businessObjective2: BusinessObjective = {} as any;
      const payload = { results: [businessObjective1, businessObjective2], pagination: blankPages };
      const action = new businessObjectiveListActions.LoadBusinessObjectivesListSuccess(payload);
      expect({ ...action }).toEqual({
        payload,
        type: businessObjectiveListActions.LOAD_BUSINESS_OBJECTIVES_LIST_SUCCESS,
      });
    });
  });

  describe('Business Objectives List Failure', () => {
    it('should create an action', () => {
      const action = new businessObjectiveListActions.BusinessObjectivesListFailure(new Error('a message'));
      expect({ ...action }).toEqual({
        payload: new Error('a message'),
        type: businessObjectiveListActions.BUSINESS_OBJECTIVES_LIST_FAILURE,
      });
    });
  });
});
