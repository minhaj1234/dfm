import { Action } from '@ngrx/store';

export * from './authentication/authentication.actions';
export * from './version-information/version-information.actions';
export * from './interfaces';

export class NoOpAction implements Action {
  readonly type = 'NO OP';
}
