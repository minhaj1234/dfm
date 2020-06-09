import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ObjectTabType } from 'core/models';
import { TagSize } from './tag-size';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'core-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
})
export class TagComponent {
  @Input() id: string;
  @Input() text: string;
  @Input() size: TagSize = 'small';
  @Input() addTabAction: any;

  @HostBinding('class.tag-small')
  get smallTagSize() {
    return this.size === 'small';
  }

  @HostBinding('class.tag-medium')
  get mediumTagSize() {
    return this.size === 'medium';
  }

  @HostBinding('class.tag-large')
  get largeTagSize() {
    return this.size === 'large';
  }

  @HostBinding('class.clickable')
  get clickable() {
    return this.addTabAction;
  }

  constructor(
    private store: Store<unknown>,
  ) { }

  openTagPage(): void {
    if (this.addTabAction && this.id) {
      this.store.dispatch(new this.addTabAction({
        id: this.id,
        type: ObjectTabType.Tag,
      }));
    }
  }
}
