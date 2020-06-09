import { BusinessObjective } from '../../../models/businessObjective.model';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import { Organization } from '../../../models/organization.model';
import * as fromActions from '../../actions';
import * as fromOrganizations from './organization.reducer';

describe('Organizations Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromOrganizations;
      const action = {} as any;

      const state = fromOrganizations.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe(`${fromActions.LOAD_ORGANIZATION} action`, () => {
    it('sets the correct network active key to true', () => {
      const { initialState } = fromOrganizations;
      const action = new fromActions.LoadOrganization('organization1');

      const state = fromOrganizations.reducer(initialState, action);

      expect(state.networkActive.organization1).toBe(true);
    });
  });

  describe(`${fromActions.ORGANIZATION_FAILURE} action`, () => {
    it('sets the correct network active key to false', () => {
      const { initialState } = fromOrganizations;
      let state = fromOrganizations.reducer(initialState, new fromActions.LoadOrganization('organization1'));
      const action = new fromActions.OrganizationFailure({ id: 'organization1' } as any);

      state = fromOrganizations.reducer(state, action);

      expect(state.networkActive.organization1).toBeUndefined();
    });
  });

  describe(`${fromActions.LOAD_ORGANIZATION_SUCCESS} action`, () => {
    it('sets the correct network active key to false and adds the organization', () => {
      const { initialState } = fromOrganizations;
      const organization: Organization = { id: 'organization1' } as any;
      const action = new fromActions.LoadOrganizationSuccess(organization);

      const state = fromOrganizations.reducer(initialState, action);

      expect(state.entities.organization1).toBe(organization);
    });
  });

  describe(`${fromActions.FINISHED_NETWORK_REQUEST_FOR_ORGANIZATION} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromOrganizations;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.FinishedNetworkRequestForOrganization('abc');

      const state = fromOrganizations.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
    });
  });

  describe(`${fromActions.UPDATE_ORGANIZATION} action`, () => {
    it('sets the correct network active key to true', () => {
      const { initialState } = fromOrganizations;
      const organization: Organization = { id: 'organization1' } as any;
      const action = new fromActions.UpdateOrganization({organization});

      const state = fromOrganizations.reducer(initialState, action);

      expect(state.networkActive.organization1).toBe(true);
    });
  });

  describe(`${fromActions.ADD_RELATED_OBJECT_TO_ORGANIZATION} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromOrganizations;
      const action = new fromActions.AddRelatedObjectToOrganization({
        sourceObject: {id: 'sourceObjectId'} as Organization,
        relatedObject: {id: 'relatedObjectId'} as BusinessObjective,
        relationPath: ObjectRelationsNames.BusinessObjectives,
      });

      const state = fromOrganizations.reducer(initialState, action);

      expect(state.networkActive).toEqual({ sourceObjectId: true });
    });
  });

  describe(`${fromActions.UPDATE_ORGANIZATION_RELATED_OBJECT} action`, () => {
    it('should update knowledge source', () => {
      const { initialState } = fromOrganizations;
      const loadedState = {
        ...initialState,
        entities: {
          object1: {
            id: 'object1',
            knowledgeSources: [{ id: 'a', name: 'old name' }],
          },
          object2: {
            id: 'object2',
            knowledgeSources: [{ id: 'b', name: 'do not change' }],
          },
        },
      };

      const newKnowledgeSource = { id: 'a', name: 'new name' } as KnowledgeSource;
      const action = new fromActions.UpdateOrganizationRelatedObject({object: newKnowledgeSource, paths: [ObjectRelationsNames.KnowledgeSources]});

      const state = fromOrganizations.reducer(loadedState as any, action);

      expect(state.entities.object1.knowledgeSources[0].name).toEqual('new name');
      expect(state.entities.object2.knowledgeSources[0].name).toEqual('do not change');
    });
  });

  describe(`${fromActions.REMOVE_RELATED_OBJECT_FROM_ORGANIZATION} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromOrganizations;
      const action = new fromActions.RemoveRelatedObjectFromOrganization({
        sourceObject: {id: 'sourceObjectId'} as Organization,
        relatedObject: {id: 'relatedObjectId'} as BusinessObjective,
        relationPath: ObjectRelationsNames.BusinessObjectives,
      });

      const state = fromOrganizations.reducer(initialState, action);

      expect(state.networkActive).toEqual({ sourceObjectId: true });
    });
  });

  describe(`${fromActions.UPDATE_OBJECT_TAGS} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromOrganizations;
      const action = new fromActions.UpdateObjectTags({
        id: 'objectId',
        missingTagNames: [],
        extraTagIds: [],
        type: ObjectClassNames.Organization
      });

      const state = fromOrganizations.reducer(initialState, action);

      expect(state.networkActive).toEqual({ objectId: true });
    });
  });

  describe(`${fromActions.REMOVE_ORGANIZATION_FROM_LOCAL_MEMORY} action`, () => {
    it('removes the organization from the entities', () => {
      const { initialState } = fromOrganizations;
      const stateWithEntities = {
        ...initialState,
        entities: {
          abc: { id: 'abc' },
        },
      };
      const action = new fromActions.RemoveOrganizationFromLocalMemory('abc');

      const state = fromOrganizations.reducer(stateWithEntities as any, action);

      expect(state.entities).toEqual({});
    });
  });
});
