import { TestBed } from '@angular/core/testing';
import { combineReducers, select, Store, StoreModule } from '@ngrx/store';
import { blankPages } from 'core/models';
import { rootReducers } from 'core/root-store';
import { System } from '../../../models/system.model';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions/system/systemsList.action';
import * as fromReducers from '../../reducers';
import * as fromSelectors from './systemsList.selector';

describe('Systems List Selectors', () => {
  let store: Store<fromReducers.IDecisionFirstState>;
  const system1 = {
    id: 'system1',
    name: 'System One',
  } as System;
  const system2 = {
    id: 'system2',
    name: 'System Two',
  } as System;
  const system3 = {
    id: 'system3',
    name: 'System Three',
  } as System;
  const systems: System[] = [system1, system2, system3];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
      ],
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getSystemsEntities', () => {
    it('should return the systems in entity form', () => {
      let result;

      store.pipe(select(fromSelectors.getSystemsEntities)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual({});

      store.dispatch(new fromActions.LoadSystemsListSuccess({ results: systems, pagination: blankPages }));

      expect(result).toEqual({
        system1: {
          id: 'system1',
          name: 'System One',
        },
        system2: {
          id: 'system2',
          name: 'System Two',
        },
        system3: {
          id: 'system3',
          name: 'System Three',
        },
      });
    });
  });

  describe('getSystemsList', () => {
    it('should return the processes in array form', () => {
      let result;

      store.pipe(select(fromSelectors.getSystemsList)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual([]);

      store.dispatch(new fromActions.LoadSystemsListSuccess({ results: systems, pagination: blankPages }));

      expect(result).toEqual([...systems]);
    });
  });

  describe('getSystemsListNetworkActive', () => {
    it('should return if the network is active', () => {
      let result;

      store.pipe(select(fromSelectors.getSystemsListNetworkActive)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(false);
    });
  });

  describe('getSelectedSystemFromSystemsList', () => {
    it('should return selected list item', () => {
      let result;

      store.pipe(select(fromSelectors.getSelectedSystemFromSystemsList(system1.id))).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(undefined);

      store.dispatch(new fromActions.LoadSystemsListSuccess({pagination: blankPages, results: systems }));

      expect(result).toEqual(system1);
    });
  });
});
