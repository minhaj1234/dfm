import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbAlertModule, NbButtonModule, NbCardModule, NbLayoutModule, NbListModule, NbSpinnerModule, NbThemeModule } from '@nebular/theme';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CoreComponentsModule } from 'core/components';
import { I18nModule } from 'core/i18n';
import { CallbackComponent } from './callback/callback.component';
import { EditVersionInformationContainerComponent } from './edit-version-information-container/edit-version-information-container.component';
import { LoggedOutComponent } from './logged-out/logged-out.component';
import { LoginContainerComponent } from './login-container/login-container.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    CallbackComponent,
    LoggedOutComponent,
    NotFoundComponent,
    LoginContainerComponent,
    EditVersionInformationContainerComponent,
  ],
  imports: [
    TranslateModule,
    NbThemeModule.forRoot(),
    NbCardModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NbListModule,
    NbSpinnerModule,
    NbButtonModule,
    NbLayoutModule,
    NbAlertModule,
    CoreComponentsModule
  ],
  exports: [
    CallbackComponent,
    LoggedOutComponent,
    NotFoundComponent,
    LoginContainerComponent,
    EditVersionInformationContainerComponent,
  ]
})
export class CoreContainersModule { }
