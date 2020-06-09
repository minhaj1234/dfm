import { TestBed } from '@angular/core/testing';
import { combineReducers, select, Store, StoreModule } from '@ngrx/store';
import { rootReducers } from 'core/root-store';
import { Organization } from '../../../models/organization.model';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions';
import * as fromReducers from '../../reducers';
import * as fromSelectors from './organization.selectors';

describe('Organizations Selectors', () => {
  let store: Store<fromReducers.IDecisionFirstState>;

  const organizations: Organization[] = [
    {
      id: 'organization1',
      name: 'Organization One',
      ownsDecisions: [{ id: 'decision1' }, { id: 'decision2' }],
      makesDecisions: [{ id: 'decision3' }, { id: 'decision4' }],
      impactedByDecisions: [{ id: 'decision5' }, { id: 'decision6' }],
      inputDatas: [{ id: 'inputData1' }, { id: 'inputData2' }],
      knowledgeSources: [{ id: 'knowledgeSource1' }, { id: 'knowledgeSource2' }],
      parentOrganization: [{ id: 'organization1' }, { id: 'organization2' }],
      childOrganizations: [{ id: 'organization3' }, { id: 'organization4' }],
      businessObjectives: [{ id: 'businessObjective1' }, { id: 'businessObjective2' }],
    } as any,
    {
      id: 'organization2',
      name: 'Organization Two',
      ownsDecisions: [{ id: 'decision7' }, { id: 'decision8' }],
      makesDecisions: [{ id: 'decision9' }, { id: 'decision10' }],
      impactedByDecisions: [{ id: 'decision11' }, { id: 'decision12' }],
      inputDatas: [{ id: 'inputData3' }, { id: 'inputData4' }],
      knowledgeSources: [{ id: 'knowledgeSource3' }, { id: 'knowledgeSource4' }],
      parentOrganization: [{ id: 'organization5' }, { id: 'organization6' }],
      childOrganizations: [{ id: 'organization7' }, { id: 'organization8' }],
      businessObjectives: [{ id: 'businessObjective3' }, { id: 'businessObjective4' }],
    } as any,
    {
      id: 'organization3',
      name: 'Organization Three',
      ownsDecisions: [{ id: 'decision13' }, { id: 'decision14' }],
      makesDecisions: [{ id: 'decision15' }, { id: 'decision16' }],
      impactedByDecisions: [{ id: 'decision17' }, { id: 'decision18' }],
      inputDatas: [{ id: 'inputData5' }, { id: 'inputData6' }],
      knowledgeSources: [{ id: 'knowledgeSource5' }, { id: 'knowledgeSource6' }],
      parentOrganization: [{ id: 'organization9' }, { id: 'organization10' }],
      childOrganizations: [{ id: 'organization11' }, { id: 'organization12' }],
      businessObjectives: [{ id: 'businessObjective5' }, { id: 'businessObjective6' }],
    } as any,
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
      ],
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getLoadedOrganizations', () => {
    it('should return the loaded organizations in entity form', () => {
      let result;

      store.pipe(select(fromSelectors.getLoadedOrganizations)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual({});

      store.dispatch(new fromActions.LoadOrganizationSuccess(organizations[0]));
      store.dispatch(new fromActions.LoadOrganizationSuccess(organizations[1]));
      store.dispatch(new fromActions.LoadOrganizationSuccess(organizations[2]));

      expect(result).toEqual({
        organization1: organizations[0],
        organization2: organizations[1],
        organization3: organizations[2],
      });
    });
  });

  describe('getLoadedOrganizationsAsArray', () => {
    it('should return the loaded organizations in array form', () => {
      let result;

      store.pipe(select(fromSelectors.getLoadedOrganizationsAsArray)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual([]);

      store.dispatch(new fromActions.LoadOrganizationSuccess(organizations[0]));
      store.dispatch(new fromActions.LoadOrganizationSuccess(organizations[1]));
      store.dispatch(new fromActions.LoadOrganizationSuccess(organizations[2]));

      expect(result).toEqual([organizations[0], organizations[1], organizations[2]]);
    });
  });

  describe('getOrganizationsAnyNetworkActive', () => {
    it('should return true if any of the organizations are loading', () => {
      let result;

      store.pipe(select(fromSelectors.getOrganizationsAnyNetworkActive)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(false);

      store.dispatch(new fromActions.LoadOrganizationSuccess(organizations[0]));
      store.dispatch(new fromActions.LoadOrganization(organizations[1].id));
      store.dispatch(new fromActions.LoadOrganizationSuccess(organizations[2]));

      expect(result).toEqual(true);
    });

    it('return false if none of the organizations are loading', () => {
      let result;

      store.pipe(select(fromSelectors.getOrganizationsAnyNetworkActive)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(false);

      store.dispatch(new fromActions.LoadOrganizationSuccess(organizations[0]));
      store.dispatch(new fromActions.LoadOrganization(organizations[1].id));
      store.dispatch(new fromActions.LoadOrganizationSuccess(organizations[2]));
      store.dispatch(new fromActions.LoadOrganizationSuccess(organizations[1]));

      expect(result).toEqual(false);
    });
  });

  describe('getLoadedOrganizations', () => {
    it('should return the selected organization', () => {
      let result;

      store.pipe(select(fromSelectors.getSelectedOrganization('organization1'))).subscribe((value) => {
        result = value;
      });

      expect(result).toBeUndefined();

      store.dispatch(new fromActions.LoadOrganizationSuccess(organizations[0]));

      expect(result).toEqual(organizations[0]);
    });
  });

  describe('getSelectedOrganizationNetworkActive', () => {
    it('should return if the selected organization is loading', () => {
      let result;

      store.pipe(select(fromSelectors.getSelectedOrganizationNetworkActive('organization1'))).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(false);

      store.dispatch(new fromActions.LoadOrganization(organizations[0].id));

      expect(result).toEqual(true);
    });
  });

  describe('getLoadedOrganizationsInputData', () => {
    it('should return input data', () => {
      let result;

      store.dispatch(new fromActions.LoadOrganizationSuccess(organizations[0]));
      store.dispatch(new fromActions.LoadOrganizationSuccess(organizations[2]));
      store.dispatch(new fromActions.LoadOrganizationSuccess(organizations[1]));

      store.pipe(select(fromSelectors.getLoadedOrganizationsInputData)).subscribe((value) => (result = value));

      expect(result).toEqual([
        ...organizations[0].inputDatas,
        ...organizations[2].inputDatas,
        ...organizations[1].inputDatas,
      ]);
    });
  });

  describe('getLoadedOrganizationsDecisions', () => {
    it('should return decisions', () => {
      let result;

      store.dispatch(new fromActions.LoadOrganizationSuccess(organizations[0]));
      store.dispatch(new fromActions.LoadOrganizationSuccess(organizations[2]));
      store.dispatch(new fromActions.LoadOrganizationSuccess(organizations[1]));

      store.pipe(select(fromSelectors.getLoadedOrganizationsDecisions)).subscribe((value) => (result = value));

      expect(result).toEqual([
        ...organizations[0].ownsDecisions,
        ...organizations[0].makesDecisions,
        ...organizations[0].impactedByDecisions,
        ...organizations[2].ownsDecisions,
        ...organizations[2].makesDecisions,
        ...organizations[2].impactedByDecisions,
        ...organizations[1].ownsDecisions,
        ...organizations[1].makesDecisions,
        ...organizations[1].impactedByDecisions,
      ]);
    });
  });

  describe('getLoadedOrganizationsKnowledgeSources', () => {
    it('should return knowledge sources', () => {
      let result;

      store.dispatch(new fromActions.LoadOrganizationSuccess(organizations[0]));
      store.dispatch(new fromActions.LoadOrganizationSuccess(organizations[2]));
      store.dispatch(new fromActions.LoadOrganizationSuccess(organizations[1]));

      store.pipe(select(fromSelectors.getLoadedOrganizationsKnowledgeSources)).subscribe((value) => (result = value));

      expect(result).toEqual([
        ...organizations[0].knowledgeSources,
        ...organizations[2].knowledgeSources,
        ...organizations[1].knowledgeSources,
      ]);
    });
  });

  describe('getLoadedOrganizationsOrganizations', () => {
    it('should return organizations', () => {
      let result;

      store.dispatch(new fromActions.LoadOrganizationSuccess(organizations[0]));
      store.dispatch(new fromActions.LoadOrganizationSuccess(organizations[2]));
      store.dispatch(new fromActions.LoadOrganizationSuccess(organizations[1]));

      store.pipe(select(fromSelectors.getLoadedOrganizationsOrganizations)).subscribe((value) => (result = value));

      expect(result).toEqual([
        organizations[0].parentOrganization,
        ...organizations[0].childOrganizations,
        organizations[2].parentOrganization,
        ...organizations[2].childOrganizations,
        organizations[1].parentOrganization,
        ...organizations[1].childOrganizations,
      ]);
    });
  });

  describe('getLoadedOrganizationsBusinessObjectives', () => {
    it('should return business objectives', () => {
      let result;

      store.dispatch(new fromActions.LoadOrganizationSuccess(organizations[0]));
      store.dispatch(new fromActions.LoadOrganizationSuccess(organizations[2]));
      store.dispatch(new fromActions.LoadOrganizationSuccess(organizations[1]));

      store.pipe(select(fromSelectors.getLoadedOrganizationsBusinessObjectives)).subscribe((value) => (result = value));

      expect(result).toEqual([
        ...organizations[0].businessObjectives,
        ...organizations[2].businessObjectives,
        ...organizations[1].businessObjectives,
      ]);
    });
  });
});
