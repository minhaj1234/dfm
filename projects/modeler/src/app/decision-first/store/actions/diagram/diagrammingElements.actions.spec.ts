import { blankPages } from 'core/models';
import { Decision } from '../../../models/decision.model';
import * as diagrammingListActions from './diagrammingElements.actions';

describe('Diagramming Elements List Actions', () => {
  describe('UpdateSearchForDiagrammingElements', () => {
    it('should create an action with an empty payload', () => {
      const action = new diagrammingListActions.UpdateSearchForDiagrammingElements({ searchTerm: '' });
      expect({ ...action }).toEqual({
        payload: {
          searchTerm: '',
        },
        type: diagrammingListActions.UPDATE_SEARCH_FOR_DIAGRAMMING_ELEMENTS,
      });
    });

    it('should create an action', () => {
      const payload = {
        searchTerm: '',
      };
      const action = new diagrammingListActions.UpdateSearchForDiagrammingElements({ searchTerm: '' });
      expect({ ...action }).toEqual({
        payload,
        type: diagrammingListActions.UPDATE_SEARCH_FOR_DIAGRAMMING_ELEMENTS,
      });
    });
  });

  describe('Load Specific Page For Diagramming Elements List', () => {
    it('should create an action', () => {
      const payload = 'https://test.test';
      const action = new diagrammingListActions.LoadSpecificPageForDiagrammingElementsList(payload);
      expect({ ...action }).toEqual({
        payload,
        type: diagrammingListActions.LOAD_SPECIFIC_PAGE_FOR_DIAGRAMMING_ELEMENTS_LIST,
      });
    });
  });

  describe('UpdateSingleDiagrammingElementIfNeeded', () => {
    it('should create an action', () => {
      const payload = new Decision();
      const action = new diagrammingListActions.UpdateSingleDiagrammingElementIfNeeded(payload);
      expect({ ...action }).toEqual({
        payload,
        type: diagrammingListActions.UPDATE_SINGLE_DIAGRAMMING_ELEMENT_IF_NEEDED,
      });
    });
  });

  describe('LoadDiagrammingElementsListFail', () => {
    it('should create an action', () => {
      const payload = new Error('a message');
      const action = new diagrammingListActions.LoadDiagrammingElementsListFail(payload);
      expect({ ...action }).toEqual({
        payload,
        type: diagrammingListActions.LOAD_DIAGRAMMING_ELEMENTS_LIST_FAIL,
      });
    });
  });

  describe('LoadDiagrammingElementsListSuccess', () => {
    it('should create an action', () => {
      const decision1: Decision = {} as any;
      const decision2: Decision = {} as any;
      const payload = { results: [decision1, decision2], pagination: blankPages };
      const action = new diagrammingListActions.LoadDiagrammingElementsListSuccess(payload);
      expect({ ...action }).toEqual({
        payload,
        type: diagrammingListActions.LOAD_DIAGRAMMING_ELEMENTS_LIST_SUCCESS,
      });
    });
  });

  describe('RemoveSingleElementFromDiagrammingElementsList', () => {
    it('should create an action', () => {
      const payload = 'decision1';
      const action = new diagrammingListActions.RemoveSingleElementFromDiagrammingElementsList(payload);
      expect({ ...action }).toEqual({
        payload,
        type: diagrammingListActions.REMOVE_SINGLE_DIAGRAMMING_ELEMENT_IF_NEEDED,
      });
    });
  });
});
