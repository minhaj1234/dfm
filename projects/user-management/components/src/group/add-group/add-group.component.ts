import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { AddObjectComponent, MaxTextLengthCategory } from 'core/components';
import { IDecisionFirstState } from 'user-management/store/reducers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'user-management-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent extends AddObjectComponent implements OnInit {
  MaxTextLengthCategory = MaxTextLengthCategory;
  @Input() addAction: any;
  @Input() customerId: string;

  constructor(
    private userManagementStore: Store<IDecisionFirstState>,
    private nbDialogRef: NbDialogRef<AddGroupComponent>,
  ) {
    super(userManagementStore, nbDialogRef);

    this.formGroup = this.getGroupForm();
    this.addAction = this.addAction;
  }

  ngOnInit() {
    this.setFormValue();
  }

  getGroupForm(): FormGroup {
    return new FormGroup({
      group: new FormGroup({
        name: new FormControl('', [Validators.required]),
      }),
      accountId: new FormControl('')
    });
  }

  setFormValue(): void {
    this.formGroup.patchValue({accountId: this.customerId}, {emitEvent: false});
  }
}
