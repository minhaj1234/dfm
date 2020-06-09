import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap } from 'core/models';
import { createNetworkAdapter, getNewEntitiesIfNeeded, StateWithNetworkActive } from 'core/utilities';
import { Event } from '../../../models/events.model';
import { ObjectClassNames } from '../../../models/objects.model';
import * as fromActions from '../../actions';

export interface IEventsState extends EntityState<Event>, StateWithNetworkActive {}

export const eventsAdapter: EntityAdapter<Event> = createEntityAdapter<Event>();
export const networkAdapter = createNetworkAdapter();

export const initialState: IEventsState = {
  ...eventsAdapter.getInitialState(),
  ...networkAdapter.initialState,
};

const actionMap: IActionMap<IEventsState, fromActions.EventActions | fromActions.CommonObjectActions> = {
  [fromActions.LOAD_EVENT]: loadEventHandler,
  [fromActions.LOAD_EVENT_SUCCESS]: loadEventSuccessHandler,
  [fromActions.ADD_EVENT]: addEventHandler,
  [fromActions.UPDATE_EVENT]: updateEventHandler,
  [fromActions.DELETE_EVENT]: deleteEventHandler,
  [fromActions.ADD_RELATED_OBJECT_TO_EVENT]: addRelatedObjectToEventHandler,
  [fromActions.UPDATE_EVENT_RELATED_OBJECT]: updateEventRelatedObjectHandler,
  [fromActions.REMOVE_RELATED_OBJECT_FROM_EVENT]: removeRelatedObjectFromEventHandler,
  [fromActions.UPDATE_OBJECT_TAGS]: updateObjectTagsHandler,
  [fromActions.FINISHED_NETWORK_REQUEST_FOR_EVENT]: finishedNetworkRequestForEventHandler,
  [fromActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_EVENT]: finishedGenericNetworkRequestForEventHandler,
  [fromActions.EVENT_FAILURE]: eventFailureHandler,
  [fromActions.REMOVE_EVENT_FROM_LOCAL_MEMORY]: removeEventFromLocalMemoryHandler,
};

export function reducer(state: IEventsState = initialState, action: fromActions.EventActions | fromActions.CommonObjectActions): IEventsState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function loadEventHandler(state: IEventsState, action: fromActions.LoadEvent): IEventsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload, state),
  };
}

function loadEventSuccessHandler(state: IEventsState, action: fromActions.LoadEventSuccess): IEventsState {
  return {
    ...eventsAdapter.upsertOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload.id, state),
  };
}

function addEventHandler(
  state: IEventsState, 
  action: fromActions.AddEvent
): IEventsState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function updateEventHandler(
  state: IEventsState, 
  action: fromActions.UpdateEvent
): IEventsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.event.id, state),
  };
}

function deleteEventHandler(
  state: IEventsState,
  action: fromActions.DeleteEvent,
): IEventsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.id, state),
  };
}

function addRelatedObjectToEventHandler(
  state: IEventsState,
  action: fromActions.AddRelatedObjectToEvent,
): IEventsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.sourceObject.id, state),
  };
}

function updateEventRelatedObjectHandler(
  state: IEventsState,
  action: fromActions.UpdateEventRelatedObject,
): IEventsState {
  return {
    ...state,
    entities: getNewEntitiesIfNeeded(action.payload.object, state.entities, action.payload.paths),
  };
}

function removeRelatedObjectFromEventHandler(
  state: IEventsState,
  action: fromActions.RemoveRelatedObjectFromEvent,
): IEventsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.sourceObject.id, state),
  };
}

function updateObjectTagsHandler(
  state: IEventsState,
  action: fromActions.UpdateObjectTags,
): IEventsState {
  return action.payload.type === ObjectClassNames.Event 
  ? {
    ...state,
    ...networkAdapter.makeOneActive(action.payload.id, state),
  }
  : state;
}

function finishedNetworkRequestForEventHandler(
  state: IEventsState,
  action: fromActions.FinishedNetworkRequestForEvent,
): IEventsState {
  return {
    ...state,
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

function finishedGenericNetworkRequestForEventHandler(
  state: IEventsState,
  action: fromActions.FinishedGenericNetworkRequestForEvent,
): IEventsState {
  return {
    ...state,
    ...networkAdapter.makeGenericInactive(state),
  };
}

function eventFailureHandler(state: IEventsState, action: fromActions.EventFailure): IEventsState {
  return {
    ...state,
    ...networkAdapter.makeOneInactive(action.payload.id, state),
  };
}

function removeEventFromLocalMemoryHandler(
  state: IEventsState,
  action: fromActions.RemoveEventFromLocalMemory,
): IEventsState {
  return {
    ...eventsAdapter.removeOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

export const { selectAnyNetworkActive, selectGenericNetworkActive, selectNetworkActive } = networkAdapter.selectors;
export const { selectAll, selectEntities, selectIds, selectTotal } = eventsAdapter.getSelectors();
