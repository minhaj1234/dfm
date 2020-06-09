import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbAlertModule, NbCardModule } from '@nebular/theme';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CoreComponentsModule } from 'core/components';
import { AddCustomerComponent } from './customer/add-customer/add-customer.component';
import { EditCustomerComponent } from './customer/edit-customer/edit-customer.component';
import { AddGroupComponent } from './group/add-group/add-group.component';
import { EditGroupComponent } from './group/edit-group/edit-group.component';
import { GroupsTableComponent } from './group/groups-table/groups-table.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { ChangePasswordComponent } from './user/change-password/change-password.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { UsersTableComponent } from './user/users-table/users-table.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AddCustomerComponent,
    EditCustomerComponent,
    AddUserComponent,
    EditUserComponent,
    UsersTableComponent,
    AddGroupComponent,
    EditGroupComponent,
    GroupsTableComponent,
    ChangePasswordComponent,
  ],
  entryComponents: [
    AddCustomerComponent,
    AddUserComponent,
    AddGroupComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreComponentsModule,
    NbCardModule,
    NbAlertModule,
    TranslateModule.forChild({
      loader: {
        deps: [HttpClient],
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
      },
    }),
  ],
  exports: [
    AddCustomerComponent,
    EditCustomerComponent,
    AddUserComponent,
    EditUserComponent,
    UsersTableComponent,
    AddGroupComponent,
    EditGroupComponent,
    GroupsTableComponent,
    ChangePasswordComponent,
  ]
})
export class UserManagementComponentsModule { }
