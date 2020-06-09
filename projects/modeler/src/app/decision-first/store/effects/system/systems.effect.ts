import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ITab } from 'core/models';
import { rootSelectors} from 'core/root-store';
import { MessageService } from 'core/services';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { IDecisionFirstState } from 'user-management/store/reducers';
import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import { System } from '../../../models/system.model';
import { SystemsService, UpdateObjectTagService } from '../../../services';
import { isInOpenTabs } from '../../../utilitites/effectsHelper';
import { getPreventDuplicateNameMessage } from '../../../utilitites/getPreventDuplicateNameMessage';
import { getAddRelatedObjectRequestBody, getAddRelatedObjectRequestHeaders, getRemoveRelatedObjectRequestHeaders } from '../../../utilitites/httpRequestHelpers';
import * as fromActions from '../../actions/';
import * as fromSelectors from '../../selectors';

@Injectable()
export class SystemsEffects {
  constructor(
    private actions$: Actions,
    private systemsService: SystemsService,
    private messageService: MessageService,
    private updateObjectTagService: UpdateObjectTagService,
    private store: Store<IDecisionFirstState>,
  ) {}

  @Effect()
  loadSystem$ = this.actions$.pipe(
    ofType(fromActions.LOAD_SYSTEM),
    switchMap((action: fromActions.LoadSystem) => {
      return this.systemsService.getSingleEdit(action.payload).pipe(
        map((system) => {
          return new fromActions.LoadSystemSuccess(system);
        }),
        catchError((error) => of(new fromActions.SystemFailure({ error, id: action.payload }))),
      );
    }),
  );

  @Effect()
  addSystem$ = this.actions$.pipe(
    ofType(fromActions.ADD_SYSTEM),
    switchMap(({ payload: { name, description, url } }: fromActions.AddSystem) => {
      const system = new System();
      system.name = name;
      system.description = description;
      system.url = url;

      const missingTagNames = this.updateObjectTagService.getMissingTagNames({...system, tags: []});

      return this.systemsService.create(system).pipe(
        switchMap((responce: System) => [
          new fromActions.AddSystemSuccess(),
          new fromActions.FinishedGenericNetworkRequestForSystem(),
          new fromActions.UpdateObjectTags({ missingTagNames, id: responce.id, type: ObjectClassNames.System }),
        ]),
        catchError((error) => of(new fromActions.GenericSystemFailure(error))),
      );
    }),
  );

  @Effect({ dispatch: false })
  addSystemSuccess$ = this.actions$.pipe(
    ofType(fromActions.ADD_SYSTEM_SUCCESS),
    tap(() => {
      this.messageService.showSuccess(['resources.addedSuccessfully'], 'resources.system');
    }),
  );

  @Effect()
  updateSystem$ = this.actions$.pipe(
    ofType(fromActions.UPDATE_SYSTEM),
    switchMap((action: fromActions.UpdateSystem) => {
      const systemToPatch = new System();
      Object.keys(action.payload.system).forEach((key) => {
        systemToPatch[key] = action.payload.system[key];
      });
            
      const missingTagNames = this.updateObjectTagService.getMissingTagNames(action.payload.objectTagsUpdate);
      const extraTagIds = this.updateObjectTagService
        .getExtraTags(action.payload.objectTagsUpdate)
        .map((tag) => tag.id);
      const isTagsChanged = !!missingTagNames.length || !!extraTagIds.length;

      return this.systemsService.patch(systemToPatch).pipe(
        switchMap((result: System) => {
          if (result.name !== action.payload.system.name) {
            this.messageService.showWarning(getPreventDuplicateNameMessage(result.name), 'resources.system');
          }

          return [
            new fromActions.FinishedNetworkRequestForSystem(action.payload.system.id),
            isTagsChanged
              ? new fromActions.UpdateObjectTags({ missingTagNames, extraTagIds, id: action.payload.system.id, type: ObjectClassNames.System })
              : new fromActions.NoOpAction(),
          ];
        }),
        catchError((error) =>
          of(
            new fromActions.SystemFailure({
              error,
              id: action.payload.system.id,
            }),
          ),
        ),
      );
    }),
  );

  @Effect()
  deleteSystem$ = this.actions$.pipe(
    ofType(fromActions.DELETE_SYSTEM),
    switchMap((action: fromActions.DeleteSystem) => {
      return this.systemsService.delete(action.payload).pipe(
        map(() => new fromActions.FinishedNetworkRequestForSystem(action.payload.id)),
        catchError((error) => of(new fromActions.SystemFailure({ error, id: action.payload.id }))),
      );
    }),
  );

  @Effect()
  addRelatedObjectToSystem$ = this.actions$.pipe(
    ofType(fromActions.ADD_RELATED_OBJECT_TO_SYSTEM),
    withLatestFrom(this.store.select(rootSelectors.getAuthenticatedUserId)),
    switchMap(([action, authenticatedUserId]: [fromActions.AddRelatedObjectToSystem, string]) => {
      const requestBody = getAddRelatedObjectRequestBody(
        action.payload.relationPath,
        action.payload.relatedObject,
        authenticatedUserId,
      );    
      const requestHeaders = getAddRelatedObjectRequestHeaders(action.payload.relationPath);
      
      return this.systemsService.addRelatedObject(
        action.payload.sourceObject._links[action.payload.relationPath].href,
        requestBody,
        requestHeaders,
      ).pipe(
        map(() => new fromActions.FinishedNetworkRequestForSystem(action.payload.sourceObject.id)),
        catchError((error) =>
          of(
            new fromActions.SystemFailure({
              error,
              id: action.payload.sourceObject.id,
            }),
          ),
        ),
      );
    }),
  );

  @Effect()
  removeRelatedObjectFromSystem$ = this.actions$.pipe(
    ofType(fromActions.REMOVE_RELATED_OBJECT_FROM_SYSTEM),
    withLatestFrom(this.store.select(rootSelectors.getAuthenticatedUserId)),
    switchMap(([action, authenticatedUserId]: [fromActions.RemoveRelatedObjectFromSystem, string]) => {
      const requestHeaders = getRemoveRelatedObjectRequestHeaders(action.payload.relationPath, authenticatedUserId);
      
      return this.systemsService.removeRelatedObject(
        action.payload.sourceObject._links[action.payload.relationPath].href, 
        action.payload.relatedObject.id,
        requestHeaders,
      ).pipe(
        map(() => new fromActions.FinishedNetworkRequestForSystem(action.payload.sourceObject.id)),
        catchError((error) =>
          of(
            new fromActions.SystemFailure({
              error,
              id: action.payload.sourceObject.id,
            }),
          ),
        ),
      );
    }),
  );

  @Effect()
  loadSystemAsChild$ = this.actions$.pipe(
    ofType(fromActions.LOAD_SYSTEM_AS_CHILD),
    switchMap((action: fromActions.LoadSystemAsChild) => {
      return this.systemsService.getSingleMinimal(action.payload).pipe(
        switchMap((system: System) => {
          return [
            new fromActions.UpdateDecisionRelatedObject({object: system, paths: [ObjectRelationsNames.Systems]}),
          ];
        }),
        catchError((error) => of(new fromActions.SystemFailure({ error, id: action.payload }))),
      );
    }),
  );

  @Effect({ dispatch: false })
  systemFailure$ = this.actions$.pipe(
    ofType(fromActions.SYSTEM_FAILURE),
    tap(({ payload }: fromActions.SystemFailure) => {
      this.messageService.handleError(payload.error, 'resources.system');
    }),
  );

  @Effect({ dispatch: false })
  genericSystemFailure$ = this.actions$.pipe(
    ofType(fromActions.GENERIC_SYSTEM_FAILURE),
    tap(({ payload }: fromActions.GenericSystemFailure) =>
      this.messageService.handleError(payload, 'resources.system'),
    ),
  );

  
  @Effect()
  removePreviewSystemFromLocalMemory$ = this.actions$.pipe(
    ofType(fromActions.REMOVE_PREVIEW_SYSTEM_FROM_LOCAL_MEMORY),
    withLatestFrom(this.store.pipe(select(fromSelectors.getAllTabs))),
    switchMap(([action, allTabs]: [fromActions.RemovePreviewSystemFromLocalMemory, ITab[]]) => [ 
      !isInOpenTabs(action.payload, allTabs) 
        ? new fromActions.RemoveSystemFromLocalMemory(action.payload)
        : new fromActions.NoOpAction()
      ]),
  );

}
