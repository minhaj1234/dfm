import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import * as fromTabsReducers from 'core/objects/tabs/store'
import { rootReducers } from 'core/root-store';
import { reducers } from 'user-management/store/reducers';

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
        ...reducers,
        ...fromTabsReducers.reducers,
      }),
  ],
})
export class TestStoreModule { }