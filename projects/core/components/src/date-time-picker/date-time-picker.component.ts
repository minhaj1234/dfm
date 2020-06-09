import { forwardRef, Component, Input, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'core-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerComponent),
      multi: true,
    },
  ],
})
export class DateTimePickerComponent implements OnInit, ControlValueAccessor {
  dateTime: Date;
  date: NgbDateStruct;
  time: NgbTimeStruct;

  private formControl: AbstractControl;
  private onChange: any;
  private onTouch: any;
  isReadOnly: boolean;

  @Input() showTime = true;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.removePlaceholdersTimepicker();
  }

  writeValue(dateTime: Date): void {
    this.dateTime = dateTime;
    this.fillValuesDateTimePicker();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(value: boolean): void {
    this.isReadOnly = value;
  }

  fillValuesDateTimePicker(): void {
    if (this.dateTime) {
      this.date = {
        day: this.dateTime.getDate(),
        month: this.dateTime.getMonth() + 1,
        year: this.dateTime.getFullYear(),
      };
      this.time = {
        hour: this.dateTime.getHours(),
        minute: this.dateTime.getMinutes(),
        second: 0,
      };
    } else {
      this.date = null;
      this.time = null;
    }
  }

  fillDateTime(): void {
    if (!this.date) this.fillDateDefaultValue();
    if (!this.time) this.fillTimeDefaultValue();

    this.dateTime = new Date(this.date.year, this.date.month - 1, this.date.day, this.time.hour, this.time.minute, 0);

    this.onChange(this.dateTime);
  }

  fillDateDefaultValue(): void {
    const currentDateTime = new Date();

    this.date = {
      year: currentDateTime.getFullYear(),
      month: currentDateTime.getMonth() + 1,
      day: currentDateTime.getDate(),
    };
  }

  fillTimeDefaultValue(): void {
    this.time = {
      hour: 1,
      minute: 0,
      second: 0,
    };
  }

  onDateChange(event: NgbDateStruct): void {
    this.fillDateTime();
  }

  onTimeChange(event: NgbTimeStruct): void {
    this.fillDateTime();
  }

  clearDateTime(): void {
    this.dateTime = null;
    this.fillValuesDateTimePicker();
    this.onChange(this.dateTime);
  }

  manageDatepicker(datepicker: any): void {
    if (datepicker.isOpen()) {
      datepicker.close();
    } else {
      datepicker.open();
      this.removeTitlesInDatepicker();
    }
  }

  removePlaceholdersTimepicker(): void {
    Array.from(document.querySelectorAll('.ngb-tp-input')).forEach((element: Element) =>
      this.renderer.removeAttribute(element, 'placeholder'),
    );
  }

  removeTitlesInDatepicker(): void {
    Array.from(document.querySelectorAll('.ngb-dp-arrow-btn')).forEach((element: Element) =>
      this.renderer.removeAttribute(element, 'title'),
    );

    Array.from(document.querySelectorAll('.custom-select')).forEach((element: Element) =>
      this.renderer.removeAttribute(element, 'title'),
    );
  }
}
