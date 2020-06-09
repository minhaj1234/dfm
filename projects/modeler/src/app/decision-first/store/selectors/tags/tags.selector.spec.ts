import { TestBed } from '@angular/core/testing';
import { combineReducers, select, Store, StoreModule } from '@ngrx/store';
import { rootReducers } from 'core/root-store';
import { Tag } from '../../../models/tag.model';
import * as fromModelerStore from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';

describe('Tabs Selectors', () => {
  let modelerStore: Store<fromModelerStore.IDecisionFirstState>;

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

    modelerStore = TestBed.get(Store);

    spyOn(modelerStore, 'dispatch').and.callThrough();
  });

  describe('getLoadedTags', () => {
    it('should return the loaded organizations in entity form', () => {
      let result;

      modelerStore.pipe(select(fromModelerStore.getLoadedTags)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual({});

      modelerStore.dispatch(new fromModelerStore.LoadTagSuccess(tags[0]));
      modelerStore.dispatch(new fromModelerStore.LoadTagSuccess(tags[1]));
      modelerStore.dispatch(new fromModelerStore.LoadTagSuccess(tags[2]));

      expect(result).toEqual({
        tag1: tags[0],
        tag2: tags[1],
        tag3: tags[2],
      });
    });
  });

  describe('getSelectedTag', () => {
    it('should return the selected tag', () => {
      modelerStore.dispatch(new fromModelerStore.LoadTagSuccess(tags[0]));
      modelerStore.dispatch(new fromModelerStore.LoadTagSuccess(tags[1]));
      modelerStore.dispatch(new fromModelerStore.LoadTagSuccess(tags[2]));

      let result;

      modelerStore.pipe(select(fromModelerStore.getSelectedTag('tag2'))).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(tags[1]);
    });
  });
});
