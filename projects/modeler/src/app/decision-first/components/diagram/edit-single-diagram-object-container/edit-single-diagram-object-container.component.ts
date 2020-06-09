import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Diagram } from '../../../models/diagram.model';
import { IGoJsDiagramNode } from '../../../models/goJsDiagram.model';
import * as fromStore from '../../../store';
import * as fromSelectors from '../../../store/selectors';
import { isDecision, isGraphable, isSketch } from '../../../utilitites/goJsHelpers';
import { IEditSingleDiagramObjectState } from './edit-single-diagram-object-container.const';

@Component({
  selector: 'dfm-edit-single-diagram-object-container',
  templateUrl: './edit-single-diagram-object-container.component.html',
  styleUrls: ['./edit-single-diagram-object-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditSingleDiagramObjectContainerComponent {
  state$: Observable<IEditSingleDiagramObjectState>;
  @Input() selectedObject: IGoJsDiagramNode;
  @Input() diagram: Diagram;
  @Input() isReadOnly: boolean;

  get objectName(): string {
    return isGraphable(this.selectedObject) ? this.selectedObject.data.name : '';
  }

  constructor(private modelerStore: Store<fromStore.IDecisionFirstState>) {
    this.state$ = combineLatest([
      this.modelerStore.pipe(select(fromSelectors.getImplementationComponentsIconsAsArray)),
    ]).pipe(
      map(([icons]) => {
        return { icons }
      })
    );
  }

  checkIsGraphable(selectedSingleObject: IGoJsDiagramNode): boolean {
    return isGraphable(selectedSingleObject);
  }

  checkIsSketch(selectedSingleObject: IGoJsDiagramNode): boolean {
    return isSketch(selectedSingleObject);
  }

  checkIsDecision(selectedSingleObject: IGoJsDiagramNode): boolean {
    return selectedSingleObject.data && isDecision(selectedSingleObject.data);
  }

  closeEditorContainer(): void {
    if (this.diagram) {
      this.modelerStore.dispatch(
        new fromStore.SetSelectedDiagramObjectsActiveDiagram({
          id: this.diagram.id,
          selectedDiagramObjects: []
        }),
      );
    }
  }
}
