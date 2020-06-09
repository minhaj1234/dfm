import { Resource } from 'angular4-hal';
import { Customer } from './customer.model';
import { Tag } from './tag.model';
import { USER_NAMAGEMENT_CLASS_NAMES } from './types.model';
import { User } from './user.model';

export class Group extends Resource {
  readonly className: string = USER_NAMAGEMENT_CLASS_NAMES.Group;
  id: string;
  name: string;
  description: string;
  users: User[];
  tags: Tag[];
  createdBy: string;
  account: Customer;
}

export type GroupRelatedObject =
  User;

export class IStateEditGroup {
  group: Group;
}
