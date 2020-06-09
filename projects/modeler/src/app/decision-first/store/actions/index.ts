import { Action } from '@ngrx/store';

export * from './diagram/activeDiagrams.action';
export * from './diagram/diagramsList.actions';
export * from './diagram/diagrammingElements.actions';
export * from './diagram/diagrams.actions';
export * from './decision/decisionsList.actions';
export * from './decision/decision.actions';
export * from './knowledge-source/knowledgeSource.actions';
export * from './knowledge-source/knowledgeSourcesList.actions';
export * from './organization/organization.actions';
export * from './organization/organizationsList.actions';
export * from './search/mainSearchList.actions';
export * from './input-data/inputDatasList.actions';
export * from './business-objective/businessObjectivesList.actions';
export * from './process/processesList.actions';
export * from './event/eventsList.action';
export * from './system/systemsList.action';
export * from './input-data/inputData.action';
export * from './business-objective/businessObjective.action';
export * from './process/process.action';
export * from './event/event.action';
export * from './system/system.action';
export * from './implementation-component/implementationComponentsList.action';
export * from './implementation-component/implementationComponent.action';
export * from './tags/tags.actions';
export * from './tags/tagsList.actions';
export * from './search/homeSearchList.actions';
export * from './search/autocompleteSearchList.actions';
export * from './common/common-object.actions';
export { 
  LoadUser, 
  LoadUserSuccess, 
  UpdateUser, 
  RemoveUserFromLocalMemory, 
  AddUser,
  LoadGroup, 
  LoadGroupSuccess,
  UpdateGroup,
  AddGroup,
  RemoveGroupFromLocalMemory,
  AddGroupsToUser,
  AddUsersToGroup,
  RemoveGroupFromUser,
  RemoveUserFromGroup,
  LoadCustomer,
  UpdateCustomer,
  RemoveCustomerFromLocalMemory,
  DeleteUser,
  DeleteGroup,
  ChangePassword,
  OpenChangePasswordForm,
  CloseChangePasswordForm
} from 'user-management/store/actions'
export {
  LoadImplementationComponentsIcon,
  LoadImplementationComponentsIcons,
  LoadImplementationComponentsIconsSuccess,
  UploadImplementationComponentsIcon,
} from 'core/objects/implementation-component/store';
export { 
  SetCurrentSidebarPanel,
  ExpandSidebar,
  ToggleSidebar,
  CollapseSidebar,
  SetIsPinnedPropertySidebar,
  SetInitialStateSidebar,
} from 'core/objects/sidebar/store';
export { 
  AddTab,
  RemoveTab,
  SetSelectedTab,
  UpdateJumpMenuSelectedItemInTab,
} from 'core/objects/tabs/store';
export class NoOpAction implements Action {
  readonly type = 'NO OP';
}
