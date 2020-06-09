import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { combineLatest, of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ObjectClassNames } from '../../models/objects.model';
import * as fromModelerStore from '../../store';
import { getDiagramImageActiveDiagram } from '../../store';
import { GET_OBJECTS_SELECTOR_MAPPING, IPrintedObjectState, PRINT_SECTION_PREFIX } from './print-container.const';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-print-container',
  styleUrls: ['./print-container.component.scss'],
  templateUrl: './print-container.component.html',
})
export class PrintContainerComponent implements OnInit, OnDestroy {
  state$: Observable<IPrintedObjectState>;
  includeRelatedObjects: boolean;
  includeComments: boolean;
  @Input() customerFooter: string;
  @Input() objectId: string;
  @Input() objectType: string;

  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
  ) { }

  ngOnInit() { 
    this.getStatePrintedObject();
  }

  getPrintSectionId(): string {
    return `${PRINT_SECTION_PREFIX}${this.objectId}`;
  }

  onIncludeRelatedObjectsClick(value: boolean): void {
    this.includeRelatedObjects = value;
  }

  onIncludeCommentsClick(value: boolean): void {
    this.includeComments = value;
  }

  getStatePrintedObject(): void {
    this.state$ = combineLatest([
      this.modelerStore.pipe(select(GET_OBJECTS_SELECTOR_MAPPING[this.objectType](this.objectId))),
      this.isDiagram() 
        ? this.modelerStore.pipe(select(getDiagramImageActiveDiagram(this.objectId)))
        : of(null),
    ]).pipe(
      map(([object, diagramImage]) => {
        return { object, diagramImage }
      })
    );
  }

  isDiagram(): boolean {
    return this.objectType === ObjectClassNames.Diagram;
  }

  ngOnDestroy() {
  }
}
