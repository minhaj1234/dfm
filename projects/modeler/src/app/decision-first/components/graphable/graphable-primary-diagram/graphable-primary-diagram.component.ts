import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ObjectTabType } from 'core/models';
import { Diagram } from '../../../models/diagram.model';
import { Graphable } from '../../../models/graphable.model';
import * as fromStore from '../../../store';
import { IDecisionFirstState } from '../../../store';
import { UPDATE_GRAPHABLE_MAPPING } from './mappings';

@Component({
  selector: 'dfm-graphable-primary-diagram',
  templateUrl: './graphable-primary-diagram.component.html',
  styleUrls: ['./graphable-primary-diagram.component.scss'],
})
export class GraphablePrimaryDiagramComponent implements OnInit, OnDestroy {
  private _graphable: Graphable;
  @Input()
  set graphable(graphable: Graphable) {
    if (graphable) {
      this._graphable = graphable;
      this.primaryDiagramId = graphable.primaryDiagramId;
    }
  }
  get graphable(): Graphable {
    return this._graphable;
  }

  public primaryDiagramId: string;

  @Input() isReadOnly: boolean;

  get diagrams(): Diagram[] {
    return this.graphable ? this.graphable.diagrams : [];
  }

  constructor(private store: Store<IDecisionFirstState>) {}

  ngOnInit() {}

  onPrimaryDiagramSelected(value: string): void {
    this.primaryDiagramId = value;
    this.updateGraphable();
  }

  updateGraphable(): void {
    this.store.dispatch(
      UPDATE_GRAPHABLE_MAPPING[this.graphable.className]({
        primaryDiagramId: this.primaryDiagramId,
        _links: this.graphable._links,
        id: this.graphable.id,
      })
    );
  }

  isCanOpenPrimaryDiagram(): boolean {
    return this.graphable && this.graphable.diagrams.some((diagram) => diagram.id === this.primaryDiagramId);
  }

  openSelectedDiagram(): void {
    this.openTab(this.primaryDiagramId);
  }

  openTab(id: string): void {
    this.store.dispatch(
      new fromStore.AddTab({
        id,
        type: ObjectTabType.Diagram,
      }),
    );
  }

  ngOnDestroy() {}
}
