import { TestBed } from '@angular/core/testing';
import { select, Store } from '@ngrx/store';
import { blankPages } from 'core/models';
import { Diagram } from '../../../models/diagram.model';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions';
import * as fromReducers from '../../reducers';
import * as fromSelectors from './diagramsList.selectors';

describe('Diagrams List Selectors', () => {
  let store: Store<fromReducers.IDecisionFirstState>;

  const diagram1 = {
    id: 'diagram1',
    name: 'Diagram One',
  } as Diagram;
  const diagram2 = {
    id: 'diagram2',
      name: 'Diagram Two',
  } as Diagram;
  const diagram3 = {
    id: 'diagram3',
      name: 'Diagram Three',
  } as Diagram;
  const diagrams: Diagram[] = [diagram1, diagram2, diagram3];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
      ],
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getDiagramsList', () => {
    it('should return the diagrams in array form', () => {
      let result;

      store.pipe(select(fromSelectors.getDiagramsList)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual([]);

      store.dispatch(
        new fromActions.LoadDiagramsListSuccess({
          pagination: blankPages,
          results: diagrams,
        }),
      );

      expect(result).toEqual([...diagrams]);
    });
  });

  describe('getDiagramsListNetworkActive', () => {
    it('should return if the network is active', () => {
      let result;

      store.pipe(select(fromSelectors.getDiagramsListNetworkActive)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(false);

      store.dispatch(new fromActions.LoadDiagramsList());

      expect(result).toEqual(true);
    });
  });

  describe('getDiagramsEntities', () => {
    it('should return if the network is active', () => {
      let result;

      store.pipe(select(fromSelectors.getDiagramsEntities)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual({});

      store.dispatch(
        new fromActions.LoadDiagramsListSuccess({
          pagination: blankPages,
          results: diagrams,
        }),
      );

      expect(result).toEqual({
        diagram1: {
          id: 'diagram1',
          name: 'Diagram One',
        } as any,
        diagram2: {
          id: 'diagram2',
          name: 'Diagram Two',
        } as any,
        diagram3: {
          id: 'diagram3',
          name: 'Diagram Three',
        } as any,
      });
    });
  });

  describe('getSelectedDiagramFromDiagramsList', () => {
    it('should return selected list item', () => {
      let result;

      store.pipe(select(fromSelectors.getSelectedDiagramFromDiagramsList(diagram1.id))).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(undefined);

      store.dispatch(new fromActions.LoadDiagramsListSuccess({pagination: blankPages, results: diagrams }));

      expect(result).toEqual(diagram1);
    });
  });
});
