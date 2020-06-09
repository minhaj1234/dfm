import { Action } from '@ngrx/store';
import { ObjectTabType } from 'core/models';
import * as fromActions from 'user-management/store/actions';

export interface StompServiceActionsMapping {
  loadObjectAction: new(id: string) => Action
} 

export const LOAD_OBJECT_ACTION_MAPPING = {
  [ObjectTabType.Account]: fromActions.LoadCustomer,
  [ObjectTabType.User]: fromActions.LoadUser,
  [ObjectTabType.Group]: fromActions.LoadGroup,
}
