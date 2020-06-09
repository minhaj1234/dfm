import { InjectionToken } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { IConfig } from 'core/config';

export const APP_CONFIG = new InjectionToken<IConfig>("config");
export const HTTP_ERROR_HANDLERS = new InjectionToken<Record<string, IHttpErrorHandler>>("httpErrorHandlers");
export const DEFAULT_HTTP_ERROR_HANDLER = 'DEFAULT_HTTP_ERROR_HANDLER';

export function httpErrorHandlersFactory(toastr: NbToastrService): Record<string, IHttpErrorHandler> {
  return {
    '403': (message: string, title: string) => toastr.warning(message, title),
    '404': (message: string, title: string) => toastr.danger(message, title),
    '412': (message: string, title: string) => toastr.warning(message, title),
    [DEFAULT_HTTP_ERROR_HANDLER]: (message: string, title: string) => toastr.danger(message, title),
  }
}

export type IHttpErrorHandler = (message: string, title: string) => void;
