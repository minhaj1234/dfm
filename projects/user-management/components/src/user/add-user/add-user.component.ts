import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { AddObjectComponent, MaxTextLengthCategory } from 'core/components';
import { EMAIL_PATTERN } from 'core/constants';
import { UserType } from 'user-management/models';
import { IDecisionFirstState } from 'user-management/store/reducers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'user-management-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent extends AddObjectComponent implements OnInit {
  MaxTextLengthCategory = MaxTextLengthCategory;
  @Input() addAction: any;
  @Input() customerId: string;
  types = UserType;

  constructor(
    private userManagementStore: Store<IDecisionFirstState>,
    private nbDialogRef: NbDialogRef<AddUserComponent>,
  ) {
    super(userManagementStore, nbDialogRef);

    this.formGroup = this.getUserForm();
    this.addAction = this.addAction;
  }

  ngOnInit() {
    this.setFormValue();
  }

  getUserForm(): FormGroup {
    return new FormGroup({
      user: new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: new FormControl('', Validators.compose([Validators.required, Validators.pattern(EMAIL_PATTERN)])),
        type: new FormControl('', [Validators.required]),
      }),
      accountId: new FormControl('')
    });
  }

  setFormValue() {
    this.formGroup.patchValue({ user: { type: UserType.STANDARD }, accountId: this.customerId }, { emitEvent: false });
  }
}
