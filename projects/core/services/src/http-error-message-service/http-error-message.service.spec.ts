import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { NbThemeModule, NbToastrModule, NbToastrService } from '@nebular/theme';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { httpErrorHandlersFactory, HTTP_ERROR_HANDLERS } from '../constants';
import { HTTP_ERRORS_MESSAGES } from '../http-error-handlers/http-error-handlers.const';
import { HttpErrorMessageService } from '../http-error-message-service/http-error-message.service';

describe('HttpErrorMessageService', () => {
  let service: HttpErrorMessageService;
  let toastr: NbToastrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NbToastrModule.forRoot(), NbThemeModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        HttpErrorMessageService,
        NbToastrService,
        TranslateService, 
        { 
          provide: HTTP_ERROR_HANDLERS,
          useFactory: httpErrorHandlersFactory,
          deps: [NbToastrService, TranslateService]
        },
      ],
    });
    service = TestBed.get(HttpErrorMessageService);

    toastr = TestBed.get(NbToastrService);
    spyOn(toastr, 'warning');
    spyOn(toastr, 'danger');
  });

  it('should be created', () => {   
    expect(service).toBeTruthy();
  });

  describe('handle', () => {
    it('should call toastr danger for default error', () => {
      const httpErrorResponce = new HttpErrorResponse({status: 1, error: {detailMessage: 'resources.message'}});
     
      service.handle(httpErrorResponce, 'title');

      expect(toastr.danger).toHaveBeenCalledWith(httpErrorResponce.error.detailMessage, 'title');
    });

    it('should call toastr warning for 403 error', () => {
      const httpErrorResponce = new HttpErrorResponse({status: 403, error: {detailMessage: 'resources.message'}});
     
      service.handle(httpErrorResponce, 'title');

      expect(toastr.warning).toHaveBeenCalledWith(httpErrorResponce.error.detailMessage, 'title');
    });

    it('should call toastr danger for 404 error', () => {
      const httpErrorResponce = new HttpErrorResponse({status: 404, error: {detailMessage: 'resources.message'}});
     
      service.handle(httpErrorResponce, 'title');

      expect(toastr.danger).toHaveBeenCalledWith(HTTP_ERRORS_MESSAGES[404], 'title');
    });

    it('should call toastr warning for 412 error', () => {
      const httpErrorResponce = new HttpErrorResponse({status: 412, error: {detailMessage: 'resources.message'}});
     
      service.handle(httpErrorResponce, 'title');

      expect(toastr.warning).toHaveBeenCalledWith(httpErrorResponce.error.detailMessage, 'title');
    });

    it('should display detailMessage property', () => {
      const httpErrorResponce = new HttpErrorResponse({status: 400, error: {detailMessage: 'resources.detailMessage', userMessage: 'userMessage'}});

      service.handle(httpErrorResponce, 'title');

      expect(toastr.danger).toHaveBeenCalledWith(httpErrorResponce.error.detailMessage, 'title');
    });

    it('should display userMessage property', () => {
      const httpErrorResponce = new HttpErrorResponse({status: 400, error: {detailMessage: 'detailMessage', userMessage: 'resources.userMessage'}});

      service.handle(httpErrorResponce, 'title');

      expect(toastr.danger).toHaveBeenCalledWith(httpErrorResponce.error.userMessage, 'title');
    });

    it('should display message property', () => {
      const httpErrorResponce = new HttpErrorResponse({status: 400, error: {detailMessage: 'detailMessage', userMessage: 'userMessage'}});

      service.handle(httpErrorResponce, 'title');

      expect(toastr.danger).toHaveBeenCalledWith(httpErrorResponce.message, 'title');
    });
  });
});
