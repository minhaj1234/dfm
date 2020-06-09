import { TestBed } from '@angular/core/testing';
import { combineReducers, select, Store, StoreModule } from '@ngrx/store';
import { blankPages } from 'core/models';
import { rootReducers } from 'core/root-store';
import { Search } from '../../../models/search.model';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromAutocompleteSearchListActions from '../../actions/search/autocompleteSearchList.actions';
import * as fromReducers from '../../reducers';
import * as fromAutocompleteSearchListSelectors from './autocompleteSearchList.selector';

describe('Autocomplete Search List Selectors', () => {
  let store: Store<fromReducers.IDecisionFirstState>;

  const autocompleteSearchList: Search[] = [
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

  describe('getAutocompleteSearchList', () => {
    it('should return the initial value', () => {
      let result;

      store.pipe(select(fromAutocompleteSearchListSelectors.getAutocompleteSearchList)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual([]);
    });

    it('should return the updated value', () => {
      let result;

      store.dispatch(new fromAutocompleteSearchListActions.LoadAutocompleteSearchListSuccess({ results: autocompleteSearchList, pagination: blankPages }));

      store.pipe(select(fromAutocompleteSearchListSelectors.getAutocompleteSearchList)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual([...autocompleteSearchList]);
    });
  });

  describe('getAutocompleteSearchListNetworkActive', () => {
    it('should return network active status', () => {
      let result;

      store.pipe(select(fromAutocompleteSearchListSelectors.getAutocompleteSearchListNetworkActive)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(false);
    });
  });
});
