import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { MessageService } from 'core/services';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { DiagramsService } from '../../../services';
import * as fromHomeSearchListActions from '../../actions/search/homeSearchList.actions';

@Injectable()
export class HomeSearchListEffects {
  constructor(
    private actions$: Actions,
    private diagramsService: DiagramsService,
    private messageService: MessageService,
  ) {}

  @Effect()
  loadHomeSearchList$ = this.actions$.pipe(
    ofType(fromHomeSearchListActions.LOAD_HOME_SEARCH_LIST),
    switchMap(() => {
      return this.diagramsService.getSomeMinimalWithSearch().pipe(
        map((results) => new fromHomeSearchListActions.LoadHomeSearchListSuccess(results)),
        catchError((error) => of(new fromHomeSearchListActions.HomeSearchListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect()
  loadSpecificPageForHomeSearchList$ = this.actions$.pipe(
    ofType(fromHomeSearchListActions.LOAD_SPECIFIC_PAGE_FOR_HOME_SEARCH_LIST),
    switchMap(({ payload }: fromHomeSearchListActions.LoadSpecificPageForHomeSearchList) => {
      return this.diagramsService.getByUrl(payload).pipe(
        map((results) => new fromHomeSearchListActions.LoadHomeSearchListSuccess(results)),
        catchError((error) => of(new fromHomeSearchListActions.HomeSearchListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect()
  updateHomeSearchForSearchList$ = this.actions$.pipe(
    ofType(fromHomeSearchListActions.UPDATE_SEARCH_FOR_HOME_SEARCH_LIST),
    switchMap(({ payload }: fromHomeSearchListActions.UpdateSearchForHomeSearchList) => {
      return this.diagramsService.getSomeMinimalWithSearch(payload.searchTerm).pipe(
        map((results) => new fromHomeSearchListActions.LoadHomeSearchListSuccess(results)),
        catchError((error) => of(new fromHomeSearchListActions.HomeSearchListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect({ dispatch: false })
  homeSearchListFailure$ = this.actions$.pipe(
    ofType(fromHomeSearchListActions.HOME_SEARCH_LIST_FAILURE),
    tap(({ payload }: fromHomeSearchListActions.HomeSearchListFailure) =>
      this.messageService.handleError(payload, 'resources.searchList'),
    ),
  );
}
