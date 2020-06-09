import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ITab } from 'core/models/tab.model';
import { MessageService } from 'core/services';
import { URL_LIST_HEADER } from 'core/services';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Diagram, IObjectAssociatedWithOtherDiagram } from '../../../models/diagram.model';
import { GoNodes } from '../../../models/goJsDiagram.model';
import { Graphable } from '../../../models/graphable.model';
import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import { DiagramsService, UpdateObjectTagService } from '../../../services';
import { isInOpenTabs } from '../../../utilitites/effectsHelper';
import { getPreventDuplicateNameMessage } from '../../../utilitites/getPreventDuplicateNameMessage';
import { NoOpAction } from '../../actions';
import * as fromActions from '../../actions';
import { IDecisionFirstState } from '../../reducers';
import * as fromSelectors from '../../selectors';
import { DEFAULT_GRAPHABLE_OBJECT_NAMES } from './diagrams.effect.const';

@Injectable()
export class DiagramsEffects {
  constructor(
    private actions$: Actions,
    private diagramsService: DiagramsService,
    private messageService: MessageService,
    private updateObjectTagService: UpdateObjectTagService,
    private store: Store<IDecisionFirstState>,
  ) { }

  @Effect()
  loadDiagram$ = this.actions$.pipe(
    ofType(fromActions.LOAD_DIAGRAM),
    switchMap((action: fromActions.LoadDiagram) => {
      return this.diagramsService.getSingleEdit(action.payload).pipe(
        map((diagram) => {
          return new fromActions.LoadDiagramSuccess(diagram);
        }),
        catchError((error) => of(new fromActions.DiagramFailure({ error, id: action.payload }))),
      );
    }),
  );

  @Effect()
  addDiagram$ = this.actions$.pipe(
    ofType(fromActions.ADD_DIAGRAM),
    switchMap(({ payload: { name, description } }: fromActions.AddDiagram) => {
      const diagram = new Diagram();
      diagram.name = name;
      diagram.description = description;

      const missingTagNames = this.updateObjectTagService.getMissingTagNames({ ...diagram, tags: [] });

      return this.diagramsService.create(diagram).pipe(
        switchMap((responce: Diagram) => [
          new fromActions.AddDiagramSuccess(),
          missingTagNames.length
            ? new fromActions.UpdateObjectTags({ missingTagNames, id: responce.id, type: ObjectClassNames.Diagram })
            : new fromActions.NoOpAction(),
        ]),
        catchError((error) => of(new fromActions.DiagramFailure({ error, id: '' }))),
      );
    }),
  );

  @Effect({ dispatch: false })
  addDiagramSuccess$ = this.actions$.pipe(
    ofType(fromActions.ADD_DIAGRAM_SUCCESS),
    tap(() => {
      this.messageService.showSuccess(['resources.addedSuccessfully'], 'resources.diagram');
    }),
  );

  @Effect()
  updateDiagram$ = this.actions$.pipe(
    ofType(fromActions.UPDATE_DIAGRAM),
    switchMap((action: fromActions.UpdateDiagram) => {
      const diagramToPatch = new Diagram();
      Object.keys(action.payload.diagram).forEach((key) => {
        diagramToPatch[key] = action.payload.diagram[key];
      });

      const missingTagNames = this.updateObjectTagService.getMissingTagNames(action.payload.objectTagsUpdate);
      const extraTagIds = this.updateObjectTagService
        .getExtraTags(action.payload.objectTagsUpdate)
        .map((tag) => tag.id);
      const isTagsChanged = !!missingTagNames.length || !!extraTagIds.length;

      return this.diagramsService.patch(diagramToPatch).pipe(
        switchMap((result: Diagram) => {
          if (result.name !== action.payload.diagram.name) {
            this.messageService.showWarning(getPreventDuplicateNameMessage(result.name), 'resources.diagram');
          }

          return [
            new fromActions.FinishedNetworkRequestForDiagram(diagramToPatch.id),
            isTagsChanged
              ? new fromActions.UpdateObjectTags({ missingTagNames, extraTagIds, id: action.payload.diagram.id, type: ObjectClassNames.Diagram })
              : new fromActions.NoOpAction(),
          ];
        }),
        catchError((error) => of(new fromActions.DiagramFailure({ error, id: action.payload.diagram.id }))),
      );
    }),
  );

  @Effect()
  deleteDiagram$ = this.actions$.pipe(
    ofType(fromActions.DELETE_DIAGRAM),
    switchMap((action: fromActions.DeleteDiagram) => {
      return this.diagramsService.delete(action.payload).pipe(
        map(() => new NoOpAction()),
        catchError((error) => of(new fromActions.DiagramFailure({ error, id: action.payload.id }))),
      );
    }),
  );

  @Effect()
  addGraphableObjectToDiagram$ = this.actions$.pipe(
    ofType(fromActions.ADD_GRAPHABLE_OBJECT_TO_DIAGRAM),
    switchMap((action: fromActions.AddGraphableObjectToDiagram) => {
      return this.diagramsService.addRelatedObject(
        action.payload.sourceObject._links[action.payload.relationPath].href,
        action.payload.relatedObject._links.self.href,
        URL_LIST_HEADER,
      ).pipe(
        map((result: Graphable) => {
          return new fromActions.FinishedNetworkRequestForDiagram(action.payload.sourceObject.id)
        }),
        catchError((error) => of(new fromActions.DiagramFailure({ error, id: action.payload.sourceObject.id }))),
      );
    }),
  );

  @Effect()
  removeGraphableObjectsFromDiagram$ = this.actions$.pipe(
    ofType(fromActions.REMOVE_GRAPHABLE_OBJECTS_FROM_DIAGRAM),
    switchMap((action: fromActions.RemoveGraphableObjectsFromDiagram) => {
      const removeRelatedObjects$ = action.payload.deletedGraphables
        .map((graphable) =>
          this.diagramsService.removeObject(
            action.payload.diagram._links[graphable.relationPath].href,
            graphable.graphable.id,
            graphable.isPermanentDelete
          ));

      return forkJoin([...removeRelatedObjects$]).pipe(
        map(() => new fromActions.FinishedNetworkRequestForDiagram(action.payload.diagram.id)),
        catchError((error) => of(new fromActions.DiagramFailure({ error, id: action.payload.diagram.id }))),
      );
    }),
  );

  @Effect()
  updateSketchObject$ = this.actions$.pipe(
    ofType(fromActions.UPDATE_SKETCH_OBJECT),
    switchMap(({ payload: { diagram, sketch } }: fromActions.UpdateSketchObject) => {
      const diagramToPatch = new Diagram();
      diagramToPatch.id = diagram.id;
      diagramToPatch._links = diagram._links;
      const goNodes = JSON.parse(diagram.goNodes) as GoNodes;
      goNodes[sketch.id].text = sketch.description;
      diagramToPatch.goNodes = JSON.stringify(goNodes);
      return this.diagramsService.patch(diagramToPatch).pipe(
        map(() => new fromActions.FinishedNetworkRequestForDiagram(diagram.id)),
        catchError((error) => of(new fromActions.DiagramFailure({ error, id: diagram.id }))),
      );
    }),
  );

  @Effect()
  updateGoJson$ = this.actions$.pipe(
    ofType(fromActions.UPDATE_GO_JSON),
    switchMap(({ payload: { diagram, goNodes, goLocations, goConnectors } }: fromActions.UpdateGoJson) => {
      const diagramToPatch = new Diagram();
      diagramToPatch.id = diagram.id;
      diagramToPatch._links = diagram._links;
      if (goNodes) {
        diagramToPatch.goNodes = goNodes;
      }
      if (goLocations) {
        diagramToPatch.goLocations = goLocations;
      }
      if (goConnectors) {
        diagramToPatch.goConnectors = goConnectors;
      }

      return this.diagramsService.patch(diagramToPatch).pipe(
        map(() => new fromActions.FinishedNetworkRequestForDiagram(diagram.id)),
        catchError((error) => of(new fromActions.DiagramFailure({ error, id: diagram.id }))),
      );
    }),
  );

  @Effect()
  loadDiagramAsChild$ = this.actions$.pipe(
    ofType(fromActions.LOAD_DIAGRAM_AS_CHILD),
    switchMap((action: fromActions.LoadDiagramAsChild) => {
      return this.diagramsService.getSingleMinimal(action.payload).pipe(
        switchMap((diagram: Diagram) => {
          return [
            new fromActions.UpdateDecisionRelatedObject({ object: diagram, paths: [ObjectRelationsNames.Diagrams] }),
            new fromActions.UpdateInputDataRelatedObject({ object: diagram, paths: [ObjectRelationsNames.Diagrams] }),
            new fromActions.UpdateKnowledgeSourceRelatedObject({ object: diagram, paths: [ObjectRelationsNames.Diagrams] }),
          ];
        }),
        catchError((error) => of(new fromActions.DiagramFailure({ error, id: action.payload }))),
      );
    }),
  );

  @Effect({ dispatch: false })
  diagramsFailure$ = this.actions$.pipe(
    ofType(fromActions.DIAGRAM_FAILURE),
    tap(({ payload }: fromActions.DiagramFailure) => {
      this.messageService.handleError(payload.error, 'resources.diagram');
    }),
  );

  @Effect()
  removePreviewDiagramFromLocalMemory$ = this.actions$.pipe(
    ofType(fromActions.REMOVE_PREVIEW_DIAGRAM_FROM_LOCAL_MEMORY),
    withLatestFrom(this.store.pipe(select(fromSelectors.getAllTabs))),
    switchMap(([action, allTabs]: [fromActions.RemovePreviewDiagramFromLocalMemory, ITab[]]) => [
      !isInOpenTabs(action.payload, allTabs)
        ? new fromActions.RemoveDiagramFromLocalMemory(action.payload)
        : new fromActions.NoOpAction()
    ]),
  );

  @Effect()
  removeLink$ = this.actions$.pipe(
    ofType(fromActions.REMOVE_LINK),
    switchMap(({ payload: { diagram, fromObjectId, toObjectId, linkType } }: fromActions.RemoveLink) => {
      return this.diagramsService.removeLink(diagram._links.self.href, fromObjectId, toObjectId, linkType).pipe(
        map(() => new fromActions.FinishedNetworkRequestForDiagram(diagram.id)),
        catchError((error) => of(new fromActions.DiagramFailure({ error, id: diagram.id }))),
      );
    })
  );

  @Effect()
  isObjectAssociatedWithOtherDiagram$ = this.actions$.pipe(
    ofType(fromActions.IS_OBJECT_ASSOCIATED_WITH_OTHER_DIAGRAM),
    switchMap(({ payload: { diagramId, objectType, objectId } }: fromActions.ObjectAssociationWithOtherDiagram) => {
      return this.diagramsService.isObjectAssociatedWithOtherDiagram(diagramId, objectType, objectId).pipe(
        map((data: IObjectAssociatedWithOtherDiagram) => {
          return new fromActions.ObjectAssociationWithOtherDiagramSuccess(data);
        }),
        catchError((error) => of(new fromActions.DiagramFailure({ error, id: diagramId }))),
      );
    })
  );

  private checkGraphableObjectName(object: Graphable): void {
    if (!this.hasDefaultName(object)) {
      this.messageService.showWarning(getPreventDuplicateNameMessage(object.name), 'resources.diagram');
    }
  }

  private hasDefaultName(object: Graphable): boolean {
    return DEFAULT_GRAPHABLE_OBJECT_NAMES.some((defaultName) => defaultName === object.name);
  }
}
