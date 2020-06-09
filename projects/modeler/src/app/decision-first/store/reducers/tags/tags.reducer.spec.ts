import { Tag } from '../../../models/tag.model';
import * as fromActions from '../../actions';
import * as fromTags from './tags.reducer';

describe('Tags Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromTags;
      const action = {} as any;
      const state = fromTags.reducer(undefined, action);
      expect(state).toEqual(initialState);
    });
  });

  describe(`${fromActions.LOAD_TAG} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromTags;
      const action = new fromActions.LoadTag('abc');

      const state = fromTags.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.LOAD_TAG_SUCCESS} action`, () => {
    it('should return tags', () => {
      const { initialState } = fromTags;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.LoadTagSuccess({ id: 'abc' } as any);

      const state = fromTags.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
      expect(state.entities).toEqual({ abc: { id: 'abc' } } as any);
    });
  });

  describe(`${fromActions.TAG_FAILURE} action`, () => {
    it('should not have network active', () => {
      const { initialState } = fromTags;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.TagFailure({ id: 'abc', error: new Error('some message') });

      const state = fromTags.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
    });
  });

  describe(`${fromActions.REMOVE_TAG_FROM_LOCAL_MEMORY} action`, () => {
    it('should remove tag', () => {
      const { initialState } = fromTags;
      const stateWithEntityLoaded = { ...initialState, entities: { abc: { id: 'abc' } as any } };
      const action = new fromActions.RemoveTagFromLocalMemory('abc');

      const state = fromTags.reducer(stateWithEntityLoaded, action);

      expect(state.entities).toEqual({});
    });
  });

  describe(`${fromActions.UPDATE_TAG} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromTags;
      const action = new fromActions.UpdateTag({
        tag: {id: 'abc'}
      });

      const state = fromTags.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.DELETE_TAG} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromTags;
      const action = new fromActions.DeleteTag({id: 'abc'} as Tag);

      const state = fromTags.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.MERGE_TAGS} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromTags;
      const action = new fromActions.MergeTags({sourceTagId: 'abc', relatedTagId: '123'});

      const state = fromTags.reducer(initialState, action);

      expect(state.networkActive).toEqual({ abc: true });
    });
  });

  describe(`${fromActions.FINISHED_NETWORK_REQUEST_FOR_TAG} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromTags;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true } };
      const action = new fromActions.FinishedNetworkRequestForTag('abc');

      const state = fromTags.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
    });
  });
});
