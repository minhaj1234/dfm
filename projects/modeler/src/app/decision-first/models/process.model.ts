import { ResourceWithId } from 'core/models';
import { Comment } from './comment.model';
import { Decision } from './decision.model';
import { ObjectClassNames } from './objects.model';
import { ObjectTagsUpdate, Tag } from './tag.model';

export class Process extends ResourceWithId {
  readonly className: string = ObjectClassNames.Process;
  id: string;
  name: string;
  description: string;
  url: string;
  tags: Tag[];
  decisions: Decision[];
  comments: Comment[];
  _links: IProcessLinks;
}

export interface IProcessLinks {
  self: {
    href: string;
  };
  process: {
    href: string;
  };
  decisions: {
    href: string;
  };
};

export class IStateEditProcess {
  process: Process;
  isReadOnlySession: boolean;
}

export type ProcessRelatedObjects =
  | Decision
  | Comment;
  
export interface IProcessUpdate {
  process: Partial<Process>;
  objectTagsUpdate?: ObjectTagsUpdate;
}
