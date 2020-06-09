import { blankPages } from 'core/models';
import * as fromActions from '../../actions/organization/organizationsList.actions';
import * as fromOrganization from './organizationsList.reducer';

describe('Decisions List Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromOrganization;
      const action = {} as any;

      const state = fromOrganization.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe(`${fromActions.LOAD_ORGANIZATIONS_LIST} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromOrganization;
      const action = new fromActions.LoadOrganizationsList();

      const state = fromOrganization.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.LOAD_SPECIFIC_PAGE_FOR_ORGANIZATIONS_LIST} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromOrganization;
      const action = new fromActions.LoadSpecificPageForOrganizationsList('https://example.com/');

      const state = fromOrganization.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.UPDATE_SEARCH_FOR_ORGANIZATIONS_LIST} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromOrganization;
      const action = new fromActions.UpdateSearchForOrganizationsList();

      const state = fromOrganization.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.ORGANIZATIONS_LIST_FAILURE} action`, () => {
    it('should have genericNetworkActive be false', () => {
      const { initialState } = fromOrganization;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.OrganizationsListFailure({} as any);

      const state = fromOrganization.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
    });
  });

  describe(`${fromActions.LOAD_ORGANIZATIONS_LIST_SUCCESS} action`, () => {
    it('should have genericNetworkActive be false and have the ids', () => {
      const { initialState } = fromOrganization;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.LoadOrganizationsListSuccess({
        pagination: blankPages,
        results: [{ id: 'decision1' } as any, { id: 'decision2' } as any],
      });

      const state = fromOrganization.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
      expect(state.ids).toEqual(['decision1', 'decision2']);
    });
  });

  describe(`${fromActions.UPDATE_SINGLE_ORGANIZATION_IF_NEEDED} action`, () => {
    it('it updates the list if the element is in there', () => {
      const { initialState } = fromOrganization;
      const setupAction = new fromActions.LoadOrganizationsListSuccess({
        pagination: blankPages,
        results: [{ id: 'decision1', name: 'd1' } as any, { id: 'decision2', name: 'd2' } as any],
      });
      const setupState = fromOrganization.reducer(initialState, setupAction);

      const action = new fromActions.UpdateSingleOrganizationIfNeeded({
        id: 'decision1',
        name: 'new name',
      } as any);

      const state = fromOrganization.reducer(setupState, action);

      expect(state.entities.decision1.name).toEqual('new name');
    });
  });

  describe(`${fromActions.REMOVE_SINGLE_ORGANIZATION_IF_NEEDED} action`, () => {
    it('should have no longer have the decision', () => {
      const { initialState } = fromOrganization;
      const setupAction = new fromActions.LoadOrganizationsListSuccess({
        pagination: blankPages,
        results: [{ id: 'decision1' } as any, { id: 'decision2' } as any],
      });
      const stateWithDecisions = fromOrganization.reducer(initialState, setupAction);

      const action = new fromActions.RemoveSingleElementFromOrganizationsList('decision1');
      const state = fromOrganization.reducer(stateWithDecisions, action);

      expect(state.ids).toEqual(['decision2']);
      expect(state.entities['decision1']).toBeUndefined();
    });
  });

  describe('getSearchTerm', () => {
    it('returns the search term', () => {
      const state = {
        ...fromOrganization.initialState,
        searchTerm: 'a string',
      };

      expect(fromOrganization.getSearchTerm(state)).toEqual('a string');
    });
  });

  describe('getPagination', () => {
    it('returns the pagination', () => {
      const { initialState } = fromOrganization;

      expect(fromOrganization.getPagination(initialState)).toEqual({
        number: 0,
        size: 0,
        totalElements: 0,
        totalPages: 0,
      });
    });
  });
});
