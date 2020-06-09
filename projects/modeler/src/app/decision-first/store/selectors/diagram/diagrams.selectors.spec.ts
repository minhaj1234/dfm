import { TestBed } from '@angular/core/testing';
import { select, Store } from '@ngrx/store';
import { Diagram } from '../../../models/diagram.model';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions';
import * as fromReducers from '../../reducers';
import * as fromSelectors from './diagrams.selectors';

describe('Diagrams Selectors', () => {
  let store: Store<fromReducers.IDecisionFirstState>;

  const diagrams: Diagram[] = [
    {
      id: 'diagram1',
      name: 'Diagram One',
      decisions: [{ id: 'abc' }, { id: 'def' }, { id: 'ghi' }],
      inputDatas: [{ id: 'input data 1' }, { id: 'input data 2' }],
      knowledgeSources: [{ id: 'zyx' }, { id: 'wvu' }, { id: 'tsr' }],
    } as any,
    {
      id: 'diagram2',
      name: 'Diagram Two',
      decisions: [{ id: 'abc' }, { id: 'jkl' }, { id: 'mno' }],
      inputDatas: [{ id: 'input data 3' }, { id: 'input data 4' }],
      knowledgeSources: [{ id: 'zyx' }, { id: 'pon' }, { id: 'mlk' }],
    } as any,
    {
      id: 'diagram3',
      name: 'Diagram Three',
      decisions: [{ id: 'def' }, { id: 'jkl' }, { id: 'pqr' }],
      inputDatas: [{ id: 'input data 5' }, { id: 'input data 6' }],
      knowledgeSources: [{ id: 'pon' }, { id: 'mlk' }, { id: 'jih' }],
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

  describe('getLoadedDiagrams', () => {
    it('should return the loaded diagrams in entity form', () => {
      let result;

      store.pipe(select(fromSelectors.getLoadedDiagrams)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual({});

      store.dispatch(new fromActions.LoadDiagramSuccess(diagrams[0]));
      store.dispatch(new fromActions.LoadDiagramSuccess(diagrams[1]));
      store.dispatch(new fromActions.LoadDiagramSuccess(diagrams[2]));

      expect(result).toEqual({
        diagram1: diagrams[0],
        diagram2: diagrams[1],
        diagram3: diagrams[2],
      });
    });
  });

  describe('getLoadedDiagramsAsArray', () => {
    it('should return the loaded diagrams in array form', () => {
      let result;

      store.pipe(select(fromSelectors.getLoadedDiagramsAsArray)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual([]);

      store.dispatch(new fromActions.LoadDiagramSuccess(diagrams[0]));
      store.dispatch(new fromActions.LoadDiagramSuccess(diagrams[1]));
      store.dispatch(new fromActions.LoadDiagramSuccess(diagrams[2]));

      expect(result).toEqual([diagrams[0], diagrams[1], diagrams[2]]);
    });
  });

  describe('getDiagramsAnyNetworkActive', () => {
    it('should return true if any of the diagrams are loading', () => {
      let result;

      store.pipe(select(fromSelectors.getDiagramsAnyNetworkActive)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(false);

      store.dispatch(new fromActions.LoadDiagramSuccess(diagrams[0]));
      store.dispatch(new fromActions.LoadDiagram(diagrams[1].id));
      store.dispatch(new fromActions.LoadDiagramSuccess(diagrams[2]));

      expect(result).toEqual(true);
    });

    it('return false if none of the diagrams are loading', () => {
      let result;

      store.pipe(select(fromSelectors.getDiagramsAnyNetworkActive)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(false);

      store.dispatch(new fromActions.LoadDiagramSuccess(diagrams[0]));
      store.dispatch(new fromActions.LoadDiagram(diagrams[1].id));
      store.dispatch(new fromActions.LoadDiagramSuccess(diagrams[2]));
      store.dispatch(new fromActions.LoadDiagramSuccess(diagrams[1]));

      expect(result).toEqual(false);
    });
  });

  describe('getLoadedDiagrams', () => {
    it('should return the selected diagram', () => {
      let result;

      store.pipe(select(fromSelectors.getSelectedDiagram('diagram1'))).subscribe((value) => {
        result = value;
      });

      expect(result).toBeUndefined();

      store.dispatch(new fromActions.LoadDiagramSuccess(diagrams[0]));

      expect(result).toEqual(diagrams[0]);
    });
  });

  describe('getSelectedDiagramNetworkActive', () => {
    it('should return if the selected diagram is loading', () => {
      let result;

      store.pipe(select(fromSelectors.getSelectedDiagramNetworkActive('diagram1'))).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(false);

      store.dispatch(new fromActions.LoadDiagram(diagrams[0].id));

      expect(result).toEqual(true);
    });
  });

  describe('getLoadedDiagramDecisions', () => {
    it('should return the loaded diagrams decisions', () => {
      let result;

      store.dispatch(new fromActions.LoadDiagramSuccess(diagrams[0]));
      store.dispatch(new fromActions.LoadDiagramSuccess(diagrams[2]));
      store.dispatch(new fromActions.LoadDiagramSuccess(diagrams[1]));

      store.pipe(select(fromSelectors.getLoadedDiagramsDecisions)).subscribe((value) => (result = value));

      expect(result).toEqual([...diagrams[0].decisions, ...diagrams[2].decisions, ...diagrams[1].decisions]);
    });
  });

  describe('getLoadedDiagramsInputData', () => {
    it('should return input data', () => {
      let result;

      store.dispatch(new fromActions.LoadDiagramSuccess(diagrams[0]));
      store.dispatch(new fromActions.LoadDiagramSuccess(diagrams[2]));
      store.dispatch(new fromActions.LoadDiagramSuccess(diagrams[1]));

      store.pipe(select(fromSelectors.getLoadedDiagramsInputData)).subscribe((value) => (result = value));

      expect(result).toEqual([...diagrams[0].inputDatas, ...diagrams[2].inputDatas, ...diagrams[1].inputDatas]);
    });
  });

  describe('getLoadedDiagramsKnowledgeSources', () => {
    it('should return the loaded diagrams knowledge sources', () => {
      let result;

      store.dispatch(new fromActions.LoadDiagramSuccess(diagrams[0]));
      store.dispatch(new fromActions.LoadDiagramSuccess(diagrams[2]));
      store.dispatch(new fromActions.LoadDiagramSuccess(diagrams[1]));

      store.pipe(select(fromSelectors.getLoadedDiagramsKnowledgeSources)).subscribe((value) => (result = value));

      expect(result).toEqual([
        ...diagrams[0].knowledgeSources,
        ...diagrams[2].knowledgeSources,
        ...diagrams[1].knowledgeSources,
      ]);
    });
  });
});
