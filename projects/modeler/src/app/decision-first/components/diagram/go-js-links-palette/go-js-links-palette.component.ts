import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as go from 'gojs';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Diagram } from '../../../models/diagram.model';
import { DiagramLinkType } from '../../../models/goJsDiagram.model';
import * as fromStore from '../../../store';

@Component({
  selector: 'dfm-go-js-links-palette',
  styleUrls: ['./go-js-links-palette.component.scss'],
  templateUrl: './go-js-links-palette.component.html',
})
export class GoJsLinksPaletteComponent implements OnInit, OnDestroy {
  public palette: go.Palette = new go.Palette();

  @Input() diagram: Diagram;
  @ViewChild('paletteDiv', { static: true }) private paletteRef: ElementRef;

  currentLinkType: DiagramLinkType = null;

  constructor(private store: Store<fromStore.IDecisionFirstState>) {
    this.fillPalette();
  }

  ngOnInit() {
    this.palette.div = this.paletteRef.nativeElement;
    this.setSelectedLink();
  }

  setSelectedLink(): void {
    if (this.diagram) {
      this.store
        .pipe(select(fromStore.getLinkTypeActiveDiagram(this.diagram.id)))
        .pipe(untilDestroyed(this))
        .subscribe((linkType: DiagramLinkType) => {
          this.currentLinkType = linkType;
          this.setCurrentLinkTypePalette();
        });
    }
  }

  setCurrentLinkTypePalette(): void {
    const link = this.palette.findNodeForKey(this.currentLinkType);

    if (link) {
      this.palette.select(link);
    } else {
      this.palette.clearSelection();
    }
  }

  fillPalette(): void {
    this.fillPaletteProperties();
    this.fillPaletteNodeTemplate();
    this.fillPaletteNodeDataArray();
    this.setPaletteListeners();
  }

  fillPaletteProperties(): void {
    this.palette.toolManager.panningTool.isEnabled = false;
    this.palette.toolManager.dragSelectingTool.isEnabled = false;
    this.palette.allowDragOut = false;
  }

  fillPaletteNodeTemplate(): void {
    this.palette.nodeTemplate = go.GraphObject.make(
      go.Node,
      'Vertical',
      go.GraphObject.make(
        go.Panel,
        go.GraphObject.make(
          go.Shape,
          { width: 30, height: 30, figure: 'Line2', background: 'transparent' },
          new go.Binding('strokeDashArray', 'strokeDashArray'),
        ),
      ),
      {
        toolTip:
          go.GraphObject.make(
            go.Adornment,
            "Auto",
            go.GraphObject.make(
              go.Shape,
              "RoundedRectangle",
              { fill: "#FFFFFF", stroke: "#B6B6B6" },
              new go.Binding('geometryString', 'geometryString')),
            go.GraphObject.make(
              go.TextBlock,
              { margin: 4, background: "#FFFFFF" },
              new go.Binding("text", "key"))
          )
      }
    );
  }

  fillPaletteNodeDataArray(): void {
    this.palette.model.nodeDataArray = [
      {
        key: DiagramLinkType.Information,
        strokeDashArray: [],
      },
      {
        key: DiagramLinkType.Authority,
        strokeDashArray: [5],
      },
      {
        key: DiagramLinkType.Annotation,
        strokeDashArray: [2, 4],
      },
    ];
  }

  setPaletteListeners(): void {
    this.palette.addDiagramListener('ObjectSingleClicked', () => this.onObjectSingleClicked());
    this.palette.addDiagramListener('BackgroundSingleClicked', () => this.onBackgroundSingleClicked());
  }

  onObjectSingleClicked(): void {
    const selectedLinkType = this.palette.selection.first().data.key;

    if (selectedLinkType !== this.currentLinkType) {
      this.setLinkTypeActiveDiagram(selectedLinkType);
    }
  }

  onBackgroundSingleClicked(): void {
    if (this.currentLinkType !== null) {
      this.setLinkTypeActiveDiagram(null);
    }
  }

  setLinkTypeActiveDiagram(linkType: DiagramLinkType): void {
    this.store.dispatch(new fromStore.SetLinkTypeActiveDiagram({ id: this.diagram.id, linkType: linkType }));
  }

  ngOnDestroy() { }
}
