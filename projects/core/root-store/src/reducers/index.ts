import * as authenticationReducer from './authentication/authentication.reducer';
import * as routerReducer from './router/router.reducer';
import * as versionInformationReducer from './version-information/version-information.reducer';

export * from './state';
export {
  authenticationReducer,
  routerReducer,
  versionInformationReducer,
}