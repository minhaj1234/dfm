import { ResourceWithId } from 'core/models';
import { Comment } from './comment.model';
import { Decision } from './decision.model';
import { ObjectClassNames } from './objects.model';
import { ObjectTagsUpdate, Tag } from './tag.model';

export class ImplementationComponent extends ResourceWithId {
  readonly className: string = ObjectClassNames.ImplementationComponent;
  id: string;
  name: string;
  description: string;
  url: string;
  iconId: string;
  tags: Tag[];
  decisions: Decision[];
  comments: Comment[];
  _links: IImplementationComponentLinks;
}

export interface IImplementationComponentLinks {
  self: {
    href: string;
  };
  implementationComponent: {
    href: string;
  };
  decisions: {
    href: string;
  };
};

export class IStateEditImplementationComponent {
  implementationComponent: ImplementationComponent;
  isReadOnlySession: boolean;
}

export type ImplementationComponentRelatedObjects = 
  | Decision
  | Comment;
  
export interface IImplementationComponentUpdate {
  implementationComponent: Partial<ImplementationComponent>
  objectTagsUpdate?: ObjectTagsUpdate;
}
