import { forwardRef, Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { getUrlWithProtocol, isCorrectUrl } from 'core/utilities';

@Component({
  selector: 'core-input-url',
  templateUrl: './input-url.component.html',
  styleUrls: ['./input-url.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputUrlComponent),
      multi: true,
    },
  ],
})
export class InputUrlComponent implements ControlValueAccessor {  
  url: string;
  isCorrectUrl = false;
  isReadOnly: boolean;

  private onChange: any;
  private onTouch: any;

  writeValue(url: string): void {
    this.url = url;
    this.isCorrectUrl = isCorrectUrl(this.url);
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

  onChangeUrl(value: string): void {
    this.url = value;
    this.onChange(value);
    this.isCorrectUrl = isCorrectUrl(this.url);
  }

  openUrl(target: HTMLElement): void {
    target.blur();
    window.open(getUrlWithProtocol(this.url), '_blank');
  }
}
