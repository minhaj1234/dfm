import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { NbThemeModule, NbToastrModule, NbToastrService } from '@nebular/theme';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpErrorMessageService } from '../http-error-message-service/http-error-message.service';
import { MessageService } from './message.service';

class FakeHttpErrorMessageService {
  handle(error: HttpErrorResponse, title: string) { }
}

describe('MessageService', () => {
  let service: MessageService;
  let toastr: NbToastrService;
  let translateService: TranslateService;
  let httpErrorMessageService: HttpErrorMessageService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NbToastrModule.forRoot(), NbThemeModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        MessageService, 
        NbToastrService, 
        TranslateService, 
        { provide: HttpErrorMessageService, useClass: FakeHttpErrorMessageService}
      ],
    });
    toastr = TestBed.get(NbToastrService);
    service = TestBed.get(MessageService);
    translateService = TestBed.get(TranslateService);
    httpErrorMessageService = TestBed.get(HttpErrorMessageService);

    spyOn(toastr, 'danger');
    spyOn(toastr, 'warning');
    spyOn(httpErrorMessageService, 'handle');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('showError', () => {
      describe('when error is HttpErrorResponse', () => {
        it('shoud call httpErrorMessageService.hanlde', () => {
          const error = new HttpErrorResponse({status: 1});
    
          service.handleError(error, 'title123');
    
          expect(httpErrorMessageService.handle).toHaveBeenCalledWith(error, 'title123');
        });
      });
    
      describe('when error is not HttpErrorResponse', () => {
        it('shoud call toastr.danger', () => {
          const error = new Error('error message');

          service.handleError(error, 'title123');
    
          expect(toastr.danger).toHaveBeenCalledWith(error.message, 'title123');
        });
      });
    });

  describe('showWarning', () => {
    it('shoud call toastr.warning', () => {
      service.showWarning(['message1', 'message2'], 'title123');

      expect(toastr.warning).toHaveBeenCalledWith('message1message2', 'title123', {preventDuplicates: true});
    });
  });
});
