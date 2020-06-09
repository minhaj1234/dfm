import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { AddObjectComponent } from 'core/components';
import { MaxTextLengthCategory } from 'core/components'
import { getEnumValues  } from 'core/utilities';
import { getI18nString } from 'core/utilities';
import { defaultInputDataType, InputDataType } from '../../../models/inputData.model';
import * as fromModelerStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-add-input-data',
  templateUrl: './add-input-data.component.html',
  styleUrls: ['./add-input-data.component.scss']
})
export class AddInputDataComponent extends AddObjectComponent {
  getInputDataTypeValues = getEnumValues(InputDataType);
  getI18nNameInputDataType = getI18nString;
  maxTextLengthCategory = MaxTextLengthCategory;

  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
    private nbDialogRef: NbDialogRef<AddInputDataComponent>,
  ) {
    super(modelerStore, nbDialogRef);
    this.formGroup = this.getInputDataForm();
    this.addAction = fromModelerStore.AddInputData;
  }

  getInputDataForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      type: new FormControl(defaultInputDataType),
      url: new FormControl(''),
    });
  }
}
