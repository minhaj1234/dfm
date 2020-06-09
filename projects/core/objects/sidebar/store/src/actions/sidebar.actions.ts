import { Action } from '@ngrx/store';
import { SidebarPanel } from 'core/objects/sidebar/models';

export const SET_CURRENT_SIDEBAR_PANEL = '[CORE] Set Current Sidebar Panel';
export const EXPAND_SIDEBAR = '[CORE] Open Sidebar';
export const TOGGLE_SIDEBAR = '[CORE] Toggle Sidebar';
export const COLLAPSE_SIDEBAR = '[CORE] Collapse Sidebar';
export const SET_IS_PINNED_PROPERTY_SIDEBAR = '[CORE] Set Is Pinned Property Sidebar';
export const SET_INITIAL_STATE_SIDEBAR = '[CORE] Set Initial State Sidebar';

export class SetCurrentSidebarPanel implements Action {
  readonly type = SET_CURRENT_SIDEBAR_PANEL;
  constructor(public payload: SidebarPanel) { }
}

export class ExpandSidebar implements Action {
  readonly type = EXPAND_SIDEBAR;
}

export class ToggleSidebar implements Action {
  readonly type = TOGGLE_SIDEBAR;
}

export class CollapseSidebar implements Action {
  readonly type = COLLAPSE_SIDEBAR;
}

export class SetIsPinnedPropertySidebar implements Action {
  readonly type = SET_IS_PINNED_PROPERTY_SIDEBAR;
  constructor(public payload: boolean){ }
}

export class SetInitialStateSidebar implements Action {
  readonly type = SET_INITIAL_STATE_SIDEBAR;
}

export type SidebarActions =
  | SetCurrentSidebarPanel
  | ExpandSidebar
  | ToggleSidebar
  | CollapseSidebar
  | SetIsPinnedPropertySidebar
  | SetInitialStateSidebar;
