import { BusinessObjective } from './businessObjective.model';
import { Decision } from './decision.model';
import { Diagram } from './diagram.model';
import { Event } from './events.model';
import { ImplementationComponent } from './implementationComponent.model';
import { InputData } from './inputData.model';
import { KnowledgeSource } from './knowledgeSource.model';
import { ObjectClassNames } from './objects.model';
import { Organization } from './organization.model';
import { Process } from './process.model';
import { System } from './system.model';
import { Tag } from './tag.model';

export type Search =
  | Diagram
  | Decision
  | InputData
  | KnowledgeSource
  | Organization
  | BusinessObjective
  | Process
  | Event
  | System
  | ImplementationComponent
  | Tag;

export enum SearchSort {
  Asc = 'Asc',
  Desc = 'Desc',
}

export const defaultSearchSort = SearchSort.Asc;

export const defaultSearchFilterTypeObjects = [];

export const allSearchFilterTypeObjects = [
  ObjectClassNames.Diagram,
  ObjectClassNames.Decision,
  ObjectClassNames.InputData,
  ObjectClassNames.KnowledgeSource,
  ObjectClassNames.Organization,
  ObjectClassNames.BusinessObjective,
  ObjectClassNames.Process,
  ObjectClassNames.Event,
  ObjectClassNames.System,
  ObjectClassNames.ImplementationComponent,
];

export enum SearchListItemType {
  ShortSearchListItem,
  FullSearchListItem,
}
