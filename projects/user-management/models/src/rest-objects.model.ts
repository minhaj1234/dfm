import { Resource } from 'angular4-hal';
import { Customer } from './customer.model';
import { Group } from './group.model';
import { USER_NAMAGEMENT_CLASS_NAMES } from './types.model';
import { User } from './user.model';

export const USER_MANAGEMENT_LINKS_ARRAY = '_links';

export const USER_MANAGEMENT_OBJECTS: {
  [className: string]: UserManagementObject;
} = {
  [USER_NAMAGEMENT_CLASS_NAMES.Customer]: {
    className: USER_NAMAGEMENT_CLASS_NAMES.Customer,
    listName: 'accountList',
    resourceName: 'accounts',
    relationName: 'account',
    tabTypeName: 'Account',
    type: Customer,
    partialSearchPath: 'search/findAccountByName',
    partialSearchParameterName: 'name',
  },
  [USER_NAMAGEMENT_CLASS_NAMES.User]: {
    className: USER_NAMAGEMENT_CLASS_NAMES.User,
    listName: 'userList',
    resourceName: 'users',
    relationName: 'user',
    tabTypeName: 'User',
    type: User,
    partialSearchPath: 'search/findUserByNameOrEmailForAccount',
    partialSearchParameterName: 'partialName',
    accountIdParameterName: 'accountId'
  },
  [USER_NAMAGEMENT_CLASS_NAMES.Group]: {
    className: USER_NAMAGEMENT_CLASS_NAMES.Group,
    listName: 'groupList',
    resourceName: 'groups',
    relationName: 'group',
    tabTypeName: 'Group',
    type: Group,
    partialSearchPath: 'search/findGroupByNameForAccount',
    partialSearchParameterName: 'name',
    accountIdParameterName: 'accountId'
  },
}

export interface UserManagementObject {
  className: string; // business object name and Angular class name
  listName: string; // field containing the list of these objects for 'GET list' requests
  resourceName: string; // name of the REST resource
  relationName: string; // name of the relation field for this object. E.g. user.account relates to user._links['account'], account is the relationName
  tabTypeName: string; // name of the tab type
  type: new() => Resource; // Angular class
  partialSearchPath: string; // path to search by partial matching. For example 'search/findUserByNameOrEmail'
  partialSearchParameterName: string; // name of parameter to partial search
  accountIdParameterName?: string; //name of parameter to accountId
}
