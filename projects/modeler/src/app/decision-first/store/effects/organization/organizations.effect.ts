import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ITab } from 'core/models';
import { rootSelectors } from 'core/root-store';
import { MessageService } from 'core/services';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { IDecisionFirstState } from 'user-management/store/reducers';
import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import { Organization } from '../../../models/organization.model';
import { OrganizationsService, UpdateObjectTagService } from '../../../services';
import { isInOpenTabs } from '../../../utilitites/effectsHelper';
import { getPreventDuplicateNameMessage } from '../../../utilitites/getPreventDuplicateNameMessage';
import { getAddRelatedObjectRequestBody, getAddRelatedObjectRequestHeaders, getRemoveRelatedObjectRequestHeaders } from '../../../utilitites/httpRequestHelpers';
import { NoOpAction } from '../../actions';
import * as fromActions from '../../actions';
import * as fromSelectors from '../../selectors';

@Injectable()
export class OrganizationsEffects {
  constructor(
    private actions$: Actions,
    private organizationsService: OrganizationsService,
    private messageService: MessageService,
    private updateObjectTagService: UpdateObjectTagService,
    private store: Store<IDecisionFirstState>,
  ) { }

  @Effect()
  loadOrganization$ = this.actions$.pipe(
    ofType(fromActions.LOAD_ORGANIZATION),
    mergeMap((action: fromActions.LoadOrganization) => {
      return this.organizationsService.getSingleEdit(action.payload).pipe(
        map((organization) => {
          return new fromActions.LoadOrganizationSuccess(organization);
        }),
        catchError((error) =>
          of(new fromActions.OrganizationFailure({ error, id: action.payload })),
        ),
      );
    }),
  );

  @Effect()
  addOrganization$ = this.actions$.pipe(
    ofType(fromActions.ADD_ORGANIZATION),
    switchMap(({ payload: { name, description, type, url } }: fromActions.AddOrganization) => {
      const organization = new Organization();
      organization.name = name;
      organization.description = description;
      organization.type = type;
      organization.url = url;

      const missingTagNames = this.updateObjectTagService.getMissingTagNames({ ...organization, tags: [] });

      return this.organizationsService.create(organization).pipe(
        switchMap((responce: Organization) => [
          new fromActions.AddOrganizationSuccess(),
          new fromActions.FinishedGenericNetworkRequestForOrganization(),
          missingTagNames.length
            ? new fromActions.UpdateObjectTags({ missingTagNames, id: responce.id, type: ObjectClassNames.Organization })
            : new fromActions.NoOpAction(),
        ]),
        catchError((error) => of(new fromActions.OrganizationFailure({ error, id: '' }))),
      );
    }),
  );

  @Effect({ dispatch: false })
  addOrganizationSuccess$ = this.actions$.pipe(
    ofType(fromActions.ADD_ORGANIZATION_SUCCESS),
    tap(() => {
      this.messageService.showSuccess(['resources.addedSuccessfully'], 'resources.organization');
    }),
  );

  @Effect()
  updateOrganization$ = this.actions$.pipe(
    ofType(fromActions.UPDATE_ORGANIZATION),
    switchMap((action: fromActions.UpdateOrganization) => {
      const organizationToPatch = new Organization();
      Object.keys(action.payload.organization).forEach((key) => {
        organizationToPatch[key] = action.payload.organization[key];
      });

      const missingTagNames = this.updateObjectTagService.getMissingTagNames(action.payload.objectTagsUpdate);
      const extraTagIds = this.updateObjectTagService
        .getExtraTags(action.payload.objectTagsUpdate)
        .map((tag) => tag.id);
      const isTagsChanged = !!missingTagNames.length || !!extraTagIds.length;

      return this.organizationsService.patch(organizationToPatch).pipe(
        switchMap((result: Organization) => {
          if (result.name !== action.payload.organization.name) {
            this.messageService.showWarning(getPreventDuplicateNameMessage(result.name), 'resources.organization');
          }

          return [
            new fromActions.FinishedNetworkRequestForOrganization(organizationToPatch.id),
            isTagsChanged
              ? new fromActions.UpdateObjectTags({ missingTagNames, extraTagIds, id: action.payload.organization.id, type: ObjectClassNames.Organization })
              : new fromActions.NoOpAction(),
          ];
        }),
        catchError((error) =>
          of(new fromActions.OrganizationFailure({ error, id: action.payload.organization.id })),
        ),
      );
    }),
  );

  @Effect()
  deleteOrganization$ = this.actions$.pipe(
    ofType(fromActions.DELETE_ORGANIZATION),
    switchMap((action: fromActions.DeleteOrganization) => {
      return this.organizationsService.delete(action.payload).pipe(
        map(() => new NoOpAction()),
        catchError((error) =>
          of(new fromActions.OrganizationFailure({ error, id: action.payload.id })),
        ),
      );
    }),
  );

  @Effect()
  addRelatedObjectToOrganization$ = this.actions$.pipe(
    ofType(fromActions.ADD_RELATED_OBJECT_TO_ORGANIZATION),
    withLatestFrom(this.store.select(rootSelectors.getAuthenticatedUserId)),
    switchMap(([action, authenticatedUserId]: [fromActions.AddRelatedObjectToOrganization, string]) => {
      const requestBody = getAddRelatedObjectRequestBody(
        action.payload.relationPath,
        action.payload.relatedObject,
        authenticatedUserId,
      );
      const requestHeaders = getAddRelatedObjectRequestHeaders(action.payload.relationPath);

      return this.organizationsService.addRelatedObject(
        action.payload.sourceObject._links[action.payload.relationPath].href,
        requestBody,
        requestHeaders,
      ).pipe(
        map(() => new fromActions.FinishedNetworkRequestForOrganization(action.payload.sourceObject.id)),
        catchError((error) =>
          of(
            new fromActions.OrganizationFailure({
              error,
              id: action.payload.sourceObject.id,
            }),
          ),
        ),
      );
    }),
  );

  @Effect()
  removeRelatedObjectFromOrganization$ = this.actions$.pipe(
    ofType(fromActions.REMOVE_RELATED_OBJECT_FROM_ORGANIZATION),
    withLatestFrom(this.store.select(rootSelectors.getAuthenticatedUserId)),
    switchMap(([action, authenticatedUserId]: [fromActions.RemoveRelatedObjectFromOrganization, string]) => {
      const requestHeaders = getRemoveRelatedObjectRequestHeaders(action.payload.relationPath, authenticatedUserId);

      return this.organizationsService.removeRelatedObject(
        action.payload.sourceObject._links[action.payload.relationPath].href,
        action.payload.relatedObject.id,
        requestHeaders,
      ).pipe(
        map(() => new fromActions.FinishedNetworkRequestForOrganization(action.payload.sourceObject.id)),
        catchError((error) =>
          of(
            new fromActions.OrganizationFailure({
              error,
              id: action.payload.sourceObject.id,
            }),
          ),
        ),
      );
    }),
  );

  @Effect()
  loadOrganizationAsChild$ = this.actions$.pipe(
    ofType(fromActions.LOAD_ORGANIZATION_AS_CHILD),
    switchMap((action: fromActions.LoadOrganizationAsChild) => {
      return this.organizationsService.getSingleMinimal(action.payload).pipe(
        switchMap((organization: Organization) => {
          return [
            new fromActions.UpdateDecisionRelatedObject({
              object: organization, paths: [
                ObjectRelationsNames.OrganizationsOwnsDecisions,
                ObjectRelationsNames.OrganizationsMakesDecisions,
                ObjectRelationsNames.OrganizationsImpactedByDecisions,
              ]
            }),
            new fromActions.UpdateInputDataRelatedObject({ object: organization, paths: [ObjectRelationsNames.Organizations] }),
            new fromActions.UpdateKnowledgeSourceRelatedObject({ object: organization, paths: [ObjectRelationsNames.Organizations] }),
            new fromActions.UpdateOrganizationRelatedObject({
              object: organization, paths: [
                ObjectRelationsNames.ParentOrganization,
                ObjectRelationsNames.ChildOrganizations,
              ]
            }),
            new fromActions.UpdateBusinessObjectiveRelatedObject({ object: organization, paths: [ObjectRelationsNames.Organizations] }),
          ];
        }),
        catchError((error) => of(new fromActions.OrganizationFailure({ error, id: action.payload }))),
      );
    }),
  );

  @Effect({ dispatch: false })
  organizationsFailure$ = this.actions$.pipe(
    ofType(fromActions.ORGANIZATION_FAILURE),
    tap(({ payload }: fromActions.OrganizationFailure) => {
      this.messageService.handleError(payload.error, 'resources.organization');
    }),
  );

  @Effect()
  removePreviewOrganizationFromLocalMemory$ = this.actions$.pipe(
    ofType(fromActions.REMOVE_PREVIEW_ORGANIZATION_FROM_LOCAL_MEMORY),
    withLatestFrom(this.store.pipe(select(fromSelectors.getAllTabs))),
    switchMap(([action, allTabs]: [fromActions.RemovePreviewOrganizationFromLocalMemory, ITab[]]) => [
      !isInOpenTabs(action.payload, allTabs)
        ? new fromActions.RemoveOrganizationFromLocalMemory(action.payload)
        : new fromActions.NoOpAction()
    ]),
  );
}
