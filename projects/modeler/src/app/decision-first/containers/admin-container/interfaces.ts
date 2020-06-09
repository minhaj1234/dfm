import { AuthenticatedUser } from 'core/models';
import { Tag } from 'user-management/models/tag.model';

export interface IStateAdminTab {
  tags: Tag[],
  authenticatedUser: AuthenticatedUser
}
