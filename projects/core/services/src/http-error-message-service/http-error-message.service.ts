import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';
import { DEFAULT_HTTP_ERROR_HANDLER, HTTP_ERROR_HANDLERS, IHttpErrorHandler } from '../constants';
import { HTTP_ERRORS_MESSAGES } from '../http-error-handlers/http-error-handlers.const';

@Injectable()
export class HttpErrorMessageService {
  constructor(@Inject(HTTP_ERROR_HANDLERS) private httpErrorHandlers, private translateService: TranslateService) { }

  handle(httpErrorResponse: HttpErrorResponse, title: string) {
    const errorMessage$ = this.translateService.get(this.getErrorMessage(httpErrorResponse));
    const title$ = this.translateService.get(title);
    const handler = this.getHttpErrorHandler(httpErrorResponse);

    combineLatest([errorMessage$, title$]).subscribe((values) => handler(...values));

    console.error(httpErrorResponse);
  }

  private getErrorMessage(httpErrorResponse: HttpErrorResponse): string {
    if(HTTP_ERRORS_MESSAGES[httpErrorResponse.status]) {
      return HTTP_ERRORS_MESSAGES[httpErrorResponse.status];
    } else {
      return this.getResourceStringFromError(httpErrorResponse);
    }
  }

  private getResourceStringFromError(httpErrorResponse: HttpErrorResponse): string {
    const resourceRegex = /^resources./g;
    
    if(httpErrorResponse.error.detailMessage.match(resourceRegex)) {
      return httpErrorResponse.error.detailMessage;
    } else if(httpErrorResponse.error.userMessage.match(resourceRegex)) {
      return httpErrorResponse.error.userMessage;
    } else {
      return httpErrorResponse.message
    }
  }

  private getHttpErrorHandler(httpErrorResponse: HttpErrorResponse): IHttpErrorHandler {
    if (this.httpErrorHandlers[httpErrorResponse.status]) {
      return this.httpErrorHandlers[httpErrorResponse.status];
    } else {
      return this.httpErrorHandlers[DEFAULT_HTTP_ERROR_HANDLER];
    }
  }
}
