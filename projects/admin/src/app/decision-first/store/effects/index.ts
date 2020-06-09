import { ImplementationComponentsIconsEffects } from 'core/objects/implementation-component/store';
import { SidebarEffects } from 'core/objects/sidebar/store';
import { AutocompleteSearchListEffects, CustomersEffects, CustomersListEffects, GroupsEffects, UsersEffects, UserOwnProfileEffects } from 'user-management/store/effects';

export const effects: any[] = [
  CustomersEffects,
  CustomersListEffects,
  UsersEffects,
  GroupsEffects,
  AutocompleteSearchListEffects,
  UserOwnProfileEffects,
  ImplementationComponentsIconsEffects,
  SidebarEffects,
];
