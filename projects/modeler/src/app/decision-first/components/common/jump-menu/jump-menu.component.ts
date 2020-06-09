import { ChangeDetectionStrategy, Component, ElementRef, Input } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { DefaultJumpMenuSelectedItem, JumpMenuItems } from 'core/models';
import { convertStringToI18nString } from 'core/utilities';
import { Subscription } from 'rxjs';
import { DfmObjects } from '../../../models/objects.model';
import { IDecisionFirstState } from '../../../store';
import * as fromStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-jump-menu',
  templateUrl: './jump-menu.component.html',
  styleUrls: ['./jump-menu.component.scss']
})
export class JumpMenuComponent {
  selectedMenuItem = DefaultJumpMenuSelectedItem
  jumpMenuItems = JumpMenuItems;
  tabEntitySubscription: Subscription;
  _dfmObject: DfmObjects;
  @Input() anchors: Record<string, ElementRef> = {};
  @Input() set object(dfmObject: DfmObjects) {
    this._dfmObject = dfmObject;
    if (dfmObject && !this.tabEntitySubscription) {
      this.subscribeTabEntity(dfmObject);
    }
  }

  get object(): DfmObjects {
    return this._dfmObject;
  }

  constructor(private store: Store<IDecisionFirstState>) {}

  isAnchorExists(item: JumpMenuItems): boolean {
    return this.anchors && this.anchors[item] != null;
  }

  subscribeTabEntity(dfmObject: DfmObjects): void {
    this.tabEntitySubscription = this.store.pipe(select(fromStore.getTabEntityById(dfmObject.id))).subscribe((tab) => {
      if (tab) {
        this.selectedMenuItem = tab.jumpMenuSelectedItem;
        this.scrollToAnchor(tab.jumpMenuSelectedItem);
      }
    });
  }

  getAnchorsTypes(): Array<string> {
    const anchorsTypes = new Array<string>();
    for (const type in this.anchors) {
      if (this.anchors[type]) {
        anchorsTypes.push(type);
      }
    }
    return anchorsTypes;
  }

  scrollToAnchor(selectedAnchor: JumpMenuItems): void {
    if (this.anchors[selectedAnchor]) {
      this.anchors[selectedAnchor].nativeElement.scrollIntoView();
    }
  }

  isActive(item: JumpMenuItems): boolean {
    return item === this.selectedMenuItem;
  }

  moveToAnchor(item: JumpMenuItems): void {
    if (this.object) {
      this.store.dispatch(new fromStore.UpdateJumpMenuSelectedItemInTab({id: this.object.id, jumpMenuSelectedItem: item}));
    }
  }

  getI18nResourceByString(value: string): string {
    return convertStringToI18nString(value);
  }
}
