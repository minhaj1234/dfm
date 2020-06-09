import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ITab } from 'core/models';
import { rootSelectors } from 'core/root-store';
import { MessageService } from 'core/services';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { IDecisionFirstState } from 'user-management/store/reducers';
import { ImplementationComponent } from '../../../models/implementationComponent.model';
import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import { ImplementationComponentsService, UpdateObjectTagService } from '../../../services';
import { isInOpenTabs } from '../../../utilitites/effectsHelper';
import { getPreventDuplicateNameMessage } from '../../../utilitites/getPreventDuplicateNameMessage';
import { getAddRelatedObjectRequestBody, getAddRelatedObjectRequestHeaders, getRemoveRelatedObjectRequestHeaders } from '../../../utilitites/httpRequestHelpers';
import { fromImplementationComponent } from '../../../utilitites/mappings';
import * as fromActions from '../../actions';
import * as fromSelectors from '../../selectors';

@Injectable()
export class ImplementationComponentsEffects {
  constructor(
    private actions$: Actions,
    private implementationComponentsService: ImplementationComponentsService,
    private messageService: MessageService,
    private updateObjectTagService: UpdateObjectTagService,
    private store: Store<IDecisionFirstState>,
  ) { }

  @Effect()
  loadImplementationComponent$ = this.actions$.pipe(
    ofType(fromActions.LOAD_IMPLEMENTATION_COMPONENT),
    switchMap((action: fromActions.LoadImplementationComponent) => {
      return this.implementationComponentsService.getSingleEdit(action.payload).pipe(
        map((implementationComponent) => {
          return new fromActions.LoadImplementationComponentSuccess(implementationComponent);
        }),
        catchError((error) => of(new fromActions.ImplementationComponentFailure({ error, id: action.payload }))),
      );
    }),
  );

  @Effect()
  addImplementationComponent$ = this.actions$.pipe(
    ofType(fromActions.ADD_IMPLEMENTATION_COMPONENT),
    switchMap(({ payload: { name, description, url, iconId } }: fromActions.AddImplementationComponent) => {
      const implementationComponent = new ImplementationComponent();
      implementationComponent.name = name;
      implementationComponent.description = description;
      implementationComponent.url = url;
      implementationComponent.iconId = iconId;

      const missingTagNames = this.updateObjectTagService.getMissingTagNames({ ...implementationComponent, tags: [] });

      return this.implementationComponentsService.create(fromImplementationComponent(implementationComponent)).pipe(
        switchMap((responce: ImplementationComponent) => [
          new fromActions.AddImplementationComponentSuccess(),
          new fromActions.FinishedGenericNetworkRequestForImplementationComponent(),
          missingTagNames.length
            ? new fromActions.UpdateObjectTags({ missingTagNames, id: responce.id, type: ObjectClassNames.ImplementationComponent })
            : new fromActions.NoOpAction(),
        ]),
        catchError((error) => of(new fromActions.GenericImplementationComponentFailure(error))),
      );
    }),
  );

  @Effect({ dispatch: false })
  addImplementationComponentSuccess$ = this.actions$.pipe(
    ofType(fromActions.ADD_IMPLEMENTATION_COMPONENT_SUCCESS),
    tap(() => {
      this.messageService.showSuccess(['resources.addedSuccessfully'], 'resources.implementationComponent');
    }),
  );

  @Effect()
  updateImplementationComponent$ = this.actions$.pipe(
    ofType(fromActions.UPDATE_IMPLEMENTATION_COMPONENT),
    switchMap((action: fromActions.UpdateImplementationComponent) => {
      const implementationComponentToPatch = new ImplementationComponent();
      Object.keys(action.payload.implementationComponent).forEach((key) => {
        implementationComponentToPatch[key] = action.payload.implementationComponent[key];
      });

      const missingTagNames = this.updateObjectTagService.getMissingTagNames(action.payload.objectTagsUpdate);
      const extraTagIds = this.updateObjectTagService
        .getExtraTags(action.payload.objectTagsUpdate)
        .map((tag) => tag.id);
      const isTagsChanged = !!missingTagNames.length || !!extraTagIds.length;

      return this.implementationComponentsService.patch(fromImplementationComponent(implementationComponentToPatch)).pipe(
        switchMap((result: ImplementationComponent) => {
          if (result.name !== action.payload.implementationComponent.name) {
            this.messageService.showWarning(getPreventDuplicateNameMessage(result.name), 'resources.implementationComponent');
          }

          return [
            new fromActions.FinishedNetworkRequestForImplementationComponent(action.payload.implementationComponent.id),
            isTagsChanged
              ? new fromActions.UpdateObjectTags({ missingTagNames, extraTagIds, id: action.payload.implementationComponent.id, type: ObjectClassNames.ImplementationComponent })
              : new fromActions.NoOpAction(),
          ];
        }),
        catchError((error) =>
          of(
            new fromActions.ImplementationComponentFailure({
              error,
              id: action.payload.implementationComponent.id,
            }),
          ),
        ),
      );
    }),
  );

  @Effect()
  deleteImplementationComponent$ = this.actions$.pipe(
    ofType(fromActions.DELETE_IMPLEMENTATION_COMPONENT),
    switchMap((action: fromActions.DeleteImplementationComponent) => {
      return this.implementationComponentsService.delete(action.payload).pipe(
        map(() => new fromActions.FinishedNetworkRequestForImplementationComponent(action.payload.id)),
        catchError((error) => of(new fromActions.ImplementationComponentFailure({
          error,
          id: action.payload.id
        }))),
      );
    }),
  );

  @Effect()
  addRelatedObjectToImplementationComponent$ = this.actions$.pipe(
    ofType(fromActions.ADD_RELATED_OBJECT_TO_IMPLEMENTATION_COMPONENT),
    withLatestFrom(this.store.select(rootSelectors.getAuthenticatedUserId)),
    switchMap(([action, authenticatedUserId]: [fromActions.AddRelatedObjectToImplementationComponent, string]) => {
      const requestBody = getAddRelatedObjectRequestBody(
        action.payload.relationPath,
        action.payload.relatedObject,
        authenticatedUserId,
      );
      const requestHeaders = getAddRelatedObjectRequestHeaders(action.payload.relationPath);

      return this.implementationComponentsService.addRelatedObject(
        action.payload.sourceObject._links[action.payload.relationPath].href,
        requestBody,
        requestHeaders,
      ).pipe(
        map(() => new fromActions.FinishedNetworkRequestForImplementationComponent(action.payload.sourceObject.id)),
        catchError((error) =>
          of(
            new fromActions.ImplementationComponentFailure({
              error,
              id: action.payload.sourceObject.id,
            }),
          ),
        ),
      );
    }),
  );

  @Effect()
  removeRelatedObjectFromImplementationComponent$ = this.actions$.pipe(
    ofType(fromActions.REMOVE_RELATED_OBJECT_FROM_IMPLEMENTATION_COMPONENT),
    withLatestFrom(this.store.select(rootSelectors.getAuthenticatedUserId)),
    switchMap(([action, authenticatedUserId]: [fromActions.RemoveRelatedObjectFromImplementationComponent, string]) => {
      const requestHeaders = getRemoveRelatedObjectRequestHeaders(action.payload.relationPath, authenticatedUserId);

      return this.implementationComponentsService.removeRelatedObject(
        action.payload.sourceObject._links[action.payload.relationPath].href,
        action.payload.relatedObject.id,
        requestHeaders,
      ).pipe(
        map(() => new fromActions.FinishedNetworkRequestForImplementationComponent(action.payload.sourceObject.id)),
        catchError((error) =>
          of(
            new fromActions.ImplementationComponentFailure({
              error,
              id: action.payload.sourceObject.id,
            }),
          ),
        ),
      );
    }),
  );

  @Effect()
  loadImplementationComponentAsChild$ = this.actions$.pipe(
    ofType(fromActions.LOAD_IMPLEMENTATION_COMPONENT_AS_CHILD),
    switchMap((action: fromActions.LoadImplementationComponentAsChild) => {
      return this.implementationComponentsService.getSingleMinimal(action.payload).pipe(
        switchMap((implementationComponent: ImplementationComponent) => {
          return [
            new fromActions.UpdateDecisionRelatedObject({ object: implementationComponent, paths: [ObjectRelationsNames.ImplementationComponents] }),
          ];
        }),
        catchError((error) => of(new fromActions.ImplementationComponentFailure({ error, id: action.payload }))),
      );
    }),
  );

  @Effect({ dispatch: false })
  implementationComponentFailure$ = this.actions$.pipe(
    ofType(fromActions.IMPLEMENTATION_COMPONENT_FAILURE),
    tap(({ payload }: fromActions.ImplementationComponentFailure) => {
      this.messageService.handleError(payload.error, 'resources.implementationComponent');
    }),
  );

  @Effect({ dispatch: false })
  genericImplementationComponentFailure$ = this.actions$.pipe(
    ofType(fromActions.GENERIC_IMPLEMENTATION_COMPONENT_FAILURE),
    tap(({ payload }: fromActions.GenericImplementationComponentFailure) =>
      this.messageService.handleError(payload, 'resources.implementationComponent'),
    ),
  );

  @Effect()
  removePreviewImplementationComponentFromLocalMemory$ = this.actions$.pipe(
    ofType(fromActions.REMOVE_PREVIEW_IMPLEMENTATION_COMPONENT_FROM_LOCAL_MEMORY),
    withLatestFrom(this.store.pipe(select(fromSelectors.getAllTabs))),
    switchMap(([action, allTabs]: [fromActions.RemovePreviewImplementationComponentFromLocalMemory, ITab[]]) => [
      !isInOpenTabs(action.payload, allTabs)
        ? new fromActions.RemoveImplementationComponentFromLocalMemory(action.payload)
        : new fromActions.NoOpAction()
    ]),
  );
}
