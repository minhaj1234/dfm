import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ITab } from 'core/models';
import { rootSelectors } from 'core/root-store';
import { MessageService } from 'core/services';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { IDecisionFirstState } from 'user-management/store/reducers';
import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import { Process } from '../../../models/process.model';
import { ProcessesService, UpdateObjectTagService } from '../../../services';
import { isInOpenTabs } from '../../../utilitites/effectsHelper';
import { getPreventDuplicateNameMessage } from '../../../utilitites/getPreventDuplicateNameMessage';
import { getAddRelatedObjectRequestBody, getAddRelatedObjectRequestHeaders, getRemoveRelatedObjectRequestHeaders } from '../../../utilitites/httpRequestHelpers';
import * as fromActions from '../../actions';
import * as fromSelectors from '../../selectors';

@Injectable()
export class ProcessesEffects {
  constructor(
    private actions$: Actions,
    private processesService: ProcessesService,
    private messageService: MessageService,
    private updateObjectTagService: UpdateObjectTagService,
    private store: Store<IDecisionFirstState>,
  ) { }

  @Effect()
  loadProcess$ = this.actions$.pipe(
    ofType(fromActions.LOAD_PROCESS),
    switchMap((action: fromActions.LoadProcess) => {
      return this.processesService.getSingleEdit(action.payload).pipe(
        map((process) => {
          return new fromActions.LoadProcessSuccess(process);
        }),
        catchError((error) => of(new fromActions.ProcessFailure({ error, id: action.payload }))),
      );
    }),
  );

  @Effect()
  addProcess$ = this.actions$.pipe(
    ofType(fromActions.ADD_PROCESS),
    switchMap(({ payload: { name, description, url } }: fromActions.AddProcess) => {
      const process = new Process();
      process.name = name;
      process.description = description;
      process.url = url;

      const missingTagNames = this.updateObjectTagService.getMissingTagNames({ ...process, tags: [] });

      return this.processesService.create(process).pipe(
        switchMap((responce: Process) => [
          new fromActions.AddProcessSuccess(),
          new fromActions.FinishedGenericNetworkRequestForProcess(),
          missingTagNames.length
            ? new fromActions.UpdateObjectTags({ missingTagNames, id: responce.id, type: ObjectClassNames.Process })
            : new fromActions.NoOpAction(),
        ]),
        catchError((error) => of(new fromActions.GenericProcessFailure(error))),
      );
    }),
  );

  @Effect({ dispatch: false })
  addProcessSuccess$ = this.actions$.pipe(
    ofType(fromActions.ADD_PROCESS_SUCCESS),
    tap(() => {
      this.messageService.showSuccess(['resources.addedSuccessfully'], 'resources.process');
    }),
  );

  @Effect()
  updateProcess$ = this.actions$.pipe(
    ofType(fromActions.UPDATE_PROCESS),
    switchMap((action: fromActions.UpdateProcess) => {
      const processToPatch = new Process();
      Object.keys(action.payload.process).forEach((key) => {
        processToPatch[key] = action.payload.process[key];
      });

      const missingTagNames = this.updateObjectTagService.getMissingTagNames(action.payload.objectTagsUpdate);
      const extraTagIds = this.updateObjectTagService
        .getExtraTags(action.payload.objectTagsUpdate)
        .map((tag) => tag.id);
      const isTagsChanged = !!missingTagNames.length || !!extraTagIds.length;

      return this.processesService.patch(processToPatch).pipe(
        switchMap((result: Process) => {
          if (result.name !== action.payload.process.name) {
            this.messageService.showWarning(getPreventDuplicateNameMessage(result.name), 'resources.process');
          }

          return [
            new fromActions.FinishedNetworkRequestForProcess(action.payload.process.id),
            isTagsChanged
              ? new fromActions.UpdateObjectTags({ missingTagNames, extraTagIds, id: action.payload.process.id, type: ObjectClassNames.Process })
              : new fromActions.NoOpAction(),
          ];
        }),
        catchError((error) =>
          of(
            new fromActions.ProcessFailure({
              error,
              id: action.payload.process.id,
            }),
          ),
        ),
      );
    }),
  );

  @Effect()
  deleteProcess$ = this.actions$.pipe(
    ofType(fromActions.DELETE_PROCESS),
    switchMap((action: fromActions.DeleteProcess) => {
      return this.processesService.delete(action.payload).pipe(
        map(() => new fromActions.FinishedNetworkRequestForProcess(action.payload.id)),
        catchError((error) => of(new fromActions.ProcessFailure({ error, id: action.payload.id }))),
      );
    }),
  );

  @Effect()
  addRelatedObjectToProcess$ = this.actions$.pipe(
    ofType(fromActions.ADD_RELATED_OBJECT_TO_PROCESS),
    withLatestFrom(this.store.select(rootSelectors.getAuthenticatedUserId)),
    switchMap(([action, authenticatedUserId]: [fromActions.AddRelatedObjectToProcess, string]) => {
      const requestBody = getAddRelatedObjectRequestBody(
        action.payload.relationPath,
        action.payload.relatedObject,
        authenticatedUserId,
      );
      const requestHeaders = getAddRelatedObjectRequestHeaders(action.payload.relationPath);

      return this.processesService.addRelatedObject(
        action.payload.sourceObject._links[action.payload.relationPath].href,
        requestBody,
        requestHeaders,
      ).pipe(
        map(() => new fromActions.FinishedNetworkRequestForProcess(action.payload.sourceObject.id)),
        catchError((error) =>
          of(
            new fromActions.ProcessFailure({
              error,
              id: action.payload.sourceObject.id,
            }),
          ),
        ),
      );
    }),
  );

  @Effect()
  removeRelatedObjectFromProcess$ = this.actions$.pipe(
    ofType(fromActions.REMOVE_RELATED_OBJECT_FROM_PROCESS),
    withLatestFrom(this.store.select(rootSelectors.getAuthenticatedUserId)),
    switchMap(([action, authenticatedUserId]: [fromActions.RemoveRelatedObjectFromProcess, string]) => {
      const requestHeaders = getRemoveRelatedObjectRequestHeaders(action.payload.relationPath, authenticatedUserId);

      return this.processesService.removeRelatedObject(
        action.payload.sourceObject._links[action.payload.relationPath].href,
        action.payload.relatedObject.id,
        requestHeaders,
      ).pipe(
        map(() => new fromActions.FinishedNetworkRequestForProcess(action.payload.sourceObject.id)),
        catchError((error) =>
          of(
            new fromActions.ProcessFailure({
              error,
              id: action.payload.sourceObject.id,
            }),
          ),
        ),
      );
    }),
  );

  @Effect()
  loadProcessAsChild$ = this.actions$.pipe(
    ofType(fromActions.LOAD_PROCESS_AS_CHILD),
    switchMap((action: fromActions.LoadProcessAsChild) => {
      return this.processesService.getSingleMinimal(action.payload).pipe(
        switchMap((process: Process) => {
          return [
            new fromActions.UpdateDecisionRelatedObject({ object: process, paths: [ObjectRelationsNames.Processes] }),
          ];
        }),
        catchError((error) => of(new fromActions.ProcessFailure({ error, id: action.payload }))),
      );
    }),
  );

  @Effect({ dispatch: false })
  processFailure$ = this.actions$.pipe(
    ofType(fromActions.PROCESS_FAILURE),
    tap(({ payload }: fromActions.ProcessFailure) => {
      this.messageService.handleError(payload.error, 'resources.process');
    }),
  );

  @Effect({ dispatch: false })
  genericProcessFailure$ = this.actions$.pipe(
    ofType(fromActions.GENERIC_PROCESS_FAILURE),
    tap(({ payload }: fromActions.GenericProcessFailure) =>
      this.messageService.handleError(payload, 'resources.process'),
    ),
  );

  @Effect()
  removePreviewProcessFromLocalMemory$ = this.actions$.pipe(
    ofType(fromActions.REMOVE_PREVIEW_PROCESS_FROM_LOCAL_MEMORY),
    withLatestFrom(this.store.pipe(select(fromSelectors.getAllTabs))),
    switchMap(([action, allTabs]: [fromActions.RemovePreviewProcessFromLocalMemory, ITab[]]) => [
      !isInOpenTabs(action.payload, allTabs)
        ? new fromActions.RemoveProcessFromLocalMemory(action.payload)
        : new fromActions.NoOpAction()
    ]),
  );
}
