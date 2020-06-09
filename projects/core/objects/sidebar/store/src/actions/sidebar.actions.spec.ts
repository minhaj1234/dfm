import { SidebarPanel } from 'core/objects/sidebar/models';
import * as sidebarActions from './sidebar.actions';

describe('Sidebar Actions', () => {
  describe('Set Current Sidebar Panel', () => {
    it('should create an action', () => {
      const payload = SidebarPanel.AddObjects;
      const action = new sidebarActions.SetCurrentSidebarPanel(payload);
      expect({ ...action }).toEqual({
        payload,
        type: sidebarActions.SET_CURRENT_SIDEBAR_PANEL,
      });
    });
  });

  describe('Expand Sidebar', () => {
    it('should create an action', () => {
      const action = new sidebarActions.ExpandSidebar();
      expect({ ...action }).toEqual({
        type: sidebarActions.EXPAND_SIDEBAR,
      });
    });
  });

  describe('Toggle Sidebar', () => {
    it('should create an action', () => {
      const action = new sidebarActions.ToggleSidebar();
      expect({ ...action }).toEqual({
        type: sidebarActions.TOGGLE_SIDEBAR,
      });
    });
  });

  describe('Collapse Sidebar', () => {
    it('should create an action', () => {
      const action = new sidebarActions.CollapseSidebar();
      expect({ ...action }).toEqual({
        type: sidebarActions.COLLAPSE_SIDEBAR,
      });
    });
  });

  describe('Collapse Sidebar', () => {
    it('should create an action', () => {
      const action = new sidebarActions.CollapseSidebar();
      expect({ ...action }).toEqual({
        type: sidebarActions.COLLAPSE_SIDEBAR,
      });
    });
  });

  describe('Set Is Pinned Property Sidebar', () => {
    it('should create an action', () => {
      const payload = true;
      const action = new sidebarActions.SetIsPinnedPropertySidebar(payload);
      expect({ ...action }).toEqual({
        payload,
        type: sidebarActions.SET_IS_PINNED_PROPERTY_SIDEBAR,
      });
    });
  });

  describe('Set Initial State Sidebar', () => {
    it('should create an action', () => {
      const action = new sidebarActions.SetInitialStateSidebar();
      expect({ ...action }).toEqual({
        type: sidebarActions.SET_INITIAL_STATE_SIDEBAR,
      });
    });
  });
});
