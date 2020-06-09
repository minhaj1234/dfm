import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { AddObjectComponent, MaxTextLengthCategory } from 'core/components';
import { domainsValidator } from 'core/utilities';
import { IDecisionFirstState } from 'user-management/store/reducers';
import { DEFAULT_COUNT_SHIFT_MONTHS, DEFAULT_NUMBER_OF_USERS } from './constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'user-management-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent extends AddObjectComponent {
  MaxTextLengthCategory = MaxTextLengthCategory;

  @Input() addAction: any;

  constructor(
    private userManagementStore: Store<IDecisionFirstState>,
    private nbDialogRef: NbDialogRef<AddCustomerComponent>,
  ) {
    super(userManagementStore, nbDialogRef);

    this.formGroup = this.getCustomerForm();
    this.addAction = this.addAction;
  }

  getDefaultValidDate(): Date {
    const validDate = new Date();
    validDate.setMonth(validDate.getMonth() + DEFAULT_COUNT_SHIFT_MONTHS);
    return validDate;
  }

  getCustomerForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      numberOfUsers: new FormControl(DEFAULT_NUMBER_OF_USERS, [Validators.required]),
      validDate: new FormControl(this.getDefaultValidDate(), [Validators.required]),
      domains: new FormControl('', [Validators.required, domainsValidator]),
    });
  }
}
