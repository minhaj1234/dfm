import { ResourceWithId } from 'core/models';
import { Comment } from './comment.model';
import { Decision } from './decision.model';
import { ObjectClassNames } from './objects.model';
import { Organization } from './organization.model';
import { ObjectTagsUpdate, Tag } from './tag.model';

export class BusinessObjective extends ResourceWithId {
  readonly className: string = ObjectClassNames.BusinessObjective;
  id: string;
  name: string;
  description: string;
  url: string;
  tags: Tag[];
  decisions: Decision[];
  organizations: Organization[];
  comments: Comment[];
  _links: IBusinessObjectiveLinks;
}

export interface IBusinessObjectiveLinks {
  self: {
    href: string;
  };
  businessObjective: {
    href: string;
  };
  organizations: {
    href: string;
  };
  decisions: {
    href: string;
  };
};

export class IStateEditBusinessObjective {
  businessObjective: BusinessObjective;
  isReadOnlySession: boolean;
}

export type BusinessObjectiveRelatedObjects = 
  | Organization 
  | Decision
  | Comment;
  
export interface IBusinessObjectiveUpdate {
  businessObjective: Partial<BusinessObjective>;
  objectTagsUpdate?: ObjectTagsUpdate;
}