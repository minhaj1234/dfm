import { ObjectClassNames } from '../../../models/objects.model';
import { ITagUpdate, Tag } from '../../../models/tag.model';
import * as tagActions from './tags.actions';

describe('TagActions', () => {
  describe('Load Tag', () => {
    it('should create an action', () => {
      const payload = '12345';
      const action = new tagActions.LoadTag(payload);
      expect({ ...action }).toEqual({
        payload,
        type: tagActions.LOAD_TAG,
      });
    });
  });

  describe('Load Tag Success', () => {
    it('should create an action', () => {
      const payload: Tag = {} as any;
      const action = new tagActions.LoadTagSuccess(payload);
      expect({ ...action }).toEqual({
        payload,
        type: tagActions.LOAD_TAG_SUCCESS,
      });
    });
  });

  describe('Update Tag', () => {
    it('should create an action', () => {
      const payload = {tag: { name: 'name', id: '12345' }}; 
      const action = new tagActions.UpdateTag(payload);
      expect({ ...action }).toEqual({
        payload,
        type: tagActions.UPDATE_TAG,
      });
    });
  });

  describe('Delete Tag', () => {
    it('should create an action', () => {
      const payload = { name: 'name', id: '12345' } as Tag; 
      const action = new tagActions.DeleteTag(payload);
      expect({ ...action }).toEqual({
        payload,
        type: tagActions.DELETE_TAG,
      });
    });
  });

  describe('Merge Tags', () => {
    it('should create an action', () => {
      const payload = {  sourceTagId: '12345', relatedTagId: 'abc' }; 
      const action = new tagActions.MergeTags (payload);
      expect({ ...action }).toEqual({
        payload,
        type: tagActions.MERGE_TAGS,
      });
    });
  });

  describe('Update Object Tags', () => {
    it('should create an action', () => {
      const payload = {
        missingTagNames: ['tag1'],
        extraTagIds: ['tag id'],
        id: '12345',
        type: ObjectClassNames.Decision,
      }; 
      const action = new tagActions.UpdateObjectTags(payload);
      expect({ ...action }).toEqual({
        payload,
        type: tagActions.UPDATE_OBJECT_TAGS,
      });
    });
  });

  describe('Finished Network Request For Tag', () => {
    it('should create an action', () => {
      const payload = '12345'; 
      const action = new tagActions.FinishedNetworkRequestForTag(payload);
      expect({ ...action }).toEqual({
        payload,
        type: tagActions.FINISHED_NETWORK_REQUEST_FOR_TAG,
      });
    });
  });

  describe('Tag Failure', () => {
    it('should create an action', () => {
      const payload = { error: new Error('Fail message'), id: '1234' };
      const action = new tagActions.TagFailure(payload);
      expect({ ...action }).toEqual({
        payload,
        type: tagActions.TAG_FAILURE,
      });
    });
  });

  describe('Remove Tag From Local Memory', () => {
    it('should create an action', () => {
      const payload = 'test id';
      const action = new tagActions.RemoveTagFromLocalMemory(payload);
      expect({ ...action }).toEqual({
        payload,
        type: tagActions.REMOVE_TAG_FROM_LOCAL_MEMORY,
      });
    });
  });
});
