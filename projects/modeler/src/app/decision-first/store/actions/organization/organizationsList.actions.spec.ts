import { blankPages } from 'core/models';
import { Organization } from '../../../models/organization.model';
import * as organizationsListActions from './organizationsList.actions';

describe('Organizations List Actions', () => {
  describe('Load Organizations List', () => {
    it('should create an action', () => {
      const action = new organizationsListActions.LoadOrganizationsList();
      expect({ ...action }).toEqual({
        type: organizationsListActions.LOAD_ORGANIZATIONS_LIST,
      });
    });
  });
  
  describe('Load Specific Page For Organizations List', () => {
    it('should create an action', () => {
      const payload = 'https://test.test';
      const action = new organizationsListActions.LoadSpecificPageForOrganizationsList(payload);
      expect({ ...action }).toEqual({
        payload,
        type: organizationsListActions.LOAD_SPECIFIC_PAGE_FOR_ORGANIZATIONS_LIST,
      });
    });
  });

  describe('Load Organizations List Success', () => {
    it('should create an action', () => {
      const firstOrganization: Organization = {} as any;
      const secondOrganization: Organization = {} as any;
      const payload = { results: [firstOrganization, secondOrganization], pagination: blankPages };
      const action = new organizationsListActions.LoadOrganizationsListSuccess(payload);
      expect({ ...action }).toEqual({
        payload,
        type: organizationsListActions.LOAD_ORGANIZATIONS_LIST_SUCCESS,
      });
    });
  });

  describe('Update Search For Organizations List', () => {
    it('should create an action with an empty payload', () => {
      const action = new organizationsListActions.UpdateSearchForOrganizationsList();
      expect({ ...action }).toEqual({
        payload: '',
        type: organizationsListActions.UPDATE_SEARCH_FOR_ORGANIZATIONS_LIST,
      });
    });

    it('should create an action', () => {
      const payload = 'abc';
      const action = new organizationsListActions.UpdateSearchForOrganizationsList(payload);
      expect({ ...action }).toEqual({
        payload,
        type: organizationsListActions.UPDATE_SEARCH_FOR_ORGANIZATIONS_LIST,
      });
    });
  });

  describe('Load Single Organization For Organizations List', () => {
    it('should create an action', () => {
      const action = new organizationsListActions.LoadSingleOrganizationForOrganizationsList('decision1');
      expect({ ...action }).toEqual({
        payload: 'decision1',
        type: organizationsListActions.LOAD_SINGLE_ORGANIZATION_FOR_ORGANIZATIONS_LIST,
      });
    });
  });

  describe('Load Single Organization For Organizations List Success', () => {
    it('should create an action', () => {
      const payload = new Organization();
      const action = new organizationsListActions.LoadSingleOrganizationForOrganizationsListSuccess(payload);
      expect({ ...action }).toEqual({
        payload,
        type: organizationsListActions.LOAD_SINGLE_ORGANIZATION_FOR_ORGANIZATIONS_LIST_SUCCESS,
      });
    });
  });

  describe('Update Single Organization If Needed', () => {
    it('should create an action', () => {
      const payload = new Organization();
      const action = new organizationsListActions.UpdateSingleOrganizationIfNeeded(payload);
      expect({ ...action }).toEqual({
        payload,
        type: organizationsListActions.UPDATE_SINGLE_ORGANIZATION_IF_NEEDED,
      });
    });
  });

  describe('Remove Single Element From Organizations List', () => {
    it('should create an action', () => {
      const payload = 'decision1';
      const action = new organizationsListActions.RemoveSingleElementFromOrganizationsList(payload);
      expect({ ...action }).toEqual({
        payload,
        type: organizationsListActions.REMOVE_SINGLE_ORGANIZATION_IF_NEEDED,
      });
    });
  });

  describe('Organizations List Failure', () => {
    it('should create an action', () => {
      const payload = new Error('a message');
      const action = new organizationsListActions.OrganizationsListFailure(payload);
      expect({ ...action }).toEqual({
        payload,
        type: organizationsListActions.ORGANIZATIONS_LIST_FAILURE,
      });
    });
  });
});
