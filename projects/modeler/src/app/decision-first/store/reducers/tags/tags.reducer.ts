import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap } from 'core/models';
import { createNetworkAdapter, StateWithNetworkActive } from 'core/utilities';
import { Tag } from '../../../models/tag.model';
import * as fromActions from '../../actions';

export interface ITagsState extends EntityState<Tag>, StateWithNetworkActive { }

export const tagsAdapter: EntityAdapter<Tag> = createEntityAdapter<Tag>();
export const networkAdapter = createNetworkAdapter();

export const initialState: ITagsState = {
  ...tagsAdapter.getInitialState(),
  ...networkAdapter.initialState,
};

const actionMap: IActionMap<ITagsState, fromActions.TagsActions | fromActions.DecisionActions> = {
  [fromActions.UPDATE_TAG]: updateTagHandler,
  [fromActions.DELETE_TAG]: deleteTagHandler,
  [fromActions.MERGE_TAGS]: mergeTagsHandler,
  [fromActions.LOAD_TAG]: loadTagHandler,
  [fromActions.LOAD_TAG_SUCCESS]: loadTagSuccessHandler,
  [fromActions.FINISHED_NETWORK_REQUEST_FOR_TAG]: finishedNetworkRequestForTagHandler,
  [fromActions.TAG_FAILURE]: tagFailureHandler,
  [fromActions.REMOVE_TAG_FROM_LOCAL_MEMORY]: removeTagFromLocalMemoryHandler,
  [fromActions.UPDATE_DECISION]: removeTagFromLocalMemoryHandler,
};

export function reducer(state: ITagsState = initialState, action: fromActions.TagsActions): ITagsState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function updateTagHandler(state: ITagsState, action: fromActions.UpdateTag): ITagsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.tag.id, state),
  };
}

function deleteTagHandler(state: ITagsState, action: fromActions.DeleteTag): ITagsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.id, state),
  };
}


function mergeTagsHandler(state: ITagsState, action: fromActions.MergeTags): ITagsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.sourceTagId, state),
  };
}

function loadTagHandler(state: ITagsState, action: fromActions.LoadTag): ITagsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload, state),
  };
}

function loadTagSuccessHandler(state: ITagsState, action: fromActions.LoadTagSuccess): ITagsState {
  return {
    ...tagsAdapter.upsertOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload.id, state),
  };
}

function finishedNetworkRequestForTagHandler(
  state: ITagsState,
  action: fromActions.FinishedNetworkRequestForTag,
): ITagsState {
  return {
    ...state,
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

function tagFailureHandler(state: ITagsState, action: fromActions.TagFailure): ITagsState {
  return {
    ...state,
    ...networkAdapter.makeOneInactive(action.payload.id, state),
  };
}

function removeTagFromLocalMemoryHandler(
  state: ITagsState,
  action: fromActions.RemoveTagFromLocalMemory,
): ITagsState {
  return {
    ...tagsAdapter.removeOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

export const { selectAll, selectEntities } = tagsAdapter.getSelectors();
