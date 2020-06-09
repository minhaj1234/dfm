import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';
import { HttpErrorMessageService } from '../http-error-message-service/http-error-message.service';

@Injectable()
export class MessageService {
  constructor(
    private toastr: NbToastrService, 
    private translateService: TranslateService, 
    private httpErrorMessageService: HttpErrorMessageService
  ) {}

  handleError(error: Error, title: string): void {
    if (error instanceof HttpErrorResponse) {
      this.httpErrorMessageService.handle(error, title)
    } else {
      this.showError(error, title);
    }
  }
  
  showError(error: Error, title: string): void {
    const messageError$ = this.translateService.get(error.message);
    const title$ = this.translateService.get(title);

    combineLatest([messageError$, title$]).subscribe((values) => this.toastr.danger(...values));
    console.error(error);
  }

  showWarning(messages: string[], title: string): void {
    let message = "";
    const title$ = this.translateService.get(title);
    const masseges$ = messages.map((value) => this.translateService.get(value));

    combineLatest(masseges$).subscribe((values) => {
      values.forEach((value) => {
        message += value;
      })
    });

    title$.subscribe((value) => this.toastr.warning(message, value, {preventDuplicates: true}));
    console.error(messages);
  }

  showSuccess(messages: string[], title: string): void {
    let message = "";
    const title$ = this.translateService.get(title);
    const masseges$ = messages.map((value) => this.translateService.get(value));

    combineLatest(masseges$).subscribe((values) => {
      values.forEach((value) => {
        message += value;
      })
    });

    title$.subscribe((value) => this.toastr.success(message, value, {preventDuplicates: true}));
  }
}
