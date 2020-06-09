import { blankPages } from 'core/models';
import { ImplementationComponent } from '../../../models/implementationComponent.model';
import * as implementationComponentListActions from './implementationComponentsList.action';

describe('Implementation Components List Actions', () => {
  describe('Load Implementation Components List', () => {
    it('should create an action', () => {
      const action = new implementationComponentListActions.LoadImplementationComponentsList();
      expect({ ...action }).toEqual({
        type: implementationComponentListActions.LOAD_IMPLEMENTATION_COMPONENTS_LIST,
      });
    });
  });

  describe('Load Specific Page For Implementation Components List', () => {
    it('should create an action', () => {
      const payload = 'https://test.test';
      const action = new implementationComponentListActions.LoadSpecificPageForImplementationComponentsList(payload);
      expect({ ...action }).toEqual({
        payload,
        type: implementationComponentListActions.LOAD_SPECIFIC_PAGE_FOR_IMPLEMENTATION_COMPONENTS_LIST,
      });
    });
  });

  describe('Load Implementation Components List Success', () => {
    it('should create an action', () => {
      const implementationComponent1: ImplementationComponent = {} as any;
      const implementationComponent2: ImplementationComponent = {} as any;
      const payload = { results: [implementationComponent1, implementationComponent2], pagination: blankPages };
      const action = new implementationComponentListActions.LoadImplementationComponentsListSuccess(payload);
      expect({ ...action }).toEqual({
        payload,
        type: implementationComponentListActions.LOAD_IMPLEMENTATION_COMPONENTS_LIST_SUCCESS,
      });
    });
  });

  describe('Implementation Components List Failure', () => {
    it('should create an action', () => {
      const action = new implementationComponentListActions.ImplementationComponentsListFailure(new Error('a message'));
      expect({ ...action }).toEqual({
        payload: new Error('a message'),
        type: implementationComponentListActions.IMPLEMENTATION_COMPONENTS_LIST_FAILURE,
      });
    });
  });
});
