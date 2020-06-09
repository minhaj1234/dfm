import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { IStateTabs, ITab, ObjectTabType, TechnicalTabType } from 'core/models';
import * as fromImplementationComponentIconsStore from 'core/objects/implementation-component/store';
import { rootSelectors } from 'core/root-store';
import { convertStringToI18nString } from 'core/utilities';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { combineLatest, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { EditGroupContainerOptions, EditUserContainerOptions } from 'user-management/containers';
import { EditCustomerContainerOptions } from 'user-management/containers/edit-customer-container/interfaces';
import { EditCustomerFormEditableType, USER_MANAGEMENT_OBJECTS } from 'user-management/models';
import { Config } from '../../../config';
import * as fromAdminStore from '../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'admin-tabs',
  styleUrls: ['./tabs.component.scss'],
  templateUrl: './tabs.component.html',
})
export class TabsComponent implements OnInit, OnDestroy {
  fromAdminStore = fromAdminStore;
  rootSelectors = rootSelectors;
  Config = Config;
  editUserContainerOptions: EditUserContainerOptions = {
    loadUserAction: fromAdminStore.LoadUser,
    getSelectedUserSelector: fromAdminStore.getSelectedUser,
    getAuthenticatedUser: rootSelectors.getAuthenticatedUser,
    getAutocompleteSearchListSelector: fromAdminStore.getAutocompleteSearchList,
    removeUserFromLocalMemoryAction: fromAdminStore.RemoveUserFromLocalMemory,
    updateUserAction: fromAdminStore.UpdateUser,
    addTabAction: fromAdminStore.AddTab,
    addGroupsToUserAction: fromAdminStore.AddGroupsToUser,
    removeGroupFromUserAction: fromAdminStore.RemoveGroupFromUser,
    loadGroupsToAutocompleteSearchListAction: fromAdminStore.LoadGroupsToAutocompleteSearchList,
    setAutocompleteSearchListInitialStateAction: fromAdminStore.SetAutocompleteSearchListInitialState,
    debounceTime: Config.debounceTime,
    searchDebounceTime: Config.searchDebounceTime,
    autocompleteListPageSize: Config.autocompleteListPageSize,
    changePasswordAction: fromAdminStore.ChangePassword,
    openChangePasswordFormAction: fromAdminStore.OpenChangePasswordForm, 
    closeChangePasswordFormAction: fromAdminStore.CloseChangePasswordForm, 
    getChangePasswordFormStateSelector: fromAdminStore.getChangePasswordFormState
  }
  editGroupContainerOptions: EditGroupContainerOptions = {
    loadGroupAction: fromAdminStore.LoadGroup,
    getSelectedGroupSelector: fromAdminStore.getSelectedGroup,
    getAuthenticatedUserType: rootSelectors.getAuthenticatedUserType,
    getAutocompleteSearchListSelector: fromAdminStore.getAutocompleteSearchList,
    removeGroupFromLocalMemoryAction: fromAdminStore.RemoveGroupFromLocalMemory,
    updateGroupAction: fromAdminStore.UpdateGroup,
    addTabAction: fromAdminStore.AddTab,
    addUsersToGroupAction: fromAdminStore.AddUsersToGroup,
    removeUserFromGroupAction: fromAdminStore.RemoveUserFromGroup,
    loadUsersToAutocompleteSearchListAction: fromAdminStore.LoadUsersToAutocompleteSearchList,
    setAutocompleteSearchListInitialStateAction: fromAdminStore.SetAutocompleteSearchListInitialState,
    debounceTime: Config.debounceTime,
    searchDebounceTime: Config.searchDebounceTime,
    autocompleteListPageSize: Config.autocompleteListPageSize,
  }
  editCustomerContainerOptions: EditCustomerContainerOptions = {
    loadCustomerAction: fromAdminStore.LoadCustomer,
    addUserAction: fromAdminStore.AddUser,
    deleteUserAction: fromAdminStore.DeleteUser,
    addGroupAction: fromAdminStore.AddGroup,
    deleteGroupAction: fromAdminStore.DeleteGroup,
    getSelectedCustomerSelector: fromAdminStore.getSelectedCustomer,
    removeCustomerFromLocalMemoryAction: fromAdminStore.RemoveCustomerFromLocalMemory,
    updateCustomerAction: fromAdminStore.UpdateCustomer,
    addTabAction: fromAdminStore.AddTab,
    debounceTime: Config.debounceTime,
    editCustomerFormEditableType: EditCustomerFormEditableType.AllWithoutDomains,
    getAuthenticatedUserSelector: rootSelectors.getAuthenticatedUser,
  }
  state$: Observable<IStateTabs>;
  tabs$: Observable<ITab[]>;
  activeTab$: Observable<string>;
  namesMap$: Observable<Record<string, string>>;

  constructor(
    private modelerStore: Store<fromAdminStore.IDecisionFirstState>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.getStateForTabs();
    this.setNamesMap();
    this.subscribeCurrentTabEntity();
    this.checkIfTabNeedsToBeLoadedFirstTime();
  }

  getStateForTabs(): void {
    this.state$ = combineLatest([
      this.modelerStore.pipe(select(fromAdminStore.getAllTabs)),
      this.modelerStore.pipe(select(fromAdminStore.getCurrentTabId)),
    ]).pipe(
      map(([tabs, activeTabId]) => {
        return { tabs, activeTabId }
      })
    );
  }

  setNamesMap() {
    this.namesMap$ = combineLatest([
      this.modelerStore.pipe(select(fromAdminStore.getLoadedCustomers)),
      this.modelerStore.pipe(select(fromAdminStore.getLoadedUsers)),
      this.modelerStore.pipe(select(fromAdminStore.getLoadedGroups)),
      this.modelerStore.pipe(select(fromImplementationComponentIconsStore.getLoadedImplementationComponentsIcons)),
    ]).pipe(
      map(
        ([
          customers,
          users,
          groups,
          icons,
        ]) => {
          return {
            ...convertRecordToIdKeyedNames(customers),
            ...convertRecordToIdKeyedNames(users),
            ...convertRecordToIdKeyedNames(groups),
            ...convertRecordToIdKeyedNames(icons),
          };
        },
      ),
    );
  }

  subscribeCurrentTabEntity(): void {
    this.modelerStore.pipe(
      select(fromAdminStore.getCurrentTabEntity),
      untilDestroyed(this),
    ).subscribe((tab: ITab) => {
      if (tab) {
          this.router.navigate([''], { queryParams: this.getQueryParamsCurrentTabEntity(tab), relativeTo: this.activatedRoute });
      } else {
        this.router.navigate([''], { relativeTo: this.activatedRoute });
      }
    });
  }

  getQueryParamsCurrentTabEntity(tab: ITab): Object {    
    if (TechnicalTabType[tab.type]) {
      return { type: tab.type };
    }
    else {
      return { id: tab.id, type: tab.type };
    }
  }

  checkIfTabNeedsToBeLoadedFirstTime(): void {
    this.modelerStore
      .pipe(
        select(rootSelectors.getRouterQueryParams),
        first(),
      )
      .subscribe(({ type, id } = {}) => {
        if (type && id) {
          this.modelerStore.dispatch(new fromAdminStore.AddTab({ type, id }));
        }
      });
  }

  trackByFn(index: number, tab: ITab) {
    return tab.id;
  }

  getObjectName(tab: ITab): Observable<string> {
    return this.namesMap$.pipe(
      map((diagramsMap) => {
        return diagramsMap[tab.id] ? diagramsMap[tab.id] : '';
      }),
    );
  }

  closeTab($event: Event, id: string) {
    $event.stopPropagation();
    this.modelerStore.dispatch(new fromAdminStore.RemoveTab(id));
  }

  focusTab($event: Event, tab: ITab) {
    this.modelerStore.dispatch(new fromAdminStore.SetSelectedTab(tab));
  }

  isTechnicalTab(type: ObjectTabType | TechnicalTabType): boolean {
    return type in TechnicalTabType;
  }

  isHomeTab(type: ObjectTabType | TechnicalTabType): boolean {
    return type === TechnicalTabType.Home;
  }

  isCustomerTab(type: ObjectTabType | TechnicalTabType): boolean {
    return type === ObjectTabType.Account;
  }

  isUserTab(type: ObjectTabType | TechnicalTabType): boolean {
    return type === ObjectTabType.User;
  }

  isGroupTab(type: ObjectTabType | TechnicalTabType): boolean {
    return type === ObjectTabType.Group;
  }

  isImplementationComponentIconsTab(type: ObjectTabType | TechnicalTabType): boolean {
    return type === TechnicalTabType.ImplementationComponentIcons;
  }

  isVersionInformationTab(type: ObjectTabType | TechnicalTabType): boolean {
    return type === TechnicalTabType.VersionInformation;
  }

  isImplementationComponentIconTab(type: ObjectTabType | TechnicalTabType): boolean {
    return type === ObjectTabType.ImplementationComponentIcon;
  }
  
  getTechnicalTabName(tabName: string): string {
    return convertStringToI18nString(tabName);
  };
  
  ngOnDestroy() { }
}

function convertRecordToIdKeyedNames(
  records:
    | Record<string, any>
): Record<string, string> {
  return Object.keys(records)
    .map((key) => records[key])
    .reduce((newRecords, item) => {
      
      switch(item.className) {
        case USER_MANAGEMENT_OBJECTS.Customer.className:
        case USER_MANAGEMENT_OBJECTS.Group.className:
          newRecords[item.id] = item.name;
          break;
        case USER_MANAGEMENT_OBJECTS.User.className:
          newRecords[item.id] = `${item.firstName} ${item.lastName}`
          break;
        default: 
          newRecords[item.id] = item.name;
      }

      return newRecords;
    }, {});
}
