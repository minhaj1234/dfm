import { Action } from '@ngrx/store';
import { ObjectClassNames } from '../../../models/objects.model';
import { ITagUpdate, Tag } from '../../../models/tag.model';

export const LOAD_TAG = '[DMS] Load Tag';
export const LOAD_TAG_SUCCESS = '[DMS] Load Tag Success';
export const DELETE_TAG = '[DMS] Delete Tag';
export const UPDATE_TAG = '[DMS] Update Tag';
export const MERGE_TAGS = '[DMS] Merge Tags';
export const UPDATE_OBJECT_TAGS = '[DMS] Update Object Tags';
export const FINISHED_NETWORK_REQUEST_FOR_TAG = '[DMS] Finished Network Access for Tag';
export const TAG_FAILURE = '[DMS] Tag Failure';
export const REMOVE_TAG_FROM_LOCAL_MEMORY = '[DMS] Remove Tag From Local Memory';

export class LoadTag implements Action {
  readonly type = LOAD_TAG;
  constructor(public payload: string) { };
}

export class LoadTagSuccess implements Action {
  readonly type = LOAD_TAG_SUCCESS;
  constructor(public payload: Tag) { };
}

export class UpdateTag implements Action {
  readonly type = UPDATE_TAG;
  constructor(public payload: ITagUpdate) { }
}

export class DeleteTag implements Action {
  readonly type = DELETE_TAG;
  constructor(public payload: Tag) { };
}

export class MergeTags implements Action {
  readonly type = MERGE_TAGS;
  constructor(public payload: {
    sourceTagId: string,
    relatedTagId: string
  }) { };
}

export class UpdateObjectTags implements Action {
  readonly type = UPDATE_OBJECT_TAGS;
  constructor(public payload: {
    missingTagNames?: string[],
    extraTagIds?: string[],
    id: string,
    type: ObjectClassNames,
  }) { };
}
export class FinishedNetworkRequestForTag implements Action {
  readonly type = FINISHED_NETWORK_REQUEST_FOR_TAG;
  constructor(public payload: string) { }
}

export class TagFailure implements Action {
  readonly type = TAG_FAILURE;
  constructor(public payload: { id: string; error: Error }) {}
}

export class RemoveTagFromLocalMemory implements Action {
  readonly type = REMOVE_TAG_FROM_LOCAL_MEMORY;
  constructor(public payload: string) { }
}

export type TagsActions = 
  | LoadTag
  | LoadTagSuccess
  | DeleteTag
  | UpdateTag
  | MergeTags
  | UpdateObjectTags
  | FinishedNetworkRequestForTag
  | TagFailure
  | RemoveTagFromLocalMemory;
