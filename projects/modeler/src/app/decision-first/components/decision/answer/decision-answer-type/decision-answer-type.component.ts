import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AnswerType, AnswerTypeTranslationString } from '../../../../models/decision.model';

@Component({
  selector: 'dfm-decision-answer-type',
  templateUrl: './decision-answer-type.component.html',
  styleUrls: ['./decision-answer-type.component.scss'],
})
export class DecisionAnswerTypeComponent {
  @Input() answerForm: FormGroup;

  answerTypes = [
    { value: AnswerType.YesNo, label: AnswerTypeTranslationString[AnswerType.YesNo] },
    { value: AnswerType.DefinedList, label: AnswerTypeTranslationString[AnswerType.DefinedList] },
    { value: AnswerType.ExternalValueList, label: AnswerTypeTranslationString[AnswerType.ExternalValueList] },
    { value: AnswerType.NumberInRange, label: AnswerTypeTranslationString[AnswerType.NumberInRange] },
    { value: AnswerType.Text, label: AnswerTypeTranslationString[AnswerType.Text] },
    { value: AnswerType.DateTime, label: AnswerTypeTranslationString[AnswerType.DateTime] },
    { value: AnswerType.Other, label: AnswerTypeTranslationString[AnswerType.Other] },
  ];
}
