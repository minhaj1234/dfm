import { TestBed } from '@angular/core/testing';
import { select, Store } from '@ngrx/store';
import { blankPages } from 'core/models';
import { Decision } from '../../../models/decision.model';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions/decision/decisionsList.actions';
import * as fromReducers from '../../reducers';
import * as fromSelectors from './decisionsList.selectors';

describe('Decisions List Selectors', () => {
  let store: Store<fromReducers.IDecisionFirstState>;
  const decision1 = {
    id: 'decision1',
    name: 'Decision One',
  } as Decision;
  const decision2 = {
    id: 'decision2',
    name: 'Decision Two',
  } as Decision;
  const decision3 = {
    id: 'decision3',
    name: 'Decision Three',
  } as Decision;
  const decisions: Decision[] = [decision1, decision2, decision3];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
      ],
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getDecisions', () => {
    it('should return the decisions in entity form', () => {
      let result;

      store.pipe(select(fromSelectors.getDecisionsListEntities)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual({});

      store.dispatch(new fromActions.LoadDecisionsListSuccess({ results: decisions, pagination: blankPages }));

      expect(result).toEqual({
        decision1: {
          id: 'decision1',
          name: 'Decision One',
        },
        decision2: {
          id: 'decision2',
          name: 'Decision Two',
        },
        decision3: {
          id: 'decision3',
          name: 'Decision Three',
        },
      });
    });
  });

  describe('getDecisionsList', () => {
    it('should return the decisions in array form', () => {
      let result;

      store.pipe(select(fromSelectors.getDecisionsList)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual([]);

      store.dispatch(new fromActions.LoadDecisionsListSuccess({ results: decisions, pagination: blankPages }));

      expect(result).toEqual([...decisions]);
    });
  });

  describe('getDecisionsListNetworkActive', () => {
    it('should return if the network is active', () => {
      let result;

      store.pipe(select(fromSelectors.getDecisionsListNetworkActive)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(false);
    });
  });

  describe('getSelectedDecisionFromDecisionsList', () => {
    it('should return selected list item', () => {
      let result;

      store.pipe(select(fromSelectors.getSelectedDecisionFromDecisionsList(decision1.id))).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(undefined);

      store.dispatch(new fromActions.LoadDecisionsListSuccess({pagination: blankPages, results: decisions }));

      expect(result).toEqual(decision1);
    });
  });
});
