import { blankPages } from 'core/models';
import * as fromActions from '../../actions/tags/tagsList.actions';
import * as fromTagsList from './tagsList.reducer';

describe('Tags List Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromTagsList;
      const action = {} as any;

      const state = fromTagsList.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  it(`${fromActions.LOAD_TAGS_LIST} action`, () => {
    const { initialState } = fromTagsList;
    const action = new fromActions.LoadTagsList();

    const state = fromTagsList.reducer(initialState, action);

    expect(state.genericNetworkActive).toBe(true);
  });

  it(`${fromActions.LOAD_SPECIFIC_PAGE_FOR_TAGS_LIST} action`, () => {
    const { initialState } = fromTagsList;
    const action = new fromActions.LoadSpecificPageForTagsList('https://example.com/23466');

    const state = fromTagsList.reducer(initialState, action);

    expect(state.genericNetworkActive).toBe(true);
  });

  it(`${fromActions.LOAD_TAGS_LIST_SUCCESS} action`, () => {
    const { initialState } = fromTagsList;
    const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
    const action = new fromActions.LoadTagsListSuccess({
      pagination: blankPages,
      results: [{ id: 'tag1' } as any, { id: 'tag2' } as any],
    });

    const state = fromTagsList.reducer(stateWithNetworkActive, action);

    expect(state.genericNetworkActive).toBe(false);
    expect(state.ids).toEqual(['tag1', 'tag2']);
  });

  it(`${fromActions.TAGS_LIST_FAILURE} action`, () => {
    const { initialState } = fromTagsList;
    const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
    const action = new fromActions.TagsListFailure({} as any);

    const state = fromTagsList.reducer(stateWithNetworkActive, action);

    expect(state.genericNetworkActive).toBe(false);
  });
});
