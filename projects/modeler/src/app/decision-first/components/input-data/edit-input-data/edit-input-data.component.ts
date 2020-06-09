import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { EditObjectComponent } from 'core/components';
import { MaxTextLengthCategory } from 'core/components'
import { getEnumValues  } from 'core/utilities';
import { getI18nString } from 'core/utilities';
import { Config } from '../../../../config';
import { InputData, InputDataType } from '../../../models/inputData.model';
import * as fromModelerStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-edit-input-data',
  styleUrls: ['./edit-input-data.component.scss'],
  templateUrl: './edit-input-data.component.html',
})
export class EditInputDataComponent extends EditObjectComponent<InputData> {
  fromModelerStore = fromModelerStore;
  getInputDataTypeValues = getEnumValues(InputDataType);
  getI18nNameInputDataType = getI18nString;
  maxTextLengthCategory = MaxTextLengthCategory;

  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
  ) {
    super(modelerStore);
    this.formGroup = this.getInputDataForm();
    this.updateAction = fromModelerStore.UpdateInputData;
    this.debounceTime = Config.debounceTime;
    this.dispatchUpdateAction = this.dispatchUpdateObjectWithTagsAction;
  }

  getInputDataForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      type: new FormControl(''),
      url: new FormControl(''),
      complexity: new FormControl(''),
    });
  }

  dispatchUpdateObjectWithTagsAction(value: Partial<InputData>): void {
    this.modelerStore.dispatch(new this.updateAction({
      inputData: {
        ...value,
        _links: this.editObject._links,
        id: this.editObject.id
      },
      objectTagsUpdate: {
        tags: this.editObject.tags,
        name: value.name,
        description: value.description,
      }
    }));
  }
}
