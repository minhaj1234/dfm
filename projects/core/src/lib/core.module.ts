import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbToastrService } from '@nebular/theme';
import { NgbDatepickerI18n, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { AngularHalModule } from 'angular4-hal';
import { TokenInterceptorService } from 'core/auth';
import { CoreComponentsModule } from 'core/components';
import { CoreContainersModule } from 'core/containers';
import { I18nModule } from 'core/i18n';
import { CoreImplementationComponentComponentsModule } from 'core/objects/implementation-component/components';
import { CoreImplementationComponentContainersModule } from 'core/objects/implementation-component/containers';
import { CustomDatepickerI18n, CustomNgbDateParserFormatter } from 'core/providers';
import { RootStoreModule, VersionInformationService } from 'core/root-store';
import { 
  httpErrorHandlersFactory, 
  HttpErrorMessageService, 
  HTTP_ERROR_HANDLERS, 
  KeyboardService, 
  MessageService, 
} from 'core/services';
import AbstractXHRObject from 'sockjs-client/lib/transport/browser/abstract-xhr';

const _start = AbstractXHRObject.prototype._start;

// Monkey patching sockjs-client because there is no option to avoid sending credentials - causes CORS errors otherwise
AbstractXHRObject.prototype._start = function(method, url, payload, opts) {
  if (!opts) {
    opts = { noCredentials: true };
  } else {
    opts = {
      ...opts,
      noCredentials: true,
    };
  }
  return _start.call(this, method, url, payload, opts);
};

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularHalModule.forRoot(),
    RootStoreModule,
    I18nModule,
    CoreContainersModule,
    CoreComponentsModule,
    CoreImplementationComponentContainersModule,
    CoreImplementationComponentComponentsModule,
    NbThemeModule.forRoot(),
    HttpClientModule,
  ],
  exports: [
  ],
  providers: [
    MessageService,
    HttpErrorMessageService,
    { 
      provide: HTTP_ERROR_HANDLERS,
      useFactory: httpErrorHandlersFactory,
      deps: [NbToastrService]
    },
    KeyboardService,
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
    },
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    { provide: NgbDateParserFormatter, useClass: CustomNgbDateParserFormatter },
  ]
})
export class CoreModule { }
