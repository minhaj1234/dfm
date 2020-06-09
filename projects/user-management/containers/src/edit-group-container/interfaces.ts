import { Action, MemoizedSelector } from '@ngrx/store';
import { DefaultProjectorFn } from '@ngrx/store/src/selector';
import { AutocompleteListItem, ITab } from 'core/models';
import { rootReducers } from 'core/root-store';
import { Group } from 'user-management/models';
import { IDecisionFirstState } from 'user-management/store/reducers';

export interface EditGroupContainerOptions {
  loadGroupAction: new(id: string) => Action;
  getSelectedGroupSelector: (id: string) => MemoizedSelector<
    IDecisionFirstState, 
    Group, 
    DefaultProjectorFn<Group>>;
  getAutocompleteSearchListSelector: MemoizedSelector<
    IDecisionFirstState, 
    AutocompleteListItem[], 
    DefaultProjectorFn<AutocompleteListItem[]>>;
  getAuthenticatedUserType: MemoizedSelector<
    rootReducers.authenticationReducer.IAuthenticationState, 
    string, 
    DefaultProjectorFn<string>>;
  removeGroupFromLocalMemoryAction: new(id: string) => Action;
  loadUsersToAutocompleteSearchListAction: new(payload: {
      accountId: string;
      searchTerm: string;
      pageNumber: number;
      pageSize: number;
  }) => Action;
  setAutocompleteSearchListInitialStateAction: new() => Action;
  addUserAction?: new() => Action;
  addUsersToGroupAction: new(payload: {groupId: string, usersIds: string[]}) => Action;
  removeUserFromGroupAction: new(payload: {groupId: string, userId: string}) => Action;
  updateGroupAction: new(group: Group) => Action;
  addTabAction: new(tab: ITab) => Action;
  debounceTime: number;
  searchDebounceTime: number;
  autocompleteListPageSize: number;
}