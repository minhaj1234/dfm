import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { combineLatest, of } from 'rxjs';
import { delay, filter, first } from 'rxjs/operators';
import { Decision } from '../../models/decision.model';
import { Diagram } from '../../models/diagram.model';
import { DfmObjects, ObjectClassNames } from '../../models/objects.model';
import * as fromModelerStore from '../../store';
import { GET_OBJECT_FROM_SEARCH_OBJECT_LIST_SELECTOR_MAPPING, GET_OBJECT_SELECTOR_MAPPING, LOAD_OBJECT_ACTION_MAPPING } from '../../store/mappings';
import { GET_OBJECT_BY_TYPE, REMOVE_PREVIEW_OBJECT_ACTION_MAPPING } from './preview-container.const';

export const LOAD_OBJECT_DELAY = 700;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-preview-container',
  templateUrl: './preview-container.component.html',
  styleUrls: ['./preview-container.component.scss']
})
export class PreviewContainerComponent implements OnInit, OnDestroy {
  previewObject: DfmObjects;
  private needOpenPreview = false;
  private needDeleteObjectFromLocalMemory = false;
  @Input() to: DfmObjects;
  @ViewChild('previewPopover', {static: true}) previewPopover: NgbPopover;
  
  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
  ) { }

  ngOnInit() {
    this.subscribeGetObject();
  }

  onMouseEnter(): void {
    this.needOpenPreview = true;
    this.subscribeLoadObject();
  }

  onMouseLeave(): void {
    this.needOpenPreview = false;
    this.removePreviewObject();
    this.previewPopover.close();
  }

  subscribeLoadObject(): void {
    combineLatest([
      of({}).pipe(delay(LOAD_OBJECT_DELAY)),
      this.modelerStore.pipe(select(GET_OBJECT_SELECTOR_MAPPING[this.to.className](this.to.id))),
      this.modelerStore.pipe(select(GET_OBJECT_FROM_SEARCH_OBJECT_LIST_SELECTOR_MAPPING[this.to.className](this.to.id))),
      this.modelerStore.pipe(select(fromModelerStore.getSelectedItemFromAutocompleteSearchList(this.to.id))),
    ]).pipe(
      first(),
      filter(() => this.needOpenPreview),
    )
    .subscribe(([emptyEvent, object, objectFromObjectsList, objectFromAutocompleteList ]: [any, DfmObjects, DfmObjects, DfmObjects]) => {
      this.previewObject = GET_OBJECT_BY_TYPE[this.to.className](object, objectFromObjectsList, objectFromAutocompleteList);
      
      if(this.previewObject) {
        this.openPreview();
      } else {
        this.needDeleteObjectFromLocalMemory = true;
        this.modelerStore.dispatch(LOAD_OBJECT_ACTION_MAPPING[this.to.className](this.to.id));
      }
    });
  }

  removePreviewObject(): void {
    if (this.previewObject && this.needDeleteObjectFromLocalMemory) {
      this.needDeleteObjectFromLocalMemory = false;
      this.modelerStore.dispatch(REMOVE_PREVIEW_OBJECT_ACTION_MAPPING[this.to.className](this.to.id))
    }
  }

  subscribeGetObject(): void {
    combineLatest([
      this.modelerStore.pipe(select(GET_OBJECT_SELECTOR_MAPPING[this.to.className](this.to.id))),
      this.modelerStore.pipe(select(GET_OBJECT_FROM_SEARCH_OBJECT_LIST_SELECTOR_MAPPING[this.to.className](this.to.id))),
      this.modelerStore.pipe(select(fromModelerStore.getSelectedItemFromAutocompleteSearchList(this.to.id))),
    ])
    .pipe(untilDestroyed(this))
    .subscribe(([object, objectFromObjectsList, objectFromAutocompleteList]: [DfmObjects, DfmObjects, DfmObjects]) => {
      this.previewObject = GET_OBJECT_BY_TYPE[this.to.className](object, objectFromObjectsList, objectFromAutocompleteList);

      if (this.previewObject && this.needOpenPreview) {
        this.openPreview()
      }

      if (!this.needOpenPreview && this.needDeleteObjectFromLocalMemory) {
        this.removePreviewObject();
      }
    });
  }

  openPreview(): void {
    if (this.doDisplayPreview()) {
      this.previewPopover.open();
    }
  }
  
  isDiagramPreview(): boolean {
    return this.to && this.to.className === ObjectClassNames.Diagram;
  }

  doDisplayPreview(): boolean {
    if (this.to.className === ObjectClassNames.Decision) {
      return this.doDisplayDecisionPreview(this.previewObject as Decision);
    } else if (this.to.className === ObjectClassNames.Diagram) {
      return this.doDisplayDiagramPreview(this.previewObject as Diagram);
    } else {
      return !!this.previewObject.description;
    }
  }

  doDisplayDecisionPreview(decision: Decision): boolean {
    return !!decision.question || !!decision.description;
  }

  doDisplayDiagramPreview(diagram: Diagram): boolean {
    return !!diagram.goNodes && Object.keys(JSON.parse(diagram.goNodes)).length > 0;
  }

  ngOnDestroy() {
    this.needOpenPreview = false;
   }
}
