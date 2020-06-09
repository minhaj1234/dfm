import { Action, MemoizedSelector } from '@ngrx/store';
import { DefaultProjectorFn } from '@ngrx/store/src/selector';
import { AuthenticatedUser, AutocompleteListItem, ChangePasswordRequest } from 'core/models';
import { ITab } from 'core/models/tab.model';
import { rootReducers } from 'core/root-store';
import { ChangePasswordFormState, User } from 'user-management/models/user.model';
import { fromUserOwnProfile, IDecisionFirstState } from 'user-management/store/reducers';

export interface EditUserContainerOptions {
  loadUserAction: new(id: string) => Action;
  getSelectedUserSelector: (id: string) => MemoizedSelector<
    IDecisionFirstState, 
    User, 
    DefaultProjectorFn<User>>;
  getAuthenticatedUser: MemoizedSelector<
    rootReducers.authenticationReducer.IAuthenticationState, 
    AuthenticatedUser, 
    DefaultProjectorFn<AuthenticatedUser>>;
  getAutocompleteSearchListSelector: MemoizedSelector<
    IDecisionFirstState, 
    AutocompleteListItem[], 
    DefaultProjectorFn<AutocompleteListItem[]>>;
  removeUserFromLocalMemoryAction: new(id: string) => Action;
  addGroupAction?: new() => Action;
  updateUserAction: new(user: User) => Action;
  addGroupsToUserAction: new(payload: {userId: string, groupsIds: string[]}) => Action;
  removeGroupFromUserAction: new(payload: {userId: string, groupId: string}) => Action;
  loadGroupsToAutocompleteSearchListAction: new(payload: {
      accountId: string;
      searchTerm: string;
      pageNumber: number;
      pageSize: number;
  }) => Action;
  setAutocompleteSearchListInitialStateAction: new() => Action;
  addTabAction: new(tab: ITab) => Action;
  debounceTime: number;
  searchDebounceTime: number;
  autocompleteListPageSize: number;
  changePasswordAction: new(changePasswordRequest: ChangePasswordRequest) => Action;
  openChangePasswordFormAction: new() => Action;
  closeChangePasswordFormAction: new() => Action;
  getChangePasswordFormStateSelector: MemoizedSelector<
    IDecisionFirstState, 
    ChangePasswordFormState,
    DefaultProjectorFn<ChangePasswordFormState>>;
}
