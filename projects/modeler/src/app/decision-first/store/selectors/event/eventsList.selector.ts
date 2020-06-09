import { createSelector } from '@ngrx/store';
import { Event } from '../../../models/events.model';
import * as fromFeature from '../../reducers';
import * as fromEventsList from '../../reducers/event/eventsList.reducer';

export const getEventsListState = createSelector(
  fromFeature.getDecisionFirstState,
  (state: fromFeature.IDecisionFirstState) => state.eventsList,
);

export const getEventsList = createSelector(
  getEventsListState, 
  fromEventsList.selectAll
);

export const getEventsListNetworkActive = createSelector(
  getEventsListState, 
  fromEventsList.selectAnyNetworkActive
);

export const getEventsEntities = createSelector(
  getEventsListState, 
  fromEventsList.selectEntities
);

export const getEventsListPagination = createSelector(
  getEventsListState,
  fromEventsList.getPagination,
);

export const getSelectedEventFromEventsList = (id) => createSelector(getEventsListState, (eventState): Event => eventState.entities[id]);
