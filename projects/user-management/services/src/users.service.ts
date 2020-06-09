import { Injectable, Injector } from '@angular/core';
import { ExternalService } from 'angular4-hal';
import { ChangePasswordRequest } from 'core/models';
import { AUTH_BASE_URL, CHANGE_PASSWORD, IGNORE_AUTHENTICATION_TOKEN_HEADER_KEY, IGNORE_AUTHENTICATION_TOKEN_HEADER_VALUE } from 'core/root-store';
import { APP_CONFIG, APPLICATION_JSON_HEADER } from 'core/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, USER_MANAGEMENT_OBJECTS } from 'user-management/models';
import { ISuperAdminUser } from 'user-management/models';
import { toUser } from 'user-management/utilities';
import { CommonAdminService } from './common-admin.service';
import { RELATED_CUSTOMERS_SERVICE, RELATED_GROUPS_SERVICE } from './constants';
import { CustomersService } from './customers.service';
import { GroupsService } from './groups.service';

@Injectable()
export class UsersService extends CommonAdminService<User> {
  constructor(externalService: ExternalService, injector: Injector) {
    const relatedServiceFactories = {
      [USER_MANAGEMENT_OBJECTS.Group.resourceName]: () => injector.get<GroupsService>(RELATED_GROUPS_SERVICE),
      [USER_MANAGEMENT_OBJECTS.Customer.relationName]: () => injector.get<CustomersService>(RELATED_CUSTOMERS_SERVICE),
    };

    super(USER_MANAGEMENT_OBJECTS.User, externalService, injector, relatedServiceFactories);
    this.toObject = toUser;
    this.pageSize = injector.get(APP_CONFIG).pageSize;
  }

  createUser(user: User, accountId: string): Observable<Object> {
    return this.externalService.getHttp().post(`${this.externalService.getURL()}/administration/accounts/${accountId}/users`, user, {
      headers: APPLICATION_JSON_HEADER,
    });
  }

  get(id: string): Observable<User> {
    return this.externalService.getHttp()
      .get(
        `${this.externalService.getURL()}${this._resource}/${id}?projection=minimal`,
        { headers: { [IGNORE_AUTHENTICATION_TOKEN_HEADER_KEY]: IGNORE_AUTHENTICATION_TOKEN_HEADER_VALUE } }
      )
      .pipe(map(this.toObject));
  }

  addGroupsToUser(userId: string, groupsIds: string[]): Observable<Object> {
    return this.externalService.getHttp().patch(`${this.externalService.getURL()}administration/`+
    `${this.resourceInfo.resourceName}/${userId}/user-groups`, {
      [USER_MANAGEMENT_OBJECTS.Group.listName]: groupsIds
    }, {
      headers: APPLICATION_JSON_HEADER,
    });
  }

  removeGroupFromUser(userId: string, groupId: string): Observable<Object> {
    return this.externalService.getHttp().delete(`${this.externalService.getURL()}/administration/` +
    `${this.resourceInfo.resourceName}/${userId}/user-groups/${groupId}`);
  }

  changePassword(body: ChangePasswordRequest): Observable<Object> {
    const url = `${AUTH_BASE_URL}${CHANGE_PASSWORD}`;

    return this.externalService.getHttp().post(url, body);
  }

  isSuperAdmin(): Observable<boolean> {
    return this.externalService.getHttp()
    .get(`${this.externalService.getURL()}administration/users/isSuperAdminUser`)
      .pipe(
        map((result: ISuperAdminUser) => result.isSuperAdminUser)
      );
  }
}
