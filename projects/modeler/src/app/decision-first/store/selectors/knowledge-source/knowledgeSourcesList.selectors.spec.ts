import { TestBed } from '@angular/core/testing';
import { select, Store } from '@ngrx/store';
import { blankPages } from 'core/models';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions/knowledge-source/knowledgeSourcesList.actions';
import * as fromReducers from '../../reducers';
import * as fromSelectors from './knowledgeSourcesList.selectors';

describe('Knowledge Sources List Selectors', () => {
  let store: Store<fromReducers.IDecisionFirstState>;


  const knowledgeSource1 = {
    id: 'knowledgeSource1',
    name: 'Knowledge Sources One',
  } as KnowledgeSource;
  const knowledgeSource2 = {
    id: 'knowledgeSource2',
    name: 'Knowledge Sources Two',
  } as KnowledgeSource;
  const knowledgeSource3 = {
    id: 'knowledgeSource3',
    name: 'Knowledge Sources Three',
  } as KnowledgeSource;
  const knowledgeSources: KnowledgeSource[] = [knowledgeSource1, knowledgeSource2, knowledgeSource3];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
      ],
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getKnowledgeSources', () => {
    it('should return the knowledgeSources in entity form', () => {
      let result;

      store.pipe(select(fromSelectors.getKnowledgeSources)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual({});

      store.dispatch(
        new fromActions.LoadKnowledgeSourcesListSuccess({ results: knowledgeSources, pagination: blankPages }),
      );

      expect(result).toEqual({
        knowledgeSource1: {
          id: 'knowledgeSource1',
          name: 'Knowledge Sources One',
        },
        knowledgeSource2: {
          id: 'knowledgeSource2',
          name: 'Knowledge Sources Two',
        },
        knowledgeSource3: {
          id: 'knowledgeSource3',
          name: 'Knowledge Sources Three',
        },
      });
    });
  });

  describe('getKnowledge SourcessList', () => {
    it('should return the knowledgeSources in array form', () => {
      let result;

      store.pipe(select(fromSelectors.getKnowledgeSourcesList)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual([]);

      store.dispatch(
        new fromActions.LoadKnowledgeSourcesListSuccess({ results: knowledgeSources, pagination: blankPages }),
      );

      expect(result).toEqual([...knowledgeSources]);
    });
  });

  describe('getKnowledge SourcessListNetworkActive', () => {
    it('should return if the network is active', () => {
      let result;

      store.pipe(select(fromSelectors.getKnowledgeSourcesListNetworkActive)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(false);
    });
  });

  describe('getSelectedKnowledgeSourceFromKnowledgeSourcesList', () => {
    it('should return selected list item', () => {
      let result;

      store.pipe(select(fromSelectors.getSelectedKnowledgeSourceFromKnowledgeSourcesList(knowledgeSource1.id))).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(undefined);

      store.dispatch(new fromActions.LoadKnowledgeSourcesListSuccess({pagination: blankPages, results: knowledgeSources }));

      expect(result).toEqual(knowledgeSource1);
    });
  });
});
