import { forwardRef, Component } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MaxTextLengthCategory } from 'core/components'

@Component({
  selector: 'dfm-decision-answer-for-text-content',
  templateUrl: './decision-answer-for-text-content.component.html',
  styleUrls: ['./decision-answer-for-text-content.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DecisionAnswerForTextContentComponent),
      multi: true,
    },
  ],
})
export class DecisionAnswerForTextContentComponent implements ControlValueAccessor {
  text: string;
  private onChange: any;
  private onTouch: any;
  isReadOnly: boolean;
  maxTextLengthCategory = MaxTextLengthCategory;

  writeValue(value: string): void {
    this.text = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  callOnChange(): void {
    this.onChange(this.text);
  }
}
