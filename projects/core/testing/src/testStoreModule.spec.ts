import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import * as fromImplementationComponentReducers from 'core/objects/implementation-component/store'
import * as fromSidebarReducers from 'core/objects/sidebar/store'
import * as fromTabsReducers from 'core/objects/tabs/store'
import { rootReducers } from 'core/root-store';

@NgModule({
  imports: [
    StoreModule.forRoot({
      ...rootReducers.reducers,
    }, {
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
        },
      }),
      StoreModule.forFeature('DecisionFirst', {
        ...fromImplementationComponentReducers.reducers,
        ...fromSidebarReducers.reducers,
        ...fromTabsReducers.reducers,
      }),
  ],
})
export class TestStoreModule { }