import { Action } from '@ngrx/store';
import { ITab, JumpMenuItems } from 'core/models';

export const ADD_TAB = '[DMS] Add Tab';
export const REMOVE_TAB = '[DMS] Remove Tab';
export const SET_SELECTED_TAB = '[DMS] Set Selected Tab';
export const UPDATE_JUMP_MENU_SELECTED_ITEM_IN_TAB = '[DMS] Update Jump Menu Selected Item In Tab';

export class AddTab implements Action {
  readonly type = ADD_TAB;
  constructor(public payload: ITab) {
    if (!payload.id) {
      payload.id = payload.type;
    }
  }
}

export class RemoveTab implements Action {
  readonly type = REMOVE_TAB;
  constructor(public payload: string) {}
}

export class SetSelectedTab implements Action {
  readonly type = SET_SELECTED_TAB;
  constructor(public payload: ITab) {}
}

export class UpdateJumpMenuSelectedItemInTab implements Action {
  readonly type = UPDATE_JUMP_MENU_SELECTED_ITEM_IN_TAB;
  constructor(public payload: {id: string, jumpMenuSelectedItem: JumpMenuItems}) {}
}

export type TabActions = AddTab | RemoveTab | SetSelectedTab | UpdateJumpMenuSelectedItemInTab;
