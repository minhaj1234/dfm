import { createSelector } from '@ngrx/store';
import { Event } from '../../../models/events.model';
import * as fromFeature from '../../reducers';
import * as fromEvents from '../../reducers/event/events.reducer';

export const getEventsState = createSelector(
  fromFeature.getDecisionFirstState,
  (state: fromFeature.IDecisionFirstState) => state.events,
);

export const getLoadedEvents = createSelector(getEventsState, fromEvents.selectEntities);

export const getLoadedEventsAsArray = createSelector(getEventsState, fromEvents.selectAll);

export const getEventsAnyNetworkActive = createSelector(getEventsState, fromEvents.selectAnyNetworkActive);

export const getSelectedEvent = (id) => createSelector(getEventsState, (eventState): Event => eventState.entities[id]);

export const getSelectedEventNetworkActive = (id) => createSelector(
  getEventsState, 
  (eventState): boolean => eventState.networkActive[id] || false
);

export const getLoadedEventsDecisions = createSelector(
  getLoadedEventsAsArray,
  (events: Event[]) => {
    return [].concat.apply([], events.map((event: Event) => [...event.decisions]));
  },
);