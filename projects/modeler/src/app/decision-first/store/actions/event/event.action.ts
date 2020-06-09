import { Action } from '@ngrx/store';
import { Event, EventRelatedObjects, IEventUpdate } from '../../../models/events.model';

export const LOAD_EVENT = '[DMS] Load Event';
export const LOAD_EVENT_SUCCESS = '[DMS] Load Event Success';
export const ADD_EVENT = '[DMS] Add Event';
export const ADD_EVENT_SUCCESS = '[DMS] Add Event Success';
export const UPDATE_EVENT = '[DMS] Update Event';
export const DELETE_EVENT = '[DMS] Delete Event';
export const ADD_RELATED_OBJECT_TO_EVENT = '[DMS] Add Related Object To Event';
export const UPDATE_EVENT_RELATED_OBJECT = '[DMS] Update Event Related Object';
export const REMOVE_RELATED_OBJECT_FROM_EVENT = '[DMS] Remove Related Object From Event';
export const LOAD_EVENT_AS_CHILD = '[DMS] Load Event As Child';
export const FINISHED_NETWORK_REQUEST_FOR_EVENT = '[DMS] Finished Network Request for Event';
export const FINISHED_GENERIC_NETWORK_REQUEST_FOR_EVENT = '[DMS] Finished Generic Network Request for Event';
export const EVENT_FAILURE = '[DMS] Event Fail';
export const GENERIC_EVENT_FAILURE = '[DMS] Generic Event Failure';
export const REMOVE_EVENT_FROM_LOCAL_MEMORY = '[DMS] Remove Event From Local Memory';
export const REMOVE_PREVIEW_EVENT_FROM_LOCAL_MEMORY = '[DMS] Remove Perview Event From Local Memory';

export class LoadEvent implements Action {
  readonly type = LOAD_EVENT;
  constructor(public payload: string) { }
}

export class LoadEventSuccess implements Action {
  readonly type = LOAD_EVENT_SUCCESS;
  constructor(public payload: Event) { }
}

export class AddEvent implements Action {
  readonly type = ADD_EVENT;
  constructor(
    public payload: { name: string; description: string; url: string }
  ) { }
}

export class AddEventSuccess implements Action {
  readonly type = ADD_EVENT_SUCCESS;
}

export class UpdateEvent implements Action {
  readonly type = UPDATE_EVENT;
  constructor(public payload: IEventUpdate) { }
}

export class DeleteEvent implements Action {
  readonly type = DELETE_EVENT;
  constructor(public payload: Event) { }
}

export class AddRelatedObjectToEvent implements Action {
  readonly type = ADD_RELATED_OBJECT_TO_EVENT;
  constructor(public payload: {
    sourceObject: Event;
    relatedObject: EventRelatedObjects;
    relationPath: string;
  }) { }
}

export class UpdateEventRelatedObject implements Action {
  readonly type = UPDATE_EVENT_RELATED_OBJECT;
  constructor(public payload: { object: EventRelatedObjects, paths: string[] }) { }
}

export class RemoveRelatedObjectFromEvent implements Action {
  readonly type = REMOVE_RELATED_OBJECT_FROM_EVENT;
  constructor(public payload: {
    sourceObject: Event;
    relatedObject: EventRelatedObjects;
    relationPath: string;
  }) { }
}

export class LoadEventAsChild implements Action {
  readonly type = LOAD_EVENT_AS_CHILD;
  constructor(public payload: string) { }
}

export class FinishedNetworkRequestForEvent implements Action {
  readonly type = FINISHED_NETWORK_REQUEST_FOR_EVENT;
  constructor(public payload: string) { }
}

export class FinishedGenericNetworkRequestForEvent implements Action {
  readonly type = FINISHED_GENERIC_NETWORK_REQUEST_FOR_EVENT;
}

export class EventFailure implements Action {
  readonly type = EVENT_FAILURE;
  constructor(public payload: { id: string; error: Error }) { }
}

export class GenericEventFailure implements Action {
  readonly type = GENERIC_EVENT_FAILURE;
  constructor(public payload: Error) { }
}

export class RemoveEventFromLocalMemory implements Action {
  readonly type = REMOVE_EVENT_FROM_LOCAL_MEMORY;
  constructor(public payload: string) { }
}

export class RemovePreviewEventFromLocalMemory implements Action {
  readonly type = REMOVE_PREVIEW_EVENT_FROM_LOCAL_MEMORY;
  constructor(public payload: string) { }
}

export type EventActions =
  | LoadEvent
  | LoadEventSuccess
  | AddEvent
  | UpdateEvent
  | DeleteEvent
  | AddRelatedObjectToEvent
  | UpdateEventRelatedObject
  | RemoveRelatedObjectFromEvent
  | LoadEventAsChild
  | FinishedNetworkRequestForEvent
  | FinishedGenericNetworkRequestForEvent
  | EventFailure
  | GenericEventFailure
  | RemoveEventFromLocalMemory
  | RemovePreviewEventFromLocalMemory;
