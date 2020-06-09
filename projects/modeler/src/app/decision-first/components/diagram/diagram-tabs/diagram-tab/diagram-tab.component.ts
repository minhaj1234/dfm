import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core';
import { DiagramSidebarTabTypes } from '../../../../models/goJsDiagram.model';

@Component({
  selector: 'dfm-diagram-tab',
  templateUrl: './diagram-tab.component.html',
  styleUrls: ['./diagram-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiagramTabComponent {
  @Input() contentTemplateRef: TemplateRef<any>;
  @Input() titleIcon: string;
  @Input() title: string;
  @Input() type: DiagramSidebarTabTypes;
  @Input() needDisplay: (type: DiagramSidebarTabTypes) => boolean = (type: DiagramSidebarTabTypes) => {
    return this.type === type;
  };
}
