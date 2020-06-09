import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCheckboxModule, NbThemeModule } from '@nebular/theme';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CoreComponentsModule } from 'core/components';
import { ContextMenuModule } from 'ngx-contextmenu';
import { EditImplementationComponentIconComponent } from './implementation-component-icon/edit-implementation-component-icon/edit-implementation-component-icon.component';
import { ImplementationComponentIconTableComponent } from './implementation-component-icon/implementation-component-icon-table/implementation-component-icon-table.component';
import { UploadImplementationComponentIconComponent } from './implementation-component-icon/upload-implementation-component-icon/upload-implementation-component-icon.component';

@NgModule({
  declarations: [
    ImplementationComponentIconTableComponent,
    UploadImplementationComponentIconComponent,
    EditImplementationComponentIconComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ContextMenuModule,
    NgbModule,
    NbThemeModule,
    CoreComponentsModule,
    NbCheckboxModule,
  ],
  exports: [
    UploadImplementationComponentIconComponent,
    ImplementationComponentIconTableComponent,
    EditImplementationComponentIconComponent,
  ]
})
export class CoreImplementationComponentComponentsModule { }
