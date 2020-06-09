import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { of, Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { Config } from '../../../../../config';
import { Answer, AnswerItem, AnswerType, AnswerTypeTranslationString, Decision } from '../../../../models/decision.model';
import { DecisionAnswerService } from '../../../../services/decision-answer.service';
import * as fromModelerStore from '../../../../store';
import { answerRangeValidator } from '../../../../validators/answer/answer-range.validator';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-decision-answer',
  templateUrl: './decision-answer.component.html',
  styleUrls: ['./decision-answer.component.scss'],
  providers: [DatePipe],
})
export class DecisionAnswerComponent implements OnDestroy {
  private _decision: Decision;
  answerForm: FormGroup;
  answerType = AnswerType;
  
  @Input()
  set decision(decision: Decision) {
    this._decision = decision;
    if (this._decision) {
      this.setValueAnswerForm(this._decision.answer);
    }
  }
  get decision(): Decision {
    return this._decision;
  }

  @Input() isReadOnly: boolean;

  get answerItems(): AnswerItem[] {
    return this.decision.answer.answerItems; 
  }

  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
    private decisionAnswerService: DecisionAnswerService,
  ) {
    this.createAnswerForm();
    this.subscribeAnswerFormValueChanges();
  }

  createAnswerForm(): void {
    this.answerForm = new FormGroup({
      answerTypeId: new FormControl(''),
      isCollection: new FormControl(''),
      yesNo: new FormControl(true),
      answerItems: new FormControl(''),
      defaultAnswerItemId: new FormControl(''),
      externalValueList: new FormControl(''),
      minimumNumber: new FormControl('', [answerRangeValidator('minimumNumber', 'maximumNumber', 'defaultNumber')]),
      maximumNumber: new FormControl('', [answerRangeValidator('minimumNumber', 'maximumNumber', 'defaultNumber')]),
      defaultNumber: new FormControl('', [answerRangeValidator('minimumNumber', 'maximumNumber', 'defaultNumber')]),
      minimumDateTime: new FormControl('', [answerRangeValidator('minimumDateTime', 'maximumDateTime', 'defaultDateTime')]),
      maximumDateTime: new FormControl('', [answerRangeValidator('minimumDateTime', 'maximumDateTime', 'defaultDateTime')]),
      defaultDateTime: new FormControl('', [answerRangeValidator('minimumDateTime', 'maximumDateTime', 'defaultDateTime')]),
      text: new FormControl(''),
      other: new FormControl(''),
      supportingInformation: new FormControl(''),
    });
  }

  subscribeAnswerFormValueChanges(): void {
    this.answerForm.valueChanges
    .pipe(
      untilDestroyed(this),
      debounceTime(Config.debounceTime),
    )
    .subscribe((value: Answer) => {
      if (this.answerForm.valid) {
        this.modelerStore.dispatch(new fromModelerStore.UpdateAnswer({
          answer: {...value, id: this.decision.answer.id},
          decision: this.decision,
        }));
      }
    });
  }

  setValueAnswerForm(answer: Answer): void {
    if (answer && this.answerForm) {
      this.answerForm.setValue({
        answerTypeId: answer.answerTypeId || null,
        isCollection: answer.isCollection || null,
        yesNo: answer.yesNo || false,
        answerItems: answer.answerItems || [],
        defaultAnswerItemId: answer.defaultAnswerItemId || null,
        externalValueList: answer.externalValueList || null,
        minimumNumber: answer.minimumNumber || null,
        maximumNumber: answer.maximumNumber || null,
        defaultNumber: answer.defaultNumber || null,
        minimumDateTime: answer.minimumDateTime || null,
        maximumDateTime: answer.maximumDateTime || null,
        defaultDateTime: answer.defaultDateTime || null,
        text: answer.text || null,
        other: answer.other || null,
        supportingInformation: answer.supportingInformation || null,
      }, 
      { 
        emitEvent: false 
      });
    }
  }

  getNameAnswerType(): Observable<string> {
    return this.decisionAnswerService.getNameAnswerType(this.answerForm.getRawValue());
  }

  getAnswerTextValue(): Observable<string> {
    return this.decisionAnswerService.getAnswerTextValue(this.answerForm.getRawValue());
  }

  getAnswerSupportingInformation(): Observable<string> {
    return this.decisionAnswerService.getAnswerSupportingInformation(this.answerForm.getRawValue())
  }

  ngOnDestroy() { }
}
