import { BusinessObjectivesService } from './business-objectives.service';
import { DecisionAnswerService } from './decision-answer.service';
import { DecisionsService } from './decisions.service';
import { DiagrammingElementsService } from './diagramming-elements.service';
import { DiagramsService } from './diagrams.service';
import { EventsService } from './events.service';
import { ImplementationComponentsService } from './implementation-components.service';
import { InputDatasService } from './input-data.service';
import { KnowledgeSourceService } from './knowledge-source.service';
import { OrganizationsService } from './organizations.service';
import { ProcessesService } from './processes.service';
import { SystemsService } from './systems.service';
import { TagsService } from './tags.service';
import { UpdateObjectTagService } from './updateObjectTag.service';

export const services = [
  DiagramsService,
  DecisionsService,
  DiagrammingElementsService,
  KnowledgeSourceService,
  OrganizationsService,
  InputDatasService,
  BusinessObjectivesService,
  ProcessesService,
  EventsService,
  SystemsService,
  ImplementationComponentsService,
  TagsService,
  UpdateObjectTagService,
  DecisionAnswerService,
];

export * from './decisions.service';
export * from './diagramming-elements.service';
export * from './diagrams.service';
export * from './knowledge-source.service';
export * from './organizations.service';
export * from './input-data.service';
export * from './business-objectives.service';
export * from './processes.service';
export * from './events.service';
export * from './systems.service';
export * from './implementation-components.service';
export * from './tags.service';
export * from './updateObjectTag.service';
export * from './decision-answer.service';
