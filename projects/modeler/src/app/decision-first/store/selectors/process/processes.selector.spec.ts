import { TestBed } from '@angular/core/testing';
import { combineReducers, select, Store, StoreModule } from '@ngrx/store';
import { rootReducers } from 'core/root-store';
import { Process } from '../../../models/process.model';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions';
import * as fromReducers from '../../reducers';
import * as fromSelectors from './processes.selector';

describe('Process Selectors', () => {
  let store: Store<fromReducers.IDecisionFirstState>;

  const processes: Process[] = [
    {
      id: 'process1',
      name: 'Process One',
      decisions: [{ id: 'decision1' }, { id: 'decision2' }]
    } as any,
    {
      id: 'process2',
      name: 'Process Two',
      decisions: [{ id: 'decision3' }, { id: 'decision4' }]
    } as any,
    {
      id: 'process3',
      name: 'Process Three',
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

  describe('getLoadedProcessesAsArray', () => {
    it('should return the loaded processes in array form', () => {
      let result;

      store.pipe(select(fromSelectors.getLoadedProcessesAsArray)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual([]);

      store.dispatch(new fromActions.LoadProcessSuccess(processes[0]));
      store.dispatch(new fromActions.LoadProcessSuccess(processes[1]));
      store.dispatch(new fromActions.LoadProcessSuccess(processes[2]));

      expect(result).toEqual([processes[0], processes[1], processes[2]]);
    });
  });

  describe('getProcessesAnyNetworkActive', () => {
    it('should return if the network is active', () => {
      let result;

      store.pipe(select(fromSelectors.getProcessesAnyNetworkActive)).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(false);
    });
  });

  describe('getSelectedProcess', () => {
    it('should return the selected process', () => {
      store.dispatch(new fromActions.LoadProcessSuccess(processes[0]));
      store.dispatch(new fromActions.LoadProcessSuccess(processes[1]));
      store.dispatch(new fromActions.LoadProcessSuccess(processes[2]));

      let result;

      store.pipe(select(fromSelectors.getSelectedProcess('process1'))).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(processes[0]);
    });
  });

  describe('getSelectedProcessNetworkActive', () => {
    it('should return the selected process network active', () => {
      store.dispatch(new fromActions.LoadProcess('process1'));

      let result;

      store.pipe(select(fromSelectors.getSelectedProcessNetworkActive('process1'))).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(true);
    });

    it('should return false if the process is not loaded', () => {
      let result;

      store.pipe(select(fromSelectors.getSelectedProcessNetworkActive('process1'))).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(false);
    });
  });

  describe('getLoadedProcessesDecisions', () => {
    it('should return decisions', () => {
      let result;

      store.dispatch(new fromActions.LoadProcessSuccess(processes[0]));
      store.dispatch(new fromActions.LoadProcessSuccess(processes[2]));
      store.dispatch(new fromActions.LoadProcessSuccess(processes[1]));

      store.pipe(select(fromSelectors.getLoadedProcessesDecisions)).subscribe((value) => (result = value));

      expect(result).toEqual([
        ...processes[0].decisions,
        ...processes[2].decisions,
        ...processes[1].decisions
      ]);
    });
  });
});
