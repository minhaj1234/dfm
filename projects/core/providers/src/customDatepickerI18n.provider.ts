import { Injectable } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class CustomDatepickerI18n {
  getWeekdayShortName(weekday: number): string {
    return weekday.toString();
  }

  getMonthShortName(month: number): string {
    return month.toString();
  }

  getMonthFullName(month: number): string {
    return month.toString();
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return date.day.toString();
  }

  getDayNumerals(date: NgbDateStruct): string {
    return date.day.toString();
  }

  getWeekNumerals(weekNumber: number): string {
    return weekNumber.toString();
  }

  getYearNumerals(year: number): string {
    return year.toString();
  }
}
