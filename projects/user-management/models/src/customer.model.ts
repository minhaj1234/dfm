import { Resource } from 'angular4-hal';
import { Group } from './group.model';
import { USER_NAMAGEMENT_CLASS_NAMES } from './types.model';
import { User } from './user.model';

export class Customer extends Resource {
  readonly className: string = USER_NAMAGEMENT_CLASS_NAMES.Customer;
  id: string;
  name: string;
  description: string;
  apiKey: string;
  createdDate: Date;
  validDate: Date;
  numberOfUsers: number;
  footerHtml: string;
  domains: string;
  users: User[];
  groups: Group[];
}

export class AddCustomerRequest {
  name: string;
  numberOfUsers: number;
  validDate: Date;
  createdBy: string;
}

export type CustomerRelatedObject =
  | User
  | Group;

export class IStateEditCustomer {
  customer: Customer;
}

export enum EditCustomerFormEditableType {
  AllWithoutDomains,
  HtmlFooterAndDomainsOnly,
}
