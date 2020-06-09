import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MessageService } from 'core/services';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { DecisionsService, DiagramsService, KnowledgeSourceService, OrganizationsService } from '../../../services';
import { RepositoryService } from '../../../services/repository.service';
import * as fromSearchListActions from '../../actions/search/mainSearchList.actions';
import { IDecisionFirstState } from '../../reducers';
import * as fromMainSearchListSelectors from '../../selectors/search/mainSearchList.selector';

@Injectable()
export class MainSearchListEffects {
  constructor(
    private store: Store<IDecisionFirstState>,
    private actions$: Actions,
    private repositoryService: RepositoryService,
    private decisionsService: DecisionsService,
    private knowledgeSourceService: KnowledgeSourceService,
    private organizationsService: OrganizationsService,
    private messageService: MessageService,
    private diagramsService: DiagramsService,
  ) {}

  @Effect()
  loadMainSearchList$ = this.actions$.pipe(
    ofType(fromSearchListActions.LOAD_MAIN_SEARCH_LIST),
    switchMap(() => {
      return this.repositoryService.getSomeMinimalWithSearch().pipe(
        map((results) => new fromSearchListActions.LoadMainSearchListSuccess(results)),
        catchError((error) => of(new fromSearchListActions.MainSearchListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect()
  loadSpecificPageForMainSearchList$ = this.actions$.pipe(
    ofType(fromSearchListActions.LOAD_SPECIFIC_PAGE_FOR_MAIN_SEARCH_LIST),
    switchMap(({ payload }: fromSearchListActions.LoadSpecificPageForMainSearchList) => {
      return this.repositoryService.getByUrl(payload).pipe(
        map((results) => new fromSearchListActions.LoadMainSearchListSuccess(results)),
        catchError((error) => of(new fromSearchListActions.MainSearchListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect()
  updateSearchForMainSearchList$ = this.actions$.pipe(
    ofType(fromSearchListActions.UPDATE_SEARCH_FOR_MAIN_SEARCH_LIST),
    withLatestFrom(this.store.select(fromMainSearchListSelectors.getMainSearchListState)),
    switchMap(([action, mainSearchListState]: [fromSearchListActions.UpdateSearchForMainSearchList, any]) => {
      return this.repositoryService
        .getSomeMinimalWithSearch(action.payload.searchTerm, mainSearchListState.typeObjects, mainSearchListState.sort)
        .pipe(
          map((results) => new fromSearchListActions.LoadMainSearchListSuccess(results)),
          catchError((error) => of(new fromSearchListActions.MainSearchListFailure(new Error(error.message)))),
        );
    }),
  );

  @Effect({ dispatch: false })
  mainSearchListFailure$ = this.actions$.pipe(
    ofType(fromSearchListActions.MAIN_SEARCH_LIST_FAILURE),
    tap(({ payload }: fromSearchListActions.MainSearchListFailure) =>
      this.messageService.handleError(payload, 'resources.searchList'),
    ),
  );
}
