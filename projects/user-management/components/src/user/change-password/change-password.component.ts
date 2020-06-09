import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ChangePasswordRequest } from 'core/models';
import { confirmPasswordValidator, FormGroupTyped } from 'core/utilities';
import { ChangePasswordFormState, IChangePassword } from 'user-management/models';
import { ERROR_MESSAGES, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from './change-password.const';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'user-management-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  validationErrorMessages = [];
  form: FormGroupTyped<IChangePassword>;
  private _formState: ChangePasswordFormState;
  private displayIncorrectPasswordError = false;
  @Input() set formState(value: ChangePasswordFormState) {
    this._formState = value;

    this.displayIncorrectPasswordError = this._formState && this._formState.changePasswordError;  
    if (this._formState && !this._formState.displayChangePassword) {
      this.resetForm();
    }
  };
  get formState(): ChangePasswordFormState {
    return this._formState;
  }
  get displayForm(): boolean {
    return this.formState.displayChangePassword;
  }

  @Output() changePassword = new EventEmitter<ChangePasswordRequest>();
  @Output() openForm = new EventEmitter<any>();
  @Output() closeForm = new EventEmitter<any>();

  constructor(private formBuilder: FormBuilder) {
    this.setChangePasswordForm();
  }

  ngOnInit() { }

  setChangePasswordForm(): void {
    this.form = this.formBuilder.group({
      oldPassword: this.formBuilder.control('', Validators.required),
      newPassword: this.formBuilder.control('', [
        Validators.required, 
        Validators.minLength(PASSWORD_MIN_LENGTH), 
        Validators.maxLength(PASSWORD_MAX_LENGTH)
      ]),
      confirmPassword: this.formBuilder.control('', Validators.required),
    },
    {
      validator: confirmPasswordValidator,
   }) as FormGroupTyped<IChangePassword>;
  }

  onChangePassword(): void {
    this.displayIncorrectPasswordError = false;

    if (this.form.valid) {      
      this.validationErrorMessages = [];
      this.changePassword.emit({
        oldPassword: this.form.controls.oldPassword.value,
        newPassword: this.form.controls.newPassword.value,
      });
    } else {
      this.setValidationErrorMessages();
    }
  }

  setValidationErrorMessages(): void {
    this.validationErrorMessages = [];

    const errorKeys = [
      ...Object.keys(this.form.controls.oldPassword.errors || {}),
      ...Object.keys(this.form.controls.newPassword.errors || {}),
      ...Object.keys(this.form.controls.confirmPassword.errors || {})
    ];
    
    errorKeys
      .filter((errorMessageKey) => ERROR_MESSAGES[errorMessageKey])
      .forEach((errorMessageKey) => {
        this.validationErrorMessages.push(ERROR_MESSAGES[errorMessageKey]);
      });
  }

  resetForm(): void {
    this.setChangePasswordForm();
  }

  onOpenChangePasswordForm(): void {
    this.openForm.emit();
  }

  onCloseChangePasswordForm(): void {
    this.closeForm.emit();
  }

  doDisplayIncorrectPasswordError(): boolean {
    return this.displayIncorrectPasswordError;
  }
}
