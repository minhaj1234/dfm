import * as fromRouter from '@ngrx/router-store';
import { createFeatureSelector, createSelector, ActionReducerMap } from '@ngrx/store';
import { IRouterStateUrl } from '../../reducers/router/router.reducer';

export const getRouterState = createFeatureSelector<fromRouter.RouterReducerState<IRouterStateUrl>>('routerReducer');

export const getRouterQueryParams = createSelector(getRouterState, (routerState) => {
  if (routerState && routerState.state && routerState.state.queryParams) {
    return routerState.state.queryParams;
  }
});

export const getRouterParams = createSelector(getRouterState, (routerState) => {
  if (routerState && routerState.state && routerState.state.params) {
    return routerState.state.params;
  }
});

export const getRouterUrl = createSelector(getRouterState, (routerState) => {
  if (routerState && routerState.state && routerState.state.url) {
    return routerState.state.url;
  }
});
