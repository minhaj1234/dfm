import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ObjectTabType } from 'core/models';
import { IGoJsDiagramNode } from '../../../models/goJsDiagram.model';
import { Graphable } from '../../../models/graphable.model';
import * as fromStore from '../../../store';
import { IDecisionFirstState } from '../../../store';
import { isGraphable, isSketch } from '../../../utilitites/goJsHelpers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-info-single-diagram-object',
  templateUrl: './info-single-diagram-object.component.html',
  styleUrls: ['./info-single-diagram-object.component.scss']
})
export class InfoSingleDiagramObjectComponent {
  @Input() selectedObject: IGoJsDiagramNode;
  isGraphable = isGraphable;

  get selectedGraphable(): Graphable {
    return this.selectedObject.data;
  }

  get name(): string {
    return isGraphable(this.selectedObject) ? this.selectedGraphable.name : '';
  }

  get description(): string {
   if(isGraphable(this.selectedObject)){
    return this.selectedGraphable.description;
   }
   else if(isSketch(this.selectedObject)) {
    return this.selectedObject.text;
   }
  }

  constructor(private store: Store<IDecisionFirstState>) {}

  openTab(): void {
    this.store.dispatch(
      new fromStore.AddTab({
        id: this.selectedGraphable.id,
        type: ObjectTabType[this.selectedGraphable.className],
      }),
    );
  }
}
