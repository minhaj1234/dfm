import { TestBed } from '@angular/core/testing';
import { select, Store } from '@ngrx/store';
import { ImplementationComponent } from '../../../models/implementationComponent.model';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions';
import * as fromReducers from '../../reducers';
import * as fromSelectors from './implementationComponents.selector';

describe('ImplementationComponents Selectors', () => {
  let store: Store<fromReducers.IDecisionFirstState>;

  const implementationComponents: ImplementationComponent[] = [
    {
      id: 'implementationComponent1',
      name: 'ImplementationComponent One',
      decisions: [{ id: 'decision1' }, { id: 'decision2' }]
    } as any,
    {
      id: 'implementationComponent2',
      name: 'ImplementationComponent Two',
      decisions: [{ id: 'decision3' }, { id: 'decision4' }]
    } as any,
    {
      id: 'implementationComponent3',
      name: 'ImplementationComponent Three',
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

  describe('getLoadedImplementationComponentsAsArray', () => {
    it('should return the loaded implementation components in array form', () => {
      let result;

      store.pipe(select(fromSelectors.getLoadedImplementationComponentsAsArray)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual([]);

      store.dispatch(new fromActions.LoadImplementationComponentSuccess(implementationComponents[0]));
      store.dispatch(new fromActions.LoadImplementationComponentSuccess(implementationComponents[1]));
      store.dispatch(new fromActions.LoadImplementationComponentSuccess(implementationComponents[2]));

      expect(result).toEqual([implementationComponents[0], implementationComponents[1], implementationComponents[2]]);
    });
  });

  describe('getImplementationComponentsAnyNetworkActive', () => {
    it('should return if the network is active', () => {
      let result;

      store.pipe(select(fromSelectors.getImplementationComponentsAnyNetworkActive)).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(false);
    });
  });

  describe('getSelectedImplementationComponent', () => {
    it('should return the selected implementation component', () => {
      store.dispatch(new fromActions.LoadImplementationComponentSuccess(implementationComponents[0]));
      store.dispatch(new fromActions.LoadImplementationComponentSuccess(implementationComponents[1]));
      store.dispatch(new fromActions.LoadImplementationComponentSuccess(implementationComponents[2]));

      let result;

      store
        .pipe(select(fromSelectors.getSelectedImplementationComponent('implementationComponent2')))
        .subscribe((value) => {
          result = value;
        });

      expect(result).toBe(implementationComponents[1]);
    });
  });

  describe('getSelectedImplementationComponentNetworkActive', () => {
    it('should return the selected implementation component network active', () => {
      store.dispatch(new fromActions.LoadImplementationComponent('implementationComponent2'));

      let result;

      store
        .pipe(select(fromSelectors.getSelectedImplementationComponentNetworkActive('implementationComponent2')))
        .subscribe((value) => {
          result = value;
        });

      expect(result).toBe(true);
    });

    it('should return false if the implementation component is not loaded', () => {
      let result;

      store
        .pipe(select(fromSelectors.getSelectedImplementationComponentNetworkActive('implementationComponent2')))
        .subscribe((value) => {
          result = value;
        });

      expect(result).toBe(false);
    });
  });

  describe('getLoadedImplementationComponentsDecisions', () => {
    it('should return decisions', () => {
      let result;

      store.dispatch(new fromActions.LoadImplementationComponentSuccess(implementationComponents[0]));
      store.dispatch(new fromActions.LoadImplementationComponentSuccess(implementationComponents[2]));
      store.dispatch(new fromActions.LoadImplementationComponentSuccess(implementationComponents[1]));

      store.pipe(select(fromSelectors.getLoadedImplementationComponentsDecisions)).subscribe((value) => (result = value));

      expect(result).toEqual(
        [...implementationComponents[0].decisions, ...implementationComponents[2].decisions, ...implementationComponents[1].decisions]);
    });
  });
});
