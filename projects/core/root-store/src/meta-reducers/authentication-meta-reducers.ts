import { ActionReducer, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

const userMetaReducers: MetaReducer<any>[] = [];

function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({
    keys: ['authentication'],
    rehydrate: true,
  })(reducer);
}

export function getUserMetaReducers(): MetaReducer<any>[] {
  initializeUserMetaReducers();

  return userMetaReducers;
}

function initializeUserMetaReducers(): void {
  if(userMetaReducers.indexOf(localStorageSyncReducer) === -1) {
    userMetaReducers.push(localStorageSyncReducer);
  }
}
