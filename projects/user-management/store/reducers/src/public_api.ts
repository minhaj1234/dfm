import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';
import * as fromAutocompleteSearchList from './autocomplete-search-list/autocomplete-search-list.reducer';
import * as fromCustomers from './customer/customers.reducer';
import * as fromCustomersList from './customer/customersList.reducer';
import * as fromGroups from './group/groups.reducer';
import * as fromUserOwnProfile from './user-own-profile/user-own-profile.reducer';
import * as fromUsers from './user/users.reducer';

export interface IDecisionFirstState {
  customers: fromCustomers.ICustomersState;
  customersList: fromCustomersList.ICustomersListState;
  users: fromUsers.IUsersState;
  groups: fromGroups.IGroupsState;
  autocompleteSearchList: fromAutocompleteSearchList.IAutocompleteSearchListState,
}

export const reducers: ActionReducerMap<IDecisionFirstState> = {
  customers: fromCustomers.reducer,
  customersList: fromCustomersList.reducer,
  users: fromUsers.reducer,
  groups: fromGroups.reducer,
  autocompleteSearchList: fromAutocompleteSearchList.reducer,
};

export const getDecisionFirstState = createFeatureSelector<IDecisionFirstState>('DecisionFirst');
export const getUserOwnProfileState = createFeatureSelector<fromUserOwnProfile.IUserOwnProfileState>('userOwnProfile');

export {
  fromCustomers,
  fromCustomersList,
  fromGroups,
  fromUsers,
  fromAutocompleteSearchList,
  fromUserOwnProfile,
}

export const userOwnProfileReducer = fromUserOwnProfile.reducer; 
