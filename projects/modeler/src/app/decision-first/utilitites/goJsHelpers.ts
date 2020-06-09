import * as go from 'gojs';
import { toPairs } from 'ramda';
import { Decision } from '../models/decision.model';
import { Diagram } from '../models/diagram.model';
import {
  DiagramLinkType,
  DiagramNodeType,
  DEFAULT_ANNOTATION_DIAGRAM_NODE,
  DEFAULT_DECISION_DIAGRAM_NODE,
  DEFAULT_GROUP_ITEM_DIAGRAM_NODE,
  DEFAULT_INPUT_DATA_DIAGRAM_NODE,
  DEFAULT_KNOWLEDGE_SOURCE_DIAGRAM_NODE,
  GoLocation,
  GoLocations,
  GoNode,
  GoNodes,
  IGoJsDiagramGraph,
  IGoJsDiagramNode,
  ILink,
} from '../models/goJsDiagram.model';
import { IGoJsLink } from '../models/goJsDiagram.model';
import { Graphable } from '../models/graphable.model';
import { InputData } from '../models/inputData.model';
import { KnowledgeSource } from '../models/knowledgeSource.model';
import { ObjectClassNames } from '../models/objects.model';

export function convertGraphableToDiagramNode(graphable: Graphable): IGoJsDiagramNode {
  if (isDecision(graphable)) {
    return convertDecisionToDiagramNode(graphable);
  } else if (isKnowledgeSource(graphable)) {
    return convertKnowledgeSourceToDiagramNode(graphable);
  } else if (isInputData(graphable)) {
    return convertInputDataToDiagramNode(graphable);
  }
}

export function convertSketchToDiagramNode(key: string, goNode: GoNode): IGoJsDiagramNode {
  if (goNode.type === DiagramNodeType.Annotation) {
    return convertSketchToAnnotation(key, goNode);
  } else if (goNode.type === DiagramNodeType.GroupItem) {
    return convertSketchToGroupItem(key, goNode);
  }
}

export function convertSketchToAnnotation(key: string, goNode: GoNode): IGoJsDiagramNode {
  return {
    ...DEFAULT_ANNOTATION_DIAGRAM_NODE,
    isNew: false,
    key: key,
    text: goNode.text,
  };
}

export function convertSketchToGroupItem(key: string, goNode: GoNode): IGoJsDiagramNode {
  return {
    ...DEFAULT_GROUP_ITEM_DIAGRAM_NODE,
    isNew: false,
    key: key,
    text: goNode.text,
    size: new go.Size(goNode.size.width, goNode.size.height),
  };
}

export function convertDecisionToDiagramNode(decision: Decision): IGoJsDiagramNode {
  return {
    ...DEFAULT_DECISION_DIAGRAM_NODE,
    data: decision,
    isNew: false,
    key: decision.id,
    text: decision.name,
  };
}

export function convertKnowledgeSourceToDiagramNode(knowledgeSource: KnowledgeSource): IGoJsDiagramNode {
  return {
    ...DEFAULT_KNOWLEDGE_SOURCE_DIAGRAM_NODE,
    data: knowledgeSource,
    isNew: false,
    key: knowledgeSource.id,
    text: knowledgeSource.name,
  };
}

export function convertInputDataToDiagramNode(inputData: InputData): IGoJsDiagramNode {
  return {
    ...DEFAULT_INPUT_DATA_DIAGRAM_NODE,
    data: inputData,
    isNew: false,
    key: inputData.id,
    text: inputData.name,
  };
}

export function checkIfFinishedEventsWithTransactions(event: go.ChangedEvent): boolean {
  // ignore unimportant Transaction events and make sure transactions exist
  return event.isTransactionFinished && event.object !== null;
}

export function isDecision(graphable: Graphable): graphable is Decision {
  return graphable.className === ObjectClassNames.Decision;
}

export function isKnowledgeSource(graphable: Graphable): graphable is KnowledgeSource {
  return graphable.className === ObjectClassNames.KnowledgeSource;
}

export function isInputData(graphable: Graphable): graphable is InputData {
  return graphable.className === ObjectClassNames.InputData;
}

export function convertLinksToRecord(links: ILink[]): Record<string, ILink> {
  return links.reduce((linkMap, link) => {
    linkMap[`${link.from}${link.to}`] = link;
    return linkMap;
  }, {});
}

export function isEventWeCareAbout(change) {
  return (
    change.modelChange === 'nodeDataArray' ||
    change.modelChange === 'linkDataArray' ||
    change.change === go.ChangedEvent.Property
  );
}

/**
 * Since GoJS gives us a stream of events on something like the user deleting a node.
 * This includes the removal of the node and the removal of all of the links.
 * Since removing a node should not remove the relationship from other diagrams,
 * we have to infer what the user was doing and only send that data to the server.
 * Certain events like adding and removing nodes should not show up in the transaction but
 * we needed a way to sort them anyway. You may need to experiment with this part.
 * @param changes
 */
export function getMostImportantEvents(changes: go.List<go.ChangedEvent>): go.List<go.ChangedEvent> {
  let importantEvent: go.ChangedEvent;
  let maybe: go.ChangedEvent;
  changes.each((event) => {
    if (!importantEvent) {
      importantEvent = event;
    } else {
      if (event.change === go.ChangedEvent.Property && event.propertyName === 'loc') {
        maybe = event;
      }
      importantEvent = compareEvents(importantEvent, event);
    }
  });

  const returner = new go.List<go.ChangedEvent>();
  returner.add(importantEvent);

  // Node added, we need to save the location too.
  if (maybe && importantEvent.modelChange === 'nodeDataArray' && importantEvent.change === go.ChangedEvent.Insert) {
    returner.add(maybe);
  }

  return returner;
}

export function convertDiagramToGoJsDiagram(diagram: Diagram): IGoJsDiagramGraph {
  if (diagram) {
    const goNodes: GoNodes = JSON.parse(diagram.goNodes || '{}');
    const goLocations: GoLocations = JSON.parse(diagram.goLocations || '{}');

    const graphableNodesRecord: Record<string, Graphable> = [
      ...diagram.decisions,
      ...diagram.inputDatas,
      ...diagram.knowledgeSources,
    ].reduce(reduceGraphablesToRecord, {});
    const nodes: IGoJsDiagramNode[] = [];

    toPairs(goNodes).forEach(([key, goNode]: [string, GoNode]) => {
      const node = convertNodeToGoJsDiagramNode(key, goNode, graphableNodesRecord, goLocations[key]);
      if (node) {
        nodes.push(node);
      }
    });

    const links: IGoJsLink[] = getDiagramGoJsLinks(diagram.goConnectors, nodes);

    return {
      nodes: nodes,
      links: links,
      graphableNodesRecord,
    };
  }
  return {
    nodes: [],
    links: [],
    graphableNodesRecord: {},
  };
}

export function convertNodeToGoJsDiagramNode(key: string, goNode: GoNode, graphableNodesRecord: Record<string, Graphable>, goLocation: GoLocation): IGoJsDiagramNode {
  const node = graphableNodesRecord[key] ?
    convertGraphableToDiagramNode(graphableNodesRecord[key]) :
    convertSketchToDiagramNode(key, goNode);

  if (node && goLocation) {
    node.loc = goLocation.loc;
  }
  return node;
}

function compareEvents(currentEvent: go.ChangedEvent, possiblyReplacement: go.ChangedEvent): go.ChangedEvent {
  const currentEventWeight = getEventWeight(currentEvent);
  const possibleReplacementWeight = getEventWeight(possiblyReplacement);
  return possibleReplacementWeight >= currentEventWeight ? possiblyReplacement : currentEvent;
}

function getEventWeight(event: go.ChangedEvent) {
  return getEventTypeWeight(event);
}

function getEventTypeWeight(event: go.ChangedEvent): number {
  if (event.modelChange === 'nodeDataArray') {
    return 200 + getChangeWeight(event);
  }
  if (event.modelChange === 'linkDataArray') {
    return 100 + getChangeWeight(event);
  }
  return 0 + getPropertyWeight(event);
}

function getChangeWeight(event: go.ChangedEvent): number {
  if (event.change === go.ChangedEvent.Insert) {
    return 50;
  }
  return 0;
}

function getPropertyWeight(event: go.ChangedEvent): number {
  if (event.propertyName === 'text') {
    return 70;
  } else if (event.propertyName === 'loc') {
    return 50;
  } else if (event.propertyName === 'size') {
    return 25;
  }
  return 0;
}

export function getDiagramGoJsLinks(goConnectors: any, nodes: IGoJsDiagramNode[]): IGoJsLink[] {
  const links: IGoJsLink[] = [];

  JSON.parse(goConnectors || '[]').forEach((value) => {
    const fromDiagramNode: IGoJsDiagramNode = nodes.find((x) => x.key === value.from);
    const toDiagramNode: IGoJsDiagramNode = nodes.find((x) => x.key === value.to);

    if (fromDiagramNode && toDiagramNode) {
      links.push({ ...getGoJsLink(value.from, value.to, fromDiagramNode.type, toDiagramNode.type), points: value.points || [] });
    }
  });

  return links;
}

export function getGoJsLink(
  fromId: string,
  toId: string,
  fromNodeType: DiagramNodeType,
  toNodeType: DiagramNodeType,
): IGoJsLink {
  return <IGoJsLink>{
    from: fromId,
    to: toId,
    category: getCategoryConnector(fromId, toId, fromNodeType, toNodeType),
  };
}

export function convertLinkDataArrayToString(linkDataArray: IGoJsLink[]): string {
  const goJsConnectors: ILink[] = [];

  linkDataArray.forEach((linkData: IGoJsLink) => {
    goJsConnectors.push({
      from: linkData.from,
      to: linkData.to,
      points: linkData.points
    });
  });

  return JSON.stringify(goJsConnectors);
}

export function getCategoryConnector(
  fromId: string,
  toId: string,
  fromNodeType: DiagramNodeType,
  toNodeType: DiagramNodeType,
): string {
  switch (fromNodeType) {
    case DiagramNodeType.Decision:
      return getFromDecisionCategoryConnector(toNodeType);
    case DiagramNodeType.InputData:
      return getFromInputDataCategoryConnector(toNodeType);
    case DiagramNodeType.KnowledgeSource:
      return getFromKnowledgeSourceCategoryConnector(toNodeType);
    case DiagramNodeType.Annotation:
      return DiagramLinkType.Annotation
  }
}

function getFromDecisionCategoryConnector(toDiagramNodeType: DiagramNodeType) {
  switch (toDiagramNodeType) {
    case DiagramNodeType.Decision:
      return DiagramLinkType.Information;
    case DiagramNodeType.KnowledgeSource:
      return DiagramLinkType.Authority;
    default:
      return '';
  }
}

function getFromInputDataCategoryConnector(toDiagramNodeType: DiagramNodeType) {
  switch (toDiagramNodeType) {
    case DiagramNodeType.Decision:
      return DiagramLinkType.Information;
    case DiagramNodeType.KnowledgeSource:
      return DiagramLinkType.Authority;
    default:
      return '';
  }
}

function getFromKnowledgeSourceCategoryConnector(toDiagramNodeType: DiagramNodeType) {
  switch (toDiagramNodeType) {
    case DiagramNodeType.Decision:
      return DiagramLinkType.Authority;
    case DiagramNodeType.KnowledgeSource:
      return DiagramLinkType.Authority;
    default:
      return '';
  }
}

function reduceGraphablesToRecord(
  previous: Record<string, Graphable>,
  graphable: Graphable,
): Record<string, Graphable> {
  previous[graphable.id] = graphable;
  return previous;
}

export function getInformationLinkTemplate(): go.Link {
  return go.GraphObject.make(
    go.Link,
    new go.Binding("points").makeTwoWay(),
    { reshapable: true, resegmentable: true, adjusting: go.Link.End },
    go.GraphObject.make(go.Shape),
    go.GraphObject.make(go.Shape, { toArrow: 'Triangle' }),
    { fromEndSegmentLength: 0, toEndSegmentLength: 0, segmentOrientation: go.Link.OrientAlong }
  );
}

export function getAuthorityLinkTemplate(): go.Link {
  return go.GraphObject.make(
    go.Link,
    new go.Binding("points").makeTwoWay(),
    { reshapable: true, resegmentable: true, adjusting: go.Link.End },
    go.GraphObject.make(go.Shape, { strokeDashArray: [5] }),
    go.GraphObject.make(go.Shape, { toArrow: 'Circle' }),
    { fromEndSegmentLength: 0, toEndSegmentLength: 0, segmentOrientation: go.Link.OrientAlong }
  );
}

export function getAnnotationLinkTemplate(): go.Link {
  return go.GraphObject.make(
    go.Link,
    new go.Binding("points").makeTwoWay(),
    { reshapable: true, resegmentable: true, adjusting: go.Link.End },
    go.GraphObject.make(go.Shape, { strokeDashArray: [2, 4] }),
    go.GraphObject.make(go.Shape, { toArrow: '' }),
    // { fromSpot: go.Spot.Left, toSpot: go.Spot.Default }
    { fromSpot: go.Spot.LeftSide, toSpot: go.Spot.Default, fromEndSegmentLength: 0, toEndSegmentLength: 0 },
  );
}

export function hasGraphableMissingLinks(diagramLinks: IGoJsLink[], graphable: Graphable): boolean {
  let result = false;
  const graphableRelations = [...getToNodeRelations(graphable), ...getFromNodeRelations(graphable)];

  result = graphableRelations
    .some((relation) => !hasLinkOnDiagram(diagramLinks, graphable, relation));

  return result;
}

function hasLinkOnDiagram(diagramLinks: IGoJsLink[], graphable: Graphable, relation: Graphable): boolean {
  return diagramLinks.some((link) => link.to === graphable.id && link.from === relation.id)
    || diagramLinks.some((link) => link.to === relation.id && link.from === graphable.id);
}

export function getFromNodeRelations(graphable: Graphable): Graphable[] {
  let fromNodeRelations: Graphable[] = [];

  if (isDecision(graphable)) {
    fromNodeRelations = [
      ...(graphable.requiresDecisions || []),
      ...(graphable.requiresInputData || []),
      ...(graphable.requiresKnowledgeSources || []),
    ];
  } else if (isKnowledgeSource(graphable)) {
    fromNodeRelations = [
      ...(graphable.requiresDecisions || []),
      ...(graphable.requiresInputData || []),
      ...(graphable.requiresKnowledgeSources || []),
    ];
  }

  return fromNodeRelations;
}

export function getToNodeRelations(graphable: Graphable): Graphable[] {
  let toNodeRelations: Graphable[] = [];

  if (isDecision(graphable)) {
    toNodeRelations = [
      ...(graphable.requiredByDecisions || []),
      ...(graphable.requiredByKnowledgeSources || [])
    ];
  } else if (isInputData(graphable)) {
    toNodeRelations = [
      ...(graphable.requiredByDecisions || []),
      ...(graphable.requiredByKnowledgeSources || [])
    ];
  } else if (isKnowledgeSource(graphable)) {
    toNodeRelations = [
      ...(graphable.requiredByDecisions || []),
      ...(graphable.requiredByKnowledgeSources || [])
    ];
  }

  return toNodeRelations;
}

export function getAllNodeRelations(graphable: Graphable): Graphable[] {
  return [...getFromNodeRelations(graphable), ...getToNodeRelations(graphable)];
}

export function getGoJsLinksForMissingRelations(goJsDiagram: go.Diagram, graphable: Graphable): IGoJsLink[] {
  const linkDataArray = getDiagramLinkDataArray(goJsDiagram);
  const missingGoJsLinks: IGoJsLink[] = []
    .concat(...goJsDiagram.model.nodeDataArray
      .filter((node: IGoJsDiagramNode) => isGraphable(node))
      .filter((node: IGoJsDiagramNode) => node.data.id !== graphable.id)
      .map((node: IGoJsDiagramNode) => node.data)
      .map((diagramGraphableNode) => getMissingGoJsLinksForNode(linkDataArray, diagramGraphableNode, graphable))
      .filter((missingLinks) => missingLinks.length)
    );

  return missingGoJsLinks;
}

function getMissingGoJsLinksForNode(linkDataArray: IGoJsLink[], diagramGraphableNode: Graphable, graphable: Graphable): IGoJsLink[] {
  let missingGoJsLinks: IGoJsLink[] = [];

  const fromNodeLinks = getFromNodeRelations(diagramGraphableNode)
    .filter((relation) => relation.id === graphable.id)
    .map(() => ({ from: graphable.id, to: diagramGraphableNode.id, fromNodeType: graphable.className, toNodeType: diagramGraphableNode.className }))

  const toNodeLinks = getToNodeRelations(diagramGraphableNode)
    .filter((relation) => relation.id === graphable.id)
    .map(() => ({ to: graphable.id, from: diagramGraphableNode.id, toNodeType: graphable.className, fromNodeType: diagramGraphableNode.className }))

  missingGoJsLinks = [...fromNodeLinks, ...toNodeLinks]
    .filter((link) => !linkDataArray.some((diagramLink) => diagramLink.to === link.to && diagramLink.from === link.from))
    .map((payload: { to: string, from: string, fromNodeType: string, toNodeType: string }) =>
      getGoJsLink(
        payload.from,
        payload.to,
        DiagramNodeType[payload.fromNodeType],
        DiagramNodeType[payload.toNodeType],
      ));

  return missingGoJsLinks;
}

export function getDiagramLinkDataArray(goJsDiagram: go.Diagram): IGoJsLink[] {
  const linkDataArray = (goJsDiagram.model as go.GraphLinksModel).linkDataArray.map((linkData: any) => {
    linkData.points = Array.isArray(linkData.points || []) ? linkData.points : linkData.points.toArray();
    return linkData;
  });
  return linkDataArray as IGoJsLink[];
}

export function getExtraLinks(graphables: Graphable[], linkDataArray: IGoJsLink[]) {
  const requirmentLinks: IGoJsLink[] = [].concat(...graphables.map(getFromNodeRequirementLinks));

  return linkDataArray.filter(
    (link) =>
      !requirmentLinks.some((requiredLink) => link.from === requiredLink.from && link.to === requiredLink.to)
      && link.category !== DiagramLinkType.Annotation
  );
}

function getFromNodeRequirementLinks(diagramGraphableNode: Graphable): IGoJsLink[] {
  const fromNodeLinks = getFromNodeRelations(diagramGraphableNode)
    .map((graphable) => (getGoJsLink(graphable.id, diagramGraphableNode.id, DiagramNodeType[graphable.className], DiagramNodeType[diagramGraphableNode.className])))

  return fromNodeLinks;
}

export function isGraphable(node: IGoJsDiagramNode): boolean {
  return !!node && !!node.data &&
    (node.type === DiagramNodeType.Decision ||
      node.type === DiagramNodeType.InputData ||
      node.type === DiagramNodeType.KnowledgeSource);
}

export function isSketch(node: IGoJsDiagramNode): boolean {
  return !!node && (node.type === DiagramNodeType.Annotation ||
    node.type === DiagramNodeType.GroupItem);
}

export function getNewGraphableObject(type: DiagramNodeType): Graphable {
  switch (type) {
    case DiagramNodeType.Decision:
      return new Decision();
    case DiagramNodeType.InputData:
      return new InputData();
    case DiagramNodeType.KnowledgeSource:
      return new KnowledgeSource();
  }
}

export function getPositiveCoordinates(point: go.Point): go.Point {
  const x = Math.max(point.x, 0);
  const y = Math.max(point.y, 0);

  return new go.Point(x, y);
}
