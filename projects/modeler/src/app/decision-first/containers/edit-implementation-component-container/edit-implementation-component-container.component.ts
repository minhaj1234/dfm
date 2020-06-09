import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { JumpMenuItems } from 'core/models';
import { rootReducers, rootSelectors } from 'core/root-store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IStateEditImplementationComponent } from '../../models/implementationComponent.model';
import * as fromModelerStore from '../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-edit-implementation-component-container',
  styleUrls: ['./edit-implementation-component-container.component.scss'],
  templateUrl: './edit-implementation-component-container.component.html',
})
export class EditImplementationComponentContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  fromModelerStore = fromModelerStore;
  @Input() implementationComponentId: string;
  state$: Observable<IStateEditImplementationComponent>;
  anchors: Record<string, ElementRef> = {};
  @ViewChild('basicDetailsAnchor', { static: false }) basicDetailsAnchor: ElementRef;
  @ViewChild('commentsAnchor', { static: false }) commentsAnchor: ElementRef;
  
  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
    private rootStore: Store<rootReducers.IState>,
  ) { }

  ngOnInit() {
    this.modelerStore.dispatch(new fromModelerStore.LoadImplementationComponent(this.implementationComponentId));
    this.getStateForImplementationComponent();
  }

  getStateForImplementationComponent(): void {
    this.state$ = combineLatest([
      this.modelerStore.pipe(select(fromModelerStore.getSelectedImplementationComponent(this.implementationComponentId))),
      this.rootStore.pipe(select(rootSelectors.getIsReadOnlySession)),
      this.modelerStore.pipe(select(rootSelectors.getAuthenticatedUser)),
    ]).pipe(
      map(([implementationComponent, isReadOnlySession, authenticatedUser]) => {
        return { implementationComponent, isReadOnlySession, authenticatedUser }
      })
    );
  }

  ngAfterViewInit() {
    this.setAnchors();
  }

  setAnchors(): void {
    this.anchors[JumpMenuItems.BasicDetails] = this.basicDetailsAnchor;
    this.anchors[JumpMenuItems.Comments] = this.commentsAnchor;
  }

  ngOnDestroy() {
    this.modelerStore.dispatch(new fromModelerStore.RemoveImplementationComponentFromLocalMemory(this.implementationComponentId));
  }
}
