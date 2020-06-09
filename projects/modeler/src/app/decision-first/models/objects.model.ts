import { BusinessObjective } from './businessObjective.model';
import { Decision } from './decision.model';
import { Diagram } from './diagram.model';
import { Event } from './events.model';
import { ImplementationComponent } from './implementationComponent.model';
import { InputData } from './inputData.model';
import { KnowledgeSource } from './knowledgeSource.model';
import { Organization } from './organization.model';
import { Process } from './process.model';
import { System } from './system.model';

export enum ObjectClassNames {
  Diagram = 'Diagram',
  Decision = 'Decision',
  InputData = 'InputData',
  KnowledgeSource = 'KnowledgeSource',
  Organization = 'Organization',
  BusinessObjective = 'BusinessObjective',
  Process = 'Process',
  Event = 'Event',
  System = 'System',
  ImplementationComponent = 'ImplementationComponent',
  Tag = 'Tag',
}

export enum ObjectRelationsNames {
  Diagrams = 'diagrams',
  Decisions = 'decisions',
  RequiresDecisions = 'requiresDecisions',
  RequiredByDecisions = 'requiredByDecisions',
  SourceDecisions = 'sourceDecisions',
  OwnsDecisions = 'ownsDecisions',
  MakesDecisions = 'makesDecisions',
  ImpactedByDecisions = 'impactedByDecisions',
  InputDatas = 'inputDatas',
  RequiresInputData = 'requiresInputData',
  KnowledgeSources = 'knowledgeSources',
  RequiresKnowledgeSources = 'requiresKnowledgeSources',
  RequiredByKnowledgeSources = 'requiredByKnowledgeSources',
  SourceKnowledgeSources = 'sourceKnowledgeSources',
  Organizations = 'organizations',
  OrganizationsOwnsDecisions = 'organizationsOwnsDecisions',
  OrganizationsMakesDecisions = 'organizationsMakesDecisions',
  OrganizationsImpactedByDecisions = 'organizationsImpactedByDecisions',
  ParentOrganization = 'parentOrganization',
  ChildOrganizations = 'childOrganizations',
  BusinessObjectives = 'businessObjectives',
  Processes = 'processes',
  Events = 'events',
  Systems = 'systems',
  ImplementationComponents = 'implementationComponents',
  Tags = 'tags',
  Links = '_links',
  Comments = 'comments',
  ChildComments = 'childComments',
  User = 'user',
  DecisionImplementationTable = 'decisionImplementationTable',
  Headers = 'headers',
  Rows = 'rows',
  Cells = 'cells',
  Answer = 'answer',
}

export enum PrintableObjectsTypes {
  Diagram = 'Diagram',
  Decision = 'Decision',
  InputData = 'InputData',
  KnowledgeSource = 'KnowledgeSource',
  Organization = 'Organization',
  BusinessObjective = 'BusinessObjective',
  Process = 'Process',
  Event = 'Event',
  System = 'System',
  ImplementationComponent = 'ImplementationComponent',
}

export type DfmObjects =
  | Decision
  | InputData
  | KnowledgeSource
  | BusinessObjective
  | Event
  | Diagram
  | ImplementationComponent
  | Organization
  | Process
  | System;

export type CommentedDfmObjects =
  | Decision
  | InputData
  | KnowledgeSource
  | BusinessObjective
  | Event
  | ImplementationComponent
  | Organization
  | Process
  | System;
  