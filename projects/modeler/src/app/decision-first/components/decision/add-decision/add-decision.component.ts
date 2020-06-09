import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { AddObjectComponent } from 'core/components';
import { MaxTextLengthCategory } from 'core/components'
import { getEnumValues  } from 'core/utilities';
import { getI18nString } from 'core/utilities';
import { defaultDecisionStatusLevel, defaultDecisionType, DecisionStatusLevel, DecisionType } from '../../../models/decision.model';
import * as fromModelerStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-add-decision',
  styleUrls: ['./add-decision.component.scss'],
  templateUrl: './add-decision.component.html',
})
export class AddDecisionComponent extends AddObjectComponent {
  maxTextLengthCategory = MaxTextLengthCategory;

  getDecisionTypeValues = getEnumValues(DecisionType);
  getI18nNameDecisionType = getI18nString;

  getDecisionStatusLevelValues = getEnumValues(DecisionStatusLevel);
  getI18nNameDecisionStatusLevel = getI18nString;

  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
    private nbDialogRef: NbDialogRef<AddDecisionComponent>,
  ) {
    super(modelerStore, nbDialogRef);
    this.formGroup = this.getDecisionForm();
    this.addAction = fromModelerStore.AddDecision;
  }

  getDecisionForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      type: new FormControl(defaultDecisionType),
      statusLevel: new FormControl(defaultDecisionStatusLevel),
      url: new FormControl(''),
      question: new FormControl(''),
    });
  }
}
