import { Injectable } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { CustomersService } from 'user-management/services';
import * as customersListActions from 'user-management/store/actions';

@Injectable()
export class CustomersListEffects {
  constructor(
    private actions$: Actions,
    private customersService: CustomersService,
    private toastr: NbToastrService,
  ) {}

  @Effect()
  loadCustomersList$ = this.actions$.pipe(
    ofType(customersListActions.LOAD_CUSTOMERS_LIST),
    switchMap(() => {
      return this.customersService.getSomeMinimalWithSearch().pipe(
        map((results) => new customersListActions.LoadCustomersListSuccess(results)),
        catchError((error) =>
          of(new customersListActions.CustomersListFailure(new Error(error.message))),
        ),
      );
    }),
  );

  @Effect()
  loadSpecificPageForCustomersList$ = this.actions$.pipe(
    ofType(customersListActions.LOAD_SPECIFIC_PAGE_FOR_CUSTOMERS_LIST),
    switchMap(({ payload }: customersListActions.LoadSpecificPageForCustomersList) => {
      return this.customersService.getByUrl(payload).pipe(
        map((results) => new customersListActions.LoadCustomersListSuccess(results)),
        catchError((error) => of(new customersListActions.CustomersListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect()
  updateSearchForCustomersList$ = this.actions$.pipe(
    ofType(customersListActions.UPDATE_SEARCH_FOR_CUSTOMERS_LIST),
    switchMap(({ payload }: customersListActions.UpdateSearchForCustomersList) => {
      return this.customersService.getSomeMinimalWithSearch(payload.searchTerm).pipe(
        map((results) => new customersListActions.LoadCustomersListSuccess(results)),
        catchError((error) => of(new customersListActions.CustomersListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect({ dispatch: false })
  customersListFailure$ = this.actions$.pipe(
    ofType(customersListActions.CUSTOMERS_LIST_FAILURE),
    tap(({ payload }: customersListActions.CustomersListFailure) =>
      this.toastr.danger(payload.message, 'Customers List'),
    ),
  );
}
