import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TechnicalTabType } from 'core/models';
import { ImplementationComponentIconsStompService } from 'core/objects/implementation-component/stomp-services';
import { AuthStompService } from 'core/stomp-services';
import {
  BusinessObjectiveStompService,
  CommonStompService,
  DecisionStompService,
  DiagramStompService,
  EventStompService,
  ImplementationComponentStompService,
  InputDataStompService,
  KnowledgeSourceStompService,
  ModelerCustomerStompService,
  ModelerGroupStompService,
  ModelerUserStompService,
  OrganizationStompService,
  ProcessStompService,
  SystemStompService,
  TagStompService,
} from '../../stompServices';
import * as fromModelerStore from '../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    AuthStompService,
    DiagramStompService,
    DecisionStompService,
    InputDataStompService,
    KnowledgeSourceStompService,
    OrganizationStompService,
    BusinessObjectiveStompService,
    ProcessStompService,
    EventStompService,
    SystemStompService,
    ImplementationComponentStompService,
    TagStompService,
    ModelerCustomerStompService,
    ModelerUserStompService,
    ModelerGroupStompService,
    ImplementationComponentIconsStompService,
    CommonStompService,
  ],
  selector: 'dfm-main-container',
  styleUrls: ['./main-container.component.scss'],
  templateUrl: './main-container.component.html',
})
export class MainContainerComponent implements OnInit {
  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
    // Don't delete, these need to run in the background
    private diagramStompService: DiagramStompService,
    private decisionStompService: DecisionStompService,
    private inputDataStompService: InputDataStompService,
    private knowledgeSourceStompService: KnowledgeSourceStompService,
    private organizationStompService: OrganizationStompService,
    private businessObjectiveStompService: BusinessObjectiveStompService,
    private processStompService: ProcessStompService,
    private eventStompService: EventStompService,
    private systemStompService: SystemStompService,
    private implementationComponentStompService: ImplementationComponentStompService,
    private tagStompService: TagStompService,
    private groupStompService: ModelerGroupStompService,
    private customerStompService: ModelerCustomerStompService,
    private userStompService: ModelerUserStompService,
    private implementationComponentIconsStompService: ImplementationComponentIconsStompService,
    private commonStompService: CommonStompService,
  ) { }

  ngOnInit() {
    this.modelerStore.dispatch(new fromModelerStore.LoadHomeSearchList());

    this.modelerStore.dispatch(
      new fromModelerStore.AddTab({
        type: TechnicalTabType.Home,
      }),
    );
  }
}
