import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { EMAIL_PATTERN } from 'core/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'core-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  @Input() email: string;
  @Input() inProgress: boolean;
  @Output() sendForgotPassword = new EventEmitter<string>();

  readonly EMAIL_PATTERN = EMAIL_PATTERN;

  onSendForgotPassword(): void {
    this.sendForgotPassword.emit(this.email);
  }
}
