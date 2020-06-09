import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'dfm-decision-answer-yes-no',
  templateUrl: './decision-answer-yes-no.component.html',
  styleUrls: ['./decision-answer-yes-no.component.scss'],
})
export class DecisionAnswerYesNoComponent {
  @Input() answerForm: FormGroup;
  yesNoItems = [{ value: true, label: 'resources.yes' }, { value: false, label: 'resources.no' }];
}
