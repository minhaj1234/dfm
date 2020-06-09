import { SidebarPanel } from 'core/objects/sidebar/models';
import * as fromSidebarActions from '../actions/sidebar.actions';
import * as fromSidebar from './sidebar.reducer';

describe('Sidebar Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromSidebar;
      const action = {} as any;

      const state = fromSidebar.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe(`${fromSidebarActions.SET_CURRENT_SIDEBAR_PANEL} action`, () => {
    it('should set current sidebar panel', () => {
      const { initialState } = fromSidebar;
      const action = new fromSidebarActions.SetCurrentSidebarPanel(SidebarPanel.AddObjects);

      const state = fromSidebar.reducer(initialState, action);

      expect(state.currentPanel).toBe(SidebarPanel.AddObjects);
    });
  });

  describe(`${fromSidebarActions.EXPAND_SIDEBAR} action`, () => {
    it('should set is show property', () => {
      const { initialState } = fromSidebar;
      const action = new fromSidebarActions.ExpandSidebar();

      const state = fromSidebar.reducer(initialState, action);

      expect(state.isShow).toBe(true);
    });
  });

  describe(`${fromSidebarActions.COLLAPSE_SIDEBAR} action`, () => {
    it('should set is show property', () => {
      const { initialState } = fromSidebar;
      const action = new fromSidebarActions.CollapseSidebar();

      const state = fromSidebar.reducer(initialState, action);

      expect(state.isShow).toBe(false);
    });
  });

  describe(`${fromSidebarActions.SET_IS_PINNED_PROPERTY_SIDEBAR} action`, () => {
    it('should set is pinned property', () => {
      const { initialState } = fromSidebar;
      const action = new fromSidebarActions.SetIsPinnedPropertySidebar(true);

      const state = fromSidebar.reducer(initialState, action);

      expect(state.isPinned).toBe(true);
    });
  });

  describe(`${fromSidebarActions.SET_INITIAL_STATE_SIDEBAR} action`, () => {
    it('should set initial state', () => {
      const { initialState } = fromSidebar;
      const action = new fromSidebarActions.SetInitialStateSidebar();

      const state = fromSidebar.reducer(initialState, action);

      expect(state.currentPanel).toBe(SidebarPanel.Navigation);
    });
  });

  describe('selectCurrentPanel', () => {
    it('should return the initial current panel', () => {
      const { initialState } = fromSidebar;
      const currentPanel = fromSidebar.selectCurrentPanel(initialState);
      expect(currentPanel).toBe(SidebarPanel.Navigation);
    });

    it('should return the custom current panel', () => {
      const { initialState } = fromSidebar;
      const action = new fromSidebarActions.SetCurrentSidebarPanel(SidebarPanel.ExistingObjects);
      const state = fromSidebar.reducer(initialState, action);

      const currentPanel = fromSidebar.selectCurrentPanel(state);
      expect(currentPanel).toBe(SidebarPanel.ExistingObjects);
    });
  });

  describe('selectIsShowProperty', () => {
    it('should return the initial is show property', () => {
      const { initialState } = fromSidebar;
      const isShow = fromSidebar.selectIsShowProperty(initialState);
      expect(isShow).toBe(false);
    });

    it('should return true', () => {
      const { initialState } = fromSidebar;
      const action = new fromSidebarActions.ExpandSidebar();
      const state = fromSidebar.reducer(initialState, action);

      const isShow = fromSidebar.selectIsShowProperty(state);
      expect(isShow).toBe(true);
    });

    it('should return false', () => {
      const { initialState } = fromSidebar;
      const action = new fromSidebarActions.CollapseSidebar();
      const state = fromSidebar.reducer(initialState, action);

      const isShow = fromSidebar.selectIsShowProperty(state);
      expect(isShow).toBe(false);
    });
  });

  describe('selectIsPinnedProperty', () => {
    it('should return the initial is pinned property', () => {
      const { initialState } = fromSidebar;
      const isPinned = fromSidebar.selectIsPinnedProperty(initialState);
      expect(isPinned).toBe(false);
    });

    it('should return true', () => {
      const { initialState } = fromSidebar;
      const action = new fromSidebarActions.SetIsPinnedPropertySidebar(true);
      const state = fromSidebar.reducer(initialState, action);

      const isPinned = fromSidebar.selectIsPinnedProperty(state);
      expect(isPinned).toBe(true);
    });

    it('should return false', () => {
      const { initialState } = fromSidebar;
      const action = new fromSidebarActions.SetIsPinnedPropertySidebar(false);
      const state = fromSidebar.reducer(initialState, action);

      const isPinned = fromSidebar.selectIsPinnedProperty(state);
      expect(isPinned).toBe(false);
    });
  });
});
