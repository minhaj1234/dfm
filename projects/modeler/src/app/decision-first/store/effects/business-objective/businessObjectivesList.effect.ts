import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { MessageService } from 'core/services';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { BusinessObjectivesService } from '../../../services/business-objectives.service';
import * as businessObjectivesListActions from '../../actions/business-objective/businessObjectivesList.actions';

@Injectable()
export class BusinessObjectivesListEffects {
  constructor(
    private actions$: Actions,
    private businessObjectivesService: BusinessObjectivesService,
    private messageService: MessageService,
  ) {}

  @Effect()
  loadBusinessObjectivesList$ = this.actions$.pipe(
    ofType(businessObjectivesListActions.LOAD_BUSINESS_OBJECTIVES_LIST),
    switchMap(() => {
      return this.businessObjectivesService.getSomeMinimalWithSearch().pipe(
        map((results) => new businessObjectivesListActions.LoadBusinessObjectivesListSuccess(results)),
        catchError((error) =>
          of(new businessObjectivesListActions.BusinessObjectivesListFailure(new Error(error.message))),
        ),
      );
    }),
  );

  @Effect()
  loadSpecificPageForBusinessObjectivesList$ = this.actions$.pipe(
    ofType(businessObjectivesListActions.LOAD_SPECIFIC_PAGE_FOR_BUSINESS_OBJECTIVES_LIST),
    switchMap(({ payload }: businessObjectivesListActions.LoadSpecificPageForBusinessObjectivesList) => {
      return this.businessObjectivesService.getByUrl(payload).pipe(
        map((results) => new businessObjectivesListActions.LoadBusinessObjectivesListSuccess(results)),
        catchError((error) => of(new businessObjectivesListActions.BusinessObjectivesListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect({ dispatch: false })
  businessObjectivesListFailure$ = this.actions$.pipe(
    ofType(businessObjectivesListActions.BUSINESS_OBJECTIVES_LIST_FAILURE),
    tap(({ payload }: businessObjectivesListActions.BusinessObjectivesListFailure) =>
      this.messageService.handleError(payload, 'resources.businessObjectivesList'),
    ),
  );
}
