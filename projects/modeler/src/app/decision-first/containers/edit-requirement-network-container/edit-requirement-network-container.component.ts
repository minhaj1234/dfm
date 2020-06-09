import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { rootReducers, rootSelectors } from 'core/root-store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromModelerStore from '../../store';

@Component({
  selector: 'dfm-edit-requirement-network-container',
  templateUrl: './edit-requirement-network-container.component.html',
  styleUrls: ['./edit-requirement-network-container.component.scss']
})
export class EditRequirementNetworkContainerComponent implements OnInit, OnDestroy {

  state$: Observable<any>;
  @Input() objectId: string;
  @Input() objectType: string;


  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
    private rootStore: Store<rootReducers.IState>,
  ) { }

  ngOnInit() {
    if (this.objectType === "Decision") {
      this.modelerStore.dispatch(new fromModelerStore.LoadDecision(this.objectId));
      this.getStateForDecision();
    } else if (this.objectType === "InputData") {
      this.modelerStore.dispatch(new fromModelerStore.LoadInputData(this.objectId));
      this.getStateForInputData();
    } else if (this.objectType === "KnowledgeSource") {
      this.modelerStore.dispatch(new fromModelerStore.LoadKnowledgeSource(this.objectId));
      this.getStateForKnowledgeSource();
    }


  }

  getStateForDecision(): void {
    this.state$ = combineLatest([
      this.modelerStore.pipe(select(fromModelerStore.getSelectedDecision(this.objectId))),
      this.rootStore.pipe(select(rootSelectors.getIsReadOnlySession)),
      this.modelerStore.pipe(select(rootSelectors.getAuthenticatedUser)),
    ]).pipe(
      map(([decision, isReadOnlySession, authenticatedUser]) => {
        return { decision, isReadOnlySession, authenticatedUser }
      })
    );
  }

  getStateForInputData(): void {
    this.state$ = combineLatest([
      this.modelerStore.pipe(select(fromModelerStore.getSelectedInputData(this.objectId))),
      this.rootStore.pipe(select(rootSelectors.getIsReadOnlySession)),
      this.modelerStore.pipe(select(rootSelectors.getAuthenticatedUser)),
    ]).pipe(
      map(([decision, isReadOnlySession, authenticatedUser]) => {
        return { decision, isReadOnlySession, authenticatedUser }
      })
    );
  }

  getStateForKnowledgeSource(): void {
    this.state$ = combineLatest([
      this.modelerStore.pipe(select(fromModelerStore.getSelectedKnowledgeSource(this.objectId))),
      this.rootStore.pipe(select(rootSelectors.getIsReadOnlySession)),
      this.modelerStore.pipe(select(rootSelectors.getAuthenticatedUser)),
    ]).pipe(
      map(([decision, isReadOnlySession, authenticatedUser]) => {
        return { decision, isReadOnlySession, authenticatedUser }
      })
    );
  }

  ngOnDestroy() {

    if (this.objectType === "Decision") {
      this.modelerStore.dispatch(new fromModelerStore.RemoveDecisionFromLocalMemory(this.objectId));
    } else if (this.objectType === "InputData") {
      this.modelerStore.dispatch(new fromModelerStore.RemoveInputDataFromLocalMemory(this.objectId));
    } else if (this.objectType === "KnowledgeSource") {
      this.modelerStore.dispatch(new fromModelerStore.RemoveKnowledgeSourceFromLocalMemory(this.objectId));
    }
  }

}
