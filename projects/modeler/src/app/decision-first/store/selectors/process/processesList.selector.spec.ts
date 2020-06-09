import { TestBed } from '@angular/core/testing';
import { combineReducers, select, Store, StoreModule } from '@ngrx/store';
import { blankPages } from 'core/models';
import { rootReducers } from 'core/root-store';
import { Process } from '../../../models/process.model';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions/process/processesList.actions';
import * as fromReducers from '../../reducers';
import * as fromSelectors from './processesList.selector';

describe('Processes List Selectors', () => {
  let store: Store<fromReducers.IDecisionFirstState>;
  const process1 ={
    id: 'process1',
    name: 'Process One',
  } as Process;
  const process2 ={
    id: 'process2',
    name: 'Process Two',
  } as Process;
  const process3 ={
    id: 'process3',
    name: 'Process Three',
  } as Process;
  const processes: Process[] = [process1, process2, process3];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
      ],
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getProcessesEntities', () => {
    it('should return the processes in entity form', () => {
      let result;

      store.pipe(select(fromSelectors.getProcessesEntities)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual({});

      store.dispatch(new fromActions.LoadProcessesListSuccess({ results: processes, pagination: blankPages }));

      expect(result).toEqual({
        process1: {
          id: 'process1',
          name: 'Process One',
        },
        process2: {
          id: 'process2',
          name: 'Process Two',
        },
        process3: {
          id: 'process3',
          name: 'Process Three',
        },
      });
    });
  });

  describe('getProcessesList', () => {
    it('should return the processes in array form', () => {
      let result;

      store.pipe(select(fromSelectors.getProcessesList)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual([]);

      store.dispatch(new fromActions.LoadProcessesListSuccess({ results: processes, pagination: blankPages }));

      expect(result).toEqual([...processes]);
    });
  });

  describe('getProcessesListNetworkActive', () => {
    it('should return if the network is active', () => {
      let result;

      store.pipe(select(fromSelectors.getProcessesListNetworkActive)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(false);
    });
  });

  describe('getSelectedProcessFromProcessesList', () => {
    it('should return selected list item', () => {
      let result;

      store.pipe(select(fromSelectors.getSelectedProcessFromProcessesList(process1.id))).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(undefined);

      store.dispatch(new fromActions.LoadProcessesListSuccess({pagination: blankPages, results: processes }));

      expect(result).toEqual(process1);
    });
  });
});
