import { AuthenticatedUser } from 'core/models';

export enum SidebarPanel {
  Navigation,
  AddObjects,
  ExistingObjects,
}

export interface ISidebar {
  currentPanel: SidebarPanel;
}

export class IStateNavigationSidebar {
  isPinnedProperty: boolean;
  isReadOnlySession: boolean;
  authenticatedUser: AuthenticatedUser
}