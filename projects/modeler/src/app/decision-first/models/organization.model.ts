import { ResourceWithId } from 'core/models';
import { BusinessObjective } from './businessObjective.model';
import { Comment } from './comment.model';
import { Decision } from './decision.model';
import { InputData } from './inputData.model';
import { KnowledgeSource } from './knowledgeSource.model';
import { ObjectClassNames } from './objects.model';
import { ObjectTagsUpdate, Tag } from './tag.model';

export class Organization extends ResourceWithId {
  readonly className: string = ObjectClassNames.Organization;
  id: string;
  name: string;
  description: string;
  url: string;
  type: string;
  tags: Tag[];
  inputDatas: InputData[];
  decisions: Decision[];
  ownsDecisions: Decision[];
  makesDecisions: Decision[];
  impactedByDecisions: Decision[];
  knowledgeSources: KnowledgeSource[];
  parentOrganization: Organization;
  childOrganizations: Organization[];
  businessObjectives: BusinessObjective[];
  comments: Comment[];
  _links: IOrganizationLinks;
}

export interface IOrganizationLinks {
  self: {
    href: string;
  };
  organization: {
    href: string;
  };
  inputDatas: {
    href: string;
  };
  decisions: {
    href: string;
  };
  ownsDecisions: {
    href: string;
  };
  makesDecisions: {
    href: string;
  };
  impactedByDecisions: {
    href: string;
  };
  knowledgeSources: {
    href: string;
  };
  parents: {
    href: string;
  };
  childrens: {
    href: string;
  };
  businessObjectives: {
    href: string;
  };
}

export enum OrganizationType {
  ORGANIZATION = 'ORGANIZATION',
  ROLE = 'ROLE'
}

export const defaultOrganizationType = OrganizationType.ORGANIZATION;

export class IStateEditOrganization {
  organization: Organization;
  isReadOnlySession: boolean;
}

export type OrganizationRelalatedObjects =
  | KnowledgeSource
  | InputData
  | Decision
  | Organization
  | BusinessObjective
  | Comment;
  
export interface IOrganizationUpdate {
  organization: Partial<Organization>;
  objectTagsUpdate?: ObjectTagsUpdate;
}