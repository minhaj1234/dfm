import { Injectable } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class CustomNgbDateParserFormatter {
  format(date: NgbDateStruct): string {
    return date ? `${('0' + date.month).slice(-2)}-${('0' + date.day).slice(-2)}-${date.year}` : '';
  }
}
