import { Action } from '@ngrx/store';

export type ActionHandler<T, U extends Action> = (state: T, action: U) => T;

export interface IActionMap<T, U extends Action> {
  [key: string]: ActionHandler<T, U>;
}
