import { NgModule } from '@angular/core';
import { combineReducers, StoreModule } from '@ngrx/store';
import { rootReducers } from 'core/root-store';
import * as fromReducers from '../store/reducers'

@NgModule({
  imports: [
    StoreModule.forRoot({
      ...rootReducers.reducers,
      DecisionFirst: combineReducers(fromReducers.reducers),
    }, {
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
        },
      })
  ],
})
export class TestStoreModule { }