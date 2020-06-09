import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SidebarPanel } from 'core/objects/sidebar/models';
import { rootReducers, rootSelectors } from 'core/root-store';
import { Observable } from 'rxjs';
import { BusinessObjective } from '../../../models/businessObjective.model';
import { Decision } from '../../../models/decision.model';
import { Diagram } from '../../../models/diagram.model';
import { Event } from '../../../models/events.model';
import { ImplementationComponent } from '../../../models/implementationComponent.model';
import { InputData } from '../../../models/inputData.model';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import { Organization } from '../../../models/organization.model';
import { Process } from '../../../models/process.model';
import { System } from '../../../models/system.model';
import * as fromModelerStore from '../../../store/';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-existing-objects-sidebar',
  templateUrl: './existing-objects-sidebar.component.html',
  styleUrls: ['./existing-objects-sidebar.component.scss']
})
export class ExistingObjectsSidebarComponent implements OnInit {
  isReadOnlySession$: Observable<boolean>;
  decisionsList$: Observable<Decision[]>;
  diagramsList$: Observable<Diagram[]>;
  inputDataList$: Observable<InputData[]>;
  knowledgeSourcesList$: Observable<KnowledgeSource[]>;
  organizationsList$: Observable<Organization[]>;
  businessObjectivesList$: Observable<BusinessObjective[]>;
  processesList$: Observable<Process[]>;
  eventsList$: Observable<Event[]>;
  systemsList$: Observable<System[]>;
  implementationComponentsList$: Observable<ImplementationComponent[]>;

  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
    private rootStore: Store<rootReducers.IState>,
  ) { }

  ngOnInit() {
    this.modelerStore.dispatch(new fromModelerStore.LoadDiagramsList());
    this.modelerStore.dispatch(new fromModelerStore.LoadDecisionsList());
    this.modelerStore.dispatch(new fromModelerStore.LoadInputDatasList());
    this.modelerStore.dispatch(new fromModelerStore.LoadKnowledgeSourcesList());
    this.modelerStore.dispatch(new fromModelerStore.LoadOrganizationsList());
    this.modelerStore.dispatch(new fromModelerStore.LoadBusinessObjectivesList());
    this.modelerStore.dispatch(new fromModelerStore.LoadProcessesList());
    this.modelerStore.dispatch(new fromModelerStore.LoadEventsList());
    this.modelerStore.dispatch(new fromModelerStore.LoadSystemsList());
    this.modelerStore.dispatch(new fromModelerStore.LoadImplementationComponentsList());

    this.isReadOnlySession$ = this.rootStore.pipe(select(rootSelectors.getIsReadOnlySession));
    this.decisionsList$ = this.modelerStore.pipe(select(fromModelerStore.getDecisionsList));
    this.diagramsList$ = this.modelerStore.pipe(select(fromModelerStore.getDiagramsList));
    this.inputDataList$ = this.modelerStore.pipe(select(fromModelerStore.getInputDatasList));
    this.knowledgeSourcesList$ = this.modelerStore.pipe(select(fromModelerStore.getKnowledgeSourcesList));
    this.organizationsList$ = this.modelerStore.pipe(select(fromModelerStore.getOrganizationsList));
    this.businessObjectivesList$ = this.modelerStore.pipe(select(fromModelerStore.getBusinessObjectivesList));
    this.processesList$ = this.modelerStore.pipe(select(fromModelerStore.getProcessesList));
    this.eventsList$ = this.modelerStore.pipe(select(fromModelerStore.getEventsList));
    this.systemsList$ = this.modelerStore.pipe(select(fromModelerStore.getSystemsList));
    this.implementationComponentsList$ = this.modelerStore.pipe(select(fromModelerStore.getImplementationComponentsList));
  }

  openNavigationSidebarPanel(): void {
    this.modelerStore.dispatch(new fromModelerStore.SetCurrentSidebarPanel(SidebarPanel.Navigation));
  }
}
