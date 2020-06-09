import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as go from 'gojs';
import { Decision } from '../../../models/decision.model';
import { DEFAULT_ANNOTATION_DIAGRAM_NODE, DEFAULT_DECISION_DIAGRAM_NODE, DEFAULT_GROUP_ITEM_DIAGRAM_NODE, DEFAULT_INPUT_DATA_DIAGRAM_NODE, DEFAULT_KNOWLEDGE_SOURCE_DIAGRAM_NODE } from '../../../models/goJsDiagram.model';
import { InputData } from '../../../models/inputData.model';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-go-js-add-object-palette',
  styleUrls: ['./go-js-add-object-palette.component.scss'],
  templateUrl: './go-js-add-object-palette.component.html',
})
export class GoJsAddObjectPaletteComponent implements OnInit, OnDestroy {
  @ViewChild('paletteDiv', { static: true }) private paletteRef: ElementRef;
  public palette: go.Palette = new go.Palette();

  constructor() {
    this.fillPalette();
  }

  ngOnInit() {
    this.palette.div = this.paletteRef.nativeElement;
  }

  fillPalette(): void {
    this.fillPaletteProperties();
    this.fillPaletteLayout();
    this.fillPaletteNodeTemplate();
    this.fillPaletteNodeDataArray();
  }

  fillPaletteProperties(): void {
    this.palette.toolManager.panningTool.isEnabled = false;
    this.palette.toolManager.dragSelectingTool.isEnabled = false;
    this.palette.autoScrollRegion = 0;
  }

  fillPaletteLayout(): void {
    this.palette.layout = go.GraphObject.make(go.GridLayout, {
      alignment: go.GridLayout.Position,
      cellSize: new go.Size(1, 1),
      spacing: new go.Size(5, 5),
    });
  }

  fillPaletteNodeTemplate(): void {
    this.palette.nodeTemplate = go.GraphObject.make(
      go.Node,
      'Vertical',
      { selectionAdorned: false },
      go.GraphObject.make(
        go.Shape,
        { width: 30, height: 30, fill: 'white' },
        new go.Binding('figure', 'shape'),
        new go.Binding('geometryString', 'geometryString'),
        new go.Binding('strokeDashArray', 'strokeDashArray'),
        new go.Binding('stroke', 'borderColor'),
      ),
      {
        toolTip:
          go.GraphObject.make(
            go.Adornment,
            "Auto",
            go.GraphObject.make(
              go.Shape,
              "RoundedRectangle",
              { fill: "#FFFFFF", stroke: "#B6B6B6" }),
            go.GraphObject.make(
              go.TextBlock,
              { margin: 4, background: "#FFFFFF" },
              new go.Binding("text", "text"))
          )
      }
    );
  }

  fillPaletteNodeDataArray(): void {
    this.palette.model.nodeDataArray = [
      {
        ...DEFAULT_DECISION_DIAGRAM_NODE,
        isNew: true,
        data: new Decision(),
      },
      {
        ...DEFAULT_INPUT_DATA_DIAGRAM_NODE,
        isNew: true,
        data: new InputData(),
      },
      {
        ...DEFAULT_KNOWLEDGE_SOURCE_DIAGRAM_NODE,
        isNew: true,
        data: new KnowledgeSource(),
      },
      {
        ...DEFAULT_GROUP_ITEM_DIAGRAM_NODE,
        isNew: true,
      },
      {
        ...DEFAULT_ANNOTATION_DIAGRAM_NODE,
        isNew: true,
      },
    ];
  }

  ngOnDestroy() { }
}
