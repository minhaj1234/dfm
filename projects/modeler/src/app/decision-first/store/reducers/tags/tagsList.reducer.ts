import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap, IPagination } from 'core/models';
import { createNetworkAdapter, StateWithNetworkActive } from 'core/utilities';
import { Tag } from '../../../models/tag.model';
import * as fromTagsListActions from '../../actions/tags/tagsList.actions';

export interface ITagsListState extends EntityState<Tag>, StateWithNetworkActive {
  pagination: IPagination;
}

export const tagsAdapter: EntityAdapter<Tag> = createEntityAdapter<Tag>();
export const networkAdapter = createNetworkAdapter();

export const initialState: ITagsListState = {
  ...tagsAdapter.getInitialState(),
  ...networkAdapter.initialState,
  pagination: {
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  },
};

const actionMap: IActionMap<ITagsListState, fromTagsListActions.TagsListActions> = {
  [fromTagsListActions.LOAD_TAGS_LIST]: loadTagsListHandler,
  [fromTagsListActions.LOAD_SPECIFIC_PAGE_FOR_TAGS_LIST]: loadSpecificPageForTagsListHandler,
  [fromTagsListActions.LOAD_TAGS_LIST_SUCCESS]: loadTagsListSuccessHandler,
  [fromTagsListActions.TAGS_LIST_FAILURE]: tagsListFailureHandler,
  [fromTagsListActions.SET_INITIAL_STATE_TAGS_LIST]: setInitialStateTagsListHandler,
};

export function reducer(state: ITagsListState = initialState, action: fromTagsListActions.TagsListActions): ITagsListState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function loadTagsListHandler(state: ITagsListState, action: fromTagsListActions.LoadTagsList): ITagsListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadSpecificPageForTagsListHandler(state: ITagsListState, action: fromTagsListActions.LoadTagsList): ITagsListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadTagsListSuccessHandler(state: ITagsListState, action: fromTagsListActions.LoadTagsListSuccess): ITagsListState {
  return {
    ...tagsAdapter.addAll(action.payload.results, state),
    ...networkAdapter.makeGenericInactive(state),
    pagination: action.payload.pagination,
  };
}

function tagsListFailureHandler(
  state: ITagsListState,
  action: fromTagsListActions.TagsListActions,
): ITagsListState {
  return {
    ...state,
    ...networkAdapter.makeGenericInactive(state),
  };
}

function setInitialStateTagsListHandler(
  state: ITagsListState,
  action: fromTagsListActions.SetInitialStateTagsList,
): ITagsListState {
  return {
    ...initialState,
  }
}

export const { selectAll, selectEntities } = tagsAdapter.getSelectors();
export const getPagination = (state: ITagsListState) => state.pagination;
