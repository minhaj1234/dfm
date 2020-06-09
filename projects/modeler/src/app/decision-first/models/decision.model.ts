import { ResourceWithId } from 'core/models';
import { BusinessObjective } from './businessObjective.model';
import { Comment } from './comment.model';
import { DecisionImplementationTable, TableEntity } from './decisionImplementationTable.model';
import { Diagram } from './diagram.model';
import { Event } from './events.model';
import { ImplementationComponent } from './implementationComponent.model';
import { InputData } from './inputData.model';
import { KnowledgeSource } from './knowledgeSource.model';
import { ObjectClassNames } from './objects.model';
import { Organization } from './organization.model';
import { Process } from './process.model';
import { System } from './system.model';
import { ObjectTagsUpdate, Tag } from './tag.model';

export class Decision extends ResourceWithId {
  readonly className: string = ObjectClassNames.Decision;
  id: string;
  name: string;
  description: string;
  url: string;
  type: string;
  statusLevel: string;
  question: string;
  answer: Answer;
  primaryDiagramId: string;
  decisionImplementationTable: DecisionImplementationTable;
  tags: Tag[];
  diagrams: Diagram[];
  requiresDecisions: Decision[];
  requiredByDecisions: Decision[];
  requiresInputData: InputData[];
  requiresKnowledgeSources: KnowledgeSource[];
  requiredByKnowledgeSources: KnowledgeSource[];
  processes: Process[];
  businessObjectives: BusinessObjective[];
  organizationsOwnsDecisions: Organization[];
  organizationsMakesDecisions: Organization[];
  organizationsImpactedByDecisions: Organization[];
  implementationComponents: ImplementationComponent[];
  systems: System[];
  events: Event[];
  comments: Comment[];
  _links: IDecisionLinks;
}

export enum DecisionType {
  STRATEGIC = 'STRATEGIC',
  TACTICAL = 'TACTICAL',
  OPERATIONAL = 'OPERATIONAL'
}

export const defaultDecisionType = DecisionType.STRATEGIC;

export enum DecisionStatusLevel {
  INPROCESS = 'IN_PROCESS',
  COMPLETED = 'COMPLETED'
}

export const defaultDecisionStatusLevel = DecisionStatusLevel.INPROCESS;

export interface IDecisionLinks {
  self: {
    href: string;
  };
  decision?: {
    href: string;
  };
  events?: {
    href: string;
  };
  organizationsImpactedByDecisions?: {
    href: string;
  };
  requiresKnowledgeSources?: {
    href: string;
  };
  requiresDecisions?: {
    href: string;
  };
  systems?: {
    href: string;
  };
  organizations?: {
    href: string;
  };
  organizationsMakesDecisions?: {
    href: string;
  };
  requiresInputDatas?: {
    href: string;
  };
  processes?: {
    href: string;
  };
  organizationsOwnsDecisions?: {
    href: string;
  };
  businessObjectives?: {
    href: string;
  };
  diagrams?: {
    href: string;
  };
  implementationComponents?: {
    href: string;
  };
  requiredByDecisions?: {
    href: string;
  };
  requiredByKnowledgeSources?: {
    href: string;
  };
}

export class Answer {
  id: string;
  answerTypeId: AnswerType;
  isCollection;
  yesNo: boolean = null;
  answerItems: AnswerItem[];
  defaultAnswerItemId: string;
  externalValueList: string;
  minimumNumber: number;
  maximumNumber: number;
  defaultNumber: number;
  minimumDateTime: Date;
  maximumDateTime: Date;
  defaultDateTime: Date;
  text: string;
  other: string;
  supportingInformation: string;
  _links: IAnswerLinks
}

export class AnswerItem {
  id: string;
  value: string;
}

export enum AnswerType {
  YesNo = 1,
  DefinedList,
  ExternalValueList,
  NumberInRange,
  Text,
  DateTime,
  Other,
}

export enum AnswerTypeTranslationString {
  'resources.yesNo' = 1,
  'resources.definedList',
  'resources.externalValueList',
  'resources.numberInRange',
  'resources.text',
  'resources.dateTime',
  'resources.other'
}

export interface IAnswerNumberInRange {
  min: number;
  max: number;
  default: number;
}
export interface IAnswerLinks {
  self: {
    href: string;
  };
}
export class IStateEditDecision {
  decision: Decision;
  isReadOnlySession: boolean;
}

export type DecisionRelatedObjects =  
  | Decision 
  | InputData
  | KnowledgeSource
  | BusinessObjective
  | Event
  | Diagram
  | ImplementationComponent
  | Organization
  | Process
  | System
  | Comment;

export interface IDecisionUpdate {
  decision: Partial<Decision>;
  objectTagsUpdate?: ObjectTagsUpdate;
}

export interface IDecisionCells{
   relationPath: string;
   relationObject: any;
}
