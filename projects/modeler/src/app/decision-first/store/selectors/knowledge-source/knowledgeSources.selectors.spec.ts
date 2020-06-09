import { TestBed } from '@angular/core/testing';
import { select, Store } from '@ngrx/store';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import { ObjectClassNames } from '../../../models/objects.model';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions';
import * as fromReducers from '../../reducers';
import * as fromSelectors from './knowledgeSources.selectors';

describe('Knowledge Source Selectors', () => {
  let store: Store<fromReducers.IDecisionFirstState>;

  const knowledgeSources: KnowledgeSource[] = [
    {
      id: 'knowledgeSource1',
      name: 'Knowledge Source One',
      className: ObjectClassNames.KnowledgeSource,
      diagrams: [{ id: 'diagram1' }],
      requiresDecisions: [{ id: 'decision1' }, { id: 'decision2' }],
      requiredByDecisions: [{ id: 'decision3' }, { id: 'decision4' }],
      requiresInputData: [{ id: 'inputData1' }, { id: 'inputData2' }],
      requiresKnowledgeSources: [{ id: 'requiresKnowledge1' }, { id: 'requiresKnowledge2' }, { id: 'requiresKnowledge3' }],
      requiredByKnowledgeSources: [{ id: 'requiredByKnowledge1' }, { id: 'requiredByKnowledge2' }],
      organizations: [{ id: 'organization1' }, { id: 'organization2' }]
    } as any,
    {
      id: 'knowledgeSource2',
      name: 'Knowledge Source Two',
      className: ObjectClassNames.KnowledgeSource,
      diagrams: [{ id: 'diagram2' }],
      requiresDecisions: [{ id: 'decision5' }, { id: 'decision6' }],
      requiredByDecisions: [{ id: 'decision7' }, { id: 'decision8' }],
      requiresInputData: [{ id: 'inputData3' }, { id: 'inputData4' }],
      requiresKnowledgeSources: [{ id: 'requiresKnowledge4' }, { id: 'requiresKnowledge5' }, { id: 'requiresKnowledge6' }],
      requiredByKnowledgeSources: [{ id: 'requiredByKnowledge3' }, { id: 'requiredByKnowledge4' }],
      organizations: [{ id: 'organization3' }, { id: 'organization4' }]
    } as any,
    {
      id: 'knowledgeSource3',
      name: 'Knowledge Source Three',
      className: ObjectClassNames.KnowledgeSource,
      diagrams: [{ id: 'diagram3' }],
      requiresDecisions: [{ id: 'decision9' }, { id: 'decision10' }],
      requiredByDecisions: [{ id: 'decision11' }, { id: 'decision12' }],
      requiresInputData: [{ id: 'inputData5' }, { id: 'inputData6' }],
      requiresKnowledgeSources: [{ id: 'requiresKnowledge7' }, { id: 'requiresKnowledge8' }, { id: 'requiresKnowledge9' }],
      requiredByKnowledgeSources: [{ id: 'requiredByKnowledge5' }, { id: 'requiredByKnowledge6' }],
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

  describe('getNewKnowledgeSourceForm', () => {
    it('should return if the network is active', () => {
      let result;

      store.pipe(select(fromSelectors.getKnowledgeSourceNetworkActive)).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(false);
    });
  });

  describe('getSelectedKnowledgeSource', () => {
    it('should return the selected knowledgeSource', () => {
      store.dispatch(new fromActions.LoadKnowledgeSourceSuccess(knowledgeSources[0]));
      store.dispatch(new fromActions.LoadKnowledgeSourceSuccess(knowledgeSources[1]));
      store.dispatch(new fromActions.LoadKnowledgeSourceSuccess(knowledgeSources[2]));

      let result;

      store.pipe(select(fromSelectors.getSelectedKnowledgeSource('knowledgeSource1'))).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(knowledgeSources[0]);
    });
  });

  describe('getSelectedKnowledgeSourceNetworkActive', () => {
    it('should return the selected knowledgeSource network active', () => {
      store.dispatch(new fromActions.UpdateKnowledgeSource({
        knowledgeSource: knowledgeSources[0]
      }));

      let result;

      store
        .pipe(select(fromSelectors.getSelectedKnowledgeSourceNetworkActive('knowledgeSource1')))
        .subscribe((value) => {
          result = value;
        });

      expect(result).toBe(true);
    });

    it('should return false if the knowledgeSource is not loaded', () => {
      let result;

      store
        .pipe(select(fromSelectors.getSelectedKnowledgeSourceNetworkActive('knowledgeSource1')))
        .subscribe((value) => {
          result = value;
        });

      expect(result).toBe(false);
    });
  });

  describe('getLoadedKnowledgeSourcesDiagrams', () => {
    it('should return diagrams', () => {
      let result;

      store.dispatch(new fromActions.LoadKnowledgeSourceSuccess(knowledgeSources[0]));
      store.dispatch(new fromActions.LoadKnowledgeSourceSuccess(knowledgeSources[2]));
      store.dispatch(new fromActions.LoadKnowledgeSourceSuccess(knowledgeSources[1]));

      store.pipe(select(fromSelectors.getLoadedKnowledgeSourcesDiagrams)).subscribe((value) => (result = value));

      expect(result).toEqual([
        ...knowledgeSources[0].diagrams,
        ...knowledgeSources[2].diagrams,
        ...knowledgeSources[1].diagrams,
      ]);
    });
  });

  describe('getLoadedKnowledgeSourcesDecisions', () => {
    it('should return decisions', () => {
      let result;

      store.dispatch(new fromActions.LoadKnowledgeSourceSuccess(knowledgeSources[0]));
      store.dispatch(new fromActions.LoadKnowledgeSourceSuccess(knowledgeSources[2]));
      store.dispatch(new fromActions.LoadKnowledgeSourceSuccess(knowledgeSources[1]));

      store.pipe(select(fromSelectors.getLoadedKnowledgeSourcesDecisions)).subscribe((value) => (result = value));

      expect(result).toEqual([
        ...knowledgeSources[0].requiresDecisions,
        ...knowledgeSources[0].requiredByDecisions,
        ...knowledgeSources[2].requiresDecisions,
        ...knowledgeSources[2].requiredByDecisions,
        ...knowledgeSources[1].requiresDecisions,
        ...knowledgeSources[1].requiredByDecisions,
      ]);
    });
  });

  describe('getLoadedKnowledgeSourcesInputData', () => {
    it('should return input data', () => {
      let result;

      store.dispatch(new fromActions.LoadKnowledgeSourceSuccess(knowledgeSources[0]));
      store.dispatch(new fromActions.LoadKnowledgeSourceSuccess(knowledgeSources[2]));
      store.dispatch(new fromActions.LoadKnowledgeSourceSuccess(knowledgeSources[1]));

      store.pipe(select(fromSelectors.getLoadedKnowledgeSourcesInputData)).subscribe((value) => (result = value));

      expect(result).toEqual([
        ...knowledgeSources[0].requiresInputData,
        ...knowledgeSources[2].requiresInputData,
        ...knowledgeSources[1].requiresInputData,
      ]);
    });
  });

  describe('getLoadedKnowledgeSourcesKnowledgeSources', () => {
    it('should return the loaded diagrams knowledge sources', () => {
      let result;

      store.dispatch(new fromActions.LoadKnowledgeSourceSuccess(knowledgeSources[0]));
      store.dispatch(new fromActions.LoadKnowledgeSourceSuccess(knowledgeSources[2]));
      store.dispatch(new fromActions.LoadKnowledgeSourceSuccess(knowledgeSources[1]));

      store
        .pipe(select(fromSelectors.getLoadedKnowledgeSourcesKnowledgeSources))
        .subscribe((value) => (result = value));

      expect(result).toEqual([
        ...knowledgeSources[0].requiresKnowledgeSources,
        ...knowledgeSources[0].requiredByKnowledgeSources,
        ...knowledgeSources[2].requiresKnowledgeSources,
        ...knowledgeSources[2].requiredByKnowledgeSources,
        ...knowledgeSources[1].requiresKnowledgeSources,
        ...knowledgeSources[1].requiredByKnowledgeSources,
      ]);
    });
  });

  describe('getLoadedKnowledgeSourcesOrganizations', () => {
    it('should return organizations', () => {
      let result;

      store.dispatch(new fromActions.LoadKnowledgeSourceSuccess(knowledgeSources[0]));
      store.dispatch(new fromActions.LoadKnowledgeSourceSuccess(knowledgeSources[2]));
      store.dispatch(new fromActions.LoadKnowledgeSourceSuccess(knowledgeSources[1]));

      store.pipe(select(fromSelectors.getLoadedKnowledgeSourcesOrganizations)).subscribe((value) => (result = value));

      expect(result).toEqual([
        ...knowledgeSources[0].organizations,
        ...knowledgeSources[2].organizations,
        ...knowledgeSources[1].organizations,
      ]);
    });
  });
});
