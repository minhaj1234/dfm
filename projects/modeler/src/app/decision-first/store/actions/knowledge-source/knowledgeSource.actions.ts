import { Action } from '@ngrx/store';
import { IKnowledgeSourceUpdate, KnowledgeSource, KnowledgeSourceRelatedObjects } from '../../../models/knowledgeSource.model';

export const ADD_KNOWLEDGE_SOURCE = '[DMS] Add Knowledge Source';
export const ADD_KNOWLEDGE_SOURCE_SUCCESS = '[DMS] Add Knowledge Source Success';
export const UPDATE_KNOWLEDGE_SOURCE = '[DMS] Update Knowledge Source';
export const DELETE_KNOWLEDGE_SOURCE = '[DMS] Delete Knowledge Source';
export const ADD_RELATED_OBJECT_TO_KNOWLEDGE_SOURCE = '[DMS] Add Related Object To Knowledge Source';
export const UPDATE_KNOWLEDGE_SOURCE_RELATED_OBJECT = '[DMS] Update Knowledge Source Related Object';
export const REMOVE_RELATED_OBJECT_FROM_KNOWLEDGE_SOURCE = '[DMS] Remove Related Object From Knowledge Source';
export const KNOWLEDGE_SOURCE_FAILURE = '[DMS] Knowledge Source Failure';
export const GENERIC_KNOWLEDGE_SOURCE_FAILURE = '[DMS] Generic Knowledge Source Failure';
export const FINISHED_NETWORK_REQUEST_FOR_KNOWLEDGE_SOURCE = '[DMS] Finished Network Access for Knowledge Source';
export const FINISHED_GENERIC_NETWORK_REQUEST_FOR_KNOWLEGE_SOURCE =
  '[DMS] Finished Generic Network Access for Knowledge Source';
export const LOAD_KNOWLEGE_SOURCE = '[DMS] Load Knowledge Source';
export const LOAD_KNOWLEGE_SOURCE_AS_CHILD = '[DMS] Load Knowledge Source As Child';
export const LOAD_KNOWLEGE_SOURCE_SUCCESS = '[DMS] Load Knowledge Source Success';
export const REMOVE_KNOWLEDGE_SOURCE_FROM_LOCAL_MEMORY = '[DMS] Remove Knowledge Source From Local Memory';
export const REMOVE_PREVIEW_KNOWLEDGE_SOURCE_FROM_LOCAL_MEMORY = '[DMS] Remove Preview Knowledge Source From Local Memory';

export class AddKnowledgeSource implements Action {
  readonly type = ADD_KNOWLEDGE_SOURCE;
  constructor(public payload: { name: string; description: string; url: string; type: string }) { }
}

export class AddKnowledgeSourceSuccess implements Action {
  readonly type = ADD_KNOWLEDGE_SOURCE_SUCCESS;
}

export class UpdateKnowledgeSource implements Action {
  readonly type = UPDATE_KNOWLEDGE_SOURCE;
  constructor(public payload: IKnowledgeSourceUpdate) { }
}

export class DeleteKnowledgeSource implements Action {
  readonly type = DELETE_KNOWLEDGE_SOURCE;
  constructor(public payload: KnowledgeSource) { }
}

export class AddRelatedObjectToKnowledgeSource implements Action {
  readonly type = ADD_RELATED_OBJECT_TO_KNOWLEDGE_SOURCE;
  constructor(public payload: {
    sourceObject: KnowledgeSource;
    relatedObject: KnowledgeSourceRelatedObjects;
    relationPath: string;
  }) { }
}

export class UpdateKnowledgeSourceRelatedObject implements Action {
  readonly type = UPDATE_KNOWLEDGE_SOURCE_RELATED_OBJECT;
  constructor(public payload: { object: KnowledgeSourceRelatedObjects, paths: string[] }) { }
}

export class RemoveRelatedObjectFromKnowledgeSource implements Action {
  readonly type = REMOVE_RELATED_OBJECT_FROM_KNOWLEDGE_SOURCE;
  constructor(public payload: {
    sourceObject: KnowledgeSource;
    relatedObject: KnowledgeSourceRelatedObjects;
    relationPath: string;
  }) { }
}

export class KnowledgeSourceFailure implements Action {
  readonly type = KNOWLEDGE_SOURCE_FAILURE;
  constructor(
    public payload: {
      error: Error;
      id: string;
    },
  ) { }
}

export class LoadKnowledgeSource implements Action {
  readonly type = LOAD_KNOWLEGE_SOURCE;
  constructor(public payload: string) { }
}

export class LoadKnowledgeSourceAsChild implements Action {
  readonly type = LOAD_KNOWLEGE_SOURCE_AS_CHILD;
  constructor(public payload: string) { }
}

export class LoadKnowledgeSourceSuccess implements Action {
  readonly type = LOAD_KNOWLEGE_SOURCE_SUCCESS;
  constructor(public payload: KnowledgeSource) { }
}

export class GenericKnowlegeSourceFailure implements Action {
  readonly type = GENERIC_KNOWLEDGE_SOURCE_FAILURE;
  constructor(public payload: Error) { }
}

export class FinishedNetworkRequestForKnowledgeSource implements Action {
  readonly type = FINISHED_NETWORK_REQUEST_FOR_KNOWLEDGE_SOURCE;
  constructor(public payload: string) { }
}

export class FinishedGenericNetworkRequestForKnowledgeSource implements Action {
  readonly type = FINISHED_GENERIC_NETWORK_REQUEST_FOR_KNOWLEGE_SOURCE;
}

export class RemoveKnowledgeSourceFromLocalMemory implements Action {
  readonly type = REMOVE_KNOWLEDGE_SOURCE_FROM_LOCAL_MEMORY;
  constructor(public payload: string) { }
}

export class RemovePreviewKnowledgeSourceFromLocalMemory implements Action {
  readonly type = REMOVE_PREVIEW_KNOWLEDGE_SOURCE_FROM_LOCAL_MEMORY;
  constructor(public payload: string) { }
}

export type KnowledgeSourceActions =
  | AddKnowledgeSource
  | UpdateKnowledgeSource
  | DeleteKnowledgeSource
  | AddRelatedObjectToKnowledgeSource
  | UpdateKnowledgeSourceRelatedObject
  | RemoveRelatedObjectFromKnowledgeSource
  | KnowledgeSourceFailure
  | FinishedNetworkRequestForKnowledgeSource
  | LoadKnowledgeSource
  | LoadKnowledgeSourceSuccess
  | GenericKnowlegeSourceFailure
  | FinishedGenericNetworkRequestForKnowledgeSource
  | RemoveKnowledgeSourceFromLocalMemory
  | RemovePreviewKnowledgeSourceFromLocalMemory;
