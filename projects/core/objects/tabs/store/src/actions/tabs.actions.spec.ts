import { DefaultJumpMenuSelectedItem, ITab, ObjectTabType, TechnicalTabType } from 'core/models';
import * as tabsActions from './tabs.actions';

describe('Tabs Actions', () => {
  describe('Add Tab', () => {
    it('should create an action for object tab', () => {
      const payload: ITab = {
        id: 'some uuid',
        type: ObjectTabType.Diagram,
      };
      const action = new tabsActions.AddTab(payload);
      expect({ ...action }).toEqual({
        payload,
        type: tabsActions.ADD_TAB,
      });
    });

    it('should create an action for technical tab', () => {
      const payload: ITab = {
        type: TechnicalTabType.Home,
      };

      const action = new tabsActions.AddTab(payload);
      expect({ ...action }).toEqual({
        payload,
        type: tabsActions.ADD_TAB,
      });
    });
  });

  describe('Remove Tab', () => {
    it('should create an action', () => {
      const payload = 'some uuid';
      const action = new tabsActions.RemoveTab(payload);
      expect({ ...action }).toEqual({
        payload,
        type: tabsActions.REMOVE_TAB,
      });
    });
  });

  describe('Set Tab Index', () => {
    it('should create an action', () => {
      const payload: ITab = {
        id: 'abc',
        type: ObjectTabType.Diagram,
        jumpMenuSelectedItem: DefaultJumpMenuSelectedItem
      };
      const action = new tabsActions.SetSelectedTab(payload);
      expect({ ...action }).toEqual({
        payload,
        type: tabsActions.SET_SELECTED_TAB,
      });
    });
  });

  describe('Update Jump MenuS elected Item', () => {
    it('should create an action', () => {
      const payload = {
        id: 'abc',
        jumpMenuSelectedItem: DefaultJumpMenuSelectedItem
      };
      const action = new tabsActions.UpdateJumpMenuSelectedItemInTab(payload);
      expect({ ...action }).toEqual({
        payload,
        type: tabsActions.UPDATE_JUMP_MENU_SELECTED_ITEM_IN_TAB,
      });
    });
  });
});
