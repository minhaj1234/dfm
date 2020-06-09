import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MessageService } from 'core/services';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { DiagrammingElementsService } from '../../../services';
import * as digrammingElementsActions from '../../actions/diagram/diagrammingElements.actions';
import { IDecisionFirstState } from '../../reducers';
import { getActiveDiagramsState } from '../../selectors';

@Injectable()
export class DiagrammingElementsEffects {
  constructor(
    private store: Store<IDecisionFirstState>,
    private actions$: Actions,
    private diagrammingElementsService: DiagrammingElementsService,
    private messageService: MessageService,
  ) { }

  @Effect()
  updateSearchForDiagrammingElements$ = this.actions$.pipe(
    ofType(digrammingElementsActions.UPDATE_SEARCH_FOR_DIAGRAMMING_ELEMENTS),
    switchMap(({ payload }: digrammingElementsActions.UpdateSearchForDiagrammingElements) => {
      return this.diagrammingElementsService.getSomeMinimalWithSearch(payload.searchTerm).pipe(
        map((results) => new digrammingElementsActions.LoadDiagrammingElementsListSuccess(results)),
        catchError((error) => of(new digrammingElementsActions.LoadDiagrammingElementsListFail(error))),
      );
    }),
  );

  @Effect()
  loadSpecificPageForDiagrammingElementsList$ = this.actions$.pipe(
    ofType(digrammingElementsActions.LOAD_SPECIFIC_PAGE_FOR_DIAGRAMMING_ELEMENTS_LIST),
    switchMap(({ payload }: digrammingElementsActions.LoadSpecificPageForDiagrammingElementsList) => {
      return this.diagrammingElementsService.getByUrl(payload).pipe(
        map((results) => new digrammingElementsActions.LoadDiagrammingElementsListSuccess(results)),
        catchError((error) => of(new digrammingElementsActions.LoadDiagrammingElementsListFail(new Error(error.message)))),
      );
    }),
  );

  @Effect()
  loadMissingDiagrammingElementsForNode$ = this.actions$.pipe(
    ofType(digrammingElementsActions.LOAD_MISSING_DIAGRAMMING_ELEMENTS_FOR_NODE),
    switchMap((action : digrammingElementsActions.LoadMissingDiagrammingElementsForNode) => {
      return this.diagrammingElementsService.getMissingForNode(
        action.payload.nodeId,
        action.payload.diagramId
      ).pipe(
        map((results) => new digrammingElementsActions.LoadDiagrammingElementsListSuccess(results)),
        catchError((error) => of(new digrammingElementsActions.LoadDiagrammingElementsListFail(new Error(error.message)))),
      );
    }),
  );

  @Effect({ dispatch: false })
  diagrammingElementsFailure$ = this.actions$.pipe(
    ofType(digrammingElementsActions.LOAD_DIAGRAMMING_ELEMENTS_LIST_FAIL),
    tap(({ payload }: digrammingElementsActions.LoadDiagrammingElementsListFail) => {
      this.messageService.handleError(payload, 'resources.diagrammingElements');
    }),
  );
}
