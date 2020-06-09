import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { filter } from 'rxjs/operators';
import { Diagram } from '../../../models/diagram.model';
import { DiagramSidebarTabTypes, IGoJsDiagramNode } from '../../../models/goJsDiagram.model';
import * as fromModelerStore from '../../../store';
import { SetSelectedSidebarTabType } from '../../../store';
import { DiagramTabsContainerComponent } from '../diagram-tabs/diagram-tabs-container/diagram-tabs-container.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-diagram-sidebar',
  templateUrl: './diagram-sidebar.component.html',
  styleUrls: ['./diagram-sidebar.component.scss']
})
export class DiagramSideBarComponent implements OnInit, OnDestroy {
  @Input() diagram: Diagram;
  @Input() existingObjects: IGoJsDiagramNode[];
  @ViewChild('tabsDesktop', {static: true}) tabsContainerDesktop: DiagramTabsContainerComponent;
  @ViewChild('tabsMobile', {static: true}) tabsContainerMobile: DiagramTabsContainerComponent;
  @Output() toggle = new EventEmitter<any>()
  diagramTabTypes = DiagramSidebarTabTypes;
  selectedTabType: DiagramSidebarTabTypes;
  private _isReadOnly: boolean;

  @Input() set isReadOnly(value: boolean) {
    this._isReadOnly = value;
    if (this._isReadOnly && this.diagram) {
      this.closeOpenTab();
    }  
  }
  get isReadOnly(): boolean {
    return this._isReadOnly;
  }

  constructor(private modelerStore: Store<fromModelerStore.IDecisionFirstState>) {}

  ngOnInit() {
    this.modelerStore.pipe(
      untilDestroyed(this),
      filter(() => !!this.diagram),
      select((x) => fromModelerStore.getSelectedSidebarTabTypeActiveDiagram(this.diagram.id)(x)),
    ).subscribe((type) => this.selectedTabType = type);
  }

  onTabSelected(type: DiagramSidebarTabTypes): void {
    this.dispatchSetSelectedSidebarTabType(type);
    this.toggle.emit();
  }

  closeOpenTab(): void {
    this.dispatchSetSelectedSidebarTabType(null);
  }

  dispatchSetSelectedSidebarTabType(type: DiagramSidebarTabTypes) {
    this.modelerStore.dispatch(new SetSelectedSidebarTabType({id: this.diagram.id, selectedSidebarTabType: type}));
  }

  needDisplayToolsTab(type: DiagramSidebarTabTypes): boolean {
    return [
      DiagramSidebarTabTypes.Tools,
      DiagramSidebarTabTypes.Objects,
      DiagramSidebarTabTypes.Links,
      DiagramSidebarTabTypes.NewObjects,
    ]
      .some((item) => item === type);
  }

  ngOnDestroy() { }
}
