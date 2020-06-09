import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { JumpMenuItems } from 'core/models';
import { rootReducers, rootSelectors } from 'core/root-store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IStateEditDecision } from '../../models/decision.model';
import * as fromModelerStore from '../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-edit-decision-container',
  styleUrls: ['./edit-decision-container.component.scss'],
  templateUrl: './edit-decision-container.component.html',
})
export class EditDecisionContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  fromModelerStore = fromModelerStore;
  @Input() decisionId: string;
  @Input() expanded: string;
  state$: Observable<IStateEditDecision>;
  private _decisionTableExpanded = false;
  private showBasicDetails: boolean = true;
  private showQA: boolean = false;
  private showDependencies: boolean = true;
  private showImplementation: boolean = true;
  private showQC: boolean = false;
  private showAC: boolean = false;
  private showComments: boolean = false;
  private _requirementNetworkExpanded = false;
  jumpMenuItems = JumpMenuItems;
  anchors: Record<string, ElementRef> = {};
  @ViewChild('editDecisionTabContainer', { static: false }) tabContainer: ElementRef;
  @ViewChild('basicDetailsAnchor', { static: false }) basicDetailsAnchor: ElementRef;
  @ViewChild('requirementsAnchor', { static: false }) requirementsAnchor: ElementRef;
  @ViewChild('questionAndAnswersAnchor', { static: false }) questionAndAnswersAnchor: ElementRef;
  @ViewChild('implementationAnchor', { static: false }) implementationAnchor: ElementRef;
  @ViewChild('applicationContext', { static: false }) applicationContext: ElementRef;
  @ViewChild('organizationContext', { static: false }) organizationContext: ElementRef;
  @ViewChild('commentsAnchor', { static: false }) commentsAnchor: ElementRef;

  get decisionTableExpanded(): boolean {
    return this._decisionTableExpanded;
  }

  set decisionTableExpanded(value: boolean) {
    this._decisionTableExpanded = value;
  }

  get requirementNetworkExpanded(): boolean {
    return this._requirementNetworkExpanded;
  }

  set requirementNetworkExpanded(value: boolean) {
    this._requirementNetworkExpanded = value;
  }

  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
    private rootStore: Store<rootReducers.IState>,
  ) { }

  ngOnInit() {
    this.modelerStore.dispatch(new fromModelerStore.LoadDecision(this.decisionId));
    this.getStateForDecision();
    this.checkIfExpanded(this.expanded);
  }

  checkIfExpanded(expanded) {
    if (expanded === 'Implementation') {
      this._decisionTableExpanded = true
    } else if (expanded === 'Dependencies') {
      this._requirementNetworkExpanded = true
    }
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

  ngAfterViewInit() {
    this.setAnchors();
  }

  setAnchors(): void {
    this.anchors[JumpMenuItems.BasicDetails] = this.basicDetailsAnchor;
    this.anchors[JumpMenuItems.QuestionAndAnswers] = this.questionAndAnswersAnchor;
    this.anchors[JumpMenuItems.Requirements] = this.requirementsAnchor;
    this.anchors[JumpMenuItems.Implementation] = this.implementationAnchor;
    this.anchors[JumpMenuItems.OrganizationContext] = this.organizationContext;
    this.anchors[JumpMenuItems.ApplicationContext] = this.applicationContext;
    this.anchors[JumpMenuItems.Comments] = this.commentsAnchor;
  }

  expandDecisionTable(): void {
    this.decisionTableExpanded = !this.decisionTableExpanded;
    setTimeout(() => {
      this.modelerStore.dispatch(new fromModelerStore.UpdateJumpMenuSelectedItemInTab({ id: this.decisionId, jumpMenuSelectedItem: JumpMenuItems.Implementation }));
    });
  }

  expandRequirementNetwork(): void {
    this.requirementNetworkExpanded = !this.requirementNetworkExpanded;
    setTimeout(() => {
      this.modelerStore.dispatch(new fromModelerStore.UpdateJumpMenuSelectedItemInTab({ id: this.decisionId, jumpMenuSelectedItem: JumpMenuItems.Requirements }));
    });
  }

  onClickShowBasicDetails() {
    this.showBasicDetails = !this.showBasicDetails
  }

  onClickShowQA() {
    this.showQA = !this.showQA
  }

  onClickShowDependencies() {
    this.showDependencies = !this.showDependencies
  }

  onClickShowImplementation() {
    this.showImplementation = !this.showImplementation
  }

  onClickShowQC() {
    this.showQC = !this.showQC
  }

  onClickShowAC() {
    this.showAC = !this.showAC
  }

  onClickShowComments() {
    this.showComments = !this.showComments
  }

  ngOnDestroy() {
    this.modelerStore.dispatch(new fromModelerStore.RemoveDecisionFromLocalMemory(this.decisionId));
  }
}
