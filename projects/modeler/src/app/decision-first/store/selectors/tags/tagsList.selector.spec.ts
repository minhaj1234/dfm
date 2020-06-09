import { TestBed } from '@angular/core/testing';
import { combineReducers, select, Store, StoreModule } from '@ngrx/store';
import { blankPages } from 'core/models';
import { rootReducers } from 'core/root-store';
import { Tag } from '../../../models/tag.model';
import * as fromModelerStore from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';

describe('Tags List Selectors', () => {
  let store: Store<fromModelerStore.IDecisionFirstState>;

  const tags: Tag[] = [
    {
      id: 'tag1',
      name: 'Tag One',
    } as any,
    {
      id: 'tag2',
      name: 'Tag Two',
    } as any,
    {
      id: 'tag3',
      name: 'Tag Three',
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

  describe('getTagsList', () => {
    it('should return the tags in array form', () => {
      let result;

      store.pipe(select(fromModelerStore.getTagsList)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual([]);

      store.dispatch(new fromModelerStore.LoadTagsListSuccess({ results: tags, pagination: blankPages }));

      expect(result).toEqual([...tags]);
    });
  });

  describe('getTagsEntities', () => {
    it('should return the tags in entity form', () => {
      let result;

      store.pipe(select(fromModelerStore.getTagsEntities)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual({});

      store.dispatch(new fromModelerStore.LoadTagsListSuccess({ results: tags, pagination: blankPages }));

      expect(result).toEqual({
        tag1: {
          id: 'tag1',
          name: 'Tag One',
        },
        tag2: {
          id: 'tag2',
          name: 'Tag Two',
        },
        tag3: {
          id: 'tag3',
          name: 'Tag Three',
        },
      });
    });
  });
});
