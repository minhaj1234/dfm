import { createSelector } from '@ngrx/store';
import { SidebarPanel } from 'core/objects/sidebar/models';
import * as fromFeature from '../reducers';
import * as fromSidebar from '../reducers/sidebar.reducer';

export const getSidebarState = createSelector(
  fromFeature.getSidebarStoreState,
  (state: fromFeature.IDecisionFirstSidebarState) => state.sidebar,
);

export const getCurrentPanelSidebar = createSelector(getSidebarState, fromSidebar.selectCurrentPanel);

export const getIsShowPropertySidebar = createSelector(getSidebarState, fromSidebar.selectIsShowProperty);

export const getIsPinnedPropertySidebar = createSelector(getSidebarState, fromSidebar.selectIsPinnedProperty);
