import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ITab } from 'core/models';
import { rootSelectors } from 'core/root-store';
import { MessageService } from 'core/services';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { IDecisionFirstState } from 'user-management/store/reducers';
import { Event } from '../../../models/events.model';
import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import { EventsService, UpdateObjectTagService } from '../../../services';
import { isInOpenTabs } from '../../../utilitites/effectsHelper';
import { getPreventDuplicateNameMessage } from '../../../utilitites/getPreventDuplicateNameMessage';
import { getAddRelatedObjectRequestBody, getAddRelatedObjectRequestHeaders, getRemoveRelatedObjectRequestHeaders } from '../../../utilitites/httpRequestHelpers';
import * as fromActions from '../../actions';
import * as fromSelectors from '../../selectors';

@Injectable()
export class EventsEffects {
  constructor(
    private actions$: Actions,
    private eventsService: EventsService,
    private messageService: MessageService,
    private updateObjectTagService: UpdateObjectTagService,
    private store: Store<IDecisionFirstState>,
  ) { }

  @Effect()
  loadEvent$ = this.actions$.pipe(
    ofType(fromActions.LOAD_EVENT),
    switchMap((action: fromActions.LoadEvent) => {
      return this.eventsService.getSingleEdit(action.payload).pipe(
        map((event) => {
          return new fromActions.LoadEventSuccess(event);
        }),
        catchError((error) => of(new fromActions.EventFailure({ error, id: action.payload }))),
      );
    }),
  );

  @Effect()
  addEvent$ = this.actions$.pipe(
    ofType(fromActions.ADD_EVENT),
    switchMap(({ payload: { name, description, url } }: fromActions.AddEvent) => {
      const event = new Event();
      event.name = name;
      event.description = description;
      event.url = url;

      const missingTagNames = this.updateObjectTagService.getMissingTagNames({ ...event, tags: [] });

      return this.eventsService.create(event).pipe(
        switchMap((responce: Event) => [
          new fromActions.AddEventSuccess(),
          new fromActions.FinishedGenericNetworkRequestForEvent(),
          missingTagNames.length
            ? new fromActions.UpdateObjectTags({ missingTagNames, id: responce.id, type: ObjectClassNames.Event })
            : new fromActions.NoOpAction(),
        ]),
        catchError((error) => of(new fromActions.GenericEventFailure(error))),
      );
    }),
  );

  @Effect({ dispatch: false })
  addEventSuccess$ = this.actions$.pipe(
    ofType(fromActions.ADD_EVENT_SUCCESS),
    tap(() => {
      this.messageService.showSuccess(['resources.addedSuccessfully'], 'resources.event');
    }),
  );

  @Effect()
  updateEvent$ = this.actions$.pipe(
    ofType(fromActions.UPDATE_EVENT),
    switchMap((action: fromActions.UpdateEvent) => {
      const eventToPatch = new Event();
      Object.keys(action.payload.event).forEach((key) => {
        eventToPatch[key] = action.payload.event[key];
      });

      const missingTagNames = this.updateObjectTagService.getMissingTagNames(action.payload.objectTagsUpdate);
      const extraTagIds = this.updateObjectTagService
        .getExtraTags(action.payload.objectTagsUpdate)
        .map((tag) => tag.id);
      const isTagsChanged = !!missingTagNames.length || !!extraTagIds.length;

      return this.eventsService.patch(eventToPatch).pipe(
        switchMap((result: Event) => {
          if (result.name !== action.payload.event.name) {
            this.messageService.showWarning(getPreventDuplicateNameMessage(result.name), 'resources.event');
          }

          return [
            new fromActions.FinishedNetworkRequestForEvent(action.payload.event.id),
            isTagsChanged
              ? new fromActions.UpdateObjectTags({ missingTagNames, extraTagIds, id: action.payload.event.id, type: ObjectClassNames.Event })
              : new fromActions.NoOpAction(),
          ];
        }),
        catchError((error) =>
          of(
            new fromActions.EventFailure({
              error,
              id: action.payload.event.id,
            }),
          ),
        ),
      );
    }),
  );

  @Effect()
  deleteEvent$ = this.actions$.pipe(
    ofType(fromActions.DELETE_EVENT),
    switchMap((action: fromActions.DeleteEvent) => {
      return this.eventsService.delete(action.payload).pipe(
        map(() => new fromActions.FinishedNetworkRequestForEvent(action.payload.id)),
        catchError((error) => of(new fromActions.EventFailure({ error, id: action.payload.id }))),
      );
    }),
  );

  @Effect()
  addRelatedObjectToEvent$ = this.actions$.pipe(
    ofType(fromActions.ADD_RELATED_OBJECT_TO_EVENT),
    withLatestFrom(this.store.select(rootSelectors.getAuthenticatedUserId)),
    switchMap(([action, authenticatedUserId]: [fromActions.AddRelatedObjectToEvent, string]) => {
      const requestBody = getAddRelatedObjectRequestBody(
        action.payload.relationPath,
        action.payload.relatedObject,
        authenticatedUserId,
      );
      const requestHeaders = getAddRelatedObjectRequestHeaders(action.payload.relationPath);

      return this.eventsService.addRelatedObject(
        action.payload.sourceObject._links[action.payload.relationPath].href,
        requestBody,
        requestHeaders,
      ).pipe(
        map(() => new fromActions.FinishedNetworkRequestForEvent(action.payload.sourceObject.id)),
        catchError((error) =>
          of(
            new fromActions.EventFailure({
              error,
              id: action.payload.sourceObject.id,
            }),
          ),
        ),
      );
    }),
  );

  @Effect()
  removeRelatedObjectFromEvent$ = this.actions$.pipe(
    ofType(fromActions.REMOVE_RELATED_OBJECT_FROM_EVENT),
    withLatestFrom(this.store.select(rootSelectors.getAuthenticatedUserId)),
    switchMap(([action, authenticatedUserId]: [fromActions.RemoveRelatedObjectFromEvent, string]) => {
      const requestHeaders = getRemoveRelatedObjectRequestHeaders(action.payload.relationPath, authenticatedUserId);

      return this.eventsService.removeRelatedObject(
        action.payload.sourceObject._links[action.payload.relationPath].href,
        action.payload.relatedObject.id,
        requestHeaders,
      ).pipe(
        map(() => new fromActions.FinishedNetworkRequestForEvent(action.payload.sourceObject.id)),
        catchError((error) =>
          of(
            new fromActions.EventFailure({
              error,
              id: action.payload.sourceObject.id,
            }),
          ),
        ),
      );
    }),
  );

  @Effect()
  loadEventAsChild$ = this.actions$.pipe(
    ofType(fromActions.LOAD_EVENT_AS_CHILD),
    switchMap((action: fromActions.LoadEventAsChild) => {
      return this.eventsService.getSingleMinimal(action.payload).pipe(
        switchMap((event: Event) => {
          return [
            new fromActions.UpdateDecisionRelatedObject({ object: event, paths: [ObjectRelationsNames.Events] }),
          ];
        }),
        catchError((error) => of(new fromActions.EventFailure({ error, id: action.payload }))),
      );
    }),
  );

  @Effect({ dispatch: false })
  eventFailure$ = this.actions$.pipe(
    ofType(fromActions.EVENT_FAILURE),
    tap(({ payload }: fromActions.EventFailure) => {
      this.messageService.handleError(payload.error, 'resources.event');
    }),
  );

  @Effect({ dispatch: false })
  genericEventFailure$ = this.actions$.pipe(
    ofType(fromActions.GENERIC_EVENT_FAILURE),
    tap(({ payload }: fromActions.GenericEventFailure) =>
      this.messageService.handleError(payload, 'resources.event'),
    ),
  );

  @Effect()
  removePreviewEventFromLocalMemory$ = this.actions$.pipe(
    ofType(fromActions.REMOVE_PREVIEW_EVENT_FROM_LOCAL_MEMORY),
    withLatestFrom(this.store.pipe(select(fromSelectors.getAllTabs))),
    switchMap(([action, allTabs]: [fromActions.RemovePreviewEventFromLocalMemory, ITab[]]) => [
      !isInOpenTabs(action.payload, allTabs)
        ? new fromActions.RemoveEventFromLocalMemory(action.payload)
        : new fromActions.NoOpAction()
    ]),
  );
}
