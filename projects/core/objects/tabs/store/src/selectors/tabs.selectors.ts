import { createSelector } from '@ngrx/store';
import { ITab } from 'core/models';
import * as fromFeature from '../reducers';
import * as fromTabs from '../reducers';

export const getTabsState = createSelector(
  fromFeature.getTabsStoreState,
  (state: fromFeature.IDecisionFirstTabsState) => state.tabs,
);

export const getAllTabsEntities = createSelector(getTabsState, fromTabs.selectEntities);
export const getAllTabs = createSelector(getTabsState, fromTabs.selectAll);
export const isTabOpen = (id) => createSelector(getTabsState, (tabs) => tabs.entities[id] !== undefined);
export const getCurrentTabId = createSelector(getTabsState, fromTabs.selectCurrentTab);
export const getCurrentTabEntity = createSelector(getTabsState, fromTabs.selectCurrentEntity);
export const getTabEntityById = (id) => createSelector(getAllTabs, (tabs: ITab[]) => tabs.find((tab) =>  tab.id === id) as ITab);
