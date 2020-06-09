import { Action } from '@ngrx/store';
import { IPagination } from 'core/models';
import { Graphable } from '../../../models/graphable.model';

export const UPDATE_SEARCH_FOR_DIAGRAMMING_ELEMENTS = '[DMS] Update Search For Diagramming Elements';
export const LOAD_SPECIFIC_PAGE_FOR_DIAGRAMMING_ELEMENTS_LIST = '[DMS] Load Specific Page For Diagramming Elements List';
export const LOAD_MISSING_DIAGRAMMING_ELEMENTS_FOR_NODE = '[DMS] Load Missing Diagramming Elements For Node';
export const UPDATE_SINGLE_DIAGRAMMING_ELEMENT_IF_NEEDED = '[DMS] Update Single Diagramming Element If Needed';
export const REMOVE_SINGLE_DIAGRAMMING_ELEMENT_IF_NEEDED = '[DMS] Remove Single Diagramming Element If Needed';
export const LOAD_DIAGRAMMING_ELEMENTS_LIST_FAIL = '[DMS] Load Diagramming Elements List Fail';
export const LOAD_DIAGRAMMING_ELEMENTS_LIST_SUCCESS = '[DMS] Load Diagramming Elements List Success';

export class UpdateSearchForDiagrammingElements implements Action {
  readonly type = UPDATE_SEARCH_FOR_DIAGRAMMING_ELEMENTS;
  constructor(public payload: { searchTerm: string }) {}
}

export class LoadSpecificPageForDiagrammingElementsList implements Action {
  readonly type = LOAD_SPECIFIC_PAGE_FOR_DIAGRAMMING_ELEMENTS_LIST;
  constructor(public payload: string) { }
}

export class LoadMissingDiagrammingElementsForNode implements Action {
  readonly type = LOAD_MISSING_DIAGRAMMING_ELEMENTS_FOR_NODE;
  constructor(public payload: {diagramId: string, nodeId: string}) { }
}

export class UpdateSingleDiagrammingElementIfNeeded implements Action {
  readonly type = UPDATE_SINGLE_DIAGRAMMING_ELEMENT_IF_NEEDED;
  constructor(public payload: Graphable) {}
}

export class RemoveSingleElementFromDiagrammingElementsList implements Action {
  readonly type = REMOVE_SINGLE_DIAGRAMMING_ELEMENT_IF_NEEDED;
  constructor(public payload: string) {}
}

export class LoadDiagrammingElementsListFail implements Action {
  readonly type = LOAD_DIAGRAMMING_ELEMENTS_LIST_FAIL;
  constructor(public payload: Error) {}
}

export class LoadDiagrammingElementsListSuccess implements Action {
  readonly type = LOAD_DIAGRAMMING_ELEMENTS_LIST_SUCCESS;
  constructor(public payload: { results: Graphable[]; pagination: IPagination }) {}
}

export type DiagrammingElementsListActions =
  | UpdateSearchForDiagrammingElements
  | LoadSpecificPageForDiagrammingElementsList
  | UpdateSingleDiagrammingElementIfNeeded
  | RemoveSingleElementFromDiagrammingElementsList
  | LoadDiagrammingElementsListFail
  | LoadDiagrammingElementsListSuccess;
