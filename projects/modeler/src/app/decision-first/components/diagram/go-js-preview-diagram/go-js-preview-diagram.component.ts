import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { setSVGViewBox } from 'core/utilities';
import * as go from 'gojs';
import { Diagram } from '../../../models/diagram.model';
import { CommonGoJsDisplayDiagramComponent } from '../common-go-js-display-diagram/common-go-js-display-diagram.component';

const IMAGE_SIZE = 200;

@Component({
  selector: 'dfm-go-js-preview-diagram',
  templateUrl: './go-js-preview-diagram.component.html',
  styleUrls: ['./go-js-preview-diagram.component.scss']
})
export class GoJsPreviewDiagramComponent extends CommonGoJsDisplayDiagramComponent implements OnInit, OnDestroy {
  private makeSvgOptions = { 
    size: new go.Size(IMAGE_SIZE, IMAGE_SIZE)
  };
  private image: SVGElement;
  @ViewChild('previewDiagram', {static: true}) previewDiagram: ElementRef;
  @ViewChild('diagramDiv', {static: true}) diagramDiv: ElementRef;
  @Input()
  set diagram(diagram: Diagram) {
    this._diagram = diagram;

    if(diagram) {
      this.updateDiagram(this._diagram);

      setTimeout(() => {
        this.checkMissingRelations();
        this.setPreviewImage();
      });
    }
  }
  get diagram(): Diagram {
    return this._diagram;
  }

  constructor(private renderer: Renderer2) {
    super();
    this.fillGoJsDiagram();
  }

  ngOnInit() {
    this.goJsdiagram.div = this.diagramDiv.nativeElement;
  }

  setPreviewImage(): void {
    if(this.goJsdiagram && !!this.goJsdiagram.model.nodeDataArray.length) {
      this.createImage();
      this.alignImage();
    }
  }

  createImage(): void {
    if (!this.image) {
      this.image = this.goJsdiagram.makeSvg(this.makeSvgOptions);
      this.renderer.appendChild(this.previewDiagram.nativeElement, this.image);
    }
  }

  alignImage(): void {
    setTimeout(() => {
      setSVGViewBox(this.image);
      this.renderer.setStyle(this.previewDiagram.nativeElement, 'visibility', 'visible');
     });
  }

  fillGoJsDiagram(): void {
    this.fillGoJsDiagramTemplates();
  }

  ngOnDestroy() { }
}
