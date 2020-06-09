import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { AddObjectComponent, MaxTextLengthCategory } from 'core/components'
import { getEnumValues  } from 'core/utilities';
import { getI18nString } from 'core/utilities';
import { defaultOrganizationType, OrganizationType } from '../../../models/organization.model';
import * as fromModelerStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-add-organization',
  styleUrls: ['./add-organization.component.scss'],
  templateUrl: './add-organization.component.html',
})
export class AddOrganizationComponent extends AddObjectComponent {
  getOrganizationTypeValues = getEnumValues(OrganizationType);
  getI18nNameOrganizationType = getI18nString;
  maxTextLengthCategory = MaxTextLengthCategory;

  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
    private nbDialogRef: NbDialogRef<AddOrganizationComponent>,
  ) {
    super(modelerStore, nbDialogRef);
    this.formGroup = this.getOrganizationForm();
    this.addAction = fromModelerStore.AddOrganization;
  }

  getOrganizationForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      type: new FormControl(defaultOrganizationType),
      url: new FormControl(''),
    });
  }
}
