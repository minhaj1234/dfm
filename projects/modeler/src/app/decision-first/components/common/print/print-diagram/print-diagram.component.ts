import { ChangeDetectionStrategy, Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { setSVGViewBox, sortObjectsInAlphabeticalOrderByName } from 'core/utilities';
import { Diagram } from '../../../../models/diagram.model';
import { DfmObjects } from '../../../../models/objects.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-print-diagram',
  styleUrls: ['./print-diagram.component.scss'],
  templateUrl: './print-diagram.component.html',
})
export class PrintDiagramComponent {
  _diagram: Diagram;
  @ViewChild('diagramImage', { static: true }) diagramImage: ElementRef;
  @Input() includeRelatedObjects: boolean;
  @Input() set image(image: SVGElement) {
    if (image) {
      this.renderer.setProperty(this.diagramImage.nativeElement, 'innerHTML', '');
      this.renderer.appendChild(this.diagramImage.nativeElement, image);
    }
  };
  @Input() set diagram(diagram: Diagram) {
    if (diagram) {
      this._diagram = diagram;
    }
  };
  get diagram(): Diagram {
    return this._diagram;
  }

  constructor(private renderer: Renderer2) {}
 
  doDisplayRelatedObjects(objects: DfmObjects[]): boolean {
    return !!objects && !!objects.length;
  }

  getObjectsInAlphabeticalOrder(objects: DfmObjects[]): DfmObjects[] {
    return sortObjectsInAlphabeticalOrderByName([...objects]);
  }
}
