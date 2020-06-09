import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbAlertModule, NbButtonModule, NbLayoutModule, NbListModule, NbSpinnerModule, NbThemeModule } from '@nebular/theme';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ContextMenuModule } from 'ngx-contextmenu';
import { QuillModule } from 'ngx-quill';
import { AddObjectComponent } from './add-object/add-object.component';
import { AutocompleteListComponent } from './autocomplete-list/autocomplete-list.component';
import { DateTimePickerComponent } from './date-time-picker/date-time-picker.component';
import { EditObjectComponent } from './edit-object/edit-object.component';
import { EditVersionInformationComponent } from './edit-version-information/edit-version-information.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { InputUrlComponent } from './input-url/input-url.component';
import { LoginComponent } from './login/login.component';
import { LogoComponent } from './logo/logo.component';
import { EditMultipleLinesControlComponent } from './multiple-lines-control/edit-multiple-lines-control/edit-multiple-lines-control.component';
import { ViewMultipleLinesControlComponent } from './multiple-lines-control/view-multiple-lines-control/view-multiple-lines-control.component';
import { ObjectsListComponent } from './objects-list/objects-list.component';
import { PaginationLoadMoreComponent } from './pagination-load-more/pagination-load-more.component';
import { ObjectTagsComponent } from './tags/object-tags/object-tags.component';
import { TagComponent } from './tags/tag/tag.component';
import { UploadFileComponent } from './upload-file/upload-file.component';

@NgModule({
  declarations: [
    AddObjectComponent,
    EditObjectComponent,
    ObjectsListComponent,
    InputUrlComponent,
    DateTimePickerComponent,
    PaginationLoadMoreComponent,
    EditMultipleLinesControlComponent,
    ViewMultipleLinesControlComponent,
    TagComponent,
    ObjectTagsComponent,
    AutocompleteListComponent,
    LoginComponent,
    LogoComponent,
    ForgotPasswordComponent,
    UploadFileComponent,
    EditVersionInformationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ContextMenuModule,
    NgbModule,
    QuillModule,
    NbThemeModule,
    NbListModule,
    NbSpinnerModule,
    NbButtonModule,
    NbLayoutModule,
    NbAlertModule
  ],
  exports: [
    AddObjectComponent,
    EditObjectComponent,
    ObjectsListComponent,
    InputUrlComponent,
    DateTimePickerComponent,
    PaginationLoadMoreComponent,
    EditMultipleLinesControlComponent,
    ViewMultipleLinesControlComponent,
    TagComponent,
    ObjectTagsComponent,
    AutocompleteListComponent,
    LoginComponent,
    LogoComponent,
    ForgotPasswordComponent,
    UploadFileComponent,
    EditVersionInformationComponent,
  ]
})
export class CoreComponentsModule { }
