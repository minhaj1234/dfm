import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { ImplementationComponentIcon } from 'core/objects/implementation-component/models';
import { getSvgBase64String } from 'core/utilities';
import * as go from 'gojs';
import { Diagram } from '../../../models/diagram.model';
import {
  DiagramLinkType,
  DiagramNodeCategory,
  DiagramNodeType,
  IGoJsDiagramGraph,
  IGoJsDiagramNode,
  IGoJsLink,
} from '../../../models/goJsDiagram.model';
import { Graphable } from '../../../models/graphable.model';
import {
  convertDiagramToGoJsDiagram,
  getAnnotationLinkTemplate,
  getAuthorityLinkTemplate,
  getDiagramLinkDataArray,
  getInformationLinkTemplate,
  getPositiveCoordinates,
  hasGraphableMissingLinks,
  isDecision,
  isGraphable,

} from '../../../utilitites/goJsHelpers';
import { isValidDiagramNodeText } from '../../../validators/diagram-node/diagram-node.validator';
import { createCustomTextEditor } from '../go-js-text-editor/go-js-text-editor';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-common-go-js-display-diagram',
  template: '',
})
export class CommonGoJsDisplayDiagramComponent {
  protected _diagram: Diagram;
  // private _customTextEditor: go.HTMLInfo;
  goJsdiagram = new go.Diagram();
  outsideUpdate = false;
  private _icons: ImplementationComponentIcon[];
  @Input() set icons(value: ImplementationComponentIcon[]) {
    this._icons = value;
    this.goJsdiagram.rebuildParts();
  };
  get icons(): ImplementationComponentIcon[] {
    return this._icons;
  };

  onCreateContextMenu = () => { };
  onDoubleClickShape = (event, object) => { };
  onDoubleClickTextBlock = (event, object) => { };
  onDoubleClickIconImplementationComponent = (event, object) => { };

  constructor() { }

  overrideDelHandler(implementation: () => void) {
    this.goJsdiagram.commandHandler.deleteSelection = implementation;
  }

  updateDiagram(diagram: Diagram) {
    const goJsDiagramGraph = convertDiagramToGoJsDiagram(diagram);
    this.updateDiagramModel(goJsDiagramGraph);
  }

  updateDiagramModel(goJsDiagramGraph: IGoJsDiagramGraph): void {
    this.outsideUpdate = true;
    this.goJsdiagram.startTransaction('async data');

    this.addNewNodesDiagramModel(goJsDiagramGraph.nodes);
    this.removeOldNodesDiagramModel(goJsDiagramGraph.nodes);
    this.editNodeDiagramModel(goJsDiagramGraph.nodes);
    this.addNewLinksDiagramModel(goJsDiagramGraph.links);
    this.removeOldLinksDiagramModel(goJsDiagramGraph.links);

    this.goJsdiagram.commitTransaction('async data');
    this.outsideUpdate = false;

    this.goJsdiagram.requestUpdate();
  }

  fillGoJsDiagramTemplates() {
    this.fillGoJsDiagramNodeTemplate();
    this.fillGoJsDiagramLinkTemplateMap();
  }

  checkMissingRelations(): void {
    this.goJsdiagram.model.nodeDataArray
      .filter((diagramNode: IGoJsDiagramNode) => isGraphable(diagramNode))
      .forEach((diagramNode: IGoJsDiagramNode) => {
        diagramNode.hasMissingNodes = hasGraphableMissingLinks(
          getDiagramLinkDataArray(this.goJsdiagram),
          diagramNode.data,
        );
      });

    this.goJsdiagram.updateAllTargetBindings();
  }

  addNewNodesDiagramModel(newNodeDataArray: IGoJsDiagramNode[]): void {
    const nodesToAdd = newNodeDataArray.filter(
      (nodeNewModel: IGoJsDiagramNode) =>
        !this.goJsdiagram.model.nodeDataArray.find(
          (nodeOldModel: IGoJsDiagramNode) => nodeOldModel.key === nodeNewModel.key,
        ),
    );

    this.goJsdiagram.model.addNodeDataCollection(nodesToAdd);
  }

  removeOldNodesDiagramModel(newNodeDataArray: IGoJsDiagramNode[]): void {
    const nodesToRemove = this.goJsdiagram.model.nodeDataArray.filter(
      (nodeOldModel: IGoJsDiagramNode) =>
        !newNodeDataArray.find((nodeNewModel: IGoJsDiagramNode) => nodeNewModel.key === nodeOldModel.key),
    );

    this.goJsdiagram.model.removeNodeDataCollection(nodesToRemove);
  }

  editNodeDiagramModel(newNodeDataArray: IGoJsDiagramNode[]): void {
    this.goJsdiagram.model.nodeDataArray.forEach((nodeOldModel: IGoJsDiagramNode) => {
      const newNodeForUpdate = newNodeDataArray.find(
        (nodeNewModel: IGoJsDiagramNode) => nodeNewModel.key === nodeOldModel.key,
      );
      this.updateNodeProperties(nodeOldModel, newNodeForUpdate);
    });
  }

  updateNodeProperties(nodeOldModel: IGoJsDiagramNode, newNodeForUpdate: IGoJsDiagramNode): void {
    this.goJsdiagram.model.setDataProperty(nodeOldModel, 'text', newNodeForUpdate.text);
    this.goJsdiagram.model.setDataProperty(nodeOldModel, 'isNew', newNodeForUpdate.isNew);
    this.goJsdiagram.model.setDataProperty(nodeOldModel, 'loc', newNodeForUpdate.loc);
    this.goJsdiagram.model.setDataProperty(nodeOldModel, 'size', newNodeForUpdate.size);
    this.goJsdiagram.model.setDataProperty(nodeOldModel, 'data', newNodeForUpdate.data);
  }

  addNewLinksDiagramModel(newLinkDataArray: IGoJsLink[]): void {
    const linksToAdd: IGoJsLink[] = newLinkDataArray.filter(
      (linkNewModel: IGoJsLink) =>
        !getDiagramLinkDataArray(this.goJsdiagram).find(
          (linkOldModel) => linkOldModel.from === linkNewModel.from && linkOldModel.to === linkNewModel.to,
        ),
    );

    (this.goJsdiagram.model as go.GraphLinksModel).addLinkDataCollection(linksToAdd);
  }

  removeOldLinksDiagramModel(newLinkDataArray: IGoJsLink[]): void {
    const linksToRemove = getDiagramLinkDataArray(this.goJsdiagram).filter(
      (linkOldModel) =>
        !newLinkDataArray.find(
          (linkNewModel: IGoJsLink) => linkNewModel.from === linkOldModel.from && linkNewModel.to === linkOldModel.to,
        ),
    );

    this.removeLinkDataCollection(linksToRemove);
  }

  removeLinkDataCollection(linksToRemove: IGoJsLink[]): void {
    (this.goJsdiagram.model as go.GraphLinksModel).removeLinkDataCollection(linksToRemove);
  }

  createGoJsDiagramCustomTools() {
    // this._customTextEditor = createCustomTextEditor();
  }

  fillGoJsDiagramLinkingTool(linkType: DiagramLinkType): void {
    if (linkType) {
      this.goJsdiagram.allowLink = true;
      this.goJsdiagram.toolManager.linkingTool.archetypeLinkData = this.getLinkingToolArchetypeLinkData(linkType);
      this.goJsdiagram.toolManager.linkingTool.temporaryLink = this.getLinkingToolTemporaryLink(linkType);
    } else {
      this.goJsdiagram.allowLink = false;
    }
  }

  getLinkingToolArchetypeLinkData(linkType: DiagramLinkType): any {
    return {
      category: linkType,
    };
  }

  getLinkingToolTemporaryLink(linkType: DiagramLinkType): go.Link {
    switch (linkType) {
      case DiagramLinkType.Information:
        return getInformationLinkTemplate();
      case DiagramLinkType.Authority:
        return getAuthorityLinkTemplate();
      case DiagramLinkType.Annotation:
        return getAnnotationLinkTemplate();
    }
  }

  fillGoJsDiagramNodeTemplate(): void {
    this.goJsdiagram.nodeTemplateMap = this.getNodeTemplateMap();
  }

  getNodeTemplateMap() {
    const templateMap = new go.Map<string, go.Part>();
    templateMap.add(DiagramNodeCategory.Node, this.getNodeTemplate());
    templateMap.add(DiagramNodeCategory.GroupItem, this.getGroupItemTemplate());
    return templateMap;
  }

  getNodeTemplate(): any {
    return go.GraphObject.make(
      go.Node,
      'Auto',
      {
        dragComputation: (part: go.Part, point: go.Point) => getPositiveCoordinates(point),
        minSize: new go.Size(100, 50),
        contextMenu: this.onCreateContextMenu(),
        resizeObjectName: 'NodePanel',
        zOrder: 2,
      },
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
      this.getShapeNodeTemplate(),
      this.getPanelNodeTemplate(),
      this.getDotsTextBlockNodeTemplate(),
      this.getIconImplementationComponentNodeTemplate(),
    );
  }

  getShapeNodeTemplate(): any {
    return go.GraphObject.make(
      go.Shape,
      {
        cursor: 'pointer',
        fill: 'white',
        fromLinkable: true,
        toLinkable: true,
        portId: '',
        stroke: '#000000',
        strokeWidth: 1,
        doubleClick: (event, object) => this.onDoubleClickShape(event, object),
      },
      new go.Binding('figure', 'shape'),
      new go.Binding('geometryString', 'geometryString'),
      new go.Binding('toSpot', 'type', (value: DiagramNodeType) => this.getNodeToSpot(value)),
    );
  }

  getPanelNodeTemplate(): any {
    return go.GraphObject.make(
      go.Panel,
      'Table',
      {
        background: 'transparent',
        margin: 6,
        doubleClick: (event, object) => this.onDoubleClickTextBlock(event, object),
      },
      this.getNameTextBlockNodeTemplate(),
    );
  }

  getDotsTextBlockNodeTemplate(): void {
    return go.GraphObject.make(
      go.TextBlock,
      {
        text: '...',
        font: 'bold 12pt sans-serif',
        alignment: go.Spot.TopCenter,
        margin: new go.Margin(-6, 0, 0, 0),
      },
      new go.Binding('visible', 'hasMissingNodes'),
    );
  }

  getIconImplementationComponentNodeTemplate(): any {
    return go.GraphObject.make(
      go.Picture,
      {
        width: 14,
        height: 14,
        alignment: go.Spot.TopLeft,
        imageStretch: go.GraphObject.UniformToFill,
        margin: 1,
        doubleClick: (event, object) => this.onDoubleClickIconImplementationComponent(event, object),
      },
      new go.Binding('source', 'data', (value) => this.getIconImplementationComponent(value)),
      {
        toolTip: this.getToolTipIconImplementationComponentNodeTemplate(),
      },
    );
  }

  getToolTipIconImplementationComponentNodeTemplate(): any {
    return go.GraphObject.make(
      go.Adornment,
      'Spot',
      { background: 'transparent' },
      go.GraphObject.make(go.Placeholder, {
        padding: 15,
      }),
      go.GraphObject.make(
        go.TextBlock,
        {
          alignment: go.Spot.TopRight,
        },
        new go.Binding('text', 'data', (graphable) => this.getNameImplementationComponent(graphable)),
      ),
    );
  }

  getNameTextBlockNodeTemplate(): any {
    return go.GraphObject.make(
      go.TextBlock,
      {
        // editable: true,
        column: 0,
        minSize: new go.Size(50, NaN),
        maxSize: new go.Size(100, NaN),
        font: '12px sans-serif',
        textAlign: "center",
        margin: new go.Margin(2, 15, 0, 12),
        doubleClick: (event, object) => this.onDoubleClickTextBlock(event, object),
        // textValidation: (block, oldString, newString) => isValidDiagramNodeText(newString),
        // textEditor: this._customTextEditor,
      },
      new go.Binding('text').makeTwoWay(),
    );
  }

  getGroupItemTemplate() {
    return go.GraphObject.make(
      go.Node,
      'Vertical',
      {
        contextMenu: this.onCreateContextMenu(),
        resizable: true,
        resizeObjectName: 'GroupItemPanel',
        zOrder: 1,
      },
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
      this.getNameTextBlockGroupItemTemplate(),
      this.getPanelGroupItemTemplate(),
    );
  }

  getPanelGroupItemTemplate(): any {
    return go.GraphObject.make(
      go.Panel,
      'Auto',
      {
        background: 'transparent',
        minSize: new go.Size(100, 50),
        name: 'GroupItemPanel',
      },
      this.getShapeGroupItemTemplate(),
      new go.Binding('desiredSize', 'size').makeTwoWay(),
    );
  }

  getShapeGroupItemTemplate(): any {
    return go.GraphObject.make(
      go.Shape,
      {
        cursor: 'pointer',
        fill: 'transparent',
        fromLinkable: false,
        toLinkable: true,
        portId: '',
        strokeWidth: 1,
      },
      new go.Binding('figure', 'shape'),
      new go.Binding('toSpot', 'type', (value: DiagramNodeType) => this.getNodeToSpot(value)),
      new go.Binding('stroke', 'borderColor'),
      new go.Binding('strokeDashArray', 'strokeDashArray'),
    );
  }

  getNameTextBlockGroupItemTemplate() {
    return go.GraphObject.make(
      go.TextBlock,
      {
        editable: true,
        font: '12px sans-serif',
        textAlign: "right",
        margin: new go.Margin(2, 2, 2, 4),
      },
      new go.Binding('text').makeTwoWay(),
      new go.Binding('width', 'size', (value: go.Size) => value.width),
    );
  }

  getIconImplementationComponent(graphable: Graphable): string {
    if (isDecision(graphable) && graphable.implementationComponents && graphable.implementationComponents.length > 0) {
      const implementationComponentIcon = this.icons.find((icon) => icon.id === graphable.implementationComponents[0].iconId);
      return implementationComponentIcon ? getSvgBase64String(implementationComponentIcon.base64) : '';
    } else {
      return '';
    }
  }

  getNameImplementationComponent(graphable: Graphable): string {
    if (isDecision(graphable) && graphable.implementationComponents && graphable.implementationComponents.length > 0) {
      return graphable.implementationComponents[0].name;
    }
  }

  getNodeToSpot(type: DiagramNodeType): go.Spot {
    switch (type) {
      case DiagramNodeType.Annotation:
        return go.Spot.Left;
      case DiagramNodeType.GroupItem:
        return go.Spot.AllSides;
      default:
        return go.Spot.Default;
    }
  }

  fillGoJsDiagramLinkTemplateMap(): void {
    this.goJsdiagram.linkTemplateMap.add(DiagramLinkType.Information, getInformationLinkTemplate());
    this.goJsdiagram.linkTemplateMap.add(DiagramLinkType.Authority, getAuthorityLinkTemplate());
    this.goJsdiagram.linkTemplateMap.add(DiagramLinkType.Annotation, getAnnotationLinkTemplate());
  }
}
