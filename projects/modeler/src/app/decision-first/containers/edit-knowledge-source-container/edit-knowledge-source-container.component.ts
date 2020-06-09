import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { JumpMenuItems } from 'core/models';
import { rootReducers, rootSelectors } from 'core/root-store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IStateEditKnowledgeSource } from '../../models/knowledgeSource.model';
import * as fromModelerStore from '../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-edit-knowledge-source-container',
  styleUrls: ['./edit-knowledge-source-container.component.scss'],
  templateUrl: './edit-knowledge-source-container.component.html',
})
export class EditKnowledgeSourceContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  fromModelerStore = fromModelerStore;
  @Input() knowledgeSourceId: string;
  @Input() expanded: string;
  state$: Observable<IStateEditKnowledgeSource>;
  anchors: Record<string, ElementRef> = {};
  @ViewChild('basicDetailsAnchor', { static: false }) basicDetailsAnchor: ElementRef;
  @ViewChild('requirementAnchor', { static: false }) requirementAnchor: ElementRef;
  @ViewChild('commentsAnchor', { static: false }) commentsAnchor: ElementRef;
  private _requirementNetworkExpanded = false;
  private showBasicDetails: boolean = true;
  private showDependencies: boolean = true;
  private showComments: boolean = false;

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

  checkIfExpanded(expanded) {
    if (expanded === 'Dependencies') {
      this._requirementNetworkExpanded = true
    }
  }

  ngOnInit() {
    this.modelerStore.dispatch(new fromModelerStore.LoadKnowledgeSource(this.knowledgeSourceId));
    this.getStateForKnowledgeSource();
    this.checkIfExpanded(this.expanded);
  }

  getStateForKnowledgeSource(): void {
    this.state$ = combineLatest([
      this.modelerStore.pipe(select(fromModelerStore.getSelectedKnowledgeSource(this.knowledgeSourceId))),
      this.rootStore.pipe(select(rootSelectors.getIsReadOnlySession)),
      this.modelerStore.pipe(select(rootSelectors.getAuthenticatedUser)),
    ]).pipe(
      map(([knowledgeSource, isReadOnlySession, authenticatedUser]) => {
        return { knowledgeSource, isReadOnlySession, authenticatedUser }
      })
    );
  }

  ngAfterViewInit() {
    this.setAnchors();
  }

  setAnchors(): void {
    this.anchors[JumpMenuItems.BasicDetails] = this.basicDetailsAnchor;
    this.anchors[JumpMenuItems.Requirements] = this.requirementAnchor;
    this.anchors[JumpMenuItems.Comments] = this.commentsAnchor;
  }

  expandRequirementNetwork(): void {
    this.requirementNetworkExpanded = !this.requirementNetworkExpanded;
    setTimeout(() => {
      this.modelerStore.dispatch(new fromModelerStore.UpdateJumpMenuSelectedItemInTab({ id: this.knowledgeSourceId, jumpMenuSelectedItem: JumpMenuItems.Requirements }));
    });
  }

  onClickShowBasicDetails() {
    this.showBasicDetails = !this.showBasicDetails
  }

  onClickShowDependencies() {
    this.showDependencies = !this.showDependencies
  }

  onClickShowComments() {
    this.showComments = !this.showComments
  }

  ngOnDestroy() {
    this.modelerStore.dispatch(new fromModelerStore.RemoveKnowledgeSourceFromLocalMemory(this.knowledgeSourceId));
  }
}
