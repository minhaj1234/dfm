import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { MessageService } from 'core/services';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { DecisionsService } from '../../../services';
import * as decisionsListActions from '../../actions/decision/decisionsList.actions';
import * as diagrammingElementsActions from '../../actions/diagram/diagrammingElements.actions';

@Injectable()
export class DecisionsListEffects {
  constructor(
    private actions$: Actions,
    private decisionsService: DecisionsService,
    private messageService: MessageService,
  ) {}

  @Effect()
  loadDecisionsList$ = this.actions$.pipe(
    ofType(decisionsListActions.LOAD_DECISIONS_LIST),
    switchMap(() => {
      return this.decisionsService.getSomeMinimalWithSearch().pipe(
        map((results) => new decisionsListActions.LoadDecisionsListSuccess(results)),
        catchError((error) => of(new decisionsListActions.DecisionsListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect()
  loadSpecificPageForDecisionsList$ = this.actions$.pipe(
    ofType(decisionsListActions.LOAD_SPECIFIC_PAGE_FOR_DECISIONS_LIST),
    switchMap(({ payload }: decisionsListActions.LoadSpecificPageForDecisionsList) => {
      return this.decisionsService.getByUrl(payload).pipe(
        map((results) => new decisionsListActions.LoadDecisionsListSuccess(results)),
        catchError((error) => of(new decisionsListActions.DecisionsListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect()
  updateSearchForDecisionsList$ = this.actions$.pipe(
    ofType(decisionsListActions.UPDATE_SEARCH_FOR_DECISIONS_LIST),
    switchMap(({ payload }: decisionsListActions.UpdateSearchForDecisionsList) => {
      return this.decisionsService.getSomeMinimalWithSearch(payload).pipe(
        map((results) => new decisionsListActions.LoadDecisionsListSuccess(results)),
        catchError((error) => of(new decisionsListActions.DecisionsListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect()
  loadSingleDecisionForDecisionsList$ = this.actions$.pipe(
    ofType(decisionsListActions.LOAD_SINGLE_DECISION_FOR_DECISIONS_LIST),
    switchMap(({ payload }: decisionsListActions.LoadSingleDecisionForDecisionsList) =>
      this.decisionsService.getSingleMinimal(payload).pipe(
        switchMap((decision) => [
          new decisionsListActions.LoadSingleDecisionForDecisionsListSuccess(decision),
          new diagrammingElementsActions.UpdateSingleDiagrammingElementIfNeeded(decision),
        ]),
        catchError((error) => of(new decisionsListActions.DecisionsListFailure(new Error(error.message)))),
      ),
    ),
  );

  @Effect({ dispatch: false })
  decisionsListFailure$ = this.actions$.pipe(
    ofType(decisionsListActions.DECISIONS_LIST_FAILURE),
    tap(({ payload }: decisionsListActions.DecisionsListFailure) =>
      this.messageService.handleError(payload, 'resources.decisionsList'),
    ),
  );
}
