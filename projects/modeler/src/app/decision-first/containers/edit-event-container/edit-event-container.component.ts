import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { JumpMenuItems } from 'core/models';
import { rootReducers, rootSelectors } from 'core/root-store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IStateEditEvent } from '../../models/events.model';
import * as fromModelerStore from '../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-edit-event-container',
  styleUrls: ['./edit-event-container.component.scss'],
  templateUrl: './edit-event-container.component.html',
})
export class EditEventContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  fromModelerStore = fromModelerStore;
  @Input() eventId: string;
  state$: Observable<IStateEditEvent>;
  anchors: Record<string, ElementRef> = {};
  @ViewChild('basicDetailsAnchor', { static: false }) basicDetailsAnchor: ElementRef;
  @ViewChild('decisionsAnchor', { static: false }) decisionsAnchor: ElementRef;
  @ViewChild('commentsAnchor', { static: false }) commentsAnchor: ElementRef;
  
  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
    private rootStore: Store<rootReducers.IState>,
  ) { }

  ngOnInit() {
    this.modelerStore.dispatch(new fromModelerStore.LoadEvent(this.eventId));
    this.getStateForEvent();
  }

  getStateForEvent(): void {
    this.state$ = combineLatest([
      this.modelerStore.pipe(select(fromModelerStore.getSelectedEvent(this.eventId))),
      this.rootStore.pipe(select(rootSelectors.getIsReadOnlySession)),
      this.modelerStore.pipe(select(rootSelectors.getAuthenticatedUser)),
    ]).pipe(
      map(([event, isReadOnlySession, authenticatedUser]) => {
        return { event, isReadOnlySession, authenticatedUser }
      })
    );
  }

  ngAfterViewInit() {
    this.setAnchors();
  }

  setAnchors(): void {
    this.anchors[JumpMenuItems.BasicDetails] = this.basicDetailsAnchor;
    this.anchors[JumpMenuItems.Decisions] = this.decisionsAnchor;
    this.anchors[JumpMenuItems.Comments] = this.commentsAnchor;
  }

  ngOnDestroy() {
    this.modelerStore.dispatch(new fromModelerStore.RemoveEventFromLocalMemory(this.eventId));
  }
}
