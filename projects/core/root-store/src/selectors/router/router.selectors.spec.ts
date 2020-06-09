import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import { rootReducers, rootSelectors } from 'core/root-store';
import { TestStoreModule } from 'core/testing';

describe('Authentication Selectors', () => {
  let store: Store<rootReducers.IState>;

  function generateRouterAction() {
    // Straight copy from Redux tools in chrome - not worth sorting the keys.
    /* tslint:disable:object-literal-sort-keys */
    return {
      type: '@ngrx/router-store/navigation',
      payload: {
        routerState: {
          params: {
            some: 'param',
          },
          queryParams: {
            type: 'diagram',
            id: 'diagram1',
          },
          url: '/decision-first?type=diagram&id=diagram1',
        },
        event: {
          id: 1,
        },
      },
    };
    /* tslint:disable:object-literal-sort-keys */
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
      ],
    });

    store = TestBed.get(Store);
  });

  describe('getRouterQueryParams', () => {
    it('returns the params if all the information is there', () => {
      let result;

      store.dispatch(generateRouterAction());

      store.pipe(select(rootSelectors.getRouterQueryParams)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual({
        type: 'diagram',
        id: 'diagram1',
      });
    });

    it('returns nothing if information not available', () => {
      let result;

      const action = generateRouterAction();
      delete action.payload.routerState.queryParams;

      store.dispatch(action);

      store.pipe(select(rootSelectors.getRouterQueryParams)).subscribe((value) => {
        result = value;
      });

      expect(result).toBeUndefined();
    });
  });

  describe('getRouterParams', () => {
    it('returns the params if all the information is there', () => {
      let result;

      store.dispatch(generateRouterAction());

      store.pipe(select(rootSelectors.getRouterParams)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual({
        some: 'param',
      });
    });

    it('returns nothing if information not available', () => {
      let result;

      const action = generateRouterAction();
      delete action.payload.routerState.params;

      store.dispatch(action);

      store.pipe(select(rootSelectors.getRouterParams)).subscribe((value) => {
        result = value;
      });

      expect(result).toBeUndefined();
    });
  });

  describe('getRouterUrl', () => {
    it('returns the params if all the information is there', () => {
      let result;

      store.dispatch(generateRouterAction());

      store.pipe(select(rootSelectors.getRouterUrl)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual('/decision-first?type=diagram&id=diagram1');
    });

    it('returns nothing if information not available', () => {
      let result;

      const action = generateRouterAction();
      delete action.payload.routerState.url;

      store.dispatch(action);

      store.pipe(select(rootSelectors.getRouterUrl)).subscribe((value) => {
        result = value;
      });

      expect(result).toBeUndefined();
    });
  });
});
