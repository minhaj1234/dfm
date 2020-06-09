import { TestBed } from '@angular/core/testing';
import { select, Store } from '@ngrx/store';
import { InputData } from '../../../models/inputData.model';
import { ObjectClassNames } from '../../../models/objects.model';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions';
import * as fromReducers from '../../reducers';
import * as fromSelectors from './inputData.selector';

describe('InputData Selectors', () => {
  let store: Store<fromReducers.IDecisionFirstState>;

  const inputDatas: InputData[] = [
    {
      id: 'inputData1',
      name: 'InputData One',
      className: ObjectClassNames.InputData,
      diagrams: [{ id: 'diagram1' }],
      requiredByDecisions: [{ id: 'decision1' }, { id: 'decision2' }],
      requiredByKnowledgeSources: [{ id: 'knowledgeSource1' }, { id: 'knowledgeSource2' }],
      organizations: [{ id: 'organization1' }, { id: 'organization2' }]
    } as any,
    {
      id: 'inputData2',
      name: 'InputData Two',
      className: ObjectClassNames.InputData,
      diagrams: [{ id: 'diagram2' }],
      requiredByDecisions: [{ id: 'decision3' }, { id: 'decision4' }],
      requiredByKnowledgeSources: [{ id: 'knowledgeSource1' }, { id: 'knowledgeSource2' }],
      organizations: [{ id: 'organization3' }, { id: 'organization4' }]
    } as any,
    {
      id: 'inputData3',
      name: 'InputData Three',
      className: ObjectClassNames.InputData,
      diagrams: [{ id: 'diagram3' }],
      requiredByDecisions: [{ id: 'decision5' }, { id: 'decision6' }],
      requiredByKnowledgeSources: [{ id: 'knowledgeSource1' }, { id: 'knowledgeSource2' }],
      organizations: [{ id: 'organization5' }, { id: 'organization6' }]
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

  describe('getLoadedInputDatasAsArray', () => {
    it('should return the loaded input datas in array form', () => {
      let result;

      store.pipe(select(fromSelectors.getLoadedInputDatasAsArray)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual([]);

      store.dispatch(new fromActions.LoadInputDataSuccess(inputDatas[0]));
      store.dispatch(new fromActions.LoadInputDataSuccess(inputDatas[1]));
      store.dispatch(new fromActions.LoadInputDataSuccess(inputDatas[2]));

      expect(result).toEqual([inputDatas[0], inputDatas[1], inputDatas[2]]);
    });
  });

  describe('getInputDatasAnyNetworkActive', () => {
    it('should return if the network is active', () => {
      let result;

      store.pipe(select(fromSelectors.getInputDatasAnyNetworkActive)).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(false);
    });
  });

  describe('getSelectedInputData', () => {
    it('should return the selected input data', () => {
      store.dispatch(new fromActions.LoadInputDataSuccess(inputDatas[0]));
      store.dispatch(new fromActions.LoadInputDataSuccess(inputDatas[1]));
      store.dispatch(new fromActions.LoadInputDataSuccess(inputDatas[2]));

      let result;

      store.pipe(select(fromSelectors.getSelectedInputData('inputData1'))).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(inputDatas[0]);
    });
  });

  describe('getSelectedInputDataNetworkActive', () => {
    it('should return the selected input data network active', () => {
      store.dispatch(new fromActions.LoadInputData('inputData1'));

      let result;

      store.pipe(select(fromSelectors.getSelectedInputDataNetworkActive('inputData1'))).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(true);
    });

    it('should return false if the input data is not loaded', () => {
      let result;

      store.pipe(select(fromSelectors.getSelectedInputDataNetworkActive('inputData1'))).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(false);
    });
  });

  describe('getLoadedInputDataDiagrams', () => {
    it('should return diagrams', () => {
      let result;

      store.dispatch(new fromActions.LoadInputDataSuccess(inputDatas[0]));
      store.dispatch(new fromActions.LoadInputDataSuccess(inputDatas[2]));
      store.dispatch(new fromActions.LoadInputDataSuccess(inputDatas[1]));

      store.pipe(select(fromSelectors.getLoadedInputDataDiagrams)).subscribe((value) => (result = value));

      expect(result).toEqual([
        ...inputDatas[0].diagrams,
        ...inputDatas[2].diagrams,
        ...inputDatas[1].diagrams]);
    });
  });

  describe('getLoadedInputDataDecisions', () => {
    it('should return decisions', () => {
      let result;

      store.dispatch(new fromActions.LoadInputDataSuccess(inputDatas[0]));
      store.dispatch(new fromActions.LoadInputDataSuccess(inputDatas[2]));
      store.dispatch(new fromActions.LoadInputDataSuccess(inputDatas[1]));

      store.pipe(select(fromSelectors.getLoadedInputDataDecisions)).subscribe((value) => (result = value));

      expect(result).toEqual([
        ...inputDatas[0].requiredByDecisions,
        ...inputDatas[2].requiredByDecisions,
        ...inputDatas[1].requiredByDecisions]);
    });
  });

  describe('getLoadedInputDataKnowledgeSources', () => {
    it('should return knowledge sources', () => {
      let result;

      store.dispatch(new fromActions.LoadInputDataSuccess(inputDatas[0]));
      store.dispatch(new fromActions.LoadInputDataSuccess(inputDatas[2]));
      store.dispatch(new fromActions.LoadInputDataSuccess(inputDatas[1]));

      store.pipe(select(fromSelectors.getLoadedInputDataKnowledgeSources)).subscribe((value) => (result = value));

      expect(result).toEqual([
        ...inputDatas[0].requiredByKnowledgeSources,
        ...inputDatas[2].requiredByKnowledgeSources,
        ...inputDatas[1].requiredByKnowledgeSources]);
    });
  });

  describe('getLoadedInputDataOrganizations', () => {
    it('should return organizations', () => {
      let result;

      store.dispatch(new fromActions.LoadInputDataSuccess(inputDatas[0]));
      store.dispatch(new fromActions.LoadInputDataSuccess(inputDatas[2]));
      store.dispatch(new fromActions.LoadInputDataSuccess(inputDatas[1]));

      store.pipe(select(fromSelectors.getLoadedInputDataOrganizations)).subscribe((value) => (result = value));

      expect(result).toEqual([
        ...inputDatas[0].organizations,
        ...inputDatas[2].organizations,
        ...inputDatas[1].organizations]);
    });
  });
});
