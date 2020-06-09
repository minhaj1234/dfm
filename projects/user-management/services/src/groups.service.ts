import { Injectable, Injector } from '@angular/core';
import { ExternalService } from 'angular4-hal';
import { APP_CONFIG, APPLICATION_JSON_HEADER } from 'core/services';
import { Observable } from 'rxjs';
import { Group, USER_MANAGEMENT_OBJECTS } from 'user-management/models';
import { toGroup } from 'user-management/utilities';
import { CommonAdminService } from './common-admin.service';
import { RelatedServiceFactories } from './common-admin.types';
import { RELATED_CUSTOMERS_SERVICE, RELATED_USERS_SERVICE } from './constants';
import { CustomersService } from './customers.service';
import { UsersService } from './users.service';

@Injectable()
export class GroupsService extends CommonAdminService<Group> {
  constructor(externalService: ExternalService, injector: Injector) {
    const relatedServiceFactories: RelatedServiceFactories = {
      [USER_MANAGEMENT_OBJECTS.User.resourceName]: () => injector.get<UsersService>(RELATED_USERS_SERVICE),
      [USER_MANAGEMENT_OBJECTS.Customer.relationName]: () => injector.get<CustomersService>(RELATED_CUSTOMERS_SERVICE),
    };

    super(USER_MANAGEMENT_OBJECTS.Group, externalService, injector, relatedServiceFactories);
    this.toObject = toGroup;
    this.pageSize = injector.get(APP_CONFIG).pageSize;
  }

  createGroup(group: Group, accountId: string): Observable<Object> {
    return this.externalService.getHttp().post(`${this.externalService.getURL()}/administration/accounts/${accountId}/groups`, group, {
      headers: APPLICATION_JSON_HEADER,
    });
  }

  addUsersToGroup(groupId: string, userIds: string[]): Observable<Object> {
    return this.externalService.getHttp().patch(`${this.externalService.getURL()}administration/`+
    `${this.resourceInfo.resourceName}/${groupId}/group-members`, {
      [USER_MANAGEMENT_OBJECTS.User.listName]: userIds
    }, {
      headers: APPLICATION_JSON_HEADER,
    });
  }

  removeUserFromGroup(groupId: string, userId: string): Observable<Object> {
    return this.externalService.getHttp().delete(`${this.externalService.getURL()}/administration/` +
    `${this.resourceInfo.resourceName}/${groupId}/group-members/${userId}`);
  }
}
