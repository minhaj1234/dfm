import { Injectable, Injector } from '@angular/core';
import { ExternalService } from 'angular4-hal';
import { IResultsWithPages } from 'core/models';
import { IGNORE_AUTHENTICATION_TOKEN_HEADER_KEY, IGNORE_AUTHENTICATION_TOKEN_HEADER_VALUE } from 'core/root-store';
import { APP_CONFIG } from 'core/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { USER_MANAGEMENT_OBJECTS } from 'user-management/models';
import { Customer } from 'user-management/models';
import { toCustomer } from 'user-management/utilities';
import { CommonAdminService } from './common-admin.service';
import { RelatedServiceFactories } from './common-admin.types';
import { RELATED_GROUPS_SERVICE, RELATED_USERS_SERVICE } from './constants';
import { GroupsService } from './groups.service';
import { UsersService } from './users.service';

@Injectable()
export class CustomersService extends CommonAdminService<Customer> {
  constructor(externalService: ExternalService, injector: Injector) {
    const relatedServiceFactories: RelatedServiceFactories = {
      [USER_MANAGEMENT_OBJECTS.User.resourceName]: () => injector.get<UsersService>(RELATED_USERS_SERVICE),
      [USER_MANAGEMENT_OBJECTS.Group.resourceName]: () => injector.get<GroupsService>(RELATED_GROUPS_SERVICE),
    }

    super(USER_MANAGEMENT_OBJECTS.Customer, externalService, injector, relatedServiceFactories);
    this.toObject = toCustomer;
    this.pageSize = injector.get(APP_CONFIG).pageSize;
  }

  getSomeMinimalWithSearch(searchTerm = '', pageNumber = 0): Observable<IResultsWithPages<Customer>> {
    const url =
      `${this.externalService.getURL()}${this._resource}/search/findAccountByName` +
      `?name=${searchTerm}&size=${this.pageSize}&page=${pageNumber}&projection=minimal`;
    return this.externalService
      .getHttp()
      .get(url)
      .pipe(map((object: any) => this.toPageableObject(object)));
  }

  getBySelfLink(url: string): Observable<any> {
    const correctProjectionUrl = url.replace('?projection=minimal', '?projection=edit');
    return this.externalService
      .getHttp()
      .get(correctProjectionUrl, { headers: { [IGNORE_AUTHENTICATION_TOKEN_HEADER_KEY]: IGNORE_AUTHENTICATION_TOKEN_HEADER_VALUE } });
  }
}
