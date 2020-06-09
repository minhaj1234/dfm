import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';
import * as fromTabsReducers from './tabs.reducer';

export interface IDecisionFirstTabsState {
  tabs: fromTabsReducers.ITabState;
}

export const reducers: ActionReducerMap<IDecisionFirstTabsState> = {
  tabs: fromTabsReducers.reducer,
};

export const getTabsStoreState = createFeatureSelector<IDecisionFirstTabsState>('DecisionFirst');

export {
  fromTabsReducers,
}
