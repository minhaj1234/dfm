import { TestBed } from '@angular/core/testing';
import { select, Store } from '@ngrx/store';
import { blankPages } from 'core/models';
import { Organization } from '../../../models/organization.model';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions/organization/organizationsList.actions';
import * as fromReducers from '../../reducers';
import * as fromSelectors from './organizationsList.selectors';

describe('Organizations List Selectors', () => {
  let store: Store<fromReducers.IDecisionFirstState>;
  const org1 = new Organization();
  org1.id = 'org1';
  const org2 = new Organization();
  org2.id = 'org2';

  const organizations: Organization[] = [org1, org2];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
      ],
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getOrganizationsList', () => {
    it('should return the organizations in array form', () => {
      let result;

      store.pipe(select(fromSelectors.getOrganizationsList)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual([]);

      store.dispatch(new fromActions.LoadOrganizationsListSuccess({ results: organizations, pagination: blankPages }));

      expect(result).toEqual([...organizations]);
    });
  });

  describe('getDecisionsListNetworkActive', () => {
    it('should return if the network is active', () => {
      let result;

      store.pipe(select(fromSelectors.getOrganizationsListNetworkActive)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(false);
    });
  });

  describe('getDecisionsListNetworkActive', () => {
    it('should return the pagination', () => {
      let result;

      store.dispatch(new fromActions.LoadOrganizationsListSuccess({ results: organizations, pagination: blankPages }));

      store.pipe(select(fromSelectors.getOrganizationsListPagination)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(blankPages);
    });
  });

  describe('getDecisionsListNetworkActive', () => {
    it('should return the search term', () => {
      let result;

      store.pipe(select(fromSelectors.getOrganizationsListSearchTerm)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual('');

      store.dispatch(new fromActions.UpdateSearchForOrganizationsList('abc'));

      expect(result).toEqual('abc');
    });
  });

  describe('getSelectedOrganizationFromOrganizationsList', () => {
    it('should return selected list item', () => {
      let result;

      store.pipe(select(fromSelectors.getSelectedOrganizationFromOrganizationsList(org1.id))).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(undefined);

      store.dispatch(new fromActions.LoadOrganizationsListSuccess({pagination: blankPages, results: organizations }));

      expect(result).toEqual(org1);
    });
  });
});
