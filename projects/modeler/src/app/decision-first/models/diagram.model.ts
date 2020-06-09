import { ResourceWithId } from 'core/models';
import { ImplementationComponentIcon } from 'core/objects/implementation-component/models';
import { Decision } from './decision.model';
import { DiagramLinkType, DiagramSidebarTabTypes, GoJsDiagramObject, IGoJsDiagramNode } from './goJsDiagram.model';
import { Graphable } from './graphable.model';
import { InputData } from './inputData.model';
import { KnowledgeSource } from './knowledgeSource.model';
import { ObjectClassNames, ObjectRelationsNames } from './objects.model';
import { ObjectTagsUpdate, Tag } from './tag.model';

export class Diagram extends ResourceWithId {
  readonly className: string = ObjectClassNames.Diagram;
  id: string;
  name: string;
  description: string;
  goConnectors: string;
  goLocations: string | null;
  goNodes: string | null;
  tags: Tag[];
  decisions: Decision[];
  inputDatas: InputData[];
  knowledgeSources: KnowledgeSource[];
  _links: IDiagramLinks;
}

export interface IDiagramLinks {
  self: {
    href: string;
  };
  diagram: {
    href: string;
  };
  decisions: {
    href: string;
  };
  inputDatas: {
    href: string;
  };
  knowledgeSources: {
    href: string;
  };
};

export interface IActiveDiagram {
  id: string;
  linkType: DiagramLinkType;
  selectedDiagramObjects: GoJsDiagramObject[];
  selectedSidebarTabType: DiagramSidebarTabTypes;
  diagramImage: SVGElement;
}

export class IStateViewDiagram {
  diagram: Diagram;
  paletteList: IGoJsDiagramNode[];
  selectedDiagramObjects: GoJsDiagramObject[];
  isReadOnlySession: boolean;
  icons: ImplementationComponentIcon[];
}

export interface IDiagramUpdate {
  diagram: Partial<Diagram>;
  objectTagsUpdate?: ObjectTagsUpdate;
}

export interface IDeleteGraphableRequest {
  graphable: Graphable;
  relationPath: ObjectRelationsNames;
  isPermanentDelete: boolean;
}

export interface IObjectAssociatedWithOtherDiagram {
  isObjectAssociatedWithOtherDiagram: boolean;
}
