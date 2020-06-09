import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { rootReducers } from 'core/root-store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Group, IStateEditGroup, UserType } from 'user-management/models';
import { IDecisionFirstState } from 'user-management/store/reducers';
import { EditGroupContainerOptions } from './interfaces';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'user-management-edit-group-container',
  templateUrl: './edit-group-container.component.html',
  styleUrls: ['./edit-group-container.component.scss']
})
export class EditGroupContainerComponent implements OnInit, OnDestroy {
  @Input() groupId: string;
  @Input() options: EditGroupContainerOptions;
  state$: Observable<IStateEditGroup>;

  constructor(
    private userManagementStore: Store<IDecisionFirstState | rootReducers.authenticationReducer.IAuthenticationState>,
  ) { }

  ngOnInit() {
    this.userManagementStore.dispatch(new this.options.loadGroupAction(this.groupId));
    this.getStateForGroup();
  }

  getStateForGroup(): void {
    this.state$ = combineLatest([
      this.userManagementStore.pipe(select(this.options.getSelectedGroupSelector(this.groupId))),
      this.userManagementStore.pipe(select(this.options.getAuthenticatedUserType)),
    ]).pipe(
      map(([ group, authenticatedUserType ]) => {
        return { group: <Group>group, authenticatedUserType: <string>authenticatedUserType }
      })
    );
  }

  ngOnDestroy() {
    if (this.options.removeGroupFromLocalMemoryAction) {
      this.userManagementStore.dispatch(new this.options.removeGroupFromLocalMemoryAction(this.groupId));
    }
  }

  isAdmin(authenticatedUserType: UserType): boolean {
    return authenticatedUserType === UserType.ADMIN;
  }

  getCustomerId(group: Group) {
    return group ? group.account.id : '';
  }
}
