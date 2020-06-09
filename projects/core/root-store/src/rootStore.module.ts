import { NgModule } from '@angular/core';
import { NbToastrModule, NbToastrService } from '@nebular/theme';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { WebAuth } from 'auth0-js';
import { TOASTR_CONFIG } from 'core/config';
import { AUTH_0_AUDIENCE, AUTH_0_CLIENT_ID, AUTH_0_DOMAIN } from 'core/constants';
import { UserEffects } from './effects/authentication/authentication.effect';
import { VersionInformationEffects } from './effects/version-information/version-information.effect';
import { CustomSerializer } from './reducers/router/router.reducer';
import { reducers } from './reducers/state';
import { AuthService } from './services/auth/auth.service';
import { VersionInformationService } from './services/version-information/version-information.service';

export const auth0Instance = new WebAuth({
  audience: AUTH_0_AUDIENCE,
  clientID: AUTH_0_CLIENT_ID,
  domain: AUTH_0_DOMAIN,
  redirectUri: `${window.location.origin}/callback`,
  responseType: 'token id_token',
});

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forRoot(reducers, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      },
    }),
    EffectsModule.forRoot([
      UserEffects,
      VersionInformationEffects,
    ]),
    StoreRouterConnectingModule.forRoot(),
    NbToastrModule.forRoot(TOASTR_CONFIG),
  ],
  exports: [],
  providers: [
    AuthService,
    { provide: WebAuth, useValue: auth0Instance },
    { provide: RouterStateSerializer, useClass: CustomSerializer },
    NbToastrService,
    VersionInformationService,
  ]
})
export class RootStoreModule { }
