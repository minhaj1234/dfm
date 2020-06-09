import { Action } from '@ngrx/store';
import { IPagination } from 'core/models';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';

export const LOAD_KNOWLEDGE_SOURCES_LIST = '[DMS] Load KnowledgeSources List';
export const LOAD_SPECIFIC_PAGE_FOR_KNOWLEDGE_SOURCES_LIST = '[DMS] Load Specific Page For Knowledge Sources List';
export const LOAD_KNOWLEDGE_SOURCES_LIST_SUCCESS = '[DMS] Load KnowledgeSources List Success';
export const LOAD_SINGLE_KNOWLEDGE_SOURCE_FOR_KNOWLEDGE_SOURCES_LIST =
  '[DMS] Load Single Knowledge Source For Knowledge Sources List';
export const LOAD_SINGLE_KNOWLEDGE_SOURCE_FOR_KNOWLEDGE_SOURCES_LIST_SUCCESS =
  '[DMS] Add Single Knowledge Source To Knowledge Sources List Success';
export const REMOVE_SINGLE_KNOWLEDGE_SOURCE_FROM_KNOWLEDGE_SOURCES_LIST =
  '[DMS] Remove Single Knowledge Source From Knowledge Sources List';
export const UPDATE_SEARCH_FOR_KNOWLEDGE_SOURCES_LIST = '[DMS] Update Search For Knoweldge Sources list';
export const KNOWLEDGE_SOURCES_LIST_FAILURE = '[DMS] Knowledge Sources List Failure';

export class LoadKnowledgeSourcesList implements Action {
  readonly type = LOAD_KNOWLEDGE_SOURCES_LIST;
}

export class LoadSpecificPageForKnowledgeSourcesList implements Action {
  readonly type = LOAD_SPECIFIC_PAGE_FOR_KNOWLEDGE_SOURCES_LIST;
  constructor(public payload: string) { }
}

export class LoadKnowledgeSourcesListSuccess implements Action {
  readonly type = LOAD_KNOWLEDGE_SOURCES_LIST_SUCCESS;
  constructor(public payload: { results: KnowledgeSource[]; pagination: IPagination }) {}
}

export class LoadSingleKnowledgeSourceForKnowledgeSourcesList implements Action {
  readonly type = LOAD_SINGLE_KNOWLEDGE_SOURCE_FOR_KNOWLEDGE_SOURCES_LIST;
  constructor(public payload: string) {}
}

export class LoadSingleKnowledgeSourceForKnowledgeSourcesListSuccess implements Action {
  readonly type = LOAD_SINGLE_KNOWLEDGE_SOURCE_FOR_KNOWLEDGE_SOURCES_LIST_SUCCESS;
  constructor(public payload: KnowledgeSource) {}
}

export class RemoveSingleKnowledgeSourceFromKnowledgeSourcesList implements Action {
  readonly type = REMOVE_SINGLE_KNOWLEDGE_SOURCE_FROM_KNOWLEDGE_SOURCES_LIST;
  constructor(public payload: string) {}
}

export class UpdateSearchForKnowledgeSourcesList implements Action {
  readonly type = UPDATE_SEARCH_FOR_KNOWLEDGE_SOURCES_LIST;
  constructor(public payload = '') {}
}

export class KnowledgeSourcesListFailure implements Action {
  readonly type = KNOWLEDGE_SOURCES_LIST_FAILURE;
  constructor(public payload: Error) {}
}

export type KnowledgeSourcesListActions =
  | LoadKnowledgeSourcesList
  | LoadSpecificPageForKnowledgeSourcesList
  | LoadKnowledgeSourcesListSuccess
  | LoadSingleKnowledgeSourceForKnowledgeSourcesList
  | LoadSingleKnowledgeSourceForKnowledgeSourcesListSuccess
  | RemoveSingleKnowledgeSourceFromKnowledgeSourcesList
  | UpdateSearchForKnowledgeSourcesList
  | KnowledgeSourcesListFailure;
