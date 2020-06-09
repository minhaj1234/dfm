import { Diagram } from '../../../models/diagram.model';
import { InputData } from '../../../models/inputData.model';
import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import { Organization } from '../../../models/organization.model';
import * as fromActions from '../../actions';
import * as fromInputData from './inputData.reducer';

describe('InputData Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromInputData;
      const action = {} as any;

      const state = fromInputData.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe(`${fromActions.LOAD_INPUT_DATA} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromInputData;
      const action = new fromActions.LoadInputData('abc');

      const state = fromInputData.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.LOAD_INPUT_DATA_SUCCESS} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromInputData;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.LoadInputDataSuccess({ id: 'abc' } as any);

      const state = fromInputData.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
      expect(state.entities).toEqual({ abc: { id: 'abc' } } as any);
    });
  });

  describe(`${fromActions.ADD_INPUT_DATA} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromInputData;
      const action = new fromActions.AddInputData({} as any);

      const state = fromInputData.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.UPDATE_INPUT_DATA} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromInputData;
      const action = new fromActions.UpdateInputData({
        inputData: { id: 'abc' }
      });

      const state = fromInputData.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.DELETE_INPUT_DATA} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromInputData;
      const action = new fromActions.DeleteInputData({ id: 'abc' } as any);

      const state = fromInputData.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.ADD_RELATED_OBJECT_TO_INPUT_DATA} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromInputData;
      const action = new fromActions.AddRelatedObjectToInputData({
        sourceObject: {id: 'sourceObjectId'} as InputData,
        relatedObject: {id: 'relatedObjectId'} as Organization,
        relationPath: ObjectRelationsNames.Organizations,
      });

      const state = fromInputData.reducer(initialState, action);

      expect(state.networkActive).toEqual({ sourceObjectId: true });
    });
  });

  describe(`${fromActions.UPDATE_INPUT_DATA_RELATED_OBJECT} action`, () => {
    it('should update diagram', () => {
      const { initialState } = fromInputData;
      const currentState = {
        ...initialState,
        entities: {
          abc: {
            id: 'abc',
            diagrams: [{ id: 'diagram1', name: 'old name' }]
          },
          def: {
            id: 'def',
            diagrams: [{ id: 'diagram2', name: 'do not change' }]
          },
        },
      };
      const newDiagram = { id: 'diagram1', name: 'new name' } as Diagram;
      const action = new fromActions.UpdateInputDataRelatedObject({object: newDiagram, paths: [ObjectRelationsNames.Diagrams]});

      const state = fromInputData.reducer(currentState as any, action);

      expect(state.entities.abc.diagrams[0].name).toEqual('new name');
      expect(state.entities.def.diagrams[0].name).toEqual('do not change');
    });
  });

  describe(`${fromActions.REMOVE_RELATED_OBJECT_FROM_INPUT_DATA} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromInputData;
      const action = new fromActions.RemoveRelatedObjectFromInputData({
        sourceObject: {id: 'sourceObjectId'} as InputData,
        relatedObject: {id: 'relatedObjectId'} as Organization,
        relationPath: ObjectRelationsNames.Organizations,
      });

      const state = fromInputData.reducer(initialState, action);

      expect(state.networkActive).toEqual({ sourceObjectId: true });
    });
  });

  describe(`${fromActions.UPDATE_OBJECT_TAGS} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromInputData;
      const action = new fromActions.UpdateObjectTags({
        id: 'objectId',
        missingTagNames: [],
        extraTagIds: [],
        type: ObjectClassNames.InputData
      });

      const state = fromInputData.reducer(initialState, action);

      expect(state.networkActive).toEqual({ objectId: true });
    });
  });

  describe(`${fromActions.FINISHED_NETWORK_REQUEST_FOR_INPUT_DATA} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromInputData;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.FinishedNetworkRequestForInputData('abc');

      const state = fromInputData.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
    });
  });

  describe(`${fromActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_INPUT_DATA} action`, () => {
    it('should have genericNetworkLoading be false', () => {
      const { initialState } = fromInputData;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.FinishedGenericNetworkRequestForInputData();

      const state = fromInputData.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toEqual(false);
    });
  });

  describe(`${fromActions.INPUT_DATA_FAILURE} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromInputData;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.InputDataFailure({ id: 'abc', error: new Error('some message') });

      const state = fromInputData.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
    });
  });

  describe(`${fromActions.REMOVE_INPUT_DATA_FROM_LOCAL_MEMORY} action`, () => {
    it('should have genericNetworkLoading be false', () => {
      const { initialState } = fromInputData;
      const stateWithEntityLoaded = { ...initialState, entities: { abc: { id: 'abc' } as any } };
      const action = new fromActions.RemoveInputDataFromLocalMemory('abc');

      const state = fromInputData.reducer(stateWithEntityLoaded, action);

      expect(state.entities).toEqual({});
    });
  });
});
