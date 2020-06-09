import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ITab } from 'core/models';
import { rootSelectors } from 'core/root-store';
import { APPLICATION_JSON_HEADER, MessageService } from 'core/services';
import { forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { IDecisionFirstState } from 'user-management/store/reducers';
import { Decision } from '../../../models/decision.model';
import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import { DecisionsService, UpdateObjectTagService } from '../../../services';
import { isInOpenTabs } from '../../../utilitites/effectsHelper';
import { getPreventDuplicateNameMessage } from '../../../utilitites/getPreventDuplicateNameMessage';
import { getAddRelatedObjectRequestBody, getAddRelatedObjectRequestHeaders, getRemoveRelatedObjectRequestHeaders } from '../../../utilitites/httpRequestHelpers';
import { fromAnswer } from '../../../utilitites/mappings';
import * as fromActions from '../../actions';
import * as fromSelectors from '../../selectors';

@Injectable()
export class DecisionsEffects {
  constructor(
    private actions$: Actions,
    private decisionsService: DecisionsService,
    private messageService: MessageService,
    private updateObjectTagService: UpdateObjectTagService,
    private store: Store<IDecisionFirstState>,
  ) { }

  @Effect()
  addDecision$ = this.actions$.pipe(
    ofType(fromActions.ADD_DECISION),
    switchMap(({ payload: { name, description, url, type, statusLevel, question } }: fromActions.AddDecision) => {
      const decision = new Decision();
      decision.name = name;
      decision.description = description;
      decision.url = url;
      decision.type = type;
      decision.statusLevel = statusLevel;
      decision.question = question;

      const missingTagNames = this.updateObjectTagService.getMissingTagNames({ ...decision, tags: [] });

      return this.decisionsService.create(decision).pipe(
        switchMap((responce: Decision) => [
          new fromActions.AddDecisionSuccess(),
          new fromActions.FinishedGenericNetworkRequestForDecision(),
          missingTagNames.length
            ? new fromActions.UpdateObjectTags({ missingTagNames, id: responce.id, type: ObjectClassNames.Decision })
            : new fromActions.NoOpAction(),
        ]),
        catchError((error) => of(new fromActions.GenericDecisionFailure(error))),
      );
    }),
  );

  @Effect({ dispatch: false })
  addDecisionSuccess$ = this.actions$.pipe(
    ofType(fromActions.ADD_DECISION_SUCCESS),
    tap(() => {
      this.messageService.showSuccess(['resources.addedSuccessfully'], 'resources.decision');
    }),
  );

  @Effect()
  updateDecision$ = this.actions$.pipe(
    ofType(fromActions.UPDATE_DECISION),
    switchMap((action: fromActions.UpdateDecision) => {
      const decisionToPatch = new Decision();
      Object.keys(action.payload.decision).forEach((key) => {
        decisionToPatch[key] = action.payload.decision[key];
      });

      const missingTagNames = this.updateObjectTagService.getMissingTagNames(action.payload.objectTagsUpdate);
      const extraTagIds = this.updateObjectTagService
        .getExtraTags(action.payload.objectTagsUpdate)
        .map((tag) => tag.id);
      const isTagsChanged = !!missingTagNames.length || !!extraTagIds.length;

      return this.decisionsService.patch(decisionToPatch).pipe(
        switchMap((result: Decision) => {
          if (result.name !== action.payload.decision.name) {
            this.messageService.showWarning(getPreventDuplicateNameMessage(result.name), 'resources.decision');
          }

          return [
            new fromActions.FinishedNetworkRequestForDecision(action.payload.decision.id),
            isTagsChanged
              ? new fromActions.UpdateObjectTags({ missingTagNames, extraTagIds, id: action.payload.decision.id, type: ObjectClassNames.Decision })
              : new fromActions.NoOpAction(),
          ];
        }),
        catchError((error) =>
          of(
            new fromActions.DecisionFailure({
              error,
              id: action.payload.decision.id,
            }),
          ),
        ),
      );
    }),
  );

  @Effect()
  deleteDecision$ = this.actions$.pipe(
    ofType(fromActions.DELETE_DECISION),
    switchMap((action: fromActions.DeleteDecision) => {
      return this.decisionsService.delete(action.payload).pipe(
        switchMap(() => [new fromActions.FinishedNetworkRequestForDecision(action.payload.id)]),
        catchError((error) =>
          of(
            new fromActions.DecisionFailure({
              error,
              id: action.payload.id,
            }),
          ),
        ),
      );
    }),
  );

  @Effect()
  addRelatedObjectToDecision$ = this.actions$.pipe(
    ofType(fromActions.ADD_RELATED_OBJECT_TO_DECISION),
    withLatestFrom(this.store.select(rootSelectors.getAuthenticatedUserId)),
    switchMap(([action, authenticatedUserId]: [fromActions.AddRelatedObjectToDecision, string]) => {
      const requestBody = getAddRelatedObjectRequestBody(
        action.payload.relationPath,
        action.payload.relatedObject,
        authenticatedUserId
      );
      const requestHeaders = getAddRelatedObjectRequestHeaders(action.payload.relationPath);

      return this.decisionsService.addRelatedObject(
        action.payload.sourceObject._links[action.payload.relationPath].href,
        requestBody,
        requestHeaders,
      ).pipe(
        map(() => new fromActions.FinishedNetworkRequestForDecision(action.payload.sourceObject.id)),
        catchError((error) =>
          of(
            new fromActions.DecisionFailure({
              error,
              id: action.payload.sourceObject.id,
            }),
          ),
        ),
      );
    }),
  );

  @Effect()
  removeRelatedObjectFromDecision$ = this.actions$.pipe(
    ofType(fromActions.REMOVE_RELATED_OBJECT_FROM_DECISION),
    withLatestFrom(this.store.select(rootSelectors.getAuthenticatedUserId)),
    switchMap(([action, authenticatedUserId]: [fromActions.RemoveRelatedObjectFromDecision, string]) => {
      const requestHeaders = getRemoveRelatedObjectRequestHeaders(action.payload.relationPath, authenticatedUserId);

      return this.decisionsService.removeRelatedObject(
        action.payload.sourceObject._links[action.payload.relationPath].href,
        action.payload.relatedObject.id,
        requestHeaders,
      ).pipe(
        map(() => new fromActions.FinishedNetworkRequestForDecision(action.payload.sourceObject.id)),
        catchError((error) =>
          of(
            new fromActions.DecisionFailure({
              error,
              id: action.payload.sourceObject.id,
            }),
          ),
        ),
      );
    }),
  );

  @Effect()
  addImplementationTableEntity$ = this.actions$.pipe(
    ofType(fromActions.ADD_IMPLEMENTATION_TABLE_ENTITY),
    switchMap((action: fromActions.AddImplementationTableEntity) => {
      const requestBody = JSON.stringify({ ...action.payload.requestBody });
      const requestHeaders = APPLICATION_JSON_HEADER;

      return this.decisionsService.addRelatedObject(
        `${action.payload.sourceObject._links.self.href}/${action.payload.relationPath}`,
        requestBody,
        requestHeaders,
      ).pipe(
        map(() => new fromActions.FinishedNetworkRequestForDecision(action.payload.sourceObject.id)),
        catchError((error) => of(new fromActions.DecisionFailure({ error, id: action.payload.sourceObject.id }))),
      );
    }),
  );

  @Effect()
  updateImplementationTableEntity$ = this.actions$.pipe(
    ofType(fromActions.UPDATE_IMPLEMENTATION_TABLE_ENTITY),
    switchMap((action: fromActions.UpdateImplementationTableEntity) => {
      const requestBody = JSON.stringify({ ...action.payload.relatedObject });
      const requestHeaders = APPLICATION_JSON_HEADER;

      return this.decisionsService.updateRelatedObject(
        `${action.payload.sourceObject._links.self.href}/${action.payload.relationPath}`,
        requestBody,
        requestHeaders,
      ).pipe(
        map(() => new fromActions.FinishedNetworkRequestForDecision(action.payload.sourceObject.id)),
        catchError((error) => of(new fromActions.DecisionFailure({ error, id: action.payload.sourceObject.id }))),
      );
    }),
  );

  @Effect()
  updateImplementationTableCells$ = this.actions$.pipe(
    ofType(fromActions.UPDATE_IMPLEMENTATION_TABLE_CELLS),
    switchMap((action: fromActions.UpdateImplementationTableCells) => {
      const requestHeaders = APPLICATION_JSON_HEADER
      const cells$ = action.payload.cells
        .map((cell) =>
          this.decisionsService.updateRelatedObject(
            `${action.payload.sourceObject._links.self.href}/${cell.relationPath}`,
            JSON.stringify({ ...cell.relationObject }),
            requestHeaders,
          ));

      return forkJoin([...cells$]).pipe(
        map(() => new fromActions.FinishedNetworkRequestForDecision(action.payload.sourceObject.id)),
        catchError((error) => of(new fromActions.DecisionFailure({ error, id: action.payload.sourceObject.id }))),
      );
    }),
  );

  @Effect()
  removeImplementationTableEntity$ = this.actions$.pipe(
    ofType(fromActions.REMOVE_IMPLEMENTATION_TABLE_ENTITY),
    switchMap((action: fromActions.RemoveImplementationTableEntity) => {
      return this.decisionsService.removeRelatedObject(
        `${action.payload.sourceObject._links.self.href}/${action.payload.relationPath}`,
        action.payload.relatedObjectId
      ).pipe(
        map(() => new fromActions.FinishedNetworkRequestForDecision(action.payload.sourceObject.id)),
        catchError((error) => of(new fromActions.DecisionFailure({ error, id: action.payload.sourceObject.id }))),
      );
    }),
  );

  @Effect()
  updateAnswer$ = this.actions$.pipe(
    ofType(fromActions.UPDATE_ANSWER),
    switchMap((action: fromActions.UpdateAnswer) => {
      const href = action.payload.decision.answer._links.self.href;
      const requestBody = JSON.stringify({ ...fromAnswer(action.payload.answer) });
      const requestHeaders = APPLICATION_JSON_HEADER;

      return this.decisionsService.updateRelatedObject(
        href,
        requestBody,
        requestHeaders,
      ).pipe(
        map(() => new fromActions.FinishedNetworkRequestForDecision(action.payload.decision.id)),
        catchError((error) => of(new fromActions.DecisionFailure({ error, id: action.payload.decision.id }))),
      );
    }),
  );

  @Effect()
  loadDecision$ = this.actions$.pipe(
    ofType(fromActions.LOAD_DECISION),
    mergeMap((action: fromActions.LoadDecision) => {
      return this.decisionsService.getSingleEdit(action.payload).pipe(
        switchMap((decision) => {
          return [
            new fromActions.LoadDecisionSuccess(decision),
            new fromActions.UpdateDiagramGraphableObject({ object: decision, paths: [ObjectRelationsNames.Decisions] }),
          ];
        }),
        catchError((error) => of(new fromActions.DecisionFailure({ error, id: action.payload }))),
      );
    }),
  );

  @Effect()
  loadDecisionAsChild$ = this.actions$.pipe(
    ofType(fromActions.LOAD_DECISION_AS_CHILD),
    mergeMap((action: fromActions.LoadDecisionAsChild) => {
      return forkJoin([
        this.decisionsService.getSingleMinimal(action.payload),
        this.decisionsService.getSingleObjectForDiagram(action.payload)
      ]).pipe(
        mergeMap(([minimalDecision, diagramDecision]) => {
          return [
            new fromActions.UpdateDiagramGraphableObject({ object: diagramDecision, paths: [ObjectRelationsNames.Decisions] }),
            new fromActions.UpdateDecisionRelatedObject({
              object: minimalDecision, paths: [
                ObjectRelationsNames.RequiresDecisions,
                ObjectRelationsNames.RequiredByDecisions,
              ]
            }),
            new fromActions.UpdateInputDataRelatedObject({ object: minimalDecision, paths: [ObjectRelationsNames.RequiredByDecisions] }),
            new fromActions.UpdateKnowledgeSourceRelatedObject({
              object: minimalDecision, paths: [
                ObjectRelationsNames.RequiresDecisions,
                ObjectRelationsNames.RequiredByDecisions,
              ]
            }),
            new fromActions.UpdateOrganizationRelatedObject({
              object: minimalDecision, paths: [
                ObjectRelationsNames.OwnsDecisions,
                ObjectRelationsNames.MakesDecisions,
                ObjectRelationsNames.ImpactedByDecisions,
              ]
            }),
            new fromActions.UpdateBusinessObjectiveRelatedObject({ object: minimalDecision, paths: [ObjectRelationsNames.Decisions] }),
            new fromActions.UpdateProcessRelatedObject({ object: minimalDecision, paths: [ObjectRelationsNames.Decisions] }),
            new fromActions.UpdateEventRelatedObject({ object: minimalDecision, paths: [ObjectRelationsNames.Decisions] }),
            new fromActions.UpdateSystemRelatedObject({ object: minimalDecision, paths: [ObjectRelationsNames.Decisions] }),
            new fromActions.UpdateImplementationComponentRelatedObject({ object: minimalDecision, paths: [ObjectRelationsNames.Decisions] }),
          ];
        }),
        catchError((error) => of(new fromActions.DecisionFailure({ error, id: action.payload }))),
      );
    }),
  );

  @Effect({ dispatch: false })
  decisionFailure$ = this.actions$.pipe(
    ofType(fromActions.DECISION_FAILURE),
    tap(({ payload }: fromActions.DecisionFailure) =>
      this.messageService.handleError(payload.error, 'resources.decision'),
    ),
  );

  @Effect({ dispatch: false })
  genericDecisionFailure$ = this.actions$.pipe(
    ofType(fromActions.GENERIC_DECISION_FAILURE),
    tap(({ payload }: fromActions.GenericDecisionFailure) =>
      this.messageService.handleError(payload, 'resources.decision'),
    ),
  );

  @Effect()
  removePreviewDecisionFromLocalMemory$ = this.actions$.pipe(
    ofType(fromActions.REMOVE_PREVIEW_DECISION_FROM_LOCAL_MEMORY),
    withLatestFrom(this.store.pipe(select(fromSelectors.getAllTabs))),
    switchMap(([action, allTabs]: [fromActions.RemovePreviewDecisionFromLocalMemory, ITab[]]) => [
      !isInOpenTabs(action.payload, allTabs)
        ? new fromActions.RemoveDecisionFromLocalMemory(action.payload)
        : new fromActions.NoOpAction()
    ]),
  );
}
