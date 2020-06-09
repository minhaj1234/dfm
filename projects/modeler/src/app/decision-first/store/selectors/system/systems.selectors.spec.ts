import { TestBed } from '@angular/core/testing';
import { combineReducers, select, Store, StoreModule } from '@ngrx/store';
import { rootReducers } from 'core/root-store';
import { System } from '../../../models/system.model';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions';
import * as fromReducers from '../../reducers';
import * as fromSelectors from './systems.selectors';

describe('System Selectors', () => {
  let store: Store<fromReducers.IDecisionFirstState>;

  const systems: System[] = [
    {
      id: 'system1',
      name: 'System One',
      decisions: [{ id: 'decision1' }, { id: 'decision2' }]
    } as any,
    {
      id: 'system2',
      name: 'System Two',
      decisions: [{ id: 'decision3' }, { id: 'decision4' }]
    } as any,
    {
      id: 'system3',
      name: 'System Three',
      decisions: [{ id: 'decision5' }, { id: 'decision6' }]
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

  describe('getLoadedSystemsAsArray', () => {
    it('should return the loaded systems in array form', () => {
      let result;

      store.pipe(select(fromSelectors.getLoadedSystemsAsArray)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual([]);

      store.dispatch(new fromActions.LoadSystemSuccess(systems[0]));
      store.dispatch(new fromActions.LoadSystemSuccess(systems[1]));
      store.dispatch(new fromActions.LoadSystemSuccess(systems[2]));

      expect(result).toEqual([systems[0], systems[1], systems[2]]);
    });
  });

  describe('getSystemsAnyNetworkActive', () => {
    it('should return if the network is active', () => {
      let result;

      store.pipe(select(fromSelectors.getSystemsAnyNetworkActive)).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(false);
    });
  });

  describe('getSelectedSystem', () => {
    it('should return the selected system', () => {
      store.dispatch(new fromActions.LoadSystemSuccess(systems[0]));
      store.dispatch(new fromActions.LoadSystemSuccess(systems[1]));
      store.dispatch(new fromActions.LoadSystemSuccess(systems[2]));

      let result;

      store.pipe(select(fromSelectors.getSelectedSystem('system1'))).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(systems[0]);
    });
  });

  describe('getSelectedSystemNetworkActive', () => {
    it('should return the selected system network active', () => {
      store.dispatch(new fromActions.LoadSystem('system1'));

      let result;

      store.pipe(select(fromSelectors.getSelectedSystemNetworkActive('system1'))).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(true);
    });

    it('should return false if the system is not loaded', () => {
      let result;

      store.pipe(select(fromSelectors.getSelectedSystemNetworkActive('system1'))).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(false);
    });
  });

  describe('getLoadedSystemsDecisions', () => {
    it('should return decisions', () => {
      let result;

      store.dispatch(new fromActions.LoadSystemSuccess(systems[0]));
      store.dispatch(new fromActions.LoadSystemSuccess(systems[2]));
      store.dispatch(new fromActions.LoadSystemSuccess(systems[1]));

      store.pipe(select(fromSelectors.getLoadedSystemsDecisions)).subscribe((value) => (result = value));

      expect(result).toEqual([
        ...systems[0].decisions,
        ...systems[2].decisions,
        ...systems[1].decisions
      ]);
    });
  });
});
