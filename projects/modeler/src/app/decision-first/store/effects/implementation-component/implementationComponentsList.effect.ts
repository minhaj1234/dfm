import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { MessageService } from 'core/services';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ImplementationComponentsService } from '../../../services';
import * as implementationComponentsListActions from '../../actions/implementation-component/implementationComponentsList.action';

@Injectable()
export class ImplementationComponentsListEffects {
  constructor(
    private actions$: Actions,
    private implementationComponentsService: ImplementationComponentsService,
    private messageService: MessageService,
  ) {}

  @Effect()
  loadImplementationComponentsList$ = this.actions$.pipe(
    ofType(implementationComponentsListActions.LOAD_IMPLEMENTATION_COMPONENTS_LIST),
    switchMap(() => {
      return this.implementationComponentsService.getSomeMinimalWithSearch().pipe(
        map((results) => new implementationComponentsListActions.LoadImplementationComponentsListSuccess(results)),
        catchError((error) =>
          of(new implementationComponentsListActions.ImplementationComponentsListFailure(new Error(error.message))),
        ),
      );
    }),
  );

  @Effect()
  loadSpecificPageForImplementationComponentsList$ = this.actions$.pipe(
    ofType(implementationComponentsListActions.LOAD_SPECIFIC_PAGE_FOR_IMPLEMENTATION_COMPONENTS_LIST),
    switchMap(({ payload }: implementationComponentsListActions.LoadSpecificPageForImplementationComponentsList) => {
      return this.implementationComponentsService.getByUrl(payload).pipe(
        map((results) => new implementationComponentsListActions.LoadImplementationComponentsListSuccess(results)),
        catchError((error) => of(new implementationComponentsListActions.ImplementationComponentsListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect({ dispatch: false })
  implementationComponentsListFailure$ = this.actions$.pipe(
    ofType(implementationComponentsListActions.IMPLEMENTATION_COMPONENTS_LIST_FAILURE),
    tap(({ payload }: implementationComponentsListActions.ImplementationComponentsListFailure) =>
      this.messageService.handleError(payload, 'resources.implementationComponentsList'),
    ),
  );
}
