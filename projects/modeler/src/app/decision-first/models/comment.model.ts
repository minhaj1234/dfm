import { ResourceWithId } from 'core/models';
import { User } from 'user-management/models';

export class Comment extends ResourceWithId{
  id: string;
  text: string;
  objectId: string;
  parentCommentId: string;
  isDeleted: boolean;
  createdDate: Date;
  user: User;
  childComments: Comment[];
  _links: {
    self: {
      href: string;
    };
    object: {
      href: string;
    };
    parentComment: {
      href: string;
    };
    childComments: {
      href: string;
    };
  };
}
