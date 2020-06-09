import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { MessageService } from 'core/services';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ProcessesService } from '../../../services/processes.service';
import * as processesListActions from '../../actions/process/processesList.actions';

@Injectable()
export class ProcessesListEffects {
  constructor(
    private actions$: Actions,
    private processesService: ProcessesService,
    private messageService: MessageService,
  ) {}

  @Effect()
  loadProcessesList$ = this.actions$.pipe(
    ofType(processesListActions.LOAD_PROCESSES_LIST),
    switchMap(() => {
      return this.processesService.getSomeMinimalWithSearch().pipe(
        map((results) => new processesListActions.LoadProcessesListSuccess(results)),
        catchError((error) => of(new processesListActions.ProcessesListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect()
  loadSpecificPageForProcessesList$ = this.actions$.pipe(
    ofType(processesListActions.LOAD_SPECIFIC_PAGE_FOR_PROCESSES_LIST),
    switchMap(({ payload }: processesListActions.LoadSpecificPageForProcessesList) => {
      return this.processesService.getByUrl(payload).pipe(
        map((results) => new processesListActions.LoadProcessesListSuccess(results)),
        catchError((error) => of(new processesListActions.ProcessesListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect({ dispatch: false })
  processesListFailure$ = this.actions$.pipe(
    ofType(processesListActions.PROCESSES_LIST_FAILURE),
    tap(({ payload }: processesListActions.ProcessesListFailure) =>
      this.messageService.handleError(payload, 'resources.processesList'),
    ),
  );
}
