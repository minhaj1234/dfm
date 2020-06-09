import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { EditObjectComponent } from 'core/components';
import { MaxTextLengthCategory } from 'core/components';
import { EMAIL_PATTERN } from 'core/constants';
import { AuthenticatedUser, ChangePasswordRequest } from 'core/models';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChangePasswordFormState, User, UserType } from 'user-management/models';
import { IDecisionFirstState } from 'user-management/store/reducers';
import { WIDTH_PICTURE_PREVIEW } from './edit-user.const';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'user-management-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent extends EditObjectComponent<User> implements OnInit, OnDestroy {
  MaxTextLengthCategory = MaxTextLengthCategory;
  WIDTH_PICTURE_PREVIEW = WIDTH_PICTURE_PREVIEW;
  changePasswordFormState$: Observable<ChangePasswordFormState>;
  @Input() updateAction: any;
  @Input() changePasswordAction: any;
  @Input() openChangePasswordFormAction: any;
  @Input() closeChangePasswordFormAction: any;
  @Input() getChangePasswordFormStateSelector: any
  @Input() debounceTime: number;
  @Input() authenticatedUser: AuthenticatedUser;

  constructor(
    private userManagementStore: Store<IDecisionFirstState>,
  ) {
    super(userManagementStore);
    this.formGroup = this.getUserForm();
    this.updateAction = this.updateAction;
    this.debounceTime = this.debounceTime;
  }

  ngOnInit() {
    super.ngOnInit();
    this.subscribeOpenChangePasswordForm();
  }

  subscribeOpenChangePasswordForm(): void {
    this.changePasswordFormState$ = this.userManagementStore.select(this.getChangePasswordFormStateSelector)
      .pipe(
        untilDestroyed(this),
        map((value: ChangePasswordFormState) => {
          return value;
        }),
      );
  }

  getUserForm(): FormGroup {
    return new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', Validators.compose([Validators.required, Validators.pattern(EMAIL_PATTERN)])),
      picture: new FormControl(''),
    });
  }

  getPictureToPreview(): string {
    let img = 'assets/images/default-user-icon.png';
    if (this.formGroup.controls.picture.value === '' || this.formGroup.controls.picture.value === null || this.formGroup.controls.picture.value === undefined) {
      img = 'assets/images/default-user-icon.png';
    } else {
      img = this.formGroup.controls.picture.value;
    }
    return img;
  }

  isAdmin(): boolean {
    return this.authenticatedUser && this.authenticatedUser.userType === UserType.ADMIN;
  }

  isCurrentUser(): boolean {
    return this.editObject && this.authenticatedUser.userId === this.editObject.id;
  }

  onPasswordChanged(value: ChangePasswordRequest): void {
    this.userManagementStore.dispatch(new this.changePasswordAction(value));
  }

  onOpenForm(): void {
    this.userManagementStore.dispatch(new this.openChangePasswordFormAction());
  }

  onCloseForm(): void {
    this.userManagementStore.dispatch(new this.closeChangePasswordFormAction());
  }

  ngOnDestroy() {
    this.userManagementStore.dispatch(new this.closeChangePasswordFormAction());
  }
}
