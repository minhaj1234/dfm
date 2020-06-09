import { Action } from '@ngrx/store';

export class NoOpAction implements Action {
  readonly type = 'NO OP';
}
