import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { ResizeEvent } from 'angular-resizable-element';
import { Diagram } from '../../models/diagram.model';
import { DiagramNodeType, GoJsDiagramObject, IGoJsDiagramNode } from '../../models/goJsDiagram.model';
import * as fromStore from '../../store';
import { isGraphable, isSketch } from '../../utilitites/goJsHelpers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-panel-info-diagram-container',
  styleUrls: ['./panel-info-diagram-container.component.scss'],
  templateUrl: './panel-info-diagram-container.component.html',
})
export class PanelInfoDiagramContainerComponent {
  private _diagram: Diagram;
  private _selectedNode: IGoJsDiagramNode;
  public panelInfoDiagramDesktopStyle: object = {};
  @Output() resize = new EventEmitter<any>()

  @Input() isReadOnly: boolean;
  @Input()
  set diagram(diagram: Diagram) {
    this._diagram = diagram;
  }

  get diagram(): Diagram {
    return this._diagram;
  }

  @Input()
  set selectedDiagramObjects(selectedObjects: GoJsDiagramObject[]) {
    this.setSelectedSingleNode(selectedObjects);
  }

  set selectedNode(selectedObject: IGoJsDiagramNode) {
    this._selectedNode = selectedObject;
  }

  get selectedNode(): IGoJsDiagramNode {
    return this._selectedNode;
  }

  get isShowEditSingleDiagramObjectComponent(): boolean {
    return isGraphable(this.selectedNode) || isSketch(this.selectedNode);
  }

  constructor(private store: Store<fromStore.IDecisionFirstState>) {}

  setSelectedSingleNode(selectedObjects: GoJsDiagramObject[]): void {
    this.selectedNode = this.getSelectedSingleNode(selectedObjects);
  }

  getSelectedSingleNode(selectedObjects: GoJsDiagramObject[]): IGoJsDiagramNode  {
    return this.isSelectedSingleObject(selectedObjects) && this.isNode(selectedObjects[0])
      ? selectedObjects[0] as IGoJsDiagramNode
      : null
  }

  isSelectedSingleObject(selectedObjects: GoJsDiagramObject[]): boolean {
    return selectedObjects && selectedObjects.length === 1
  }

  isNode(selectedObject: any): boolean {
    return (
      selectedObject &&
      (selectedObject.type === DiagramNodeType.Decision ||
        selectedObject.type === DiagramNodeType.KnowledgeSource ||
        selectedObject.type === DiagramNodeType.InputData ||
        selectedObject.type === DiagramNodeType.Annotation ||
        selectedObject.type === DiagramNodeType.GroupItem)
    );
  }

  onResizingPanelInfoDiagramDesktop(event: ResizeEvent): void {
    this.panelInfoDiagramDesktopStyle = { width: `${event.rectangle.width}px` };
    this.resize.emit();
  }
}
