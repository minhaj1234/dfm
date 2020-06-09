import { ActionReducerMap } from '@ngrx/store';
import { fromImplementationComponentIcons, IImplementationComponentsIconsState } from 'core/objects/implementation-component/store';
import { fromSidebarReducers } from 'core/objects/sidebar/store';
import { fromTabsReducers } from 'core/objects/tabs/store';
import { reducers as userManagementReducers } from 'user-management/store/reducers';
import { IAutocompleteSearchListState } from 'user-management/store/reducers/autocomplete-search-list/autocomplete-search-list.reducer';
import { ICustomersState } from 'user-management/store/reducers/customer/customers.reducer';
import { ICustomersListState } from 'user-management/store/reducers/customer/customersList.reducer';
import { IGroupsState } from 'user-management/store/reducers/group/groups.reducer';
import { IUsersState } from 'user-management/store/reducers/user/users.reducer';

export interface IDecisionFirstState {
  tabs: fromTabsReducers.ITabState;
  sidebar: fromSidebarReducers.ISidebarState;
  customers: ICustomersState;
  customersList: ICustomersListState;
  users: IUsersState;
  groups: IGroupsState;
  autocompleteSearchList: IAutocompleteSearchListState,
  implementationComponentsIcons: IImplementationComponentsIconsState;
}

export const reducers: ActionReducerMap<IDecisionFirstState> = {
  tabs: fromTabsReducers.reducer,
  sidebar: fromSidebarReducers.reducer,
  customers: userManagementReducers.customers,
  customersList: userManagementReducers.customersList,
  users: userManagementReducers.users,
  groups: userManagementReducers.groups,
  autocompleteSearchList: userManagementReducers.autocompleteSearchList,
  implementationComponentsIcons: fromImplementationComponentIcons.reducer,
};

export { userOwnProfileReducer } from 'user-management/store/reducers';
