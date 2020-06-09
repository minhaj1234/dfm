import * as go from 'gojs';
import { Graphable } from './graphable.model';

export enum DiagramNodeType {
  'Decision',
  'InputData',
  'KnowledgeSource',
  'Annotation',
  'GroupItem',
}

export enum DiagramNodeShape {
  Decision = 'Rectangle',
  InputData = 'F M0 0 L100 0 B-90 180 100 50 40 50 L100 100 20 100 B90 180 0 50 40 50z',
  KnowledgeSource = 'Document',
  Annotation = 'F M1 0 L0 0 0 1 1 1 M2 1',
  GroupItem = "RoundedRectangle",
}

export enum DiagramNodeDefaultName {
  Decision = 'Decision',
  InputData = 'Input Data',
  KnowledgeSource = 'Knowledge Source',
  Annotation = 'Annotation',
  GroupItem = 'Group Item',
}

export enum DiagramLinkType {
  Information = 'Information',
  Authority = 'Authority',
  Annotation = 'Annotation',
}

export enum DiagramNodeCategory {
  Node = 'Node',
  GroupItem = 'GroupItem',
}

export interface IGoJsDiagramNode {
  data: Graphable;
  key: string;
  loc?: string;
  text: string;
  type: DiagramNodeType;
  isNew: boolean;
  hasMissingNodes: boolean;
  shape?: string;
  geometryString?: string;
  borderColor?: string;
  strokeDashArray?: number[];
  size?: go.Size,
}

interface IPoint {
  x: number;
  y: number;
}

export interface ILink {
  from: string;
  to: string;
  points?: Array<IPoint>;
}

export interface IGoJsLink extends ILink {
  category: string;
}

export interface IGoJsDiagramGraph {
  links: IGoJsLink[];
  nodes: IGoJsDiagramNode[];
  graphableNodesRecord: Record<string, Graphable>;
}

export interface IImplementationComponentContextMenuItem {
  name: string;
  url: string;
}

export interface GoLocation {
  loc: string;
};

export type GoLocations = Record<string, GoLocation>;

export type GoJsDiagramObject = IGoJsDiagramNode | IGoJsLink;

export interface GoNode {
  type: DiagramNodeType;
  text: string;
  size?: go.Size
};

export type GoNodes = Record<string, GoNode>;

export const DEFAULT_GROUP_ITEM_DIAGRAM_NODE = {
  data: null,
  shape: DiagramNodeShape.GroupItem,
  text: DiagramNodeDefaultName.GroupItem,
  type: DiagramNodeType.GroupItem,
  hasMissingNodes: false,
  borderColor: '#696969',
  strokeDashArray: [6, 4, 1, 4],
  size: new go.Size(200, 200),
  category: DiagramNodeCategory.GroupItem,
};

export const DEFAULT_ANNOTATION_DIAGRAM_NODE = {
  data: null,
  geometryString: DiagramNodeShape.Annotation,
  text: DiagramNodeDefaultName.Annotation,
  type: DiagramNodeType.Annotation,
  hasMissingNodes: false,
  category: DiagramNodeCategory.Node,
};

export const DEFAULT_DECISION_DIAGRAM_NODE = {
  shape: DiagramNodeShape.Decision,
  text: DiagramNodeDefaultName.Decision,
  type: DiagramNodeType.Decision,
  hasMissingNodes: false,
  category: DiagramNodeCategory.Node,
};

export const DEFAULT_INPUT_DATA_DIAGRAM_NODE = {
  geometryString: DiagramNodeShape.InputData,
  text: DiagramNodeDefaultName.InputData,
  type: DiagramNodeType.InputData,
  hasMissingNodes: false,
  category: DiagramNodeCategory.Node,
};

export const DEFAULT_KNOWLEDGE_SOURCE_DIAGRAM_NODE = {
  shape: DiagramNodeShape.KnowledgeSource,
  text: DiagramNodeDefaultName.KnowledgeSource,
  type: DiagramNodeType.KnowledgeSource,
  hasMissingNodes: false,
  category: DiagramNodeCategory.Node,
};

export enum DiagramSidebarTabTypes {
  Details = 'Details',
  Tools = 'Tools',
  NewObjects = 'NewObjects',
  Links = 'Links',
  Objects = 'Objects',
}