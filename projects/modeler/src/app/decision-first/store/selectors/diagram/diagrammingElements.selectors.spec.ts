import { TestBed } from '@angular/core/testing';
import { select, Store } from '@ngrx/store';
import { blankPages } from 'core/models';
import { Graphable } from '../../../models/graphable.model';
import { decisionsData } from '../../../services/decisions.service.spec-data';
import { knowledgeSourcesData } from '../../../services/knowledge-source.service.spec-data';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { convertGraphableToDiagramNode } from '../../../utilitites/goJsHelpers';
import { toDecision, toKnowledgeSource } from '../../../utilitites/mappings';
import * as fromActions from '../../actions/diagram/diagrammingElements.actions';
import * as fromReducers from '../../reducers';
import * as fromSelectors from './diagrammingElements.selectors';

describe('Decisions List Selectors', () => {
  let store: Store<fromReducers.IDecisionFirstState>;

  const graphables: Graphable[] = [
    toDecision(decisionsData._embedded.decisions[0]),
    toDecision(decisionsData._embedded.decisions[1]),
    toKnowledgeSource(knowledgeSourcesData._embedded.knowledgeSources[0]),
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

  describe('getDiagrammingElements', () => {
    it('should return the graphable in array form', () => {
      let result;

      store.pipe(select(fromSelectors.getDiagrammingElements)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual([]);

      store.dispatch(
        new fromActions.LoadDiagrammingElementsListSuccess({ results: graphables, pagination: blankPages }),
      );

      expect(result).toEqual([...graphables]);
    });
  });

  describe('paletteList', () => {
    it('should return the graphable as palette items', () => {
      let result;

      store.pipe(select(fromSelectors.getPaletteList)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual([]);

      store.dispatch(
        new fromActions.LoadDiagrammingElementsListSuccess({ results: graphables, pagination: blankPages }),
      );

      expect(result).toEqual([...graphables].map(convertGraphableToDiagramNode));
    });
  });

  describe('getDecisionsListNetworkActive', () => {
    it('should return if the network is active', () => {
      let result;

      store.pipe(select(fromSelectors.getDiagrammingElementsNetworkActive)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(false);
    });
  });

  describe('getDecisionsListNetworkActive', () => {
    it('should return the pagination', () => {
      let result;

      store.dispatch(
        new fromActions.LoadDiagrammingElementsListSuccess({ results: graphables, pagination: blankPages }),
      );

      store.pipe(select(fromSelectors.getDiagrammingElementsPagination)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(blankPages);
    });
  });

  describe('getDecisionsListNetworkActive', () => {
    it('should return the search term', () => {
      let result;

      store.pipe(select(fromSelectors.getDiagrammingElementsSearchTerm)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual('');

      store.dispatch(new fromActions.UpdateSearchForDiagrammingElements({ searchTerm: 'abc' }));

      expect(result).toEqual('abc');
    });
  });
});
