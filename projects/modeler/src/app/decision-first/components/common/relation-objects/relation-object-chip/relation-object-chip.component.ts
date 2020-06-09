import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ObjectTabType } from 'core/models';
import { rootActions } from 'core/root-store';
import { DfmObjects, ObjectRelationsNames } from '../../../../models/objects.model';
import * as fromStore from '../../../../store';
import { IDecisionFirstState } from '../../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-relation-object-chip',
  templateUrl: './relation-object-chip.component.html',
  styleUrls: ['./relation-object-chip.component.scss']
})
export class RelationObjectChipComponent {
  @Input() dfmObject: DfmObjects;
  @Input() removeAction: rootActions.RemoveRelatedObjectAction;
  @Input() isReadOnly: boolean;
  @Input() to: any;
  @Input() relationObjectsKey: ObjectRelationsNames;

  constructor(private store: Store<IDecisionFirstState>) { }

  openTab(dfmObject: DfmObjects): void {
    this.store.dispatch(
      new fromStore.AddTab({
        id: dfmObject.id,
        type: ObjectTabType[dfmObject.className],
      }),
    );
  }

  remove(dfmObject: DfmObjects): void {
    this.store.dispatch(new this.removeAction({
      sourceObject: this.to,
      relatedObject: dfmObject,
      relationPath: this.relationObjectsKey,
    }));
  }

  isCanRemove(): boolean {
    return this.removeAction && !this.isReadOnly;
  }
}
