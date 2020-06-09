import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { MessageService } from 'core/services';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { EventsService } from '../../../services/events.service';
import * as eventsListActions from '../../actions/event/eventsList.action';

@Injectable()
export class EventsListEffects {
  constructor(
    private actions$: Actions,
    private eventsService: EventsService,
    private messageService: MessageService,
  ) {}

  @Effect()
  loadEventsList$ = this.actions$.pipe(
    ofType(eventsListActions.LOAD_EVENTS_LIST),
    switchMap(() => {
      return this.eventsService.getSomeMinimalWithSearch().pipe(
        map((results) => new eventsListActions.LoadEventsListSuccess(results)),
        catchError((error) => of(new eventsListActions.EventsListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect()
  loadSpecificPageForEventsList$ = this.actions$.pipe(
    ofType(eventsListActions.LOAD_SPECIFIC_PAGE_FOR_EVENTS_LIST),
    switchMap(({ payload }: eventsListActions.LoadSpecificPageForEventsList) => {
      return this.eventsService.getByUrl(payload).pipe(
        map((results) => new eventsListActions.LoadEventsListSuccess(results)),
        catchError((error) => of(new eventsListActions.EventsListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect({ dispatch: false })
  eventsListFailure$ = this.actions$.pipe(
    ofType(eventsListActions.EVENTS_LIST_FAILURE),
    tap(({ payload }: eventsListActions.EventsListFailure) =>
      this.messageService.handleError(payload, 'resources.eventsList'),
    ),
  );
}
