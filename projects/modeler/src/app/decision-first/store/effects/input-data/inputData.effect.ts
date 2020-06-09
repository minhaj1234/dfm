import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ITab } from 'core/models';
import { rootSelectors } from 'core/root-store';
import { MessageService } from 'core/services';
import { forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { IDecisionFirstState } from 'user-management/store/reducers';
import { InputData } from '../../../models/inputData.model';
import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import { InputDatasService, UpdateObjectTagService } from '../../../services';
import { isInOpenTabs } from '../../../utilitites/effectsHelper';
import { getPreventDuplicateNameMessage } from '../../../utilitites/getPreventDuplicateNameMessage';
import { getAddRelatedObjectRequestBody, getAddRelatedObjectRequestHeaders, getRemoveRelatedObjectRequestHeaders } from '../../../utilitites/httpRequestHelpers';
import * as fromActions from '../../actions';
import * as fromSelectors from '../../selectors';

@Injectable()
export class InputDatasEffects {
  constructor(
    private actions$: Actions,
    private inputDatasService: InputDatasService,
    private messageService: MessageService,
    private updateObjectTagService: UpdateObjectTagService,
    private store: Store<IDecisionFirstState>,
  ) { }

  @Effect()
  loadInputData$ = this.actions$.pipe(
    ofType(fromActions.LOAD_INPUT_DATA),
    switchMap((action: fromActions.LoadInputData) => {
      return this.inputDatasService.getSingleEdit(action.payload).pipe(
        switchMap((inputData) => {
          return [
            new fromActions.LoadInputDataSuccess(inputData),
            new fromActions.UpdateDiagramGraphableObject({ object: inputData, paths: [ObjectRelationsNames.InputDatas] }),
          ]
        }),
        catchError((error) => of(new fromActions.InputDataFailure({ error, id: action.payload }))),
      );
    }),
  );

  @Effect()
  addInputData$ = this.actions$.pipe(
    ofType(fromActions.ADD_INPUT_DATA),
    switchMap(({ payload: { name, description, type, url } }: fromActions.AddInputData) => {
      const inputData = new InputData();
      inputData.name = name;
      inputData.description = description;
      inputData.type = type;
      inputData.url = url;

      const missingTagNames = this.updateObjectTagService.getMissingTagNames({ ...inputData, tags: [] });

      return this.inputDatasService.create(inputData).pipe(
        switchMap((responce: InputData) => [
          new fromActions.AddInputDataSuccess(),
          new fromActions.FinishedGenericNetworkRequestForInputData(),
          missingTagNames.length
            ? new fromActions.UpdateObjectTags({ missingTagNames, id: responce.id, type: ObjectClassNames.InputData })
            : new fromActions.NoOpAction(),
        ]),
        catchError((error) => of(new fromActions.GenericInputDataFailure(error))),
      );
    }),
  );

  @Effect({ dispatch: false })
  addInputDataSuccess$ = this.actions$.pipe(
    ofType(fromActions.ADD_INPUT_DATA_SUCCESS),
    tap(() => {
      this.messageService.showSuccess(['resources.addedSuccessfully'], 'resources.inputData');
    }),
  );

  @Effect()
  updateInputData$ = this.actions$.pipe(
    ofType(fromActions.UPDATE_INPUT_DATA),
    switchMap((action: fromActions.UpdateInputData) => {
      const inputDataToPatch = new InputData();
      Object.keys(action.payload.inputData).forEach((key) => {
        inputDataToPatch[key] = action.payload.inputData[key];
      });

      const missingTagNames = this.updateObjectTagService.getMissingTagNames(action.payload.objectTagsUpdate);
      const extraTagIds = this.updateObjectTagService
        .getExtraTags(action.payload.objectTagsUpdate)
        .map((tag) => tag.id);
      const isTagsChanged = !!missingTagNames.length || !!extraTagIds.length;

      return this.inputDatasService.patch(inputDataToPatch).pipe(
        switchMap((result: InputData) => {
          if (result.name !== action.payload.inputData.name) {
            this.messageService.showWarning(getPreventDuplicateNameMessage(result.name), 'resources.inputData');
          }

          return [
            new fromActions.FinishedNetworkRequestForInputData(action.payload.inputData.id),
            isTagsChanged
              ? new fromActions.UpdateObjectTags({ missingTagNames, extraTagIds, id: action.payload.inputData.id, type: ObjectClassNames.InputData })
              : new fromActions.NoOpAction(),
          ];
        }),
        catchError((error) =>
          of(
            new fromActions.InputDataFailure({
              error,
              id: action.payload.inputData.id,
            }),
          ),
        ),
      );
    }),
  );

  @Effect()
  deleteInputData$ = this.actions$.pipe(
    ofType(fromActions.DELETE_INPUT_DATA),
    switchMap((action: fromActions.DeleteInputData) => {
      return this.inputDatasService.delete(action.payload).pipe(
        map(() => new fromActions.FinishedNetworkRequestForInputData(action.payload.id)),
        catchError((error) => of(new fromActions.InputDataFailure({ error, id: action.payload.id }))),
      );
    }),
  );

  @Effect()
  addRelatedObjectToInputData$ = this.actions$.pipe(
    ofType(fromActions.ADD_RELATED_OBJECT_TO_INPUT_DATA),
    withLatestFrom(this.store.select(rootSelectors.getAuthenticatedUserId)),
    switchMap(([action, authenticatedUserId]: [fromActions.AddRelatedObjectToInputData, string]) => {
      const requestBody = getAddRelatedObjectRequestBody(
        action.payload.relationPath,
        action.payload.relatedObject,
        authenticatedUserId,
      );
      const requestHeaders = getAddRelatedObjectRequestHeaders(action.payload.relationPath);

      return this.inputDatasService.addRelatedObject(
        action.payload.sourceObject._links[action.payload.relationPath].href,
        requestBody,
        requestHeaders,
      ).pipe(
        map(() => new fromActions.FinishedNetworkRequestForInputData(action.payload.sourceObject.id)),
        catchError((error) =>
          of(
            new fromActions.InputDataFailure({
              error,
              id: action.payload.sourceObject.id,
            }),
          ),
        ),
      );
    }),
  );

  @Effect()
  removeRelatedObjectFromInputData$ = this.actions$.pipe(
    ofType(fromActions.REMOVE_RELATED_OBJECT_FROM_INPUT_DATA),
    withLatestFrom(this.store.select(rootSelectors.getAuthenticatedUserId)),
    switchMap(([action, authenticatedUserId]: [fromActions.RemoveRelatedObjectFromInputData, string]) => {
      const requestHeaders = getRemoveRelatedObjectRequestHeaders(action.payload.relationPath, authenticatedUserId);

      return this.inputDatasService.removeRelatedObject(
        action.payload.sourceObject._links[action.payload.relationPath].href,
        action.payload.relatedObject.id,
        requestHeaders,
      ).pipe(
        map(() => new fromActions.FinishedNetworkRequestForInputData(action.payload.sourceObject.id)),
        catchError((error) =>
          of(
            new fromActions.InputDataFailure({
              error,
              id: action.payload.sourceObject.id,
            }),
          ),
        ),
      );
    }),
  );

  @Effect()
  loadInputDataAsChild$ = this.actions$.pipe(
    ofType(fromActions.LOAD_INPUT_DATA_AS_CHILD),
    mergeMap((action: fromActions.LoadInputDataAsChild) => {
      return forkJoin([
        this.inputDatasService.getSingleMinimal(action.payload),
        this.inputDatasService.getSingleObjectForDiagram(action.payload)
      ]).pipe(
        mergeMap(([minimalInputData, diagramInputData]) => {
          return [
            new fromActions.UpdateDiagramGraphableObject({ object: diagramInputData, paths: [ObjectRelationsNames.InputDatas] }),
            new fromActions.UpdateDecisionRelatedObject({ object: minimalInputData, paths: [ObjectRelationsNames.RequiresInputData] }),
            new fromActions.UpdateKnowledgeSourceRelatedObject({ object: minimalInputData, paths: [ObjectRelationsNames.RequiresInputData] }),
            new fromActions.UpdateOrganizationRelatedObject({ object: minimalInputData, paths: [ObjectRelationsNames.InputDatas] }),
          ];
        }),
        catchError((error) => of(new fromActions.InputDataFailure({ error, id: action.payload }))),
      );
    }),
  );

  @Effect({ dispatch: false })
  inputDataFailure$ = this.actions$.pipe(
    ofType(fromActions.INPUT_DATA_FAILURE),
    tap(({ payload }: fromActions.InputDataFailure) => {
      this.messageService.handleError(payload.error, 'resources.inputData');
    }),
  );

  @Effect({ dispatch: false })
  genericInputDataFailure$ = this.actions$.pipe(
    ofType(fromActions.GENERIC_INPUT_DATA_FAILURE),
    tap(({ payload }: fromActions.GenericInputDataFailure) =>
      this.messageService.handleError(payload, 'resources.inputData'),
    ),
  );

  @Effect()
  removePreviewInputDataFromLocalMemory$ = this.actions$.pipe(
    ofType(fromActions.REMOVE_PREVIEW_INPUT_DATA_FROM_LOCAL_MEMORY),
    withLatestFrom(this.store.pipe(select(fromSelectors.getAllTabs))),
    switchMap(([action, allTabs]: [fromActions.RemovePreviewInputDataFromLocalMemory, ITab[]]) => [
      !isInOpenTabs(action.payload, allTabs)
        ? new fromActions.RemoveInputDataFromLocalMemory(action.payload)
        : new fromActions.NoOpAction()
    ]),
  );
}
