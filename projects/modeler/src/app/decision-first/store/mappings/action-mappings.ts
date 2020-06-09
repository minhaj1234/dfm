import { Action } from '@ngrx/store';
import { BusinessObjective } from '../../models/businessObjective.model';
import { Decision } from '../../models/decision.model';
import { Diagram } from '../../models/diagram.model';
import { Event } from '../../models/events.model';
import { ImplementationComponent } from '../../models/implementationComponent.model';
import { InputData } from '../../models/inputData.model';
import { KnowledgeSource } from '../../models/knowledgeSource.model';
import { ObjectClassNames } from '../../models/objects.model';
import { Organization } from '../../models/organization.model';
import { Process } from '../../models/process.model';
import { System } from '../../models/system.model';
import * as fromActions from '../actions';

export const DELETE_OBJECT_ACTION_MAPPING = {
  [ObjectClassNames.Diagram]: (object: Diagram) => new fromActions.DeleteDiagram(object),
  [ObjectClassNames.Decision]: (object: Decision) => new fromActions.DeleteDecision(object),
  [ObjectClassNames.InputData]: (object: InputData) => new fromActions.DeleteInputData(object),
  [ObjectClassNames.KnowledgeSource]: (object: KnowledgeSource) => new fromActions.DeleteKnowledgeSource(object),
  [ObjectClassNames.Organization]: (object: Organization) => new fromActions.DeleteOrganization(object),
  [ObjectClassNames.BusinessObjective]: (object: BusinessObjective) => new fromActions.DeleteBusinessObjective(object),
  [ObjectClassNames.Process]: (object: Process) => new fromActions.DeleteProcess(object),
  [ObjectClassNames.Event]: (object: Event) => new fromActions.DeleteEvent(object),
  [ObjectClassNames.System]: (object: System) => new fromActions.DeleteSystem(object),
  [ObjectClassNames.ImplementationComponent]: (object: ImplementationComponent) => new fromActions.DeleteImplementationComponent(object),
};

export const LOAD_OBJECT_ACTION_MAPPING = {
  [ObjectClassNames.Diagram]: (id: string) => new fromActions.LoadDiagram(id),
  [ObjectClassNames.Decision]: (id: string) => new fromActions.LoadDecision(id),
  [ObjectClassNames.InputData]: (id: string) => new fromActions.LoadInputData(id),
  [ObjectClassNames.KnowledgeSource]: (id: string) => new fromActions.LoadKnowledgeSource(id),
  [ObjectClassNames.ImplementationComponent]: (id: string) => new fromActions.LoadImplementationComponent(id),
  [ObjectClassNames.BusinessObjective]: (id: string) => new fromActions.LoadBusinessObjective(id),
  [ObjectClassNames.Organization]: (id: string) => new fromActions.LoadOrganization(id),
  [ObjectClassNames.Process]: (id: string) => new fromActions.LoadProcess(id),
  [ObjectClassNames.System]: (id: string) => new fromActions.LoadSystem(id),
  [ObjectClassNames.Event]: (id: string) => new fromActions.LoadEvent(id),
};

export interface StompServiceActionsMapping {
  loadObjectAction: new(id: string) => Action
} 
