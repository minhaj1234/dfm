import { ResourceWithId } from 'core/models';
import { Comment } from './comment.model';
import { Decision } from './decision.model';
import { ObjectClassNames } from './objects.model';
import { ObjectTagsUpdate, Tag } from './tag.model';

export class Event extends ResourceWithId {
  readonly className: string = ObjectClassNames.Event;
  id: string;
  name: string;
  description: string;
  url: string;
  tags: Tag[];
  decisions: Decision[];
  comments: Comment[];
  _links: IEventLinks;
}

export interface IEventLinks {
  self: {
    href: string;
  };
  event: {
    href: string;
  };
  decisions: {
    href: string;
  };
};

export class IStateEditEvent {
  event: Event;
  isReadOnlySession: boolean;
}

export type EventRelatedObjects = 
  | Decision
  | Comment;
  
export interface IEventUpdate {
  event: Partial<Event>;
  objectTagsUpdate?: ObjectTagsUpdate;
}
