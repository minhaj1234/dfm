import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { MessageService } from 'core/services';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { DiagramsService } from '../../../services/diagrams.service';
import * as diagramsListActions from '../../actions/diagram/diagramsList.actions';

@Injectable()
export class DiagramsListEffects {
  constructor(
    private actions$: Actions,
    private diagramsService: DiagramsService,
    private messageService: MessageService,
  ) {}

  @Effect()
  loadDiagramsList$ = this.actions$.pipe(
    ofType(diagramsListActions.LOAD_DIAGRAMS_LIST),
    switchMap(() =>
      this.diagramsService.getSomeMinimalWithSearch().pipe(
        map((pageableDiagrams) => new diagramsListActions.LoadDiagramsListSuccess(pageableDiagrams)),
        catchError((error) => of(new diagramsListActions.DiagramsListFailure(new Error(error.message)))),
      ),
    ),
  );

  @Effect()
  loadSpecificPageForDiagramsList$ = this.actions$.pipe(
    ofType(diagramsListActions.LOAD_SPECIFIC_PAGE_FOR_DIAGRAMS_LIST),
    switchMap(({ payload }: diagramsListActions.LoadSpecificPageForDiagramsList) => {
      return this.diagramsService.getByUrl(payload).pipe(
        map((results) => new diagramsListActions.LoadDiagramsListSuccess(results)),
        catchError((error) => of(new diagramsListActions.DiagramsListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect()
  updateSearchForDiagramsList$ = this.actions$.pipe(
    ofType(diagramsListActions.UPDATE_SEARCH_FOR_DIAGRAMS_LIST),
    switchMap(({ payload }: diagramsListActions.UpdateSearchForDiagramsList) => {
      return this.diagramsService.getSomeMinimalWithSearch(payload).pipe(
        map((results) => new diagramsListActions.LoadDiagramsListSuccess(results)),
        catchError((error) => of(new diagramsListActions.DiagramsListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect()
  loadSingleDiagramForDiagramsList$ = this.actions$.pipe(
    ofType(diagramsListActions.LOAD_SINGLE_DIAGRAM_FOR_DIAGRAMS_LIST),
    switchMap(({ payload }: diagramsListActions.LoadSingleDiagramForDiagramsList) =>
      this.diagramsService.getSingleMinimal(payload).pipe(
        map((diagram) => new diagramsListActions.LoadSingleDiagramForDiagramsListSuccess(diagram)),
        catchError((error) => of(new diagramsListActions.DiagramsListFailure(new Error(error.message)))),
      ),
    ),
  );

  @Effect({ dispatch: false })
  diagramsListFailure$ = this.actions$.pipe(
    ofType(diagramsListActions.DIAGRAMS_LIST_FAILURE),
    tap(({ payload }: diagramsListActions.DiagramsListFailure) =>
      this.messageService.handleError(payload, 'resources.diagramsList'),
    ),
  );
}
