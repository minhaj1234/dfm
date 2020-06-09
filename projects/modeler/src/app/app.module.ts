import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { USER_PROVIDED_META_REDUCERS } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CoreModule } from 'core';
import { getUserMetaReducers } from 'core/root-store';
import { APP_CONFIG } from 'core/services';
import { UserManagementModule } from 'user-management';
import { environment } from '../environments/environment';
import { ROUTES } from './app-routing.module';
import { AppComponent } from './app.component';
import { Config } from './config';
import { ExternalConfigurationService } from './providers/externalConfigurationService.provider';
import { DmsThemeModule } from './theme';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [
    StoreDevtoolsModule.instrument({
      logOnly: environment.production,
      maxAge: 25,
    }),
    RouterModule.forRoot(ROUTES),
    DmsThemeModule,
    CoreModule,
    UserManagementModule,
  ],
  providers: [
    { provide: APP_CONFIG, useFactory: () => Config },
    { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
    { provide: USER_PROVIDED_META_REDUCERS, useFactory: getUserMetaReducers },
  ],
})
export class AppModule {}
