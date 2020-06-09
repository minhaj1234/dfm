import { Action } from '@ngrx/store';
import { Decision } from '../../../models/decision.model';
import { Diagram, IDeleteGraphableRequest, IDiagramUpdate, IObjectAssociatedWithOtherDiagram as IObjectAssociationWithOtherDiagram } from '../../../models/diagram.model';
import { Graphable } from '../../../models/graphable.model';
import { InputData } from '../../../models/inputData.model';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import { ObjectRelationsNames } from '../../../models/objects.model';
import { Sketch } from '../../../models/sketch.model';

export const LOAD_DIAGRAM = '[DMS] Load Diagram';
export const LOAD_DIAGRAM_SUCCESS = '[DMS] Load Diagram Success';
export const ADD_DIAGRAM = '[DMS] Add Diagram';
export const ADD_DIAGRAM_SUCCESS = '[DMS] Add Diagram Success';
export const UPDATE_DIAGRAM = '[DMS] Update Diagram';
export const DELETE_DIAGRAM = '[DMS] Delete Diagram';
export const ADD_GRAPHABLE_OBJECT_TO_DIAGRAM = '[DMS] Add Graphable Object To Diagram';
export const UPDATE_DIAGRAM_GRAPHABLE_OBJECT = '[DMS] Update Diagram Graphable Object';
export const REMOVE_GRAPHABLE_OBJECTS_FROM_DIAGRAM = '[DMS] Remove Graphable Objects From Diagram';
export const LOAD_DIAGRAM_AS_CHILD = '[DMS] Load Diagram As Child';
export const UPDATE_SKETCH_OBJECT = '[DMS] Update Sketch Object';
export const UPDATE_GO_JSON = '[DMS] Update Go Json';
export const FINISHED_NETWORK_REQUEST_FOR_DIAGRAM = '[DMS] Finished Network Access for Diagram';
export const DIAGRAM_FAILURE = '[DMS] Diagram Fail';
export const REMOVE_DIAGRAM_FROM_LOCAL_MEMORY = '[DMS] Remove Diagram From Local Memory';
export const REMOVE_PREVIEW_DIAGRAM_FROM_LOCAL_MEMORY = '[DMS] Remove Preview Diagram From Local Memory';
export const REMOVE_LINK = '[DMS] Remove Link';
export const IS_OBJECT_ASSOCIATED_WITH_OTHER_DIAGRAM = '[DMS] Is Object Associated With Other Diagram';
export const IS_OBJECT_ASSOCIATED_WITH_OTHER_DIAGRAM_SUCCESS = '[DMS] Is Object Associated With Other Diagram Success';

export class LoadDiagram implements Action {
  readonly type = LOAD_DIAGRAM;
  constructor(public payload: string) { }
}

export class LoadDiagramSuccess implements Action {
  readonly type = LOAD_DIAGRAM_SUCCESS;
  constructor(public payload: Diagram) { }
}

export class AddDiagram implements Action {
  readonly type = ADD_DIAGRAM;
  constructor(public payload: { name: string; description: string }) { }
}

export class AddDiagramSuccess implements Action {
  readonly type = ADD_DIAGRAM_SUCCESS;
}

export class UpdateDiagram implements Action {
  readonly type = UPDATE_DIAGRAM;
  constructor(public payload: IDiagramUpdate) { }
}

export class DeleteDiagram implements Action {
  readonly type = DELETE_DIAGRAM;
  constructor(public payload: Diagram) { }
}

export class AddGraphableObjectToDiagram implements Action {
  readonly type = ADD_GRAPHABLE_OBJECT_TO_DIAGRAM;
  constructor(public payload: {
    sourceObject: Diagram;
    relatedObject: Graphable;
    relationPath: ObjectRelationsNames;
    isNew: boolean;
  }) { }
}

export class UpdateDiagramGraphableObject implements Action {
  readonly type = UPDATE_DIAGRAM_GRAPHABLE_OBJECT;
  constructor(public payload: { object: DiagramRelationObjects, paths: string[] }) { }
}

export class RemoveGraphableObjectsFromDiagram implements Action {
  readonly type = REMOVE_GRAPHABLE_OBJECTS_FROM_DIAGRAM;
  constructor(public payload: {
    diagram: Diagram;
    deletedGraphables: IDeleteGraphableRequest[]
  }) { }
}

export class LoadDiagramAsChild implements Action {
  readonly type = LOAD_DIAGRAM_AS_CHILD;
  constructor(public payload: string) { }
}

export class UpdateSketchObject implements Action {
  readonly type = UPDATE_SKETCH_OBJECT;
  constructor(public payload: { diagram: Diagram; sketch: Sketch }) { }
}

export class UpdateGoJson implements Action {
  readonly type = UPDATE_GO_JSON;
  constructor(public payload: { diagram: Diagram; goNodes?: string, goLocations?: string, goConnectors?: string }) { }
}

export class FinishedNetworkRequestForDiagram implements Action {
  readonly type = FINISHED_NETWORK_REQUEST_FOR_DIAGRAM;
  constructor(public payload: string) { }
}

export class DiagramFailure implements Action {
  readonly type = DIAGRAM_FAILURE;
  constructor(public payload: { id: string; error: Error }) { }
}

export class RemoveDiagramFromLocalMemory implements Action {
  readonly type = REMOVE_DIAGRAM_FROM_LOCAL_MEMORY;
  constructor(public payload: string) { }
}

export class RemovePreviewDiagramFromLocalMemory implements Action {
  readonly type = REMOVE_PREVIEW_DIAGRAM_FROM_LOCAL_MEMORY;
  constructor(public payload: string) { }
}

export class RemoveLink implements Action {
  readonly type = REMOVE_LINK;
  constructor(public payload: { diagram: Diagram, fromObjectId: string, toObjectId: string, linkType: string }) { }
}

export class ObjectAssociationWithOtherDiagram implements Action {
  readonly type = IS_OBJECT_ASSOCIATED_WITH_OTHER_DIAGRAM;
  constructor(public payload: { diagramId: string, objectType: string, objectId: string }) { }
}

export class ObjectAssociationWithOtherDiagramSuccess implements Action {
  readonly type = IS_OBJECT_ASSOCIATED_WITH_OTHER_DIAGRAM_SUCCESS;
  constructor(public payload: IObjectAssociationWithOtherDiagram) { }
}

export type DiagramRelationObjects =
  | Decision
  | InputData
  | KnowledgeSource;

export type DiagramActions =
  | LoadDiagram
  | LoadDiagramSuccess
  | AddDiagram
  | UpdateDiagram
  | DeleteDiagram
  | AddGraphableObjectToDiagram
  | UpdateDiagramGraphableObject
  | RemoveGraphableObjectsFromDiagram
  | LoadDiagramAsChild
  | UpdateSketchObject
  | UpdateGoJson
  | FinishedNetworkRequestForDiagram
  | DiagramFailure
  | RemoveDiagramFromLocalMemory
  | RemovePreviewDiagramFromLocalMemory
  | RemoveLink
  | ObjectAssociationWithOtherDiagram
  | ObjectAssociationWithOtherDiagramSuccess;
