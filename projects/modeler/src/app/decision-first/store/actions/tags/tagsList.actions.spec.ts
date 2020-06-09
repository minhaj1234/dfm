import { blankPages } from 'core/models';
import { Tag } from '../../../models/tag.model';
import * as tagsListActions from './tagsList.actions';

describe('TagActions', () => {
  describe('Load Tags List', () => {
    it('should create an action', () => {
      const action = new tagsListActions.LoadTagsList();
      expect({ ...action }).toEqual({
        type: tagsListActions.LOAD_TAGS_LIST,
      });
    });
  });

  describe('Load Tags List Success', () => {
    it('should create an action', () => {
      const tag1: Tag = {} as any;
      const tag2: Tag = {} as any;
      const payload = { results: [tag1, tag2], pagination: blankPages };
      const action = new tagsListActions.LoadTagsListSuccess(payload);
      expect({ ...action }).toEqual({
        payload,
        type: tagsListActions.LOAD_TAGS_LIST_SUCCESS,
      });
    });
  });

  describe('Load Specific Page For Tags List', () => {
    it('should create an action', () => {
      const payload = 'https://test.test';
      const action = new tagsListActions.LoadSpecificPageForTagsList(payload);
      expect({ ...action }).toEqual({
        payload,
        type: tagsListActions.LOAD_SPECIFIC_PAGE_FOR_TAGS_LIST,
      });
    });
  });

  describe('Tags List Failure', () => {
    it('should create an action', () => {
      const action = new tagsListActions.TagsListFailure(new Error('a message'));
      expect({ ...action }).toEqual({
        payload: new Error('a message'),
        type: tagsListActions.TAGS_LIST_FAILURE,
      });
    });
  });

  describe('Set Initial State Tags List', () => {
    it('should create an action', () => {
      const action = new tagsListActions.SetInitialStateTagsList();
      expect({ ...action }).toEqual({
        type: tagsListActions.SET_INITIAL_STATE_TAGS_LIST,
      });
    });
  });
});
