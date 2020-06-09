import { Resource } from 'angular4-hal';
import { Customer } from './customer.model';
import { Group } from './group.model';
import { Tag } from './tag.model';
import { USER_NAMAGEMENT_CLASS_NAMES } from './types.model';

export class User extends Resource {
  readonly className: string = USER_NAMAGEMENT_CLASS_NAMES.User;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  isStandard: boolean;
  isActiveReader: boolean;
  isDisabled: boolean;
  type: UserType;
  picture: string;
  defaultTag: Tag;
  groups: Group[];
  account: Customer;
  createdBy: string;
}

export enum UserType {
  ADMIN = 'ADMIN',
  STANDARD = 'STANDARD',
  READER = 'READER',
  DISABLED = 'DISABLED'
}

export type UserRelatedObject =
  Group;

export class IStateEditUser {
  user: User;
}

export interface IChangePassword {
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
}

export interface ChangePasswordFormState {
  displayChangePassword: boolean,
  changePasswordError: boolean,
}

export interface ISuperAdminUser {
  isSuperAdminUser: boolean;
}
