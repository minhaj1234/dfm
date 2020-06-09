import { BusinessObjective } from '../../../models/businessObjective.model';
import { Decision } from '../../../models/decision.model';
import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import { Organization } from '../../../models/organization.model';
import * as fromActions from '../../actions';
import * as fromBusinessObjectives from './businessObjectives.reducer';

describe('BusinessObjectives Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromBusinessObjectives;
      const action = {} as any;

      const state = fromBusinessObjectives.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe(`${fromActions.LOAD_BUSINESS_OBJECTIVE} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromBusinessObjectives;
      const action = new fromActions.LoadBusinessObjective('abc');

      const state = fromBusinessObjectives.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.LOAD_BUSINESS_OBJECTIVE_SUCCESS} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromBusinessObjectives;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.LoadBusinessObjectiveSuccess({ id: 'abc' } as any);

      const state = fromBusinessObjectives.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
      expect(state.entities).toEqual({ abc: { id: 'abc' } } as any);
    });
  });

  describe(`${fromActions.ADD_BUSINESS_OBJECTIVE} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromBusinessObjectives;
      const action = new fromActions.AddBusinessObjective({} as any);

      const state = fromBusinessObjectives.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.UPDATE_BUSINESS_OBJECTIVE} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromBusinessObjectives;
      const action = new fromActions.UpdateBusinessObjective({
        businessObjective: { id: 'abc' }
      });

      const state = fromBusinessObjectives.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.DELETE_BUSINESS_OBJECTIVE} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromBusinessObjectives;
      const action = new fromActions.DeleteBusinessObjective({ id: 'abc' } as any);

      const state = fromBusinessObjectives.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.ADD_RELATED_OBJECT_TO_BUSINESS_OBJECTIVE} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromBusinessObjectives;
      const action = new fromActions.AddRelatedObjectToBusinessObjective({
        sourceObject: {id: 'sourceObjectId'} as BusinessObjective,
        relatedObject: {id: 'relatedObjectId'} as Decision,
        relationPath: ObjectRelationsNames.Decisions,
      });

      const state = fromBusinessObjectives.reducer(initialState, action);

      expect(state.networkActive).toEqual({ sourceObjectId: true });
    });
  });

  describe(`${fromActions.UPDATE_BUSINESS_OBJECTIVE_RELATED_OBJECT} action`, () => {
    it('should update decision', () => {
      const { initialState } = fromBusinessObjectives;
      const loadedState = {
        ...initialState,
        entities: {
          businessObjective1: {
            id: 'abc',
            decisions: [{ id: 'decision1', name: 'old name' }],
          },
          businessObjective2: {
            id: 'def',
            decisions: [{ id: 'decision2', name: 'do not change' }],
          },
        },
      };
      const newDecision = { id: 'decision1', name: 'new name' } as Decision;
      const action = new fromActions.UpdateBusinessObjectiveRelatedObject({object: newDecision, paths: [ObjectRelationsNames.Decisions]});

      const state = fromBusinessObjectives.reducer(loadedState as any, action);

      expect(state.entities.businessObjective1.decisions[0].name).toEqual('new name');
      expect(state.entities.businessObjective2.decisions[0].name).toEqual('do not change');
    });
  });

  describe(`${fromActions.REMOVE_RELATED_OBJECT_FROM_BUSINESS_OBJECTIVE} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromBusinessObjectives;
      const action = new fromActions.RemoveRelatedObjectFromBusinessObjective({
        sourceObject: {id: 'sourceObjectId'} as BusinessObjective,
        relatedObject: {id: 'relatedObjectId'} as Decision,
        relationPath: ObjectRelationsNames.Decisions,
      });

      const state = fromBusinessObjectives.reducer(initialState, action);

      expect(state.networkActive).toEqual({ sourceObjectId: true });
    });
  });

  describe(`${fromActions.UPDATE_OBJECT_TAGS} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromBusinessObjectives;
      const action = new fromActions.UpdateObjectTags({
        id: 'objectId',
        missingTagNames: [],
        extraTagIds: [],
        type: ObjectClassNames.BusinessObjective
      });

      const state = fromBusinessObjectives.reducer(initialState, action);

      expect(state.networkActive).toEqual({ objectId: true });
    });
  });

  describe(`${fromActions.UPDATE_BUSINESS_OBJECTIVE_RELATED_OBJECT} action`, () => {
    it('should update organization', () => {
      const { initialState } = fromBusinessObjectives;
      const loadedState = {
        ...initialState,
        entities: {
          businessObjective1: {
            id: 'abc',
            organizations: [{ id: 'organization1', name: 'old name' }],
          },
          businessObjective2: {
            id: 'def',
            organizations: [{ id: 'organization2', name: 'do not change' }],
          },
        },
      };
      const newOrganization = { id: 'organization1', name: 'new name' } as Organization;
      const action = new fromActions.UpdateBusinessObjectiveRelatedObject({object: newOrganization, paths: [ObjectRelationsNames.Organizations]});

      const state = fromBusinessObjectives.reducer(loadedState as any, action);

      expect(state.entities.businessObjective1.organizations[0].name).toEqual('new name');
      expect(state.entities.businessObjective2.organizations[0].name).toEqual('do not change');
    });
  });

  describe(`${fromActions.FINISHED_NETWORK_REQUEST_FOR_BUSINESS_OBJECTIVE} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromBusinessObjectives;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.FinishedNetworkRequestForBusinessObjective('abc');

      const state = fromBusinessObjectives.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
    });
  });

  describe(`${fromActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_BUSINESS_OBJECTIVE} action`, () => {
    it('should have genericNetworkLoading be false', () => {
      const { initialState } = fromBusinessObjectives;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.FinishedGenericNetworkRequestForBusinessObjective();

      const state = fromBusinessObjectives.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toEqual(false);
    });
  });

  describe(`${fromActions.BUSINESS_OBJECTIVE_FAILURE} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromBusinessObjectives;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.BusinessObjectiveFailure({
        id: 'abc',
        error: new Error('some message'),
      });

      const state = fromBusinessObjectives.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
    });
  });

  describe(`${fromActions.REMOVE_BUSINESS_OBJECTIVE_FROM_LOCAL_MEMORY} action`, () => {
    it('should have genericNetworkLoading be false', () => {
      const { initialState } = fromBusinessObjectives;
      const stateWithEntityLoaded = { ...initialState, entities: { abc: { id: 'abc' } as any } };
      const action = new fromActions.RemoveBusinessObjectiveFromLocalMemory('abc');

      const state = fromBusinessObjectives.reducer(stateWithEntityLoaded, action);

      expect(state.entities).toEqual({});
    });
  });
});
