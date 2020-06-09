import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EMAIL_PATTERN } from 'core/constants';
import { LoginRequest } from 'core/models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'core-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: FormGroup;
  submitAttempted = false;
  @Input() authenticationState: { authenticationInProgress: boolean, authenticationError: boolean, authorizationError: boolean };
  @Output() sendLogin = new EventEmitter<LoginRequest>();

  constructor() {
    this.form = new FormGroup({
      username: new FormControl(null, Validators.compose([Validators.required, Validators.pattern(EMAIL_PATTERN)])),
      password: new FormControl(null, Validators.required)
    });

    this.form.valueChanges.subscribe(() => {
      this.submitAttempted = false;
    });
  }

  onLoginClicked(): void {
    this.submitAttempted = true;

    if (this.form.valid) {
      this.sendLogin.emit(this.form.value);
    }
  }

  loginButtonAvailable(): boolean {
    return !(this.authenticationState.authenticationInProgress || (this.submitAttempted && !this.authenticationState.authenticationError && !this.authenticationState.authorizationError));
  }
}
