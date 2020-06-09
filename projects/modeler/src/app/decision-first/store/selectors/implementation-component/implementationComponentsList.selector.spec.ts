import { TestBed } from '@angular/core/testing';
import { select, Store } from '@ngrx/store';
import { blankPages } from 'core/models';
import { ImplementationComponent } from '../../../models/implementationComponent.model';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions/implementation-component/implementationComponentsList.action';
import * as fromReducers from '../../reducers';
import * as fromSelectors from './implementationComponentsList.selector';

describe('ImplementationComponents List Selectors', () => {
  let store: Store<fromReducers.IDecisionFirstState>;

  const implementationComponent1 =   {
    id: 'implementationComponent1',
    name: 'ImplementationComponent One',
  } as any;
  const implementationComponent2 =   {
    id: 'implementationComponent2',
    name: 'ImplementationComponent Two',
  } as any;
  const implementationComponent3 =   {
    id: 'implementationComponent3',
    name: 'ImplementationComponent Three',
  } as any;

  const implementationComponents: ImplementationComponent[] = [implementationComponent1, implementationComponent2, implementationComponent3];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
      ],
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getImplementationComponentsEntities', () => {
    it('should return the implementation components in entity form', () => {
      let result;

      store.pipe(select(fromSelectors.getImplementationComponentsEntities)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual({});

      store.dispatch(
        new fromActions.LoadImplementationComponentsListSuccess({
          pagination: blankPages,
          results: implementationComponents,
        }),
      );

      expect(result).toEqual({
        implementationComponent1: {
          id: 'implementationComponent1',
          name: 'ImplementationComponent One',
        },
        implementationComponent2: {
          id: 'implementationComponent2',
          name: 'ImplementationComponent Two',
        },
        implementationComponent3: {
          id: 'implementationComponent3',
          name: 'ImplementationComponent Three',
        },
      });
    });
  });

  describe('getImplementationComponentsList', () => {
    it('should return the implementation components in array form', () => {
      let result;

      store.pipe(select(fromSelectors.getImplementationComponentsList)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual([]);

      store.dispatch(
        new fromActions.LoadImplementationComponentsListSuccess({
          pagination: blankPages,
          results: implementationComponents,
        }),
      );

      expect(result).toEqual([...implementationComponents]);
    });
  });

  describe('getImplementationComponentsListNetworkActive', () => {
    it('should return if the network is active', () => {
      let result;

      store.pipe(select(fromSelectors.getImplementationComponentsListNetworkActive)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(false);
    });
  });

  describe('getSelectedImplementationComponentFromImplementationComponentsList', () => {
    it('should return selected list item', () => {
      let result;

      store.pipe(select(fromSelectors.getSelectedImplementationComponentFromImplementationComponentsList(implementationComponent1.id))).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(undefined);

      store.dispatch(new fromActions.LoadImplementationComponentsListSuccess({pagination: blankPages, results: implementationComponents }));

      expect(result).toEqual(implementationComponent1);
    });
  });
});
