import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NbDialogService, NbSidebarService } from '@nebular/theme';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StompRService } from '@stomp/ng2-stompjs';
import { CoreComponentsModule } from 'core/components';
import { CoreImplementationComponentContainersModule } from 'core/objects/implementation-component/containers';
import { ImplementationComponentsIconsService } from 'core/objects/implementation-component/services';
import { NgDragDropModule } from 'ng-drag-drop';
import { QuillModule } from 'ngx-quill';
import { UserManagementContainersModule } from 'user-management/containers';
import { userOwnProfileReducer } from 'user-management/store/reducers';
import { DmsThemeModule } from '../theme';
import * as fromComponents from './components';
import { DecisionImplementationTableService } from './components/decision/decision-implementation-table/decision-implementation-table-service/decision-implementation-table.service';
import * as fromContainers from './containers';
import * as fromServices from './services';
import { effects, reducers } from './store';
import { EditDecisionTableComponentContainerComponent } from './containers/edit-decision-table-component-container/edit-decision-table-component-container.component';
import { EditRequirementNetworkContainerComponent } from './containers/edit-requirement-network-container/edit-requirement-network-container.component';

export const ROUTES: Routes = [
  {
    component: fromContainers.MainContainerComponent,
    path: '',
  },
];

@NgModule({
  declarations: [
    ...fromComponents.components,
    ...fromContainers.containers,
    EditDecisionTableComponentContainerComponent,
    EditRequirementNetworkContainerComponent,
  ],
  entryComponents: [...fromComponents.components],
  exports: [...fromComponents.components, ...fromContainers.containers],
  imports: [
    QuillModule,
    StoreModule.forFeature('DecisionFirst', reducers),
    StoreModule.forFeature('userOwnProfile', userOwnProfileReducer),
    EffectsModule.forFeature(effects),
    CommonModule,
    HttpClientModule,
    DmsThemeModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(ROUTES),
    NgDragDropModule.forRoot(),
    CoreComponentsModule,
    CoreImplementationComponentContainersModule,
    UserManagementContainersModule,
  ],
  providers: [
    ...fromServices.services,
    ImplementationComponentsIconsService,
    StompRService,
    NbSidebarService,
    NbDialogService,
    DecisionImplementationTableService,
    DatePipe
  ],
})
export class DecisionFirstModule { }
