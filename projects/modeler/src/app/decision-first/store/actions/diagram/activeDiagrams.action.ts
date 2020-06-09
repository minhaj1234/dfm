import { Action } from '@ngrx/store';
import { IActiveDiagram } from '../../../models/diagram.model';
import { DiagramLinkType, DiagramSidebarTabTypes, GoJsDiagramObject } from '../../../models/goJsDiagram.model';

export const ADD_ACTIVE_DIAGRAM = '[DMS] Add Active Diagram';
export const SET_LINK_TYPE_ACTIVE_DIAGRAM = '[DMS] Set Link Type for Active Diagram';
export const SET_SELECTED_DIAGRAM_OBJECTS_ACTIVE_DIAGRAM = '[DMS] Set Selected Diagram Objects For Active Diagram';
export const SET_SELECTED_SIDEBAR_TAB_TYPE = '[DMS] Set Selected Sidebar Tab Type';
export const SET_DIAGRAM_IMAGE_ACTIVE_DIAGRAM = '[DMS] Set Diagram Image Active Diagram';
export const REMOVE_ACTIVE_DIAGRAM = '[DMS] Remove Active Diagram';

export class AddActiveDiagram implements Action {
  readonly type = ADD_ACTIVE_DIAGRAM;
  constructor(public payload: IActiveDiagram) {}
}

export class SetLinkTypeActiveDiagram implements Action {
  readonly type = SET_LINK_TYPE_ACTIVE_DIAGRAM;
  constructor(public payload: { id: string; linkType: DiagramLinkType }) {}
}

export class SetSelectedDiagramObjectsActiveDiagram implements Action {
  readonly type = SET_SELECTED_DIAGRAM_OBJECTS_ACTIVE_DIAGRAM;
  constructor(public payload: { id: string; selectedDiagramObjects: GoJsDiagramObject[] }) {}
}

export class SetSelectedSidebarTabType implements Action {
  readonly type = SET_SELECTED_SIDEBAR_TAB_TYPE;
  constructor(public payload: {id: string; selectedSidebarTabType: DiagramSidebarTabTypes}) {}
}

export class SetDiagramImageActiveDiagram implements Action {
  readonly type = SET_DIAGRAM_IMAGE_ACTIVE_DIAGRAM;
  constructor(public payload: { id: string; diagramImage: SVGElement }) {}
}

export class RemoveActiveDiagram implements Action {
  readonly type = REMOVE_ACTIVE_DIAGRAM;
  constructor(public payload: string) {}
}

export type ActiveDiagramActions =
  | AddActiveDiagram
  | SetLinkTypeActiveDiagram
  | SetSelectedDiagramObjectsActiveDiagram
  | SetSelectedSidebarTabType
  | SetDiagramImageActiveDiagram
  | RemoveActiveDiagram;
