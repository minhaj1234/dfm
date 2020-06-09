import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ITab } from 'core/models';
import { rootSelectors } from 'core/root-store';
import { MessageService } from 'core/services';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { IDecisionFirstState } from 'user-management/store/reducers';
import { BusinessObjective } from '../../../models/businessObjective.model';
import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import { BusinessObjectivesService, UpdateObjectTagService } from '../../../services';
import { isInOpenTabs } from '../../../utilitites/effectsHelper';
import { getPreventDuplicateNameMessage } from '../../../utilitites/getPreventDuplicateNameMessage';
import { getAddRelatedObjectRequestBody, getAddRelatedObjectRequestHeaders, getRemoveRelatedObjectRequestHeaders } from '../../../utilitites/httpRequestHelpers';
import * as fromActions from '../../actions';
import * as fromSelectors from '../../selectors';

@Injectable()
export class BusinessObjectivesEffects {
  constructor(
    private actions$: Actions,
    private businessObjectivesService: BusinessObjectivesService,
    private messageService: MessageService,
    private updateObjectTagService: UpdateObjectTagService,
    private store: Store<IDecisionFirstState>,
  ) { }

  @Effect()
  loadBusinessObjective$ = this.actions$.pipe(
    ofType(fromActions.LOAD_BUSINESS_OBJECTIVE),
    switchMap((action: fromActions.LoadBusinessObjective) => {
      return this.businessObjectivesService.getSingleEdit(action.payload).pipe(
        map((businessObjective) => {
          return new fromActions.LoadBusinessObjectiveSuccess(businessObjective);
        }),
        catchError((error) =>
          of(new fromActions.BusinessObjectiveFailure({ error, id: action.payload })),
        ),
      );
    }),
  );

  @Effect()
  addBusinessObjective$ = this.actions$.pipe(
    ofType(fromActions.ADD_BUSINESS_OBJECTIVE),
    switchMap(({ payload: { name, description, url } }: fromActions.AddBusinessObjective) => {
      const businessObjective = new BusinessObjective();
      businessObjective.name = name;
      businessObjective.description = description;
      businessObjective.url = url;

      const missingTagNames = this.updateObjectTagService.getMissingTagNames({ ...businessObjective, tags: [] });

      return this.businessObjectivesService.create(businessObjective).pipe(
        switchMap((responce: BusinessObjective) => [
          new fromActions.AddBusinessObjectiveSuccess(),
          new fromActions.FinishedGenericNetworkRequestForBusinessObjective(),
          missingTagNames.length
            ? new fromActions.UpdateObjectTags({ missingTagNames, id: responce.id, type: ObjectClassNames.BusinessObjective })
            : new fromActions.NoOpAction(),
        ]),
        catchError((error) => of(new fromActions.GenericBusinessObjectiveFailure(error))),
      );
    }),
  );

  @Effect({ dispatch: false })
  addBusinessObjectiveSuccess$ = this.actions$.pipe(
    ofType(fromActions.ADD_BUSINESS_OBJECTIVE_SUCCESS),
    tap(() => {
      this.messageService.showSuccess(['resources.addedSuccessfully'], 'resources.businessObjective');
    }),
  );

  @Effect()
  updateBusinessObjective$ = this.actions$.pipe(
    ofType(fromActions.UPDATE_BUSINESS_OBJECTIVE),
    switchMap((action: fromActions.UpdateBusinessObjective) => {
      const businessObjective = new BusinessObjective();
      Object.keys(action.payload.businessObjective).forEach((key) => {
        businessObjective[key] = action.payload.businessObjective[key];
      });

      const missingTagNames = this.updateObjectTagService.getMissingTagNames(action.payload.objectTagsUpdate);
      const extraTagIds = this.updateObjectTagService
        .getExtraTags(action.payload.objectTagsUpdate)
        .map((tag) => tag.id);
      const isTagsChanged = !!missingTagNames.length || !!extraTagIds.length;

      return this.businessObjectivesService.patch(businessObjective).pipe(
        switchMap((result: BusinessObjective) => {
          if (result.name !== action.payload.businessObjective.name) {
            this.messageService.showWarning(getPreventDuplicateNameMessage(result.name), 'resources.businessObjective');
          }

          return [
            new fromActions.FinishedNetworkRequestForBusinessObjective(action.payload.businessObjective.id),
            isTagsChanged
              ? new fromActions.UpdateObjectTags({ missingTagNames, extraTagIds, id: action.payload.businessObjective.id, type: ObjectClassNames.BusinessObjective })
              : new fromActions.NoOpAction(),
          ];
        }),
        catchError((error) =>
          of(
            new fromActions.BusinessObjectiveFailure({
              error,
              id: action.payload.businessObjective.id,
            }),
          ),
        ),
      );
    }),
  );

  @Effect()
  deleteBusinessObjective$ = this.actions$.pipe(
    ofType(fromActions.DELETE_BUSINESS_OBJECTIVE),
    switchMap((action: fromActions.DeleteBusinessObjective) => {
      return this.businessObjectivesService.delete(action.payload).pipe(
        map(() => new fromActions.FinishedNetworkRequestForBusinessObjective(action.payload.id)),
        catchError((error) => of(new fromActions.BusinessObjectiveFailure({ error, id: action.payload.id }))),
      );
    }),
  );

  @Effect()
  addRelatedObjectToBusinessObjective$ = this.actions$.pipe(
    ofType(fromActions.ADD_RELATED_OBJECT_TO_BUSINESS_OBJECTIVE),
    withLatestFrom(this.store.select(rootSelectors.getAuthenticatedUserId)),
    switchMap(([action, authenticatedUserId]: [fromActions.AddRelatedObjectToBusinessObjective, string]) => {
      const requestBody = getAddRelatedObjectRequestBody(
        action.payload.relationPath,
        action.payload.relatedObject,
        authenticatedUserId,
      );
      const requestHeaders = getAddRelatedObjectRequestHeaders(action.payload.relationPath);

      return this.businessObjectivesService.addRelatedObject(
        action.payload.sourceObject._links[action.payload.relationPath].href,
        requestBody,
        requestHeaders,
      ).pipe(
        map(() => new fromActions.FinishedNetworkRequestForBusinessObjective(action.payload.sourceObject.id)),
        catchError((error) =>
          of(
            new fromActions.BusinessObjectiveFailure({
              error,
              id: action.payload.sourceObject.id,
            }),
          ),
        ),
      );
    }),
  );

  @Effect()
  removeRelatedObjectFromBusinessObjective$ = this.actions$.pipe(
    ofType(fromActions.REMOVE_RELATED_OBJECT_FROM_BUSINESS_OBJECTIVE),
    withLatestFrom(this.store.select(rootSelectors.getAuthenticatedUserId)),
    switchMap(([action, authenticatedUserId]: [fromActions.RemoveRelatedObjectFromBusinessObjective, string]) => {
      const requestHeaders = getRemoveRelatedObjectRequestHeaders(action.payload.relationPath, authenticatedUserId);

      return this.businessObjectivesService.removeRelatedObject(
        action.payload.sourceObject._links[action.payload.relationPath].href,
        action.payload.relatedObject.id,
        requestHeaders,
      ).pipe(
        map(() => new fromActions.FinishedNetworkRequestForBusinessObjective(action.payload.sourceObject.id)),
        catchError((error) =>
          of(
            new fromActions.BusinessObjectiveFailure({
              error,
              id: action.payload.sourceObject.id,
            }),
          ),
        ),
      );
    }),
  );

  @Effect()
  loadBusinessObjectivesAsChild$ = this.actions$.pipe(
    ofType(fromActions.LOAD_BUSINESS_OBJECTIVE_AS_CHILD),
    switchMap((action: fromActions.LoadBusinessObjectiveAsChild) => {
      return this.businessObjectivesService.getSingleMinimal(action.payload).pipe(
        switchMap((businessObjective: BusinessObjective) => {
          return [
            new fromActions.UpdateDecisionRelatedObject({ object: businessObjective, paths: [ObjectRelationsNames.BusinessObjectives] }),
            new fromActions.UpdateOrganizationRelatedObject({ object: businessObjective, paths: [ObjectRelationsNames.BusinessObjectives] }),
          ];
        }),
        catchError((error) => of(new fromActions.BusinessObjectiveFailure({ error, id: action.payload }))),
      );
    }),
  );

  @Effect({ dispatch: false })
  businessObjectiveFailure$ = this.actions$.pipe(
    ofType(fromActions.BUSINESS_OBJECTIVE_FAILURE),
    tap(({ payload }: fromActions.BusinessObjectiveFailure) => {
      this.messageService.handleError(payload.error, 'resources.businessObjective');
    }),
  );

  @Effect({ dispatch: false })
  genericBusinessObjectiveFailure$ = this.actions$.pipe(
    ofType(fromActions.GENERIC_BUSINESS_OBJECTIVE_FAILURE),
    tap(({ payload }: fromActions.GenericBusinessObjectiveFailure) =>
      this.messageService.handleError(payload, 'resources.businessObjective'),
    ),
  );

  @Effect()
  removePreviewBusinessObjectiveFromLocalMemory$ = this.actions$.pipe(
    ofType(fromActions.REMOVE_PREVIEW_BUSINESS_OBJECTIVE_FROM_LOCAL_MEMORY),
    withLatestFrom(this.store.pipe(select(fromSelectors.getAllTabs))),
    switchMap(([action, allTabs]: [fromActions.RemovePreviewBusinessObjectiveFromLocalMemory, ITab[]]) => [
      !isInOpenTabs(action.payload, allTabs)
        ? new fromActions.RemoveBusinessObjectiveFromLocalMemory(action.payload)
        : new fromActions.NoOpAction()
    ]),
  );
}
