import { ResourceWithId } from 'core/models';
import { BusinessObjective } from "./businessObjective.model";
import { Decision } from "./decision.model";
import { Event } from "./events.model";
import { ImplementationComponent } from "./implementationComponent.model";
import { InputData } from "./inputData.model";
import { KnowledgeSource } from "./knowledgeSource.model";
import { ObjectClassNames } from './objects.model';
import { Organization } from "./organization.model";
import { Process } from "./process.model";
import { System } from "./system.model";

export class Tag extends ResourceWithId {
  readonly className: string = ObjectClassNames.Tag;
  id: string;
  name: string;
  countTagEntities: number;
  decisions: Decision[] = [];
  inputData: InputData[] = [];
  knowledgeSources: KnowledgeSource[] = [];
  organizations: Organization[] = [];
  businessObjectives: BusinessObjective[] = [];
  processes: Process[] = [];
  events: Event[] = [];
  systems: System[] = [];
  implementationComponents: ImplementationComponent[] = [];
  _links: ITagLinks
}

export interface ITagLinks {
  self: {
    href: string;
  }
}

export interface ITagUpdate {
  tag: Partial<Tag>;
}

export interface ObjectTagsUpdate {
  name: string
  description: string;
  tags: Tag[];
}