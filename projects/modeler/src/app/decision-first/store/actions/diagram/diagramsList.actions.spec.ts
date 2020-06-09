import { blankPages } from 'core/models';
import { Diagram } from '../../../models/diagram.model';
import * as diagramsListActions from './diagramsList.actions';

describe('Diagram List Actions', () => {
  describe('Load Diagrams List', () => {
    it('should create an action', () => {
      const action = new diagramsListActions.LoadDiagramsList();
      expect({ ...action }).toEqual({
        type: diagramsListActions.LOAD_DIAGRAMS_LIST,
      });
    });
  });

  describe('Load Specific Page For Diagrams List', () => {
    it('should create an action', () => {
      const payload = 'https://test.test';
      const action = new diagramsListActions.LoadSpecificPageForDiagramsList(payload);
      expect({ ...action }).toEqual({
        payload,
        type: diagramsListActions.LOAD_SPECIFIC_PAGE_FOR_DIAGRAMS_LIST,
      });
    });
  });

  describe('Load Diagrams List Success', () => {
    it('should create an action', () => {
      const diagram1: Diagram = {} as any;
      const diagram2: Diagram = {} as any;
      const payload = {
        pagination: blankPages,
        results: [diagram1, diagram2],
      };
      const action = new diagramsListActions.LoadDiagramsListSuccess(payload);
      expect({ ...action }).toEqual({
        payload,
        type: diagramsListActions.LOAD_DIAGRAMS_LIST_SUCCESS,
      });
    });
  });

  describe('Update Search For Diagrams List', () => {
    it('should create an action with an empty payload', () => {
      const action = new diagramsListActions.UpdateSearchForDiagramsList();
      expect({ ...action }).toEqual({
        payload: '',
        type: diagramsListActions.UPDATE_SEARCH_FOR_DIAGRAMS_LIST,
      });
    });

    it('should create an action', () => {
      const payload = 'abc';
      const action = new diagramsListActions.UpdateSearchForDiagramsList(payload);
      expect({ ...action }).toEqual({
        payload,
        type: diagramsListActions.UPDATE_SEARCH_FOR_DIAGRAMS_LIST,
      });
    });
  });

  describe('Load Single Diagram For Diagrams List', () => {
    it('should create an action', () => {
      const action = new diagramsListActions.LoadSingleDiagramForDiagramsList('decision1');
      expect({ ...action }).toEqual({
        payload: 'decision1',
        type: diagramsListActions.LOAD_SINGLE_DIAGRAM_FOR_DIAGRAMS_LIST,
      });
    });
  });

  describe('Load Single Diagram For Diagrams List Success', () => {
    it('should create an action', () => {
      const payload = new Diagram();
      const action = new diagramsListActions.LoadSingleDiagramForDiagramsListSuccess(payload);
      expect({ ...action }).toEqual({
        payload,
        type: diagramsListActions.LOAD_SINGLE_DIAGRAM_FOR_DIAGRAMS_LIST_SUCCESS,
      });
    });
  });

  describe('Remove Single Diagram From Diagrams List', () => {
    it('should create an action', () => {
      const payload = 'decision1';
      const action = new diagramsListActions.RemoveSingleDiagramFromDiagramsList(payload);
      expect({ ...action }).toEqual({
        payload,
        type: diagramsListActions.REMOVE_SINGLE_DIAGRAM_FROM_DIAGRAMS_LIST,
      });
    });
  });

  describe('Diagrams List Failure', () => {
    it('should create an action', () => {
      const action = new diagramsListActions.DiagramsListFailure(new Error('a message'));
      expect({ ...action }).toEqual({
        payload: new Error('a message'),
        type: diagramsListActions.DIAGRAMS_LIST_FAILURE,
      });
    });
  });
});
