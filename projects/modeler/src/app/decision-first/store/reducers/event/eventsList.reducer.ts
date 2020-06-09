import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap, IPagination } from 'core/models';
import { createNetworkAdapter, StateWithNetworkActive } from 'core/utilities';
import { Event } from '../../../models/events.model';
import * as fromActions from '../../actions/event/eventsList.action';

export interface IEventsListState extends EntityState<Event>, StateWithNetworkActive {
  pagination: IPagination;
  searchTerm: string;
}

export const eventsListAdapter: EntityAdapter<Event> = createEntityAdapter<Event>();
export const networkAdapter = createNetworkAdapter();

export const initialState: IEventsListState = {
  ...eventsListAdapter.getInitialState(),
  ...networkAdapter.initialState,
  pagination: {
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  },
  searchTerm: '',
};

const actionMap: IActionMap<IEventsListState, fromActions.EventsListActions> = {
  [fromActions.LOAD_EVENTS_LIST]: loadEventsListHandler,
  [fromActions.LOAD_SPECIFIC_PAGE_FOR_EVENTS_LIST]: loadSpecificPageForEventsListHandler,
  [fromActions.LOAD_EVENTS_LIST_SUCCESS]: loadEventsListSuccessHandler,
  [fromActions.EVENTS_LIST_FAILURE]: eventsListFailureHandler,
};

export function reducer(
  state: IEventsListState = initialState,
  action: fromActions.EventsListActions,
): IEventsListState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function loadEventsListHandler(
  state: IEventsListState, 
  action: fromActions.LoadEventsList
): IEventsListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadSpecificPageForEventsListHandler(
  state: IEventsListState,
  action: fromActions.LoadSpecificPageForEventsList,
): IEventsListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadEventsListSuccessHandler(
  state: IEventsListState,
  action: fromActions.LoadEventsListSuccess,
): IEventsListState {
  return {
    ...eventsListAdapter.addAll(action.payload.results, state),
    ...networkAdapter.makeGenericInactive(state),
    pagination: action.payload.pagination,
  };
}

function eventsListFailureHandler(state: IEventsListState, action: fromActions.EventsListFailure): IEventsListState {
  return {
    ...state,
    ...networkAdapter.makeGenericInactive(state),
  };
}

export const { selectAnyNetworkActive, selectGenericNetworkActive, selectNetworkActive } = networkAdapter.selectors;
export const { selectEntities, selectAll } = eventsListAdapter.getSelectors();
export const getPagination = (state: IEventsListState) => state.pagination;
