import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbCardModule } from '@nebular/theme';
import { CoreComponentsModule } from 'core/components';
import { CoreContainersModule } from 'core/containers';
import { CoreImplementationComponentContainersModule } from 'core/objects/implementation-component/containers';
import { UserManagementComponentsModule } from 'user-management/components';
import { EditCustomerContainerTabComponent } from './edit-customer-container-tab/edit-customer-container-tab.component';
import { EditCustomerContainerComponent } from './edit-customer-container/edit-customer-container.component';
import { EditGroupContainerComponent } from './edit-group-container/edit-group-container.component';
import { EditUserContainerComponent } from './edit-user-container/edit-user-container.component';

@NgModule({
  declarations: [
    EditCustomerContainerComponent,
    EditCustomerContainerTabComponent,
    EditUserContainerComponent,
    EditGroupContainerComponent,
  ],
  entryComponents: [],
  imports: [
    CoreImplementationComponentContainersModule,
    CommonModule,
    NbCardModule,
    UserManagementComponentsModule,
  ],
  exports: [
    EditCustomerContainerComponent,
    EditCustomerContainerTabComponent,
    EditUserContainerComponent,
    EditGroupContainerComponent,
  ]
})
export class UserManagementContainersModule { }