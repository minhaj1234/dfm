import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { EditObjectComponent } from 'core/components';
import { MaxTextLengthCategory } from 'core/components'
import { getEnumValues  } from 'core/utilities';
import { getI18nString } from 'core/utilities';
import { Config } from '../../../../config';
import { Organization, OrganizationType } from '../../../models/organization.model';
import * as fromModelerStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-edit-organization',
  styleUrls: ['./edit-organization.component.scss'],
  templateUrl: './edit-organization.component.html',
})
export class EditOrganizationComponent extends EditObjectComponent<Organization> {
  fromModelerStore = fromModelerStore;
  getOrganizationTypeValues = getEnumValues(OrganizationType);
  getI18nNameOrganizationType = getI18nString;
  maxTextLengthCategory = MaxTextLengthCategory;

  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>
  ) {
    super(modelerStore);
    this.formGroup = this.getOrganizationForm();
    this.updateAction = fromModelerStore.UpdateOrganization;
    this.debounceTime = Config.debounceTime;
    this.dispatchUpdateAction = this.dispatchUpdateObjectWithTagsAction;
  }

  getOrganizationForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      type: new FormControl(''),
      url: new FormControl(''),
    });
  }

  dispatchUpdateObjectWithTagsAction(value: Partial<Organization>): void {
    this.modelerStore.dispatch(new this.updateAction({
      organization: {
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
