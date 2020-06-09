import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { StompRService } from '@stomp/ng2-stompjs';
import { CoreComponentsModule } from 'core/components';
import { CoreContainersModule } from 'core/containers';
import { CoreImplementationComponentContainersModule } from 'core/objects/implementation-component/containers';
import { ImplementationComponentsIconsService } from 'core/objects/implementation-component/services';
import { UserManagementComponentsModule } from 'user-management/components';
import { UserManagementContainersModule } from 'user-management/containers';
import { AdminThemeModule } from '../../theme';
import * as fromComponents from './components';
import * as fromContainers from './containers';
import { effects, reducers, userOwnProfileReducer } from './store';

export const ROUTES: Routes = [
  {
    component: fromContainers.MainContainerComponent,
    path: '',
  },
];

@NgModule({
  declarations: [
    ...fromContainers.containers,
    ...fromComponents.components,
  ],
  entryComponents: [...fromComponents.components],
  exports: [],
  imports: [
    TranslateModule,
    CommonModule,
    CoreComponentsModule,
    StoreModule.forFeature('DecisionFirst', reducers),
    StoreModule.forFeature('userOwnProfile', userOwnProfileReducer),
    EffectsModule.forFeature(effects),
    ReactiveFormsModule,
    RouterModule.forChild(ROUTES),
    AdminThemeModule,
    UserManagementContainersModule,
    UserManagementComponentsModule,
    CoreImplementationComponentContainersModule,
    CoreContainersModule,
  ],
  providers: [
    ImplementationComponentsIconsService,
    StompRService,
  ],
})
export class DecisionFirstModule {}

