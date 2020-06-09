import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'dfm-decision-answer-number-in-range',
  templateUrl: './decision-answer-number-in-range.component.html',
  styleUrls: ['./decision-answer-number-in-range.component.scss'],
})
export class DecisionAnswerNumberInRangeComponent {
  @Input() answerForm: FormGroup;

  callNumberInRangeValidators(): void {
    this.answerForm.controls['minimumNumber'].updateValueAndValidity();
    this.answerForm.controls['maximumNumber'].updateValueAndValidity();
    this.answerForm.controls['defaultNumber'].updateValueAndValidity();
  }
}
