import { AutocompleteListItem } from 'core/models';
import { AddCustomerRequest, Customer, Group, User } from 'user-management/models';
import { USER_MANAGEMENT_OBJECTS } from 'user-management/models';

const toCustomerField = {
  'allowedUser': 'numberOfUsers',
  'whiteLabelFooter': 'footerHtml',
  'domain': 'domains',
  'validUntilDate': 'validDate',
  'createDate': 'createdDate'
};

const toUserField = {
  'firstname': 'firstName',
  'lastname': 'lastName',
  'userRole': 'type',
};

const toGroupField = {
};

const autocompleteListItemFields = {
  'name': 'name',
  'email': 'name',
  'id': 'id',
}

const fromCustomerField = swapObjectKeysAndValues(toCustomerField);
const fromUserField = swapObjectKeysAndValues(toUserField);
const fromGroupField = swapObjectKeysAndValues(toGroupField);

function swapObjectKeysAndValues(obj) {
  return Object.keys(obj)
  .reduce((previous, current) => ({...previous, [obj[current]]: current}), {});
} 

export function toCustomer(sourceObj: any): Customer {
  const targetCustomer = new Customer();
  Object.keys(sourceObj).forEach((key) => {
    if (key === USER_MANAGEMENT_OBJECTS.User.resourceName) {
      targetCustomer[key] = sourceObj[key].map(toUser);
    } else if (key === USER_MANAGEMENT_OBJECTS.Group.resourceName) {
      targetCustomer[key] = sourceObj[key].map(toGroup);
    } else if (toCustomerField[key]) {
      targetCustomer[toCustomerField[key]] = sourceObj[key];
    } else {
      targetCustomer[key] = sourceObj[key];
    }
  });

  return targetCustomer;
}

export function fromCustomer(sourceCustomer: Customer | AddCustomerRequest): any {
  const obj = {};
  Object.keys(sourceCustomer).forEach((key) => {
    if (fromCustomerField[key]) {
      obj[fromCustomerField[key]] = sourceCustomer[key];
    } else {
      obj[key] = sourceCustomer[key];
    }
  });

  return obj;
}

export function toUser(sourceUser: any): User {
  const targetUser = new User();
  Object.keys(sourceUser).forEach((key) => {
    if (toUserField[key]) {
      targetUser[toUserField[key]] = sourceUser[key];
    } else if (key === USER_MANAGEMENT_OBJECTS.Group.resourceName) {
      targetUser[key] = sourceUser[key].map(toGroup); 
    } else {
      targetUser[key] = sourceUser[key];
    }
  });

  return targetUser;
}

export function fromUser(sourceUser: Partial<User>): any {
  const obj = {};
  Object.keys(sourceUser).forEach((key) => {
    if (fromUserField[key]) {
      obj[fromUserField[key]] = sourceUser[key];
    } else {
      obj[key] = sourceUser[key];
    }
  });

  return obj;
}

export function toGroup(sourceGroup: any): Group {
  const targetGroup = new Group();
  Object.keys(sourceGroup).forEach((key) => {
    if (toGroupField[key]) {
      targetGroup[toGroupField[key]] = sourceGroup[key];
    } else if (key === USER_MANAGEMENT_OBJECTS.User.resourceName) {
      targetGroup[key] = sourceGroup[key].map(toUser);
    } else {
      targetGroup[key] = sourceGroup[key];
    }
  });

  return targetGroup;
}

export function fromGroup(sourceGroup: Partial<Group>): any {
  const obj = {};
  Object.keys(sourceGroup).forEach((key) => {
    if (fromGroupField[key]) {
      obj[fromGroupField[key]] = sourceGroup[key];
    } else {
      obj[key] = sourceGroup[key];
    }
  });

  return obj;
}

export function toAutocompleteListItem(sourceObject: any): AutocompleteListItem {
  const autocompleteListItem = new AutocompleteListItem();
  Object.keys(sourceObject).forEach((key) => {
    if (autocompleteListItemFields[key]) {
      autocompleteListItem[autocompleteListItemFields[key]] = sourceObject[key];
    }
  });

  return autocompleteListItem;
}
