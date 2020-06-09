import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { AutocompleteListItem, ObjectTabType } from 'core/models';
import { Observable } from 'rxjs';
import { Group, USER_NAMAGEMENT_CLASS_NAMES } from 'user-management/models';
import { IDecisionFirstState } from 'user-management/store/reducers';
import { AddGroupComponent } from '../add-group/add-group.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'user-management-groups-table',
  templateUrl: './groups-table.component.html',
  styleUrls: ['./groups-table.component.scss']
})
export class GroupsTableComponent implements OnInit {
  @Input() groups: Group[];
  @Input() customerId: string;
  @Input() userId: string;
  @Input() addTabAction: any;
  @Input() addGroupAction: any;
  @Input() deleteGroupAction: any;
  @Input() isReadOnly: boolean;
  @Input() getAutocompleteSearchListSelector: any;
  @Input() loadGroupsToAutocompleteSearchListAction: any;
  @Input() setAutocompleteSearchListInitialStateAction: any;
  @Input() addGroupsToUserAction: any;
  @Input() removeGroupFromUserAction: any;
  @Input() searchDebounceTime: number;
  @Input() autocompleteListPageSize: number;
  public selectedGroup: AutocompleteListItem;
  public autocompleteSearchList$: Observable<AutocompleteListItem[]>;

  get excludeIds(): string[] {
    return this.groups.map((group) => group.id);
  }

  get extraParametersForAutocompleteSearch(): { accountId: string } {
    return { accountId: this.customerId };
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

  openGroupTab(groupId: string): void {
    this.userManagementStore.dispatch(new this.addTabAction({
      id: groupId,
      type: ObjectTabType.Group
    }));
  }

  onAddGroupClick(): void {
    this.dialogService.open(AddGroupComponent, { context: { addAction: this.addGroupAction, customerId: this.customerId } });
  }

  onGroupSelected(group: AutocompleteListItem): void {
    this.selectedGroup = group;
  }

  onAddGroupsToUserClick(): void {
    this.userManagementStore.dispatch(new this.addGroupsToUserAction({
      userId: this.userId,
      groupsIds: [this.selectedGroup.id],
    }));
  }

  onDeleteClick(groupId: string): void {
    if (this.removeGroupFromUserAction) {
      this.removeGroupFromUserClick(groupId);
    } else if (this.deleteGroupAction) {
      this.deleteGroup(groupId);
    }
  }

  removeGroupFromUserClick(groupId: string): void {
    this.userManagementStore.dispatch(new this.removeGroupFromUserAction({
      userId: this.userId,
      groupId: groupId,
    }));
  }

  deleteGroup(groupId: string): void {
    const deletedGroup = this.groups.find((group) => group.id === groupId);

    this.userManagementStore.dispatch(new this.deleteGroupAction(deletedGroup));
  }

  canAddGroupToUser(): boolean {
    return !!this.selectedGroup;
  }

  onSearchListUpdate(searchTerm: string): void {
    this.userManagementStore.dispatch(new this.loadGroupsToAutocompleteSearchListAction({
      accountId: this.customerId,
      searchTerm: searchTerm,
      objectTypes: [USER_NAMAGEMENT_CLASS_NAMES.Group],
      pageSize: this.autocompleteListPageSize,
      excludeIds: this.excludeIds.toString(),
    }));
  }

  onResetSearchList(): void {
    this.userManagementStore.dispatch(new this.setAutocompleteSearchListInitialStateAction());
  }

  canDeleteGroup(): boolean {
    return this.removeGroupFromUserAction || this.deleteGroupAction;
  }
}
