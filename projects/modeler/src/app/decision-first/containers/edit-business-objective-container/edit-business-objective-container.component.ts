import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { JumpMenuItems } from 'core/models';
import { rootReducers, rootSelectors } from 'core/root-store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IStateEditBusinessObjective } from '../../models/businessObjective.model';
import * as fromModelerStore from '../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-edit-business-objective-container',
  styleUrls: ['./edit-business-objective-container.component.scss'],
  templateUrl: './edit-business-objective-container.component.html',
})
export class EditBusinessObjectiveContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  fromModelerStore = fromModelerStore;
  @Input() businessObjectiveId: string;
  state$: Observable<IStateEditBusinessObjective>;
  anchors: Record<string, ElementRef> = {};
  @ViewChild('basicDetailsAnchor', { static: false }) basicDetailsAnchor: ElementRef;
  @ViewChild('businessImpactAnchor', { static: false }) businessImpactAnchor: ElementRef;
  @ViewChild('commentsAnchor', { static: false }) commentsAnchor: ElementRef;
  
  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
    private rootStore: Store<rootReducers.IState>,
  ) { }

  ngOnInit() {
    this.modelerStore.dispatch(new fromModelerStore.LoadBusinessObjective(this.businessObjectiveId));
    this.getStateForBusinessObjective();
  }

  getStateForBusinessObjective(): void {
    this.state$ = combineLatest([
      this.modelerStore.pipe(select(fromModelerStore.getSelectedBusinessObjective(this.businessObjectiveId))),
      this.rootStore.pipe(select(rootSelectors.getIsReadOnlySession)),
      this.modelerStore.pipe(select(rootSelectors.getAuthenticatedUser)),
    ]).pipe(
      map(([businessObjective, isReadOnlySession, authenticatedUser]) => {
        return { businessObjective, isReadOnlySession, authenticatedUser }
      })
    );
  }

  ngAfterViewInit() {
    this.setAnchors();
  }

  setAnchors(): void {
    this.anchors[JumpMenuItems.BasicDetails] = this.basicDetailsAnchor;
    this.anchors[JumpMenuItems.BusinessImpact] = this.businessImpactAnchor;
    this.anchors[JumpMenuItems.Comments] = this.commentsAnchor;
  }

  ngOnDestroy() {
    this.modelerStore.dispatch(new fromModelerStore.RemoveBusinessObjectiveFromLocalMemory(this.businessObjectiveId));
  }
}
