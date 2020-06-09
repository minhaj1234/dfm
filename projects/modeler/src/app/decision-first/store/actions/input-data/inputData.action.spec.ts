import { Decision } from '../../../models/decision.model';
import { InputData, IInputDataUpdate } from '../../../models/inputData.model';
import { ObjectRelationsNames } from '../../../models/objects.model';
import { Organization } from '../../../models/organization.model';
import * as inputDataActions from './inputData.action';

describe('InputDataActions', () => {
  describe('Load Input Data', () => {
    it('should create an action', () => {
      const payload = '12345';
      
      const action = new inputDataActions.LoadInputData(payload);
    
      expect({ ...action }).toEqual({
        payload,
        type: inputDataActions.LOAD_INPUT_DATA,
      });
    });
  });

  describe('Load Input Data Success', () => {
    it('should create an action', () => {
      const payload: InputData = {} as any;
     
      const action = new inputDataActions.LoadInputDataSuccess(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: inputDataActions.LOAD_INPUT_DATA_SUCCESS,
      });
    });
  });

  describe('Add Input Data', () => {
    it('should create an action', () => {
      const payload = {
        name: 'test name',
        description: 'test description',
        type: 'STRUCTURED',
        url: 'test url'
      };

      const action = new inputDataActions.AddInputData(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: inputDataActions.ADD_INPUT_DATA,
      });
    });
  });

  describe('Update Input Data', () => {
    it('should create an action', () => {
      const payload: IInputDataUpdate = {
        inputData: {
          id: 'test id',
          name: 'test name',
          description: 'test description',
          type: 'STRUCTURED',
          url: 'test url',
          complexity: 'test complexity',
          primaryDiagramId: 'diagram id',
          _links: {} as any,
        }
      };

      const action = new inputDataActions.UpdateInputData(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: inputDataActions.UPDATE_INPUT_DATA,
      });
    });
  });

  describe('Delete Input Data', () => {
    it('should create an action', () => {
      const payload: InputData = {} as any;
     
      const action = new inputDataActions.DeleteInputData(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: inputDataActions.DELETE_INPUT_DATA,
      });
    });
  });

  describe('Add Related Object To Input Data', () => {
    it('should create an action', () => {
      const payload = {
        sourceObject: new InputData(),
        relatedObject: new Organization(),
        relatedPath: ObjectRelationsNames.Organizations,
      } as any;

      const action = new inputDataActions.AddRelatedObjectToInputData(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: inputDataActions.ADD_RELATED_OBJECT_TO_INPUT_DATA,
      });
    });
  });

  describe('Update Input Data Related Object', () => {
    it('should create an action', () => {
      const payload = {object: new Decision(), paths: ['test path']};
    
      const action = new inputDataActions.UpdateInputDataRelatedObject(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: inputDataActions.UPDATE_INPUT_DATA_RELATED_OBJECT,
      });
    });
  });

  describe('Remove Related Object From Input Data', () => {
    it('should create an action', () => {
      const payload = {
        sourceObject: new InputData(),
        relatedObject: new Organization(),
        relatedPath: ObjectRelationsNames.Organizations,
      } as any;

      const action = new inputDataActions.RemoveRelatedObjectFromInputData(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: inputDataActions.REMOVE_RELATED_OBJECT_FROM_INPUT_DATA,
      });
    });
  });

  describe('Load Input Data As Child', () => {
    it('should create an action', () => {
      const payload = 'test id';
     
      const action = new inputDataActions.LoadInputDataAsChild(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: inputDataActions.LOAD_INPUT_DATA_AS_CHILD,
      });
    });
  });

  describe('Finished Network Request For Input Data', () => {
    it('should create an action', () => {
      const payload = 'inputDataTestId';
     
      const action = new inputDataActions.FinishedNetworkRequestForInputData(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: inputDataActions.FINISHED_NETWORK_REQUEST_FOR_INPUT_DATA,
      });
    });
  });

  describe('Finished Generic Network Request For Input Data', () => {
    it('should create an action', () => {
      const action = new inputDataActions.FinishedGenericNetworkRequestForInputData();
      expect({ ...action }).toEqual({
        type: inputDataActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_INPUT_DATA,
      });
    });
  });

  describe('Input Data Failure', () => {
    it('should create an action', () => {
      const payload = { error: new Error('Fail message'), id: '1234' };
     
      const action = new inputDataActions.InputDataFailure(payload);
    
      expect({ ...action }).toEqual({
        payload,
        type: inputDataActions.INPUT_DATA_FAILURE,
      });
    });
  });

  describe('Generic Input Data Failure', () => {
    it('should create an action', () => {
      const payload = new Error('test error message');
      const action = new inputDataActions.GenericInputDataFailure(payload);
      expect({ ...action }).toEqual({
        payload,
        type: inputDataActions.GENERIC_INPUT_DATA_FAILURE,
      });
    });
  });

  describe('Remove Input Data From Local Memory', () => {
    it('should create an action', () => {
      const payload = 'test id';
      
      const action = new inputDataActions.RemoveInputDataFromLocalMemory(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: inputDataActions.REMOVE_INPUT_DATA_FROM_LOCAL_MEMORY,
      });
    });
  });

  describe('Remove Preview Input Data From Local Memory', () => {
    it('should create an action', () => {
      const payload = '12345';
      
      const action = new inputDataActions.RemovePreviewInputDataFromLocalMemory(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: inputDataActions.REMOVE_PREVIEW_INPUT_DATA_FROM_LOCAL_MEMORY,
      });
    });
  });
});
