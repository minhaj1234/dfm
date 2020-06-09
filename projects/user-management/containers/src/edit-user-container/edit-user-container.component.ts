import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AuthenticatedUser } from 'core/models';
import { rootReducers } from 'core/root-store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IStateEditUser, User, UserType } from 'user-management/models';
import { IDecisionFirstState } from 'user-management/store/reducers';
import { EditUserContainerOptions } from './interfaces';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'user-management-edit-user-container',
  templateUrl: './edit-user-container.component.html',
  styleUrls: ['./edit-user-container.component.scss']
})
export class EditUserContainerComponent implements OnInit, OnDestroy {
  @Input() userId: string;
  @Input() options: EditUserContainerOptions;
  state$: Observable<IStateEditUser>;

  constructor(
    private userManagementStore: Store<IDecisionFirstState | rootReducers.authenticationReducer.IAuthenticationState>,
  ) { }

  ngOnInit() {
    this.userManagementStore.dispatch(new this.options.loadUserAction(this.userId));
    this.getStateForUser();
  }

  getStateForUser(): void {
    this.state$ = combineLatest([
      this.userManagementStore.pipe(select(this.options.getSelectedUserSelector(this.userId))),
      this.userManagementStore.pipe(select(this.options.getAuthenticatedUser)),
    ]).pipe(
      map(([ user, authenticatedUser ]) => {
        return { user: <User>user, authenticatedUser: <AuthenticatedUser>authenticatedUser }
      })
    );
  }

  ngOnDestroy() {
    if (this.options.removeUserFromLocalMemoryAction) {
      this.userManagementStore.dispatch(new this.options.removeUserFromLocalMemoryAction(this.userId));
    }
  }

  isAdmin(authenticatedUser: AuthenticatedUser): boolean {
    return authenticatedUser && authenticatedUser.userType === UserType.ADMIN;
  }

  getCustomerId(user: User) {
    return user ? user.account.id : '';
  }
}
