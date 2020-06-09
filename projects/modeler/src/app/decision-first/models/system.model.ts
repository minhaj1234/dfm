import { ResourceWithId } from 'core/models';
import { Comment } from './comment.model';
import { Decision } from './decision.model';
import { ObjectClassNames } from './objects.model';
import { ObjectTagsUpdate, Tag } from './tag.model';
export class System extends ResourceWithId {

  readonly className: string = ObjectClassNames.System;
  id: string;
  name: string;
  description: string;
  url: string;
  tags: Tag[];
  decisions: Decision[];
  comments: Comment[];
  _links: ISystemLinks;
}

export interface ISystemLinks {
  self: {
    href: string;
  };
  system: {
    href: string;
  };
  decisions: {
    href: string;
  };
};

export class IStateEditSystem {
  system: System;
  isReadOnlySession: boolean;
}

export type SystemRelatedObjects =
  | Decision
  | Comment;
  
export interface ISystemUpdate {
  system: Partial<System>;
  objectTagsUpdate?: ObjectTagsUpdate;
}