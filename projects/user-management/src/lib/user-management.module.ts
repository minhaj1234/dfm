import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { USER_INFO_PROVIDER } from 'core/root-store';
import { UserManagementComponentsModule } from 'user-management/components';
import { UserManagementContainersModule } from 'user-management/containers';
import { AuthUserService, CustomersService, GroupsService, RELATED_CUSTOMERS_SERVICE, RELATED_GROUPS_SERVICE, RELATED_USERS_SERVICE, UsersService } from 'user-management/services';

@NgModule({
  imports: [
    UserManagementComponentsModule,
    UserManagementContainersModule,
  ],
  exports: [
  ],
  providers: [
    UsersService,
    GroupsService,
    CustomersService,
    { provide: RELATED_USERS_SERVICE, useClass: UsersService },
    { provide: RELATED_GROUPS_SERVICE, useClass: GroupsService },
    { provide: RELATED_CUSTOMERS_SERVICE, useClass: CustomersService },
    { provide: USER_INFO_PROVIDER, useClass: AuthUserService}
  ]
})
export class UserManagementModule {
}
