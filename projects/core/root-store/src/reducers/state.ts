import * as fromRouter from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';
import * as fromAuthentication from './authentication/authentication.reducer';
import { IRouterStateUrl } from './router/router.reducer';
import * as fromVersionInformation from './version-information/version-information.reducer';

export interface IState {
  routerReducer: fromRouter.RouterReducerState<IRouterStateUrl>;
  authentication: fromAuthentication.IAuthenticationState;
  versionInformation: fromVersionInformation.IVersionInformationState;
}

export const reducers: ActionReducerMap<IState> = {
  routerReducer: fromRouter.routerReducer,
  authentication: fromAuthentication.reducer,
  versionInformation: fromVersionInformation.reducer,
};