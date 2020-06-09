import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { MessageService } from 'core/services';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { KnowledgeSourceService } from '../../../services';
import * as diagrammingElementsActions from '../../actions/diagram/diagrammingElements.actions';
import * as knowledgeSourceActions from '../../actions/knowledge-source/knowledgeSourcesList.actions';

@Injectable()
export class KnowledgeSourceListEffects {
  constructor(
    private actions$: Actions,
    private knowledgeSourceService: KnowledgeSourceService,
    private messageService: MessageService,
  ) {}

  @Effect()
  loadKnowledgeSourceList$ = this.actions$.pipe(
    ofType(knowledgeSourceActions.LOAD_KNOWLEDGE_SOURCES_LIST),
    switchMap(() => {
      return this.knowledgeSourceService.getSomeMinimalWithSearch().pipe(
        map((results) => new knowledgeSourceActions.LoadKnowledgeSourcesListSuccess(results)),
        catchError((error) => of(new knowledgeSourceActions.KnowledgeSourcesListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect()
  loadSpecificPageForKnowledgeSourcesList$ = this.actions$.pipe(
    ofType(knowledgeSourceActions.LOAD_SPECIFIC_PAGE_FOR_KNOWLEDGE_SOURCES_LIST),
    switchMap(({ payload }: knowledgeSourceActions.LoadSpecificPageForKnowledgeSourcesList) => {
      return this.knowledgeSourceService.getByUrl(payload).pipe(
        map((results) => new knowledgeSourceActions.LoadKnowledgeSourcesListSuccess(results)),
        catchError((error) => of(new knowledgeSourceActions.KnowledgeSourcesListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect()
  loadSingleKnowledgeSourceForKnowledgeSourcesList$ = this.actions$.pipe(
    ofType(knowledgeSourceActions.LOAD_SINGLE_KNOWLEDGE_SOURCE_FOR_KNOWLEDGE_SOURCES_LIST),
    switchMap(({ payload }: knowledgeSourceActions.LoadSingleKnowledgeSourceForKnowledgeSourcesList) =>
      this.knowledgeSourceService.getSingleMinimal(payload).pipe(
        switchMap((knowledgeSource) => [
          new knowledgeSourceActions.LoadSingleKnowledgeSourceForKnowledgeSourcesListSuccess(knowledgeSource),
          new diagrammingElementsActions.UpdateSingleDiagrammingElementIfNeeded(knowledgeSource),
        ]),
        catchError((error) => of(new knowledgeSourceActions.KnowledgeSourcesListFailure(new Error(error.message)))),
      ),
    ),
  );

  @Effect()
  updateSearchForKnowledgeSourcesList$ = this.actions$.pipe(
    ofType(knowledgeSourceActions.UPDATE_SEARCH_FOR_KNOWLEDGE_SOURCES_LIST),
    switchMap(({ payload }: knowledgeSourceActions.UpdateSearchForKnowledgeSourcesList) => {
      return this.knowledgeSourceService.getSomeMinimalWithSearch(payload).pipe(
        map((results) => new knowledgeSourceActions.LoadKnowledgeSourcesListSuccess(results)),
        catchError((error) => of(new knowledgeSourceActions.KnowledgeSourcesListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect({ dispatch: false })
  knowledgeSourcesListFailure$ = this.actions$.pipe(
    ofType(knowledgeSourceActions.KNOWLEDGE_SOURCES_LIST_FAILURE),
    tap(({ payload }: knowledgeSourceActions.KnowledgeSourcesListFailure) =>
      this.messageService.handleError(payload, 'resources.knowledgeSourcesList'),
    ),
  );
}
