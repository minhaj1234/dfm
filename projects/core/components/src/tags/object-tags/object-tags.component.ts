import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'core-object-tags',
  templateUrl: './object-tags.component.html',
  styleUrls: ['./object-tags.component.scss'],
})
export class ObjectTagsComponent {
  @Input() tags: Object[];
  @Input() addTabAction: any;
}
