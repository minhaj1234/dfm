import { Action, MemoizedSelector } from '@ngrx/store';
import { DefaultProjectorFn } from '@ngrx/store/src/selector';
import { ITab } from 'core/models/tab.model';
import { Customer, EditCustomerFormEditableType, Group, User } from 'user-management/models';
import { IDecisionFirstState } from 'user-management/store/reducers';
 
export interface EditCustomerContainerOptions {
  loadCustomerAction: new(id: string) => Action;
  addUserAction: new(payload: { user: Partial<User>, accountId: string }) => Action;
  deleteUserAction: new(payload: User) => Action;
  addGroupAction: new(payload: { group: Partial<Group>, accountId: string }) => Action;
  deleteGroupAction: new(payload: Group) => Action;
  getSelectedCustomerSelector: (id: string) => MemoizedSelector<
    IDecisionFirstState, 
    Customer, 
    DefaultProjectorFn<Customer>>;
  removeCustomerFromLocalMemoryAction: new(id: string) => Action;
  updateCustomerAction: new(payload: Customer) => Action;
  addTabAction: new(payload: ITab) => Action;
  debounceTime: number;
  editCustomerFormEditableType: EditCustomerFormEditableType,
  getAuthenticatedUserSelector: any,
}
