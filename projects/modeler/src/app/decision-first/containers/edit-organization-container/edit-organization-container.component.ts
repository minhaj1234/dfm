import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { JumpMenuItems } from 'core/models';
import { rootReducers, rootSelectors } from 'core/root-store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IStateEditOrganization, Organization } from '../../models/organization.model';
import * as fromModelerStore from '../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-edit-organization-container',
  styleUrls: ['./edit-organization-container.component.scss'],
  templateUrl: './edit-organization-container.component.html',
})
export class EditOrganizationContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  fromModelerStore = fromModelerStore;
  @Input() organizationId: string;
  state$: Observable<IStateEditOrganization>;
  organizations$: Observable<Organization[]>;
  anchors: Record<string, ElementRef> = {};
  @ViewChild('basicDetailsAnchor', { static: false }) basicDetailsAnchor: ElementRef;
  @ViewChild('decisionsInvolvedAnchor', { static: false }) decisionsInvolvedAnchor: ElementRef;
  @ViewChild('organizationStructureAnchor', { static: false }) organizationStructureAnchor: ElementRef;
  @ViewChild('ownsAnchor', { static: false }) ownsAnchor: ElementRef;
  @ViewChild('objectivesInvolvedAnchor', { static: false }) objectivesInvolvedAnchor: ElementRef;
  @ViewChild('commentsAnchor', { static: false }) commentsAnchor: ElementRef;
  
  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
    private rootStore: Store<rootReducers.IState>,
  ) { }

  ngOnInit() {
    this.modelerStore.dispatch(new fromModelerStore.LoadOrganization(this.organizationId));
    this.getStateForOrganization();
  }

  getStateForOrganization(): void {
    this.state$ = combineLatest([
      this.modelerStore.pipe(select(fromModelerStore.getSelectedOrganization(this.organizationId))),
      this.rootStore.pipe(select(rootSelectors.getIsReadOnlySession)),
      this.modelerStore.pipe(select(rootSelectors.getAuthenticatedUser)),
    ]).pipe(
      map(([organization, isReadOnlySession, authenticatedUser]) => {
        return { organization, isReadOnlySession, authenticatedUser }
      }),
    );
  }

  ngAfterViewInit() {
    this.setAnchors();
  }

  setAnchors(): void {
    this.anchors[JumpMenuItems.BasicDetails] = this.basicDetailsAnchor;
    this.anchors[JumpMenuItems.DecisionsInvolved] = this.decisionsInvolvedAnchor;
    this.anchors[JumpMenuItems.OrganizationStructure] = this.organizationStructureAnchor;
    this.anchors[JumpMenuItems.Owns] = this.ownsAnchor;
    this.anchors[JumpMenuItems.ObjectivesInvolved] = this.objectivesInvolvedAnchor;
    this.anchors[JumpMenuItems.Comments] = this.commentsAnchor;
  }

  ngOnDestroy() {
    this.modelerStore.dispatch(new fromModelerStore.RemoveOrganizationFromLocalMemory(this.organizationId));
  }
}
