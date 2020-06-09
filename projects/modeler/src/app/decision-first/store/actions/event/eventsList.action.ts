import { Action } from '@ngrx/store';
import { IPagination } from 'core/models';
import { Event } from '../../../models/events.model';

export const LOAD_EVENTS_LIST = '[DMS] Load Events List';
export const LOAD_SPECIFIC_PAGE_FOR_EVENTS_LIST = '[DMS] Load Specific Page For Events List';
export const LOAD_EVENTS_LIST_SUCCESS = '[DMS] Load Events List Success';
export const EVENTS_LIST_FAILURE = '[DMS] Events List Failure';

export class LoadEventsList implements Action {
  readonly type = LOAD_EVENTS_LIST;
}

export class LoadSpecificPageForEventsList implements Action {
  readonly type = LOAD_SPECIFIC_PAGE_FOR_EVENTS_LIST;
  constructor(public payload: string) { }
}

export class LoadEventsListSuccess implements Action {
  readonly type = LOAD_EVENTS_LIST_SUCCESS;
  constructor(public payload: { results: Event[]; pagination: IPagination }) {}
}

export class EventsListFailure implements Action {
  readonly type = EVENTS_LIST_FAILURE;
  constructor(public payload: Error) {}
}

export type EventsListActions = 
  | LoadEventsList
  | LoadSpecificPageForEventsList
  | LoadEventsListSuccess
  | EventsListFailure;
