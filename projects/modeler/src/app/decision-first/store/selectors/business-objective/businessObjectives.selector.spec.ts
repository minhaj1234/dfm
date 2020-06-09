import { TestBed } from '@angular/core/testing';
import { select, Store } from '@ngrx/store';
import { BusinessObjective } from '../../../models/businessObjective.model';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions';
import * as fromReducers from '../../reducers';
import * as fromSelectors from './businessObjectives.selector';

describe('BusinessObjectives Selectors', () => {
  let store: Store<fromReducers.IDecisionFirstState>;

  const businessObjectives: BusinessObjective[] = [
    {
      id: 'businessObjective1',
      name: 'BusinessObjective One',
      decisions: [{ id: 'decision 1' }, { id: 'decision 2' }],
      organizations: [{ id: 'organization 1' }, { id: 'organization 2' }],
    } as any,
    {
      id: 'businessObjective2',
      name: 'BusinessObjective Two',
      decisions: [{ id: 'decision 3' }, { id: 'decision 4' }],
      organizations: [{ id: 'organization 3' }, { id: 'organization 4' }],
    } as any,
    {
      id: 'businessObjective3',
      name: 'BusinessObjective Three',
      decisions: [{ id: 'decision 5' }, { id: 'decision 6' }],
      organizations: [{ id: 'organization 5' }, { id: 'organization 6' }],
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

  describe('getLoadedBusinessObjectivesAsArray', () => {
    it('should return the loaded business objectives in array form', () => {
      let result;

      store.pipe(select(fromSelectors.getLoadedBusinessObjectivesAsArray)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual([]);

      store.dispatch(new fromActions.LoadBusinessObjectiveSuccess(businessObjectives[0]));
      store.dispatch(new fromActions.LoadBusinessObjectiveSuccess(businessObjectives[1]));
      store.dispatch(new fromActions.LoadBusinessObjectiveSuccess(businessObjectives[2]));

      expect(result).toEqual([businessObjectives[0], businessObjectives[1], businessObjectives[2]]);
    });
  });

  describe('getBusinessObjectivesAnyNetworkActive', () => {
    it('should return if the network is active', () => {
      let result;

      store.pipe(select(fromSelectors.getBusinessObjectivesAnyNetworkActive)).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(false);
    });
  });

  describe('getSelectedBusinessObjective', () => {
    it('should return the selected business objective', () => {
      store.dispatch(new fromActions.LoadBusinessObjectiveSuccess(businessObjectives[0]));
      store.dispatch(new fromActions.LoadBusinessObjectiveSuccess(businessObjectives[1]));
      store.dispatch(new fromActions.LoadBusinessObjectiveSuccess(businessObjectives[2]));

      let result;

      store.pipe(select(fromSelectors.getSelectedBusinessObjective('businessObjective1'))).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(businessObjectives[0]);
    });
  });

  describe('getSelectedBusinessObjectiveNetworkActive', () => {
    it('should return the selected business objective network active', () => {
      store.dispatch(new fromActions.LoadBusinessObjective('businessObjective1'));

      let result;

      store
        .pipe(select(fromSelectors.getSelectedBusinessObjectiveNetworkActive('businessObjective1')))
        .subscribe((value) => {
          result = value;
        });

      expect(result).toBe(true);
    });

    it('should return false if the business objective is not loaded', () => {
      let result;

      store
        .pipe(select(fromSelectors.getSelectedBusinessObjectiveNetworkActive('businessObjective1')))
        .subscribe((value) => {
          result = value;
        });

      expect(result).toBe(false);
    });
  });

  describe('getLoadedBusinessObjectivesDecisions', () => {
    it('should return the decisions', () => {
      let result;

      store.dispatch(new fromActions.LoadBusinessObjectiveSuccess(businessObjectives[0]));
      store.dispatch(new fromActions.LoadBusinessObjectiveSuccess(businessObjectives[2]));
      store.dispatch(new fromActions.LoadBusinessObjectiveSuccess(businessObjectives[1]));

      store.pipe(select(fromSelectors.getLoadedBusinessObjectivesDecisions)).subscribe((value) => (result = value));

      expect(result).toEqual([
        ...businessObjectives[0].decisions,
        ...businessObjectives[2].decisions,
        ...businessObjectives[1].decisions,
      ]);
    });
  });

  describe('getLoadedBusinessObjectivesOrganizations', () => {
    it('should return the organizations', () => {
      let result;

      store.dispatch(new fromActions.LoadBusinessObjectiveSuccess(businessObjectives[0]));
      store.dispatch(new fromActions.LoadBusinessObjectiveSuccess(businessObjectives[2]));
      store.dispatch(new fromActions.LoadBusinessObjectiveSuccess(businessObjectives[1]));

      store.pipe(select(fromSelectors.getLoadedBusinessObjectivesOrganizations)).subscribe((value) => (result = value));

      expect(result).toEqual([
        ...businessObjectives[0].organizations,
        ...businessObjectives[2].organizations,
        ...businessObjectives[1].organizations,
      ]);
    });
  });
});
