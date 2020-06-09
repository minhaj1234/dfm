import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ImplementationComponentIcon } from 'core/objects/implementation-component/models';
import { rootReducers, rootSelectors } from 'core/root-store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';
import { Diagram, IStateViewDiagram } from '../../models/diagram.model';
import { ImplementationComponent } from '../../models/implementationComponent.model';
import * as fromModelerStore from '../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-view-diagram-container',
  styleUrls: ['./view-diagram-container.component.scss'],
  templateUrl: './view-diagram-container.component.html',
})
export class ViewDiagramContainerComponent implements OnInit, OnDestroy {
  state$: Observable<IStateViewDiagram>;
  resizingDiagram = new Subject<any>();
  @Input() diagramId: string;

  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
    private rootStore: Store<rootReducers.IState>,
  ) { }

  ngOnInit() {
    this.setStateViewDiagram();

    this.modelerStore.dispatch(new fromModelerStore.LoadDiagram(this.diagramId));
    this.modelerStore.dispatch(new fromModelerStore.UpdateSearchForDiagrammingElements({ searchTerm: '' }));
    this.modelerStore.dispatch(new fromModelerStore.AddActiveDiagram({ 
      id: this.diagramId, 
      selectedDiagramObjects: [], 
      linkType: null, 
      selectedSidebarTabType: null,
      diagramImage: null, 
    }));
  }

  setStateViewDiagram(): void {
    this.state$ = combineLatest([
      this.modelerStore.pipe(select(fromModelerStore.getSelectedDiagram(this.diagramId))),
      this.modelerStore.pipe(select(fromModelerStore.getPaletteList)),
      this.modelerStore.pipe(select(fromModelerStore.getSelectedDiagramObjectsActiveDiagram(this.diagramId))),
      this.rootStore.pipe(select(rootSelectors.getIsReadOnlySession)),
      this.rootStore.pipe(select(fromModelerStore.getImplementationComponentsIconsAsArray)),
    ]).pipe(
      tap(([diagram, paletteList, selectedDiagramObjects, isReadOnlySession, icons]) => {
        if (diagram) {
          this.loadMissingImplementationComponentsIcons(diagram, icons);
        }
      }),
      map(([diagram, paletteList, selectedDiagramObjects, isReadOnlySession, icons]) => {
        return { diagram, paletteList, selectedDiagramObjects, isReadOnlySession, icons }
      }),
      debounceTime(0),
    );
  }

  resizeDiagram(): void {
    this.resizingDiagram.next();
  }

  loadMissingImplementationComponentsIcons(diagram: Diagram, icons: ImplementationComponentIcon[]): void {
    [].concat(
      ...diagram.decisions.map((decisions) => decisions.implementationComponents)
    )
      .filter((implementationComponent: ImplementationComponent) => !icons.some((icon) => icon.id === implementationComponent.iconId))
      .forEach((implementationComponent: ImplementationComponent) => {
        this.modelerStore.dispatch(new fromModelerStore.LoadImplementationComponentsIcon(implementationComponent.iconId));
      })
  }

  ngOnDestroy() {
    this.modelerStore.dispatch(new fromModelerStore.RemoveDiagramFromLocalMemory(this.diagramId));
    this.modelerStore.dispatch(new fromModelerStore.RemoveActiveDiagram(this.diagramId));
  }
}
