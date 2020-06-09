import { TestBed } from '@angular/core/testing';
import { select, Store } from '@ngrx/store';
import { blankPages } from 'core/models';
import { InputData } from '../../../models/inputData.model';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions/input-data/inputDatasList.actions';
import * as fromReducers from '../../reducers';
import * as fromSelectors from './inputDatasList.selector';

describe('InputDatas List Selectors', () => {
  let store: Store<fromReducers.IDecisionFirstState>;

  const inputData1 =  {
    id: 'inputData1',
    name: 'InputData One',
  } as InputData;
  const inputData2 =  {
    id: 'inputData2',
    name: 'InputData Two',
  } as InputData;
  const inputData3 =  {
    id: 'inputData3',
    name: 'InputData Three',
  } as InputData;
  
  const inputDatas: InputData[] = [ inputData1, inputData2, inputData3];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
      ],
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getInputDatasEntities', () => {
    it('should return the input datas in entity form', () => {
      let result;

      store.pipe(select(fromSelectors.getInputDatasEntities)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual({});

      store.dispatch(new fromActions.LoadInputDatasListSuccess({ results: inputDatas, pagination: blankPages }));

      expect(result).toEqual({
        inputData1: {
          id: 'inputData1',
          name: 'InputData One',
        },
        inputData2: {
          id: 'inputData2',
          name: 'InputData Two',
        },
        inputData3: {
          id: 'inputData3',
          name: 'InputData Three',
        },
      });
    });
  });

  describe('getInputDatasList', () => {
    it('should return the input datas in array form', () => {
      let result;

      store.pipe(select(fromSelectors.getInputDatasList)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual([]);

      store.dispatch(new fromActions.LoadInputDatasListSuccess({ results: inputDatas, pagination: blankPages }));

      expect(result).toEqual([...inputDatas]);
    });
  });

  describe('getInputDatasListNetworkActive', () => {
    it('should return if the network is active', () => {
      let result;

      store.pipe(select(fromSelectors.getInputDatasListNetworkActive)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(false);
    });
  });

  describe('getSelectedInputDataFromInputDataList', () => {
    it('should return selected list item', () => {
      let result;

      store.pipe(select(fromSelectors.getSelectedInputDataFromInputDataList(inputData1.id))).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(undefined);

      store.dispatch(new fromActions.LoadInputDatasListSuccess({pagination: blankPages, results: inputDatas }));

      expect(result).toEqual(inputData1);
    });
  });
});
