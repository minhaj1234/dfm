import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { merge } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'dfm-decision-answer-date-time',
  templateUrl: './decision-answer-date-time.component.html',
  styleUrls: ['./decision-answer-date-time.component.scss'],
})
export class DecisionAnswerDateTimeComponent implements OnInit, OnDestroy {
  @Input() answerForm: FormGroup;
  isListenValueChanges = true;

  ngOnInit() {
    this.subscribeDateTimeControlsValueChanges();
  }

  subscribeDateTimeControlsValueChanges(): void {
    merge(
      this.answerForm.controls['minimumDateTime'].valueChanges,
      this.answerForm.controls['maximumDateTime'].valueChanges,
      this.answerForm.controls['defaultDateTime'].valueChanges,
    )
      .pipe(
        filter(() => this.isListenValueChanges),
        untilDestroyed(this),
      )
      .subscribe((value) => this.callDateTimeValidators());
  }

  callDateTimeValidators(): void {
    this.isListenValueChanges = false;
    this.answerForm.controls['minimumDateTime'].updateValueAndValidity();
    this.answerForm.controls['maximumDateTime'].updateValueAndValidity();
    this.answerForm.controls['defaultDateTime'].updateValueAndValidity();
    this.isListenValueChanges = true;
  }

  ngOnDestroy() {}
}
