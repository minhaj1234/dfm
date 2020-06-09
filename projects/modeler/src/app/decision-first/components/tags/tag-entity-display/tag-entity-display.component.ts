import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ObjectTabType } from 'core/models';
import { DfmObjects } from '../../../models/objects.model';
import * as fromModelerStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-tag-entity-display',
  templateUrl: './tag-entity-display.component.html',
  styleUrls: ['./tag-entity-display.component.scss']
})
export class TagEntityDisplayComponent {
  @Input() entity: DfmObjects;

  constructor(
    private store: Store<fromModelerStore.IDecisionFirstState>,
  ) { }

  onOpenObjectTabClicked(): void {
    this.openTab();
  }
  
  openTab(): void {
    this.store.dispatch(new fromModelerStore.AddTab({id: this.entity.id, type: ObjectTabType[this.entity.className]}));
  }
}
