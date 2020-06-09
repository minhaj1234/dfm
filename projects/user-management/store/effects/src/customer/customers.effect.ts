import { Injectable } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AuthenticatedUser } from 'core/models';
import { rootSelectors } from 'core/root-store';
import { MessageService } from 'core/services';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { USER_MANAGEMENT_OBJECTS } from 'user-management/models';
import { CustomersService } from 'user-management/services';
import * as fromActions from 'user-management/store/actions';
import { IDecisionFirstState } from 'user-management/store/reducers';
import { fromCustomer } from 'user-management/utilities';

@Injectable()
export class CustomersEffects {
  constructor(
    private actions$: Actions,
    private customersService: CustomersService,
    private toastrService: NbToastrService,
    private store: Store<IDecisionFirstState>,
    private messageService: MessageService,
  ) { }

  @Effect()
  loadCustomer$ = this.actions$.pipe(
    ofType(fromActions.LOAD_CUSTOMER),
    switchMap((action: fromActions.LoadCustomer) => {
      return this.customersService.getSingleEdit(action.payload).pipe(
        mergeMap(customer => this.customersService.withRelatedObjects(customer)),
        map((customer) => {
          return new fromActions.LoadCustomerSuccess(customer);
        }),
        catchError((error) =>
          of(new fromActions.CustomerFailure({ error, id: action.payload })),
        ),
      );
    }),
  );

  @Effect()
  addCustomer$ = this.actions$.pipe(
    ofType(fromActions.ADD_CUSTOMER),
    withLatestFrom(this.store.select(rootSelectors.getAuthenticatedUser)),
    switchMap(([action, authenticatedUser]: [fromActions.AddCustomer, AuthenticatedUser]) => {
      const customer = {...action.payload, createdBy: authenticatedUser.userId};
      const customerToAdd = fromCustomer(customer);
      return this.customersService.create(customerToAdd).pipe(
        switchMap(() => [new fromActions.FinishedGenericNetworkRequestForCustomer()]),
        catchError((error) => of(new fromActions.GenericCustomerFailure(error))),
      );
    }),
  );

  @Effect()
  updateCustomer$ = this.actions$.pipe(
    ofType(fromActions.UPDATE_CUSTOMER),
    switchMap((action: fromActions.UpdateCustomer) => {
      const customerToPatch = fromCustomer(action.payload);
      return this.customersService.patch(customerToPatch).pipe(
        map(() => new fromActions.FinishedNetworkRequestForCustomer(action.payload.id)),
        catchError((error) =>
          of(new fromActions.CustomerFailure({ error, id: action.payload.id })),
        ),
      );
    }),
  );

  @Effect()
  deleteCustomer$ = this.actions$.pipe(
    ofType(fromActions.DELETE_CUSTOMER),
    switchMap((action: fromActions.DeleteCustomer) => {
      return this.customersService.delete(fromCustomer(action.payload)).pipe(
        switchMap(() => [new fromActions.FinishedNetworkRequestForCustomer(action.payload.id)]),
        catchError((error) =>
          of(
            new fromActions.CustomerFailure({
              error,
              id: action.payload.id,
            }),
          ),
        ),
      );
    }),
  );

  @Effect({ dispatch: false })
  customerFailure$ = this.actions$.pipe(
    ofType(fromActions.CUSTOMER_FAILURE),
    tap(({ payload }: fromActions.CustomerFailure) => {
      this.messageService.handleError(payload.error, 'resources.customer');
    }),
  );

  @Effect({ dispatch: false })
  genericCustomerFailure$ = this.actions$.pipe(
    ofType(fromActions.GENERIC_CUSTOMER_FAILURE),
    tap(({ payload }: fromActions.GenericCustomerFailure) =>
      this.messageService.handleError(payload, 'resources.customer')
    ),
  );
}
