import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { EditObjectComponent } from 'core/components';
import { MaxTextLengthCategory } from 'core/components'
import { Config } from '../../../../config';
import { ImplementationComponent } from '../../../models/implementationComponent.model';
import * as fromModelerStore from '../../../store';
import { IDecisionFirstState } from '../../../store/reducers/';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-edit-implementation-component',
  styleUrls: ['./edit-implementation-component.component.scss'],
  templateUrl: './edit-implementation-component.component.html',
})
export class EditImplementationComponentComponent extends EditObjectComponent<ImplementationComponent> {
  fromModelerStore = fromModelerStore;
  maxTextLengthCategory = MaxTextLengthCategory;

  constructor(
    private modelerStore: Store<IDecisionFirstState>,
  ) {
    super(modelerStore);
    this.formGroup = this.getImplementationComponentForm();
    this.updateAction = fromModelerStore.UpdateImplementationComponent;
    this.debounceTime = Config.debounceTime;
    this.dispatchUpdateAction = this.dispatchUpdateObjectWithTagsAction;
  }

  getImplementationComponentForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      url: new FormControl(''),
    });
  }

  dispatchUpdateObjectWithTagsAction(value: Partial<ImplementationComponent>): void {
    this.modelerStore.dispatch(new this.updateAction({
      implementationComponent: {
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
