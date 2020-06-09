import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { AutocompleteListItem, ObjectTabType } from 'core/models';
import { Observable } from 'rxjs';
import { User, UserType, USER_NAMAGEMENT_CLASS_NAMES } from 'user-management/models';
import { IDecisionFirstState } from 'user-management/store/reducers';
import { AddUserComponent } from '../add-user/add-user.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'user-management-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit {
  @Input() users: User[];
  @Input() customerId: string;
  @Input() groupId: string;
  @Input() addTabAction: any;
  @Input() addUserAction: any;
  @Input() deleteUserAction: any;
  @Input() getAutocompleteSearchListSelector: any;
  @Input() loadUsersToAutocompleteSearchListAction: any;
  @Input() setAutocompleteSearchListInitialStateAction: any;
  @Input() addUsersToGroupAction: any;
  @Input() removeUserFromGroupAction: any;
  @Input() isReadOnly: boolean;
  @Input() searchDebounceTime: number;
  @Input() autocompleteListPageSize: number;
  public UserType = UserType;
  public selectedUser: AutocompleteListItem;
  public autocompleteSearchList$: Observable<AutocompleteListItem[]>;

  get excludeIds(): string[] {
    return this.users.map((user) => user.id);
  }

  constructor(
    private userManagementStore: Store<IDecisionFirstState>,
    private dialogService: NbDialogService,
  ) { }

  ngOnInit() {
    if (this.getAutocompleteSearchListSelector) {
      this.autocompleteSearchList$ = this.userManagementStore.pipe(select(this.getAutocompleteSearchListSelector));
    }  
  }

  openUserTab(userId: string): void {
    this.userManagementStore.dispatch(new this.addTabAction({
      id: userId,
      type: ObjectTabType.User
    }));
  }
  
  onAddUserClick(): void {
    this.dialogService.open(AddUserComponent, { context: { addAction: this.addUserAction, customerId: this.customerId } });
  }

  onUserSelected(user: AutocompleteListItem): void {
    this.selectedUser = user;
  }

  onAddUsersToGroupClick(): void {
    this.userManagementStore.dispatch(new this.addUsersToGroupAction({
      groupId: this.groupId,
      usersIds: [this.selectedUser.id],
    }));
  }

  onDeleteClick(userId: string): void {
    if (this.removeUserFromGroupAction) {
      this.removeUserFromGroup(userId);
    } else if (this.deleteUserAction) {
      this.deleteUser(userId);
    }
  }

  removeUserFromGroup(userId: string): void {
    this.userManagementStore.dispatch(new this.removeUserFromGroupAction({
      groupId: this.groupId,
      userId,
    }));
  }

  deleteUser(userId: string): void {
    const deletedUser = this.users.find((user) => user.id === userId);
    
    this.userManagementStore.dispatch(new this.deleteUserAction(deletedUser));
  }

  canAddUserToGroup(): boolean {
    return !!this.selectedUser;
  }

  onSearchListUpdate(searchTerm: string): void {
    this.userManagementStore.dispatch(new this.loadUsersToAutocompleteSearchListAction({
      accountId: this.customerId,
      searchTerm: searchTerm,
      objectTypes: [USER_NAMAGEMENT_CLASS_NAMES.User],
      pageSize: this.autocompleteListPageSize,
      excludeIds: this.excludeIds.toString(),
    }));
  }

  onResetSearchList(): void {
    this.userManagementStore.dispatch(new this.setAutocompleteSearchListInitialStateAction());
  }

  canDeleteUser(): boolean {
    return this.removeUserFromGroupAction || this.deleteUserAction;
  }
}
