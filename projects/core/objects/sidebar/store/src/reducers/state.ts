import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';
import * as fromSidebarReducers from './sidebar.reducer';

export interface IDecisionFirstSidebarState {
  sidebar: fromSidebarReducers.ISidebarState;
}

export const reducers: ActionReducerMap<IDecisionFirstSidebarState> = {
  sidebar: fromSidebarReducers.reducer,
};

export const getSidebarStoreState = createFeatureSelector<IDecisionFirstSidebarState>('DecisionFirst');

export {
  fromSidebarReducers,
}
