import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  NbAccordionModule,
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDialogModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbRadioModule,
  NbSelectModule,
  NbSidebarModule,
  NbSpinnerModule,
  NbTabsetModule,
  NbToastrModule,
} from '@nebular/theme';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ResizableModule } from 'angular-resizable-element';
import { ContextMenuModule } from 'ngx-contextmenu';
import { NgxPrintModule } from 'ngx-print';
import { TableModule } from 'primeng/table';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  exports: [
    ContextMenuModule,
    NbAccordionModule,
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbDialogModule,
    NbInputModule,
    NbLayoutModule,
    NbListModule,
    NbSidebarModule,
    NbTabsetModule,
    NbSelectModule,
    NbRadioModule,
    NbSpinnerModule,
    NgbModule,
    NbToastrModule,
    TranslateModule,
    ResizableModule,
    TableModule,
    NgxPrintModule,
  ],
  imports: [
    ContextMenuModule.forRoot({
      useBootstrap4: true,
    }),
    NbAccordionModule,
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbDialogModule.forRoot({autoFocus: false}),
    NbInputModule,
    NbLayoutModule,
    NbListModule,
    NbSidebarModule,
    NbTabsetModule,
    NbSelectModule,
    NbRadioModule,
    NbSpinnerModule,
    NgbModule,
    NbToastrModule.forRoot(),
    TranslateModule.forChild({
      loader: {
        deps: [HttpClient],
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
      },
    }),
    ResizableModule,
    TableModule,
    NgxPrintModule,
  ],
})
export class DmsThemeModule {}
