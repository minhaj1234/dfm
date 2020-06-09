import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbAlertModule, NbCardModule, NbThemeModule } from '@nebular/theme';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CoreComponentsModule } from 'core/components';
import { CoreImplementationComponentComponentsModule } from 'core/objects/implementation-component/components';
import { EditImplementationComponentIconContainerComponent } from './edit-implementation-component-icon-container/edit-implementation-component-icon-container.component';
import { ImplementationComponentIconsContainerComponent } from './implementation-component-icons-container/implementation-component-icons-container.component';

@NgModule({
  declarations: [
    ImplementationComponentIconsContainerComponent,
    EditImplementationComponentIconContainerComponent,
  ],
  imports: [
    TranslateModule,
    NbThemeModule,
    NbCardModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NbAlertModule,
    CoreComponentsModule,
    CoreImplementationComponentComponentsModule,
  ],
  exports: [
    ImplementationComponentIconsContainerComponent,
    EditImplementationComponentIconContainerComponent,
  ]
})
export class CoreImplementationComponentContainersModule { }
