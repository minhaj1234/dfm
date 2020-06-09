import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MaxTextLengthCategory } from 'core/components'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-decision-answer-supporting-information',
  templateUrl: './decision-answer-supporting-information.component.html',
  styleUrls: ['./decision-answer-supporting-information.component.scss'],
})
export class DecisionAnswerSupportingInformationComponent {
  maxTextLengthCategory = MaxTextLengthCategory;
  @Input() answerForm: FormGroup;
}
