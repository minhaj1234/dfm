import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ObjectTabType, JumpMenuItems } from 'core/models';
import { MessageService } from 'core/services';
import { getUrlWithProtocol } from 'core/utilities';
import * as go from 'gojs';
import { DrawCommandHandler } from 'gojs/extensionsTS/DrawCommandHandler';
import { Guid } from 'guid-typescript';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Subject, Subscription, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Config } from '../../../../config';
import { Diagram, IDeleteGraphableRequest } from '../../../models/diagram.model';
import {
  DiagramLinkType,
  DiagramNodeType,
  DiagramSidebarTabTypes,
  GoJsDiagramObject,
  GoLocations,
  GoNodes,
  IGoJsDiagramNode,
  IGoJsLink,
  IImplementationComponentContextMenuItem,
} from '../../../models/goJsDiagram.model';
import { Graphable } from '../../../models/graphable.model';
import { ImplementationComponent } from '../../../models/implementationComponent.model';
import { ObjectRelationsNames } from '../../../models/objects.model';
import * as fromStore from '../../../store';
import { LoadMissingDiagrammingElementsForNode, SetSelectedSidebarTabType } from '../../../store';
import {
  checkIfFinishedEventsWithTransactions,
  convertLinkDataArrayToString,
  getDiagramLinkDataArray,
  getExtraLinks,
  getFromNodeRelations,
  getGoJsLinksForMissingRelations,
  getMostImportantEvents,
  getNewGraphableObject,
  getPositiveCoordinates,
  getToNodeRelations,
  isDecision,
  isEventWeCareAbout,
  isGraphable,
} from '../../../utilitites/goJsHelpers';
import { CommonGoJsDisplayDiagramComponent } from '../common-go-js-display-diagram/common-go-js-display-diagram.component';
import { CANVAS_ELEMENT_LOCAL_NAME, GRAPHABLE_OBJECTS_ACTIONS_MAPPINGS, OBJECT_IS_ALREADY_ON_THE_DIAGRAM_MESSAGE, RELATION_PATHS } from './go-js-display-diagram.const';
import { Actions, ofType } from '@ngrx/effects';
import * as fromActions from '../../../store/actions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-go-js-display-diagram',
  styleUrls: ['./go-js-display-diagram.component.scss'],
  templateUrl: './go-js-display-diagram.component.html',
})
export class GoJsDisplayDiagramComponent extends CommonGoJsDisplayDiagramComponent implements OnInit, AfterViewInit, OnDestroy {
  diagramCurrentLinkTypeSubscription: Subscription;
  diagramObjectsChangeSelectionSubscription: Subscription;
  isPermanentDelete: boolean = false;
  isLastInstance: boolean;

  @ViewChild('diagramDiv', { static: true }) private diagramRef: ElementRef;
  @ViewChild('elem', { static: true }) elem: ElementRef;
  @ViewChild('contextMenu', { static: true }) private contextMenu: ElementRef;
  @ViewChild('graphableTabContextMenuItem', { static: true }) private graphableTabContextMenuItem: ElementRef;
  @ViewChild('alignContextMenuItem', { static: true }) private alignContextMenuItem: ElementRef;
  @ViewChild('permanentDeleteContextMenuItem', { static: true }) private permanentDeleteContextMenuItem: ElementRef;
  @ViewChild('showMissingContextMenuItem', { static: true }) private showMissingContextMenuItem: ElementRef;
  @ViewChild('editDecisionTable', { static: true }) private editDecisionTable: ElementRef;
  @ViewChild('editRequirementsNetwork', { static: true }) private editRequirementsNetwork: ElementRef;
  @ViewChild('relatedDiagrams', { static: true }) private relatedDiagrams: ElementRef;
  implementationComponentContextMenuItems: IImplementationComponentContextMenuItem[] = [];
  relatedDiagramsList = [];
  @Input() resizingDiagram: Subject<any>;

  @Input()
  set diagram(diagram: Diagram) {
    this._diagram = diagram;
    this.updateDiagram(this._diagram);
    this.updateSelectedObject();

    setTimeout(() => {
      this.checkExtraLinks();
      this.checkMissingRelations();
    });

    this.subscribeDiagramCurrentLinkType();
    this.subscribeDiagramObjectsChangeSelection();
    this.setDiagramImage();
  }
  get diagram(): Diagram {
    return this._diagram;
  }

  private _isReadOnly: boolean;
  @Input() set isReadOnly(value: boolean) {
    this._isReadOnly = value;
    this.setDiagramAvailable();
    this.hideContextMenu();
  }
  get isReadOnly(): boolean {
    return this._isReadOnly;
  }

  constructor(
    private store: Store<fromStore.IDecisionFirstState>,
    private changeDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private messageService: MessageService,
    private elementRef: ElementRef,
    private actions$: Actions,

  ) {
    super();
    this.onCreateContextMenu = this.createContextMenu;
    this.onDoubleClickShape = this.openGraphableObject;
    this.onDoubleClickTextBlock = this.openGraphableObject;
    this.onDoubleClickIconImplementationComponent = this.openImplementationComponent;
    this.fillGoJsDiagram();
    this.overrideDelHandler(this.deleteSelectionHandler);
  }

  ngOnInit() {
    this.goJsdiagram.div = this.diagramRef.nativeElement;
    this.subscribeDiagramLayoutChange();
    this.subscribeDiagramCanvasListeners();
  }

  deleteSelectionHandler = () => {
    if (this.goJsdiagram.selection.count > 1) {
      this.isPermanentDelete = false;
    }
    go.CommandHandler.prototype.deleteSelection.call(this.goJsdiagram.commandHandler);
  }

  setDiagramImage(): void {
    if (this.diagram) {
      this.store.dispatch(new fromStore.SetDiagramImageActiveDiagram({
        id: this.diagram.id,
        diagramImage: this.goJsdiagram.makeSvg({
          scale: 1
        })
      }));
    }
  }

  // We need this listeners to prevent focusing diagram when user do mouse down outside the diagram and then mouse up above the diagram viewport (DFM-107).
  subscribeDiagramCanvasListeners(): void {
    setTimeout(() => {
      this.subscribeDiagramCanvasFocus();
      this.subscribeDiagramCanvasClick();
    });
  }

  subscribeDiagramCanvasFocus(): void {
    this.renderer.selectRootElement('canvas')
      .addEventListener('focus', (event) => {
        if (event.relatedTarget && event.relatedTarget.localName !== CANVAS_ELEMENT_LOCAL_NAME) {
          event.relatedTarget.focus();
        }
      });
  }

  subscribeDiagramCanvasClick(): void {
    this.renderer.selectRootElement('canvas')
      .addEventListener('click', () => {
        this.elementRef.nativeElement.ownerDocument.activeElement.blur();
        this.goJsdiagram.focus();
      });
  }

  setDiagramAvailable(): void {
    this.goJsdiagram.isReadOnly = this.isReadOnly;
  }

  checkExtraLinks(): void {
    if (this.diagram) {
      const graphables = [...this.diagram.decisions, ...this.diagram.inputDatas, ...this.diagram.knowledgeSources];
      const linksToRemove = getExtraLinks(graphables, getDiagramLinkDataArray(this.goJsdiagram));

      this.removeLinkDataCollection(linksToRemove);
    }
  }

  fillGoJsDiagram(): void {
    // this.createGoJsDiagramCustomTools();
    this.fillGoJsDiagramProperty();
    this.setGoJsDiagramListeners();
    this.fillGoJsDiagramTemplates();
  }

  fillGoJsDiagramProperty(): void {
    this.goJsdiagram = new go.Diagram();
    this.goJsdiagram.allowDrop = true;
    this.goJsdiagram.positionComputation = (diagram: go.Diagram, point: go.Point) => getPositiveCoordinates(point);
    this.goJsdiagram.validCycle = go.Diagram.CycleNotDirected;
    this.goJsdiagram.initialContentAlignment = go.Spot.Center;
    this.goJsdiagram.undoManager.isEnabled = true;
    this.goJsdiagram.toolManager.panningTool.isEnabled = false;
    this.goJsdiagram.toolManager.hoverDelay = 100;
    this.goJsdiagram.toolManager.linkingTool.direction = go.LinkingTool.ForwardsOnly;
    this.goJsdiagram.commandHandler = new DrawCommandHandler();
    this.goJsdiagram.toolManager.linkingTool.linkValidation = (fromNode, fromPort, toNode) =>
      this.linkValidation(fromNode, toNode);
    this.goJsdiagram.toolManager.linkingTool.doNoLink = () => this.updateNodesAfterInterruptLinkDrawn();
  }

  setGoJsDiagramListeners(): void {
    this.goJsdiagram.addModelChangedListener((e) => this.listenForChanges(e));
    this.goJsdiagram.addDiagramListener('ChangedSelection', () => this.onChangedSelection());
    this.goJsdiagram.addDiagramListener('BackgroundSingleClicked', () => this.onBackgroundSingleClicked());
    this.goJsdiagram.addDiagramListener('LinkDrawn', (e) => this.onLinkDrawn(e));
    this.goJsdiagram.addDiagramListener('SelectionDeleted', (e) => this.onSelectionDeleted(e));
    this.goJsdiagram.addDiagramListener('ExternalObjectsDropped', (e) => this.onExternalObjectsDropped(e));
  }

  onLinkDrawn(e): void {
    if (!this.isAnnotationLink(e.subject.data.category)) {
      const sourceGraphable: Graphable = this.findNodeForKey(e.subject.data.from);
      const relatedGraphable: Graphable = this.findNodeForKey(e.subject.data.to);
      this.handleAddRelationObject(sourceGraphable, relatedGraphable);
    }
  }

  onSelectionDeleted(e): void {
    this.removeGraphableObjects(e);
    this.updateGoJson();
    this.isPermanentDelete = false;
  };

  removeGraphableObjects(e): void {
    const deletedGraphables = this.getSelectedGraphablesToDelete(e)

    if (deletedGraphables.length) {
      this.store.dispatch(
        new fromStore.RemoveGraphableObjectsFromDiagram({
          diagram: this.diagram,
          deletedGraphables,
        }),
      );
    }
  }

  onExternalObjectsDropped(e): void {
    const droppedNode = this.goJsdiagram.selection.first();

    if (isGraphable(droppedNode.data)) {
      this.preventDuplicateNode(droppedNode);
    }
    this.setUniqueNodeKeyForNewNode(e);
  }

  setUniqueNodeKeyForNewNode(e): void {
    e.subject
      .toArray()
      .map((item) => item.data)
      .filter((node: IGoJsDiagramNode) => node.isNew)
      .forEach((node: IGoJsDiagramNode) => this.setUniqueNodeKey(node));
  }

  preventDuplicateNode(droppedNode: go.Part): void {
    const isDuplicated = this.goJsdiagram.model.nodeDataArray
      .filter((node: IGoJsDiagramNode) => isGraphable(node) && node.data.id === droppedNode.data.data.id)
      .length > 1;

    if (isDuplicated) {
      this.store.dispatch(new fromStore.DiagramFailure({
        id: this.diagram.id,
        error: new Error(OBJECT_IS_ALREADY_ON_THE_DIAGRAM_MESSAGE)
      }));
      this.rollbackTransaction();
    }
  }

  updateNodesAfterInterruptLinkDrawn(): void {
    this.goJsdiagram.model.nodeDataArray
      .map((node: IGoJsDiagramNode) => this.goJsdiagram.findNodeForKey(node.key))
      .forEach((node) => setTimeout(() => node.updateTargetBindings()));
  }

  setUniqueNodeKey(node: IGoJsDiagramNode): void {
    this.goJsdiagram.model.setDataProperty(node, 'key', Guid.create().toString());
  }

  getSelectedGraphablesToDelete(e): IDeleteGraphableRequest[] {
    return e.subject
      .toArray()
      .filter((part: go.Part) => isGraphable(part.data))
      .map((part: go.Part) => ({
        graphable: part.data.data,
        relationPath: this.getDiagramRelationPathToDiagramNode(part.data),
        isPermanentDelete: this.isPermanentDelete
      } as IDeleteGraphableRequest));
  }

  handleAddRelationObject(sourceGraphable: Graphable, relatedGraphable: Graphable): void {
    if (this.hasCircularRelations(sourceGraphable, relatedGraphable)) {
      this.messageService.showWarning(['resources.circularDependenciesAreNotAllowed'], 'resources.diagrams');
      this.rollbackTransaction();
    } else if (!this.hasRelationsBetweenNodes(sourceGraphable, relatedGraphable)) {
      this.dispatchAddRelationObject(sourceGraphable, relatedGraphable);
    }
  }

  hasCircularRelations(sourceGraphable: Graphable, relatedGraphable: Graphable): boolean {
    return getFromNodeRelations(sourceGraphable).some((graphable) => graphable.id === relatedGraphable.id);
  }

  hasRelationsBetweenNodes(sourceGraphable: Graphable, relatedGraphable: Graphable): boolean {
    return getToNodeRelations(sourceGraphable).some((graphable) => graphable.id === relatedGraphable.id);
  }

  isAnnotationLink(category: string): boolean {
    return category === DiagramLinkType.Annotation;
  }

  findNodeForKey(id: string): Graphable {
    return this.goJsdiagram.findNodeForKey(id).data.data;
  }

  dispatchAddRelationObject(sourceGraphable: Graphable, relatedGraphable: Graphable): void {
    this.store.dispatch(new GRAPHABLE_OBJECTS_ACTIONS_MAPPINGS[sourceGraphable.className].addRelatedObjectAction({
      sourceObject: sourceGraphable,
      relatedObject: relatedGraphable,
      relationPath: RELATION_PATHS[relatedGraphable.className],
    }));
  }

  rollbackTransaction(): void {
    this.goJsdiagram.rollbackTransaction();
    setTimeout(() => this.checkMissingRelations());
    this.updateSelectedObject();
  }

  openImplementationComponent(object): void {
    if (
      object.panel &&
      object.panel.data &&
      object.panel.data.data &&
      object.panel.data.data.implementationComponents &&
      object.panel.data.data.implementationComponents.length > 0
    ) {
      const implementationComponent: ImplementationComponent = object.panel.data.data.implementationComponents[0];
      this.openTab(implementationComponent.id, implementationComponent.className);
    }
  }

  linkValidation(fromNode: go.Node, toNode: go.Node): boolean {
    switch (this.goJsdiagram.toolManager.linkingTool.archetypeLinkData.category) {
      case DiagramLinkType.Information:
        return this.informationLinkValidation(fromNode.data.type, toNode.data.type);
      case DiagramLinkType.Authority:
        return this.authorityLinkValidation(fromNode.data.type, toNode.data.type);
      case DiagramLinkType.Annotation:
        return this.annotationLinkValidation(fromNode, toNode);
      default:
        return false;
    }
  }

  informationLinkValidation(fromNodeType: DiagramNodeType, toNodeType: DiagramNodeType): boolean {
    switch (fromNodeType) {
      case DiagramNodeType.Decision:
        return this.fromDecisionInformationLinkValidation(toNodeType);
      case DiagramNodeType.InputData:
        return this.fromInputDataInformationLinkValidation(toNodeType);
      default:
        return false;
    }
  }

  fromDecisionInformationLinkValidation(toNodeType: DiagramNodeType) {
    switch (toNodeType) {
      case DiagramNodeType.Decision:
        return true;
      default:
        return false;
    }
  }

  fromInputDataInformationLinkValidation(toNodeType: DiagramNodeType) {
    switch (toNodeType) {
      case DiagramNodeType.Decision:
        return true;
      default:
        return false;
    }
  }

  authorityLinkValidation(fromNodeType: DiagramNodeType, toNodeType: DiagramNodeType): boolean {
    switch (fromNodeType) {
      case DiagramNodeType.Decision:
        return this.fromDecisionAuthorityLinkValidation(toNodeType);
      case DiagramNodeType.InputData:
        return this.fromInputDataAuthorityLinkValidation(toNodeType);
      case DiagramNodeType.KnowledgeSource:
        return this.fromKnowledgeSourceAuthorityValidation(toNodeType);
      default:
        return false;
    }
  }

  fromDecisionAuthorityLinkValidation(toNodeType: DiagramNodeType): boolean {
    switch (toNodeType) {
      case DiagramNodeType.KnowledgeSource:
        return true;
      default:
        return false;
    }
  }

  fromInputDataAuthorityLinkValidation(toNodeType: DiagramNodeType): boolean {
    switch (toNodeType) {
      case DiagramNodeType.KnowledgeSource:
        return true;
      default:
        return false;
    }
  }

  fromKnowledgeSourceAuthorityValidation(toNodeType: DiagramNodeType): boolean {
    switch (toNodeType) {
      case DiagramNodeType.Decision:
        return true;
      case DiagramNodeType.KnowledgeSource:
        return true;
      default:
        return false;
    }
  }

  annotationLinkValidation(fromNode: go.Node, toNode: go.Node): boolean {
    switch (fromNode.data.type) {
      case DiagramNodeType.Annotation:
        return fromNode !== toNode;
      default:
        return false;
    }
  }

  ngAfterViewInit(): void {
    this.contextMenu.nativeElement.addEventListener('contextmenu', (e) => this.hideBrowserContextMenu(e), false);
  }

  subscribeDiagramCurrentLinkType(): void {
    if (this.diagram && !this.diagramCurrentLinkTypeSubscription) {
      this.diagramCurrentLinkTypeSubscription = this.store
        .pipe(select(fromStore.getLinkTypeActiveDiagram(this.diagram.id)))
        .pipe(untilDestroyed(this))
        .subscribe((linkType: DiagramLinkType) => {
          this.fillGoJsDiagramLinkingTool(linkType);
        });
    }
  }

  subscribeDiagramObjectsChangeSelection(): void {
    if (this.diagram && !this.diagramObjectsChangeSelectionSubscription) {
      this.diagramObjectsChangeSelectionSubscription = this.store
        .pipe(select(fromStore.getSelectedDiagramObjectsActiveDiagram(this.diagram.id)))
        .pipe(untilDestroyed(this))
        .subscribe((selectedObject: GoJsDiagramObject[]) => {
          if (selectedObject.length === 0) {
            this.diagramObjectsResetFocus();
          }
        });
    }
  }

  subscribeDiagramLayoutChange(): void {
    this.resizingDiagram
      .pipe(untilDestroyed(this))
      .subscribe(() => this.goJsdiagram.requestUpdate());
  }

  diagramObjectsResetFocus(): void {
    this.goJsdiagram.clearSelection();
    setTimeout(() => this.goJsdiagram.requestUpdate());
  }

  ngOnDestroy() { }

  listenForChanges(event: go.ChangedEvent): void {
    if (!this.outsideUpdate && checkIfFinishedEventsWithTransactions(event) && this.diagram) {
      this.forTesting();
      const transaction = event.object;

      const filtered: go.List<go.ChangedEvent> = transaction.changes.filter(isEventWeCareAbout);

      const mostImportantEvents = getMostImportantEvents(filtered);

      mostImportantEvents.each((importantEvent) => {
        this.checkIfAndHandleNodeEvents(importantEvent);
        this.checkIfAndHandleLinkEvents(importantEvent);
        this.checkIfAndHandlePropertyChanges(importantEvent);
      });
    }
  }

  onChangedSelection(): void {
    this.updateSelectedObject();
    this.hideContextMenuIfNeed();
  }

  onBackgroundSingleClicked(): void {
    this.unselectCurrentLinkType();
    this.collapseMainSidebar();
  }

  unselectCurrentLinkType(): void {
    if (this.goJsdiagram.allowLink) {
      this.store.dispatch(new fromStore.SetLinkTypeActiveDiagram({
        id: this.diagram.id,
        linkType: null,
      }));
    }
  }

  collapseMainSidebar(): void {
    this.store.select(fromStore.getIsShowPropertySidebar)
      .pipe(first())
      .subscribe((isShow: boolean) => {
        if (isShow) {
          this.changeDetectorRef.markForCheck();
          this.store.dispatch(new fromStore.CollapseSidebar());
        }
      });
  }

  hideContextMenuIfNeed(): void {
    if (this.goJsdiagram.selection.count === 0) {
      this.hideContextMenu();
    }
  }

  updateSelectedObject(): void {
    if (this.diagram) {
      this.store.dispatch(
        new fromStore.SetSelectedDiagramObjectsActiveDiagram({
          id: this.diagram.id,
          selectedDiagramObjects: this.getSelectedDiagramObjects()
        }),
      );
    }
  }

  getSelectedDiagramObjects(): GoJsDiagramObject[] {
    const selectedDiagramObjects: GoJsDiagramObject[] = [];

    this.goJsdiagram.selection.each(function (part) {
      selectedDiagramObjects.push({ ...part.data as GoJsDiagramObject });
    });

    return selectedDiagramObjects;
  }

  openGraphableObject(event: any, object: any): void {
    if (object.panel && object.panel.data && object.panel.data.data) {
      const graphable: Graphable = object.panel.data.data;
      this.openTab(graphable.id, graphable.className);
    } else if (object.panel && object.panel.part.data && object.panel.part.data.data) {
      const graphable: Graphable = object.panel.part.data.data;
      this.openTab(graphable.id, graphable.className);
    }
  }

  openTab(id: string, type: string, JumpMenuItem?: string): void {
    this.store.dispatch(
      new fromStore.AddTab({
        id: id,
        type: ObjectTabType[type],
        jumpMenuSelectedItem: JumpMenuItems[JumpMenuItem]
      }),
    );
  }

  checkIfAndHandleNodeEvents(e: go.ChangedEvent): void {
    if (e.modelChange === 'nodeDataArray') {
      if (e.change === go.ChangedEvent.Insert) {
        this.handleNodeAdded(e.newValue);
      }
    }
  }

  checkIfAndHandleLinkEvents(e: go.ChangedEvent): void {
    if (e.modelChange === 'linkDataArray') {
      if (e.change === go.ChangedEvent.Insert) {
        this.addNewGoJsLink();
      } else if (e.change === go.ChangedEvent.Remove) {
        this.removeNewGoJsLink(e.oldValue);
      }
    }
  }

  addNewGoJsLink(): void {
    this.updateGoJson();
  }

  removeNewGoJsLink(linkData: IGoJsLink): void {
    this.dispatchRemoveLink(linkData);
    this.updateGoJson();
  }

  dispatchRemoveLink(linkData: IGoJsLink): void {
    this.store.dispatch(new fromStore.RemoveLink({ diagram: this.diagram, fromObjectId: linkData.from, toObjectId: linkData.to, linkType: linkData.category }));
  }

  dispatchUpdateGoConnectors(): void {
    this.dispatchUpdateGoJson({ goConnectors: convertLinkDataArrayToString(getDiagramLinkDataArray(this.goJsdiagram)) });
  }

  checkIfAndHandlePropertyChanges(e: go.ChangedEvent): void {
    if (e.change === go.ChangedEvent.Property) {
      if (e.propertyName === 'loc' && this.isNeedUpdateDiagram(e.object)) {
        this.updateGoLocationsWithGoNodes();
      } else if (e.propertyName === 'text') {
        this.handleNameChange(e.object, e.newValue);
      } else if (e.propertyName === 'size' && e.object.type === DiagramNodeType.GroupItem) {
        this.updateGoNodes();
      } else if (e.propertyName === 'points') {
        this.updateGoConnectors();
      }
    }
  }

  isNeedUpdateDiagram(node: IGoJsDiagramNode): boolean {
    return node.data && (node.type === DiagramNodeType.Decision ||
      node.type === DiagramNodeType.InputData ||
      node.type === DiagramNodeType.KnowledgeSource) ||
      node.type === DiagramNodeType.Annotation ||
      node.type === DiagramNodeType.GroupItem;
  }

  handleNodeAdded(diagramNode: IGoJsDiagramNode): void {
    if (isGraphable(diagramNode)) {
      if (diagramNode.isNew) {
        diagramNode = this.updateModelNewNode(diagramNode);
      }

      this.addGraphableObjectToDiagram(diagramNode);
    }
  }

  updateModelNewNode(diagramNode: IGoJsDiagramNode): IGoJsDiagramNode {
    diagramNode.data = getNewGraphableObject(diagramNode.type);
    diagramNode.data._links = {
      self: {
        href: `${Config.rootUri}${this.getDiagramRelationPathToDiagramNode(diagramNode)}/${diagramNode.key}`
      }
    }

    return diagramNode;
  }

  updateGoNodes(): void {
    this.dispatchUpdateGoJson({ goNodes: JSON.stringify(this.getGoNodes()) });
  }

  updateGoConnectors(): void {
    this.dispatchUpdateGoJson({ goConnectors: convertLinkDataArrayToString(getDiagramLinkDataArray(this.goJsdiagram)) });
  }

  updateGoLocationsWithGoNodes(): void {
    this.dispatchUpdateGoJson({
      goNodes: JSON.stringify(this.getGoNodes()),
      goLocations: JSON.stringify(this.getGoLocations())
    });
  }

  updateGoJson(): void {
    this.dispatchUpdateGoJson({
      goNodes: JSON.stringify(this.getGoNodes()),
      goLocations: JSON.stringify(this.getGoLocations()),
      goConnectors: convertLinkDataArrayToString(getDiagramLinkDataArray(this.goJsdiagram))
    });
  }

  dispatchUpdateGoJson(goJson: { goNodes?: string, goLocations?: string, goConnectors?: string }): void {
    this.store.dispatch(new fromStore.UpdateGoJson({ diagram: this.diagram, ...goJson }));
  }

  getGoNodes(): GoNodes {
    const goNodes: GoNodes = {};

    this.goJsdiagram.model.nodeDataArray
      .filter((node: IGoJsDiagramNode) => this.isNeedUpdateDiagram(node))
      .forEach((node: IGoJsDiagramNode) => {
        goNodes[node.key] = {
          type: node.type,
          text: node.text,
          size: node.size,
        };
      });

    return goNodes;
  }

  getGoLocations(): GoLocations {
    const goLocations: GoLocations = {};

    this.goJsdiagram.model.nodeDataArray
      .filter((node: IGoJsDiagramNode) => this.isNeedUpdateDiagram(node))
      .forEach((node: IGoJsDiagramNode) => {
        goLocations[node.key] = { loc: node.loc };
      });

    return goLocations;
  }

  handleNameChange(node: IGoJsDiagramNode, newValue: string): void {
    if (node.data) {
      this.store.dispatch(GRAPHABLE_OBJECTS_ACTIONS_MAPPINGS[node.data.className].updateActionFactory({
        object: { id: node.data.id, _links: node.data._links, name: newValue },
        objectTagsUpdate: { tags: node.data.tags, description: node.data.description, name: newValue }
      }));
    } else {
      this.updateGoNodes();
    }
  }

  addGraphableObjectToDiagram(diagramNode: IGoJsDiagramNode): void {
    const relationPath = this.getDiagramRelationPathToDiagramNode(diagramNode);

    setTimeout(() => this.addMissingLinks(diagramNode));

    if (relationPath) {
      this.store.dispatch(
        new fromStore.AddGraphableObjectToDiagram({
          sourceObject: this.diagram,
          relatedObject: diagramNode.data,
          relationPath: relationPath,
          isNew: diagramNode.isNew
        }),
      );
    }
  }

  addMissingLinks(node: IGoJsDiagramNode): void {
    const missingLinks: IGoJsLink[] = [];

    missingLinks.push(...getGoJsLinksForMissingRelations(this.goJsdiagram, node.data));

    (this.goJsdiagram.model as go.GraphLinksModel).addLinkDataCollection(missingLinks);
  }

  getDiagramRelationPathToDiagramNode(diagramNode: IGoJsDiagramNode): ObjectRelationsNames {
    let relationPath: ObjectRelationsNames;

    if (diagramNode.type === DiagramNodeType.Decision) {
      relationPath = ObjectRelationsNames.Decisions;
    } else if (diagramNode.type === DiagramNodeType.InputData) {
      relationPath = ObjectRelationsNames.InputDatas;
    } else if (diagramNode.type === DiagramNodeType.KnowledgeSource) {
      relationPath = ObjectRelationsNames.KnowledgeSources;
    }

    return relationPath;
  }

  createContextMenu(): any {
    return go.GraphObject.make(go.HTMLInfo, {
      hide: () => this.hideContextMenu(),
      show: (obj, diagram, tool) => {
        obj.data.data && this.goJsdiagram.selection.first().data.data ?
          this.checkIfLastInstanceOfObject().subscribe((data: boolean) => {
            this.isLastInstance = data;
            this.showContextMenu(obj)
          }) : this.showContextMenu(obj);
      },
    });
  }

  checkIfLastInstanceOfObject(): Observable<boolean> {
    const nodeData = this.goJsdiagram.selection.first().data.data;
    this.store.dispatch(
      new fromStore.ObjectAssociationWithOtherDiagram({
        diagramId: this.diagram.id,
        objectType: nodeData.className,
        objectId: nodeData.id
      })
    )
    return this.actions$.pipe(
      ofType(fromActions.IS_OBJECT_ASSOCIATED_WITH_OTHER_DIAGRAM_SUCCESS),
      first(),
      map((action: fromActions.ObjectAssociationWithOtherDiagramSuccess) => !action.payload.isObjectAssociatedWithOtherDiagram)
    )
  }

  showContextMenu(obj): void {
    this.setCoordinatesContextMenu();
    this.setVisibilityForPredefinedContextMenuItems(obj);
    this.fillImplementationComponentContextMenuItems();
    this.showElementRef(this.contextMenu);
  }

  setVisibilityForPredefinedContextMenuItems(obj) {
    this.setVisibilityGraphableTabContextMenuItem();
    this.setVisibilityAlignContextMenuItem();
    this.setVisibilityPermanentDeleteContextMenuItem();
    this.setVisibilityShowMissingContextMenuItem();
    this.setVisibilityEditDecisionTable(obj);
    this.setVisibilityEditRequirementsNetwork();
    this.setVisibilityRelatedDiagrams();
  }

  hideContextMenu(): void {
    this.hideElementRef(this.contextMenu);
  }

  showElementRef(elementRef: ElementRef): void {
    this.renderer.setStyle(elementRef.nativeElement, 'display', 'block');
  }

  hideElementRef(elementRef: ElementRef): void {
    this.renderer.setStyle(elementRef.nativeElement, 'display', 'none');
  }

  setCoordinatesContextMenu(): void {
    const viewPoint = this.goJsdiagram.lastInput.viewPoint;
    this.renderer.setStyle(this.contextMenu.nativeElement, 'left', `${viewPoint.x}px`);
    this.renderer.setStyle(this.contextMenu.nativeElement, 'top', `${viewPoint.y}px`);
  }

  setVisibilityGraphableTabContextMenuItem(): void {
    if (this.goJsdiagram.selection.count === 1 && isGraphable(this.goJsdiagram.selection.first().data)) {
      this.showElementRef(this.graphableTabContextMenuItem);
    } else {
      this.hideElementRef(this.graphableTabContextMenuItem);
    }
  }

  setVisibilityAlignContextMenuItem(): void {
    if ((this.goJsdiagram.commandHandler as DrawCommandHandler).canAlignSelection() && !this.isReadOnly) {
      this.showElementRef(this.alignContextMenuItem);
    } else {
      this.hideElementRef(this.alignContextMenuItem);
    }
  }

  setVisibilityPermanentDeleteContextMenuItem(): void {
    if (this.isLastInstance && !this.isReadOnly) {
      this.showElementRef(this.permanentDeleteContextMenuItem);
    } else {
      this.hideElementRef(this.permanentDeleteContextMenuItem);
    }
  }

  setVisibilityShowMissingContextMenuItem(): void {
    if (this.selectedNodeHasMissingItems() && !this.isReadOnly) {
      this.showElementRef(this.showMissingContextMenuItem);
    } else {
      this.hideElementRef(this.showMissingContextMenuItem);
    }
  }

  setVisibilityEditDecisionTable(obj): void {
    if (this.goJsdiagram.selection.count === 1 && isGraphable(this.goJsdiagram.selection.first().data) && obj.data.data ? obj.data.data.className === "Decision" : false) {
      this.showElementRef(this.editDecisionTable);
    } else {
      this.hideElementRef(this.editDecisionTable);
    }
  }

  setVisibilityEditRequirementsNetwork(): void {
    if (this.goJsdiagram.selection.count === 1 && isGraphable(this.goJsdiagram.selection.first().data)) {
      this.showElementRef(this.editRequirementsNetwork);
    } else {
      this.hideElementRef(this.editRequirementsNetwork);
    }
  }

  setVisibilityRelatedDiagrams(): void {
    if (this.goJsdiagram.selection.count === 1 && this.goJsdiagram.selection.first().data.data.diagrams.length > 1) {
      this.showElementRef(this.relatedDiagrams)
    } else {
      this.hideElementRef(this.relatedDiagrams)
    }
  }

  selectedNodeHasMissingItems(): boolean {
    return this.goJsdiagram.selection.count === 1 && (this.goJsdiagram.selection.first().data as IGoJsDiagramNode).hasMissingNodes;
  }

  fillImplementationComponentContextMenuItems(): void {
    this.implementationComponentContextMenuItems = [];

    if (this.goJsdiagram.selection.count === 1) {
      const nodeData = this.goJsdiagram.selection.first().data.data;

      if (nodeData && this.doImplementationComponentsExistInDecision(nodeData)) {
        nodeData.implementationComponents.forEach((implementationComponent) => {
          this.addImplementationComponentContextMenuItem(implementationComponent);
        });
      }
    }

    this.changeDetectorRef.detectChanges();
  }

  addImplementationComponentContextMenuItem(implementationComponent: ImplementationComponent): void {
    if (implementationComponent.url) {
      this.implementationComponentContextMenuItems.push({
        name: implementationComponent.name,
        url: implementationComponent.url,
      });
    }
  }

  onClickGraphableTabContextMenuItem(): void {
    const nodeData = this.goJsdiagram.selection.first().data.data;
    this.openTab(nodeData.id, nodeData.className);
    this.goJsdiagram.currentTool.stopTool();
  }

  onClickEditDecisionTable(): void {
    const nodeData = this.goJsdiagram.selection.first().data.data;
    this.openTab(nodeData.id, nodeData.className, 'Implementation');
    this.goJsdiagram.currentTool.stopTool();
  }

  onClickEditRequirementsNetwork(): void {
    const nodeData = this.goJsdiagram.selection.first().data.data;
    this.openTab(nodeData.id, nodeData.className, 'Requirements');
    this.goJsdiagram.currentTool.stopTool();
  }

  onHoverShowRelatedDiagram(): void {
    this.relatedDiagramsList = []
    this.goJsdiagram.selection.first().data.data.diagrams.map(diagram => {
      if (this.diagram.id !== diagram.id) {
        this.relatedDiagramsList.push(diagram)
      }
    })
    this.relatedDiagramsList.sort(function (a, b) {
      let textA = a.name.toUpperCase();
      let textB = b.name.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    })
  }

  doImplementationComponentsExistInDecision(graphable: Graphable): boolean {
    return isDecision(graphable) && graphable.implementationComponents && graphable.implementationComponents.length
      ? true
      : false;
  }

  onClickAlignLeftContextMenuItem(): void {
    (this.goJsdiagram.commandHandler as DrawCommandHandler).alignLeft();
    this.goJsdiagram.currentTool.stopTool();
  }

  onClickAlignRightContextMenuItem(): void {
    (this.goJsdiagram.commandHandler as DrawCommandHandler).alignRight();
    this.goJsdiagram.currentTool.stopTool();
  }

  onClickAlignTopContextMenuItem(): void {
    (this.goJsdiagram.commandHandler as DrawCommandHandler).alignTop();
    this.goJsdiagram.currentTool.stopTool();
  }

  onClickAlignBottomContextMenuItem(): void {
    (this.goJsdiagram.commandHandler as DrawCommandHandler).alignBottom();
    this.goJsdiagram.currentTool.stopTool();
  }

  onClickPermanentDeleteContextMenuItem(): void {
    this.isPermanentDelete = true;
    this.goJsdiagram.commandHandler.deleteSelection();
    this.goJsdiagram.currentTool.stopTool();
  }

  onClickShowMissingContextMenuItem(): void {
    this.store.dispatch(new LoadMissingDiagrammingElementsForNode({
      diagramId: this.diagram.id,
      nodeId: (this.goJsdiagram.selection.first().data as IGoJsDiagramNode).data.id
    }));
    this.store.dispatch(new SetSelectedSidebarTabType({ id: this.diagram.id, selectedSidebarTabType: DiagramSidebarTabTypes.Objects }));
    this.goJsdiagram.currentTool.stopTool();
  }

  onClickImplementationComponentContextMenuItem(url: string): void {
    window.open(getUrlWithProtocol(url), '_blank');
    this.goJsdiagram.currentTool.stopTool();
  }

  onClickOpenDiagram(diagram: any) {
    console.log('diagram event:', diagram)
    this.openTab(diagram.id, diagram.className)
  }

  getRequirementNetworkForPreview(): void {
    let requirementNetwork = this.goJsdiagram.selection.first().data.data.diagram
  }

  hideBrowserContextMenu(e): boolean {
    e.preventDefault();
    return false;
  }

  forTesting() { }
}
