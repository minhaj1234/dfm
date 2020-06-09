import { TestBed } from '@angular/core/testing';
import { combineReducers, select, Store, StoreModule } from '@ngrx/store';
import { blankPages } from 'core/models';
import { rootReducers } from 'core/root-store';
import { Search } from '../../../models/search.model';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions';
import * as fromReducers from '../../reducers';
import * as fromSelectors from './homeSearchList.selector';

describe('Home Search List Selectors', () => {
  let store: Store<fromReducers.IDecisionFirstState>;

  const homeSearchList: Search[] = [
    {
      id: 'diagram1',
      name: 'Diagram Test',
    } as any,
    {
      id: 'decision1',
      name: 'Decision Test',
    } as any,
    {
      id: 'inputdata1',
      name: 'Input Data Test',
    } as any,
    {
      id: 'knowledgesource1',
      name: 'Knowledge Source Test',
    } as any,
    {
      id: 'organization1',
      name: 'Organization Test',
    } as any,
    {
      id: 'implementationcomponent1',
      name: 'Implementation Component Test',
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

  describe('getHomeSearchList', () => {
    it('should return the initial value', () => {
      let result;

      store.pipe(select(fromSelectors.getHomeSearchList)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual([]);
    });

    it('should return the updated value', () => {
      let result;

      store.dispatch(new fromActions.LoadHomeSearchListSuccess({ results: homeSearchList, pagination: blankPages }));

      store.pipe(select(fromSelectors.getHomeSearchList)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual([...homeSearchList]);
    });
  });

  describe('getHomeSearchListNetworkActive', () => {
    it('should return if the network is active', () => {
      let result;

      store.pipe(select(fromSelectors.getHomeSearchListNetworkActive)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(false);
    });
  });

  describe('getHomeSearchListSearchTerm', () => {
    it('should return initial value', () => {
      let result;

      store.pipe(select(fromSelectors.getHomeSearchListSearchTerm)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual('');
    });

    it('should return updated value', () => {
      let result;

      store.dispatch(new fromActions.UpdateSearchForHomeSearchList({ searchTerm: 'test search term' }));

      store.pipe(select(fromSelectors.getHomeSearchListSearchTerm)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual('test search term');
    });
  });

  describe('getHomeSearchListPagination', () => {
    it('should return initial value', () => {
      let result;

      store.pipe(select(fromSelectors.getHomeSearchListPagination)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(blankPages);
    });
  });
});
