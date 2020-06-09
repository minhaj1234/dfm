import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { MessageService } from 'core/services';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { InputDatasService } from '../../../services/input-data.service';
import * as inputDatasListActions from '../../actions/input-data/inputDatasList.actions';

@Injectable()
export class InputDatasListEffects {
  constructor(
    private actions$: Actions,
    private inputDatasService: InputDatasService,
    private messageService: MessageService,
  ) {}

  @Effect()
  loadInputDatasList$ = this.actions$.pipe(
    ofType(inputDatasListActions.LOAD_INPUT_DATAS_LIST),
    switchMap(() => {
      return this.inputDatasService.getSomeMinimalWithSearch().pipe(
        map((results) => new inputDatasListActions.LoadInputDatasListSuccess(results)),
        catchError((error) => of(new inputDatasListActions.InputDatasListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect()
  loadSpecificPageForInputDataList$ = this.actions$.pipe(
    ofType(inputDatasListActions.LOAD_SPECIFIC_PAGE_FOR_INPUT_DATA_LIST),
    switchMap(({ payload }: inputDatasListActions.LoadSpecificPageForInputDataList) => {
      return this.inputDatasService.getByUrl(payload).pipe(
        map((results) => new inputDatasListActions.LoadInputDatasListSuccess(results)),
        catchError((error) => of(new inputDatasListActions.InputDatasListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect({ dispatch: false })
  inputDatasListFailure$ = this.actions$.pipe(
    ofType(inputDatasListActions.INPUT_DATAS_LIST_FAILURE),
    tap(({ payload }: inputDatasListActions.InputDatasListFailure) =>
      this.messageService.handleError(payload, 'resources.inputDataList'),
    ),
  );
}
