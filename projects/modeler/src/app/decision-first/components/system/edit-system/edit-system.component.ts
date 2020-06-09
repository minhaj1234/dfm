import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { EditObjectComponent } from 'core/components';
import { MaxTextLengthCategory } from 'core/components'
import { Config } from '../../../../config';
import { System } from '../../../models/system.model';
import * as fromModelerStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-edit-system',
  styleUrls: ['./edit-system.component.scss'],
  templateUrl: './edit-system.component.html',
})
export class EditSystemComponent extends EditObjectComponent<System> {
  fromModelerStore = fromModelerStore;
  maxTextLengthCategory = MaxTextLengthCategory;

  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
  ) {
    super(modelerStore);
    this.formGroup = this.getSystemForm();
    this.updateAction = fromModelerStore.UpdateSystem;
    this.debounceTime = Config.debounceTime;
    this.dispatchUpdateAction = this.dispatchUpdateObjectWithTagsAction;
  }

  getSystemForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      url: new FormControl(''),
    });
  }

  dispatchUpdateObjectWithTagsAction(value: Partial<System>): void {
    this.modelerStore.dispatch(new this.updateAction({
      system: {
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
