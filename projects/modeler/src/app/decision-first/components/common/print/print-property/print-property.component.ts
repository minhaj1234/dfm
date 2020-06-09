import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { sortObjectsInAlphabeticalOrderByName } from 'core/utilities';
import { DfmObjects } from '../../../../models/objects.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-print-property',
  styleUrls: ['./print-property.component.scss'],
  templateUrl: './print-property.component.html',
})
export class PrintPropertyComponent {
  @Input() objects: DfmObjects[];
  @Input() title: string;
  @Input() includeDescription: string;
  @Input() text: string;

  getObjectsInAlphabeticalOrder(objects: DfmObjects[]): DfmObjects[] {
    return sortObjectsInAlphabeticalOrderByName([...objects]);
  }
}
