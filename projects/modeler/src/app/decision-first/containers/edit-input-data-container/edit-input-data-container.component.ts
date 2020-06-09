import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { JumpMenuItems } from 'core/models';
import { rootReducers, rootSelectors } from 'core/root-store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IStateEditInputData } from '../../models/inputData.model';
import * as fromModelerStore from '../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-edit-input-data-container',
  styleUrls: ['./edit-input-data-container.component.scss'],
  templateUrl: './edit-input-data-container.component.html',
})
export class EditInputDataContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  fromModelerStore = fromModelerStore;
  @Input() inputDataId: string;
  @Input() expanded: string;
  state$: Observable<IStateEditInputData>;
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
    this.modelerStore.dispatch(new fromModelerStore.LoadInputData(this.inputDataId));
    this.getStateForInputData();
    this.checkIfExpanded(this.expanded);
  }

  getStateForInputData(): void {
    this.state$ = combineLatest([
      this.modelerStore.pipe(select(fromModelerStore.getSelectedInputData(this.inputDataId))),
      this.rootStore.pipe(select(rootSelectors.getIsReadOnlySession)),
      this.modelerStore.pipe(select(rootSelectors.getAuthenticatedUser)),
    ]).pipe(
      map(([inputData, isReadOnlySession, authenticatedUser]) => {
        return { inputData, isReadOnlySession, authenticatedUser }
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
      this.modelerStore.dispatch(new fromModelerStore.UpdateJumpMenuSelectedItemInTab({ id: this.inputDataId, jumpMenuSelectedItem: JumpMenuItems.Requirements }));
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
    this.modelerStore.dispatch(new fromModelerStore.RemoveInputDataFromLocalMemory(this.inputDataId));
  }
}
