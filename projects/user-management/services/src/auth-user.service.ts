import { Injectable } from '@angular/core';
import { ExternalService } from 'angular4-hal';
import { IGNORE_AUTHENTICATION_TOKEN_HEADER_KEY, IGNORE_AUTHENTICATION_TOKEN_HEADER_VALUE } from 'core/root-store';
import { APPLICATION_JSON_HEADER } from 'core/services';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserType, USER_MANAGEMENT_OBJECTS } from 'user-management/models';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthUserService {

  constructor(
    private externalService: ExternalService,
    private userService: UsersService) { }

  getUserInfoByEmail(email: string): Observable<{ userId: string, accountId: string, type: UserType, accountDomains: string }> {
    const headers = APPLICATION_JSON_HEADER.append(IGNORE_AUTHENTICATION_TOKEN_HEADER_KEY, IGNORE_AUTHENTICATION_TOKEN_HEADER_VALUE);
    const request = this.externalService.getHttp()
      .get(`${this.externalService.getURL()}administration/users/search/findUserByEmail?email=${email}`, {
        headers: headers,
      });
    
    return request.pipe(
      map((result: any) => ({ userId: result.id })),
      switchMap(value => this.userService.get(value.userId)),  
      switchMap(user => this.userService.withRelatedObject(user, USER_MANAGEMENT_OBJECTS.Customer.relationName)),
      map(user => ({ userId: user.id, accountId: user.account.id, type: user.type, accountDomains: user.account.domains }))
    )
  }
}
