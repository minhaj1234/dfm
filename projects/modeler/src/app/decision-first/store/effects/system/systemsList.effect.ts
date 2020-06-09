import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { MessageService } from 'core/services';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { SystemsService } from '../../../services/systems.service';
import * as systemsListActions from '../../actions/system/systemsList.action';

@Injectable()
export class SystemsListEffects {
  constructor(
    private actions$: Actions,
    private systemsService: SystemsService,
    private messageService: MessageService,
  ) {}

  @Effect()
  loadSystemsList$ = this.actions$.pipe(
    ofType(systemsListActions.LOAD_SYSTEMS_LIST),
    switchMap(() => {
      return this.systemsService.getSomeMinimalWithSearch().pipe(
        map((results) => new systemsListActions.LoadSystemsListSuccess(results)),
        catchError((error) => of(new systemsListActions.SystemsListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect()
  loadSpecificPageForSystemsList$ = this.actions$.pipe(
    ofType(systemsListActions.LOAD_SPECIFIC_PAGE_FOR_SYSTEMS_LIST),
    switchMap(({ payload }: systemsListActions.LoadSpecificPageForSystemsList) => {
      return this.systemsService.getByUrl(payload).pipe(
        map((results) => new systemsListActions.LoadSystemsListSuccess(results)),
        catchError((error) => of(new systemsListActions.SystemsListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect({ dispatch: false })
  systemsListFailure$ = this.actions$.pipe(
    ofType(systemsListActions.SYSTEMS_LIST_FAILURE),
    tap(({ payload }: systemsListActions.SystemsListFailure) =>
      this.messageService.handleError(payload, 'resources.systemsList'),
    ),
  );
}
