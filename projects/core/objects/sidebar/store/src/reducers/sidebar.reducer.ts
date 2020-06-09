import { IActionMap } from 'core/models';
import { SidebarPanel } from 'core/objects/sidebar/models';
import * as fromSidebarActions from '../actions';

export interface ISidebarState {
  currentPanel: SidebarPanel;
  isShow: boolean;
  isPinned: boolean;
}

export const initialState: ISidebarState = {
  currentPanel: SidebarPanel.Navigation,
  isShow: false,
  isPinned: false,
}

const actionMap: IActionMap<ISidebarState, fromSidebarActions.SidebarActions> = {
  [fromSidebarActions.SET_CURRENT_SIDEBAR_PANEL]: setCurrentSidebarPanelHandler,
  [fromSidebarActions.EXPAND_SIDEBAR]: expandSidebarHandler,
  [fromSidebarActions.COLLAPSE_SIDEBAR]: collapseSidebarHandler,
  [fromSidebarActions.SET_IS_PINNED_PROPERTY_SIDEBAR]: setIsPinnedPropertySidebarHandler,
  [fromSidebarActions.SET_INITIAL_STATE_SIDEBAR]: setInitialStateSidebarHandler,
};

export function reducer(
  state: ISidebarState = initialState,
  action: fromSidebarActions.SidebarActions,
): ISidebarState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function setCurrentSidebarPanelHandler(
  state: ISidebarState,
  action: fromSidebarActions.SetCurrentSidebarPanel,
): ISidebarState {
  return { ...state, currentPanel: action.payload };
}

function expandSidebarHandler(
  state: ISidebarState,
  action: fromSidebarActions.ExpandSidebar,
): ISidebarState {
  return {
    ...state,
    isShow: true
  };
}

function collapseSidebarHandler(
  state: ISidebarState,
  action: fromSidebarActions.CollapseSidebar,
): ISidebarState {
  return {
    ...state,
    isShow: state.isPinned ? state.isShow : false
  };
}

function setIsPinnedPropertySidebarHandler(
  state: ISidebarState,
  action: fromSidebarActions.SetIsPinnedPropertySidebar,
): ISidebarState {
  return {
    ...state,
    isPinned: action.payload
  }
}

function setInitialStateSidebarHandler(
  state: ISidebarState,
  action: fromSidebarActions.SetInitialStateSidebar,
): ISidebarState {
  return initialState;
}

export const selectCurrentPanel = (state: ISidebarState) => state.currentPanel;
export const selectIsShowProperty = (state: ISidebarState) => state.isShow;
export const selectIsPinnedProperty = (state: ISidebarState) => state.isPinned;