import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';
import * as fromImplementationComponentIcons from './implementation-component/implementationComponentsIcons.reducer';

export interface DecisionFirstImplementationComponentsIconsState {
  implementationComponentsIcons: fromImplementationComponentIcons.IImplementationComponentsIconsState;
}

export const reducers: ActionReducerMap<DecisionFirstImplementationComponentsIconsState> = {
  implementationComponentsIcons: fromImplementationComponentIcons.reducer,
};

export const getImplementationComponentsIconsStoreState = createFeatureSelector<DecisionFirstImplementationComponentsIconsState>('DecisionFirst');

export {
  fromImplementationComponentIcons,
}
