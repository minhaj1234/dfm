import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Decision } from '../../../models/decision.model';
import { DfmObjects, ObjectClassNames } from '../../../models/objects.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-object-preview',
  templateUrl: './object-preview.component.html',
  styleUrls: ['./object-preview.component.scss']
})
export class ObjectPreviewComponent {
  @Input() object: DfmObjects;

  doDisplayDescription(): boolean {
    return this.object.className !== ObjectClassNames.Decision || !(this.object as Decision).question;
  }
}
