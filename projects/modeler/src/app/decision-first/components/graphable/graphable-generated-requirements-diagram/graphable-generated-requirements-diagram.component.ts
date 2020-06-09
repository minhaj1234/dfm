import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ResizeEvent } from 'angular-resizable-element';
import { ObjectTabType } from 'core/models';
import * as go from 'gojs';
import { Guid } from 'guid-typescript';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { DiagramLinkType, IGoJsDiagramNode, IGoJsLink } from '../../../models/goJsDiagram.model';
import { Graphable } from '../../../models/graphable.model';
import * as fromStore from '../../../store';
import {
  convertGraphableToDiagramNode,
  getAuthorityLinkTemplate,
  getFromNodeRelations,
  getGoJsLink,
  getInformationLinkTemplate,
  getToNodeRelations,
} from '../../../utilitites/goJsHelpers';
import {
  HEIGHT_NODE,
  HEIGHT_WITH_BOTTOM_INDENT_NODE,
  INDENT_LEFT_FROM_NODE,
  INDENT_LEFT_MAIN_NODE,
  INDENT_LEFT_TO_NODE,
  WIDTH_NODE,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  DIAGRAM_CONTAINER_HEIGHT_EXPANDED,
  DIAGRAM_CONTAINER_HEIGHT_COLLAPSE,
} from './graphable-genetated-requirements-diagram.const';

@Component({
  selector: 'dfm-graphable-generated-requirements-diagram',
  templateUrl: './graphable-generated-requirements-diagram.component.html',
  styleUrls: ['./graphable-generated-requirements-diagram.component.scss'],
})
export class GraphableGeneratedRequirementsDiagramComponent implements OnInit, OnDestroy {
  private _graphable: Graphable;
  public requirementsDiagram = new go.Diagram();
  public diagramContainerStyle: object = {};
  @Input() caption: string;
  @Input() expanded: boolean;
  public isExpanded = false;
  private heightBeforeExpand: number;
  @Output() expand = new EventEmitter();
  @Input()
  set graphable(value: Graphable) {
    this._graphable = value;
    this.fillDiagramModel();
  }
  get graphable() {
    return this._graphable;
  }

  @ViewChild('diagramDiv', { static: true }) private diagramRef: ElementRef;

  private mainNode: IGoJsDiagramNode;
  private fromRequirementsNodes: IGoJsDiagramNode[] = [];
  private toRequirementsNodes: IGoJsDiagramNode[] = [];
  private requirementsLinks: IGoJsLink[] = [];

  constructor(private store: Store<fromStore.IDecisionFirstState>) {
    this.fillDiagram();
  }

  ngOnInit() {
    this.requirementsDiagram.div = this.diagramRef.nativeElement;
    this.subscribeActiveTab();
    this.updateCanvasDimensions();
    this.isDependencyNetworkExpanded(this.expanded)
  }

  isDependencyNetworkExpanded(expanded) {
    this.isExpanded = expanded
    if (this.isExpanded === true) {
      this.diagramContainerStyle = {
        height: `${DIAGRAM_CONTAINER_HEIGHT_EXPANDED}px`,
      }
    }
  }

  fillDiagram(): void {
    this.fillDiagramProperty();
    this.fillDiagramNodeTemplate();
    this.fillDiagramLinkTemplateMap();
    this.setDiagramListeners();
  }

  fillDiagramProperty(): void {
    this.requirementsDiagram.isReadOnly = true;
    this.requirementsDiagram.initialDocumentSpot = go.Spot.Center;
    this.requirementsDiagram.initialViewportSpot = go.Spot.Center;
    this.requirementsDiagram.toolManager.panningTool.isEnabled = false;
    this.requirementsDiagram.toolManager.dragSelectingTool.isEnabled = false;
    this.requirementsDiagram.toolManager.mouseWheelBehavior = go.ToolManager.WheelNone;
  }

  fillDiagramNodeTemplate(): void {
    this.requirementsDiagram.nodeTemplate = go.GraphObject.make(
      go.Node,
      'Auto',
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
      go.GraphObject.make(
        go.Panel,
        'Auto',
        {
          desiredSize: new go.Size(WIDTH_NODE, HEIGHT_NODE),
          minSize: new go.Size(WIDTH_NODE, HEIGHT_NODE),
        },
        go.GraphObject.make(
          go.Shape,
          {
            cursor: 'pointer',
            fill: 'white',
            fromLinkable: true,
            stroke: '#000000',
            strokeWidth: 1,
            toLinkable: true,
          },
          new go.Binding('figure', 'shape'),
          new go.Binding('geometryString', 'geometryString'),
        ),
        go.GraphObject.make(go.TextBlock, new go.Binding('text').makeTwoWay()),
      ),
    );
  }

  fillDiagramLinkTemplateMap(): void {
    this.requirementsDiagram.linkTemplateMap.add(DiagramLinkType.Information, getInformationLinkTemplate());
    this.requirementsDiagram.linkTemplateMap.add(DiagramLinkType.Authority, getAuthorityLinkTemplate());
  }

  setDiagramListeners(): void {
    this.requirementsDiagram.addDiagramListener('ObjectDoubleClicked', (e) => this.listenObjectDoubleClickedEvent(e));
  }

  subscribeActiveTab(): void {
    this.store
      .pipe(
        untilDestroyed(this),
        select(fromStore.getCurrentTabId),
      )
      .subscribe((tabId) => {
        if (this.graphable && this.graphable.id === tabId) {
          this.alignCenterDiagram();
        }
      });
  }

  fillDiagramModel(): void {
    if (this.graphable) {
      this.clearDataModelDiagram();
      this.fillRequirementsData();
      this.setDiagramModelCollections();
      this.alignCenterDiagram(false);
    }
  }

  clearDataModelDiagram(): void {
    this.requirementsDiagram.clear();
    this.fromRequirementsNodes = [];
    this.toRequirementsNodes = [];
    this.requirementsLinks = [];
  }

  fillRequirementsData(): void {
    this.fillFromRequirementsNodes();
    this.fillToRequirementsNodes();
    this.fillMainNode();
    this.fillRequirementsLinks();
  }

  fillFromRequirementsNodes(): void {
    this.addFromRequirementsNodes(getFromNodeRelations(this.graphable));
  }

  addFromRequirementsNodes(requirementsNodes: Graphable[]): void {
    requirementsNodes.forEach((graphable) => {
      const diagramNode = convertGraphableToDiagramNode(graphable);
      diagramNode.key = Guid.create().toString();
      diagramNode.loc = `${INDENT_LEFT_FROM_NODE} ${this.fromRequirementsNodes.length *
        HEIGHT_WITH_BOTTOM_INDENT_NODE}`;
      this.fromRequirementsNodes.push(diagramNode);
    });
  }

  fillToRequirementsNodes(): void {
    this.addToRequirementsNodes(getToNodeRelations(this.graphable));
  }

  addToRequirementsNodes(requirementsNodes: Graphable[]): void {
    requirementsNodes.forEach((graphable) => {
      const diagramNode = convertGraphableToDiagramNode(graphable);
      diagramNode.key = Guid.create().toString();
      diagramNode.loc = `${INDENT_LEFT_TO_NODE} ${this.toRequirementsNodes.length * HEIGHT_WITH_BOTTOM_INDENT_NODE}`;
      this.toRequirementsNodes.push(diagramNode);
    });
  }

  fillMainNode(): void {
    const yPosition = this.getYPositionMainNode(this.fromRequirementsNodes.length, this.toRequirementsNodes.length);
    const node = convertGraphableToDiagramNode(this.graphable);
    node.loc = `${INDENT_LEFT_MAIN_NODE} ${yPosition}`;
    this.mainNode = node;
  }

  getYPositionMainNode(fromRequirementsNodesLength, toRequirementsNodesLength): number {
    const maxNodesInColumn = Math.max(fromRequirementsNodesLength, toRequirementsNodesLength);
    return maxNodesInColumn > 1 ? ((maxNodesInColumn - 1) * HEIGHT_WITH_BOTTOM_INDENT_NODE) / 2 : 0;
  }

  fillRequirementsLinks(): void {
    this.fromRequirementsNodes.forEach((fromNode: IGoJsDiagramNode) => {
      this.requirementsLinks.push(getGoJsLink(fromNode.key, this.mainNode.key, fromNode.type, this.mainNode.type));
    });

    this.toRequirementsNodes.forEach((toNode: IGoJsDiagramNode) => {
      this.requirementsLinks.push(getGoJsLink(this.mainNode.key, toNode.key, this.mainNode.type, toNode.type));
    });
  }

  setDiagramModelCollections(): void {
    this.requirementsDiagram.model.addNodeData(this.mainNode);
    this.requirementsDiagram.model.addNodeDataCollection(this.fromRequirementsNodes);
    this.requirementsDiagram.model.addNodeDataCollection(this.toRequirementsNodes);
    (this.requirementsDiagram.model as go.GraphLinksModel).addLinkDataCollection(this.requirementsLinks);
  }

  alignCenterDiagram(isUseTimeout: boolean = true): void {
    this.requirementsDiagram.requestUpdate();

    if (isUseTimeout) {
      setTimeout(() => this.requirementsDiagram.alignDocument(go.Spot.Center, go.Spot.Center));
    } else {
      this.requirementsDiagram.alignDocument(go.Spot.Center, go.Spot.Center);
    }
  }

  listenObjectDoubleClickedEvent(event: go.DiagramEvent): void {
    if (event.subject.panel.panel) {
      const nodeData = event.subject.panel.panel.data.data;
      if (nodeData) {
        this.openTab(nodeData.id, nodeData.className);
      }
    }
  }

  openTab(id: string, type: string): void {
    this.store.dispatch(
      new fromStore.AddTab({
        id: id,
        type: ObjectTabType[type],
      }),
    );
  }

  diagramZoomIn(): void {
    this.requirementsDiagram.commandHandler.increaseZoom();
  }

  diagramZoomOut(): void {
    this.requirementsDiagram.commandHandler.decreaseZoom();
  }

  onResizingDiagramContainer(event: ResizeEvent): void {
    this.updateDiagramContainerStyle(event);
    this.alignCenterDiagram(false);
  }

  updateDiagramContainerStyle(event: ResizeEvent): void {
    this.diagramContainerStyle = {
      height: `${event.rectangle.height}px`,
    };
  }

  onExpand() {
    this.expand.next();
    this.diagramContainerStyle = {
      height: `${DIAGRAM_CONTAINER_HEIGHT_EXPANDED}px`,
    }
    this.isExpanded = !this.isExpanded;
    this.updateCanvasDimensions()
    this.alignCenterDiagram(true)
  }

  onCollapse() {
    this.expand.next();
    this.diagramContainerStyle = {
      height: `${DIAGRAM_CONTAINER_HEIGHT_COLLAPSE}px`,
    }
    this.isExpanded = !this.isExpanded;
    this.updateCanvasDimensions()
    this.alignCenterDiagram(true)
  }

  updateCanvasDimensions(): void {
    var div = this.requirementsDiagram.div;
    div.style.height = `${CANVAS_HEIGHT}%`;
    div.style.width = `${CANVAS_WIDTH}%`;
    this.requirementsDiagram.requestUpdate();
  }

  ngOnDestroy() { }
}
