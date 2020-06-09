import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { EditObjectComponent } from 'core/components';
import { MaxTextLengthCategory } from 'core/components'
import { Config } from '../../../../config';
import { BusinessObjective } from '../../../models/businessObjective.model';
import * as fromModelerStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-edit-business-objective',
  styleUrls: ['./edit-business-objective.component.scss'],
  templateUrl: './edit-business-objective.component.html',
})
export class EditBusinessObjectiveComponent extends EditObjectComponent<BusinessObjective> {
  fromModelerStore = fromModelerStore;
  maxTextLengthCategory = MaxTextLengthCategory;

  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
  ) {
    super(modelerStore);
    this.formGroup = this.getBusinessObjectiveForm();
    this.updateAction = fromModelerStore.UpdateBusinessObjective;
    this.debounceTime = Config.debounceTime;
    this.dispatchUpdateAction = this.dispatchUpdateObjectWithTagsAction;
  }

  getBusinessObjectiveForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      url: new FormControl(''),
    });
  }

  dispatchUpdateObjectWithTagsAction(value: Partial<BusinessObjective>): void {
    this.modelerStore.dispatch(new this.updateAction({
      businessObjective: {
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
