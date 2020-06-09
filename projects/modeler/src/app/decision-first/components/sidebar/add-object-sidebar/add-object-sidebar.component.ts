import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { SidebarPanel } from 'core/objects/sidebar/models';
import * as fromStore from '../../../store';
import { IDecisionFirstState } from '../../../store/index';
import { AddBusinessObjectiveComponent } from '../../business-objective/add-business-objective/add-business-objective.component';
import { AddDecisionComponent } from '../../decision/add-decision/add-decision.component';
import { AddDiagramComponent } from '../../diagram/add-diagram/add-diagram.component';
import { AddEventComponent } from '../../event/add-event/add-event.component';
import { AddImplementationComponentComponent } from '../../implementation-component/add-implementation-component/add-implementation-component.component';
import { AddInputDataComponent } from '../../input-data/add-input-data/add-input-data.component';
import { AddKnowledgeSourceComponent } from '../../knowledge-source/add-knowledge-source/add-knowledge-source.component';
import { AddOrganizationComponent } from '../../organization/add-organization/add-organization.component';
import { AddProcessComponent } from '../../process/add-process/add-process.component';
import { AddSystemComponent } from '../../system/add-system/add-system.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-add-object-sidebar',
  styleUrls: ['./add-object-sidebar.component.scss'],
  templateUrl: './add-object-sidebar.component.html',
})
export class AddObjectSidebarComponent implements OnInit {
  constructor(
    private store: Store<IDecisionFirstState>,
    private nbDiaglogService: NbDialogService
  ) { }

  ngOnInit() {}

  openNavigationSidebarPanel(): void {
    this.store.dispatch(new fromStore.SetCurrentSidebarPanel(SidebarPanel.Navigation));
  }

  showDialogCreateDiagram(): void {
    this.nbDiaglogService.open(AddDiagramComponent);
  }

  showDialogCreateDecision(): void {
    this.nbDiaglogService.open(AddDecisionComponent);
  }

  showDialogCreateInputData(): void {
    this.nbDiaglogService.open(AddInputDataComponent);
  }

  showDialogCreateKnowledgeSource(): void {
    this.nbDiaglogService.open(AddKnowledgeSourceComponent);
  }

  showDialogCreateOrganization(): void {
    this.nbDiaglogService.open(AddOrganizationComponent);
  }

  showDialogCreateBusinessObjective(): void {
    this.nbDiaglogService.open(AddBusinessObjectiveComponent);
  }

  showDialogCreateProcess(): void {
    this.nbDiaglogService.open(AddProcessComponent);
  }

  showDialogCreateEvent(): void {
    this.nbDiaglogService.open(AddEventComponent);
  }

  showDialogCreateSystem(): void {
    this.nbDiaglogService.open(AddSystemComponent);
  }

  showDialogCreateImplementationComponent(): void {
    this.nbDiaglogService.open(AddImplementationComponentComponent);
  }
}
