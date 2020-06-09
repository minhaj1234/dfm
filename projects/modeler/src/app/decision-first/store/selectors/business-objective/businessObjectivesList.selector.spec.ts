import { TestBed } from '@angular/core/testing';
import { select, Store } from '@ngrx/store';
import { blankPages } from 'core/models';
import { BusinessObjective } from '../../../models/businessObjective.model';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions/business-objective/businessObjectivesList.actions';
import * as fromReducers from '../../reducers';
import * as fromSelectors from './businessObjectivesList.selector';

describe('BusinessObjectives List Selectors', () => {
  let store: Store<fromReducers.IDecisionFirstState>;

  const businessObjective1 = {
    id: 'businessObjective1',
    name: 'BusinessObjective One',
  } as BusinessObjective;
  const businessObjective2 = {
    id: 'businessObjective2',
    name: 'BusinessObjective Two',
  } as BusinessObjective;
  const businessObjective3 = {
    id: 'businessObjective3',
    name: 'BusinessObjective Three',
  } as BusinessObjective;
  const businessObjectives: BusinessObjective[] = [businessObjective1, businessObjective2, businessObjective3];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
      ],
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getBusinessObjectivesEntities', () => {
    it('should return the business objectives in entity form', () => {
      let result;

      store.pipe(select(fromSelectors.getBusinessObjectivesEntities)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual({});

      store.dispatch(
        new fromActions.LoadBusinessObjectivesListSuccess({ results: businessObjectives, pagination: blankPages }),
      );

      expect(result).toEqual({
        businessObjective1: {
          id: 'businessObjective1',
          name: 'BusinessObjective One',
        },
        businessObjective2: {
          id: 'businessObjective2',
          name: 'BusinessObjective Two',
        },
        businessObjective3: {
          id: 'businessObjective3',
          name: 'BusinessObjective Three',
        },
      });
    });
  });

  describe('getBusinessObjectivesList', () => {
    it('should return the business objectives in array form', () => {
      let result;

      store.pipe(select(fromSelectors.getBusinessObjectivesList)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual([]);

      store.dispatch(
        new fromActions.LoadBusinessObjectivesListSuccess({ results: businessObjectives, pagination: blankPages }),
      );

      expect(result).toEqual([...businessObjectives]);
    });
  });

  describe('getBusinessObjectivesListNetworkActive', () => {
    it('should return if the network is active', () => {
      let result;

      store.pipe(select(fromSelectors.getBusinessObjectivesListNetworkActive)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(false);
    });
  });

  describe('getSelectedBusinessObjectiveFromBusinessObjectivesList', () => {
    it('should return selected list item', () => {
      let result;

      store.pipe(select(fromSelectors.getSelectedBusinessObjectiveFromBusinessObjectivesList(businessObjective1.id))).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(undefined);

      store.dispatch(new fromActions.LoadBusinessObjectivesListSuccess({pagination: blankPages, results: businessObjectives }));

      expect(result).toEqual(businessObjective1);
    });
  });
});
