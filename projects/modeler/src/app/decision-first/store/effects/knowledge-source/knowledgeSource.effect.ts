import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ITab } from 'core/models';
import { rootSelectors } from 'core/root-store';
import { MessageService } from 'core/services';
import { forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { IDecisionFirstState } from 'user-management/store/reducers/';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import { KnowledgeSourceService, UpdateObjectTagService } from '../../../services';
import { isInOpenTabs } from '../../../utilitites/effectsHelper';
import { getPreventDuplicateNameMessage } from '../../../utilitites/getPreventDuplicateNameMessage';
import { getAddRelatedObjectRequestBody, getAddRelatedObjectRequestHeaders, getRemoveRelatedObjectRequestHeaders } from '../../../utilitites/httpRequestHelpers';
import * as fromActions from '../../actions';
import * as fromSelectors from '../../selectors';

@Injectable()
export class KnowledgeSourceEffects {
  constructor(
    private actions$: Actions,
    private knowledgeSourceService: KnowledgeSourceService,
    private messageService: MessageService,
    private updateObjectTagService: UpdateObjectTagService,
    private store: Store<IDecisionFirstState>,
  ) { }

  @Effect()
  addKnowledgeSource$ = this.actions$.pipe(
    ofType(fromActions.ADD_KNOWLEDGE_SOURCE),
    switchMap(({ payload: { name, description, url, type } }: fromActions.AddKnowledgeSource) => {
      const knowledgeSource = new KnowledgeSource();
      knowledgeSource.name = name;
      knowledgeSource.description = description;
      knowledgeSource.url = url;
      knowledgeSource.type = type;

      const missingTagNames = this.updateObjectTagService.getMissingTagNames({ ...knowledgeSource, tags: [] });

      return this.knowledgeSourceService.create(knowledgeSource).pipe(
        switchMap((responce: KnowledgeSource) => [
          new fromActions.AddKnowledgeSourceSuccess(),
          new fromActions.FinishedGenericNetworkRequestForKnowledgeSource(),
          missingTagNames.length
            ? new fromActions.UpdateObjectTags({ missingTagNames, id: responce.id, type: ObjectClassNames.KnowledgeSource })
            : new fromActions.NoOpAction(),
        ]),
        catchError((error) => of(new fromActions.GenericKnowlegeSourceFailure(error))),
      );
    }),
  );

  @Effect({ dispatch: false })
  addKnowledgeSourceSuccess$ = this.actions$.pipe(
    ofType(fromActions.ADD_KNOWLEDGE_SOURCE_SUCCESS),
    tap(() => {
      this.messageService.showSuccess(['resources.addedSuccessfully'], 'resources.knowledgeSource');
    }),
  );

  @Effect()
  updateKnowledgeSource$ = this.actions$.pipe(
    ofType(fromActions.UPDATE_KNOWLEDGE_SOURCE),
    switchMap((action: fromActions.UpdateKnowledgeSource) => {
      const knowledgeSourceToPatch = new KnowledgeSource();
      Object.keys(action.payload.knowledgeSource).forEach((key) => {
        knowledgeSourceToPatch[key] = action.payload.knowledgeSource[key];
      });

      const missingTagNames = this.updateObjectTagService.getMissingTagNames(action.payload.objectTagsUpdate);
      const extraTagIds = this.updateObjectTagService
        .getExtraTags(action.payload.objectTagsUpdate)
        .map((tag) => tag.id);
      const isTagsChanged = !!missingTagNames.length || !!extraTagIds.length;

      return this.knowledgeSourceService.patch(knowledgeSourceToPatch).pipe(
        switchMap((result: KnowledgeSource) => {
          if (result.name !== action.payload.knowledgeSource.name) {
            this.messageService.showWarning(getPreventDuplicateNameMessage(result.name), 'resources.knowledgeSource');
          }

          return [
            new fromActions.FinishedNetworkRequestForKnowledgeSource(action.payload.knowledgeSource.id),
            isTagsChanged
              ? new fromActions.UpdateObjectTags({ missingTagNames, extraTagIds, id: action.payload.knowledgeSource.id, type: ObjectClassNames.KnowledgeSource })
              : new fromActions.NoOpAction(),
          ]
        }),
        catchError((error) => of(new fromActions.KnowledgeSourceFailure({ error, id: action.payload.knowledgeSource.id }))),
      );
    }),
  );

  @Effect()
  deleteKnowledgeSource$ = this.actions$.pipe(
    ofType(fromActions.DELETE_KNOWLEDGE_SOURCE),
    switchMap((action: fromActions.DeleteKnowledgeSource) => {
      return this.knowledgeSourceService.delete(action.payload).pipe(
        map(() => new fromActions.FinishedNetworkRequestForKnowledgeSource(action.payload.id)),
        catchError((error) => of(new fromActions.KnowledgeSourceFailure({ error, id: action.payload.id }))),
      );
    }),
  );

  @Effect()
  addRelatedObjectToKnowledgeSource$ = this.actions$.pipe(
    ofType(fromActions.ADD_RELATED_OBJECT_TO_KNOWLEDGE_SOURCE),
    withLatestFrom(this.store.select(rootSelectors.getAuthenticatedUserId)),
    switchMap(([action, authenticatedUserId]: [fromActions.AddRelatedObjectToKnowledgeSource, string]) => {
      const requestBody = getAddRelatedObjectRequestBody(
        action.payload.relationPath,
        action.payload.relatedObject,
        authenticatedUserId
      );
      const requestHeaders = getAddRelatedObjectRequestHeaders(action.payload.relationPath);

      return this.knowledgeSourceService.addRelatedObject(
        action.payload.sourceObject._links[action.payload.relationPath].href,
        requestBody,
        requestHeaders,
      ).pipe(
        map(() => new fromActions.FinishedNetworkRequestForKnowledgeSource(action.payload.sourceObject.id)),
        catchError((error) =>
          of(
            new fromActions.KnowledgeSourceFailure({
              error,
              id: action.payload.sourceObject.id,
            }),
          ),
        ),
      );
    }),
  );

  @Effect()
  removeRelatedObjectFromKnowledgeSource$ = this.actions$.pipe(
    ofType(fromActions.REMOVE_RELATED_OBJECT_FROM_KNOWLEDGE_SOURCE),
    withLatestFrom(this.store.select(rootSelectors.getAuthenticatedUserId)),
    switchMap(([action, authenticatedUserId]: [fromActions.RemoveRelatedObjectFromKnowledgeSource, string]) => {
      const requestHeaders = getRemoveRelatedObjectRequestHeaders(action.payload.relationPath, authenticatedUserId);

      return this.knowledgeSourceService.removeRelatedObject(
        action.payload.sourceObject._links[action.payload.relationPath].href,
        action.payload.relatedObject.id,
        requestHeaders,
      ).pipe(
        map(() => new fromActions.FinishedNetworkRequestForKnowledgeSource(action.payload.sourceObject.id)),
        catchError((error) =>
          of(
            new fromActions.KnowledgeSourceFailure({
              error,
              id: action.payload.sourceObject.id,
            }),
          ),
        ),
      );
    }),
  );

  @Effect()
  loadKnowledgeSource$ = this.actions$.pipe(
    ofType(fromActions.LOAD_KNOWLEGE_SOURCE),
    mergeMap((action: fromActions.LoadKnowledgeSource) => {
      return this.knowledgeSourceService.getSingleEdit(action.payload).pipe(
        switchMap((knowledgeSource) => {
          return [
            new fromActions.LoadKnowledgeSourceSuccess(knowledgeSource),
            new fromActions.UpdateDiagramGraphableObject({ object: knowledgeSource, paths: [ObjectRelationsNames.KnowledgeSources] }),
          ]
        }),
        catchError((error) => of(new fromActions.KnowledgeSourceFailure({ error, id: action.payload }))),
      );
    }),
  );

  @Effect()
  loadKnowledgeSourceAsChild$ = this.actions$.pipe(
    ofType(fromActions.LOAD_KNOWLEGE_SOURCE_AS_CHILD),
    mergeMap((action: fromActions.LoadKnowledgeSourceAsChild) => {
      return forkJoin([
        this.knowledgeSourceService.getSingleMinimal(action.payload),
        this.knowledgeSourceService.getSingleObjectForDiagram(action.payload)
      ]).pipe(
        mergeMap(([minimalKnowledgeSource, diagramKnowledgeSource]) => {
          return [
            new fromActions.UpdateDiagramGraphableObject({ object: diagramKnowledgeSource, paths: [ObjectRelationsNames.KnowledgeSources] }),
            new fromActions.UpdateDecisionRelatedObject({
              object: minimalKnowledgeSource, paths: [
                ObjectRelationsNames.RequiresKnowledgeSources,
                ObjectRelationsNames.RequiredByKnowledgeSources,
              ]
            }),
            new fromActions.UpdateInputDataRelatedObject({ object: minimalKnowledgeSource, paths: [ObjectRelationsNames.RequiredByKnowledgeSources] }),
            new fromActions.UpdateKnowledgeSourceRelatedObject({
              object: minimalKnowledgeSource, paths: [
                ObjectRelationsNames.RequiresKnowledgeSources,
                ObjectRelationsNames.RequiredByKnowledgeSources,
              ]
            }),
            new fromActions.UpdateOrganizationRelatedObject({ object: minimalKnowledgeSource, paths: [ObjectRelationsNames.KnowledgeSources] }),
          ]
        }),
        catchError((error) => of(new fromActions.KnowledgeSourceFailure({ error, id: action.payload }))),
      );
    }),
  );

  @Effect({ dispatch: false })
  knowledgeSourceFailure$ = this.actions$.pipe(
    ofType(fromActions.KNOWLEDGE_SOURCE_FAILURE),
    tap(({ payload }: fromActions.KnowledgeSourceFailure) =>
      this.messageService.handleError(payload.error, 'resources.knowledgeSource'),
    ),
  );

  @Effect({ dispatch: false })
  knowledgeSourceGenericFailure$ = this.actions$.pipe(
    ofType(fromActions.GENERIC_KNOWLEDGE_SOURCE_FAILURE),
    tap(({ payload }: fromActions.GenericKnowlegeSourceFailure) =>
      this.messageService.handleError(payload, 'resources.knowledgeSource'),
    ),
  );

  @Effect()
  removePreviewKnowledgeSourceFromLocalMemory$ = this.actions$.pipe(
    ofType(fromActions.REMOVE_PREVIEW_KNOWLEDGE_SOURCE_FROM_LOCAL_MEMORY),
    withLatestFrom(this.store.pipe(select(fromSelectors.getAllTabs))),
    switchMap(([action, allTabs]: [fromActions.RemovePreviewKnowledgeSourceFromLocalMemory, ITab[]]) => [
      !isInOpenTabs(action.payload, allTabs)
        ? new fromActions.RemoveKnowledgeSourceFromLocalMemory(action.payload)
        : new fromActions.NoOpAction()
    ]),
  );
}
