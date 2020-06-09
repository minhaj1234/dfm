import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { JumpMenuItems } from 'core/models';
import { rootReducers, rootSelectors } from 'core/root-store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IStateEditDecision } from '../../models/decision.model';
import * as fromModelerStore from '../../store';

@Component({
  selector: 'dfm-edit-decision-table-component-container',
  templateUrl: './edit-decision-table-component-container.component.html',
  styleUrls: ['./edit-decision-table-component-container.component.scss']
})
export class EditDecisionTableComponentContainerComponent implements OnInit, OnDestroy {
  fromModelerStore = fromModelerStore;
  @Input() decisionId: string;
  state$: Observable<IStateEditDecision>;
  private decisionTableExpanded = true;

  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
    private rootStore: Store<rootReducers.IState>,
  ) { }

  ngOnInit() {
    this.modelerStore.dispatch(new fromModelerStore.LoadDecision(this.decisionId));
    this.getStateForDecision();
  }

  getStateForDecision(): void {
    this.state$ = combineLatest([
      this.modelerStore.pipe(select(fromModelerStore.getSelectedDecision(this.decisionId))),
      this.rootStore.pipe(select(rootSelectors.getIsReadOnlySession)),
      this.modelerStore.pipe(select(rootSelectors.getAuthenticatedUser)),
    ]).pipe(
      map(([decision, isReadOnlySession, authenticatedUser]) => {
        return { decision, isReadOnlySession, authenticatedUser }
      })
    );
  }

  expandDecisionTable(): void {
    this.decisionTableExpanded = !this.decisionTableExpanded;
    setTimeout(() => {
      this.modelerStore.dispatch(new fromModelerStore.UpdateJumpMenuSelectedItemInTab({ id: this.decisionId, jumpMenuSelectedItem: JumpMenuItems.Implementation }));
    });
  }

  ngOnDestroy() {
    this.modelerStore.dispatch(new fromModelerStore.RemoveDecisionFromLocalMemory(this.decisionId));
  }
}