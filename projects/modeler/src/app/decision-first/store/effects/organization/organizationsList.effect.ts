import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { MessageService } from 'core/services';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { OrganizationsService } from '../../../services/organizations.service';
import * as organizationsListActions from '../../actions/organization/organizationsList.actions';

@Injectable()
export class OrganizationsListEffects {
  constructor(
    private actions$: Actions,
    private organizationsService: OrganizationsService,
    private messageService: MessageService,
  ) {}

  @Effect()
  loadOrganizationsList$ = this.actions$.pipe(
    ofType(organizationsListActions.LOAD_ORGANIZATIONS_LIST),
    switchMap(() => {
      return this.organizationsService.getSomeMinimalWithSearch().pipe(
        map((results) => new organizationsListActions.LoadOrganizationsListSuccess(results)),
        catchError((error) => of(new organizationsListActions.OrganizationsListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect()
  loadSpecificPageForOrganizationsList$ = this.actions$.pipe(
    ofType(organizationsListActions.LOAD_SPECIFIC_PAGE_FOR_ORGANIZATIONS_LIST),
    switchMap(({ payload }: organizationsListActions.LoadSpecificPageForOrganizationsList) => {
      return this.organizationsService.getByUrl(payload).pipe(
        map((results) => new organizationsListActions.LoadOrganizationsListSuccess(results)),
        catchError((error) => of(new organizationsListActions.OrganizationsListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect()
  updateSearchForOrganizations$ = this.actions$.pipe(
    ofType(organizationsListActions.UPDATE_SEARCH_FOR_ORGANIZATIONS_LIST),
    switchMap(({ payload }: organizationsListActions.UpdateSearchForOrganizationsList) =>
      this.organizationsService.getSomeMinimalWithSearch(payload).pipe(
        map((organizations) => new organizationsListActions.LoadOrganizationsListSuccess(organizations)),
        catchError((error) => of(new organizationsListActions.OrganizationsListFailure(new Error(error)))),
      ),
    ),
  );

  @Effect()
  loadSingleOrganizationForOrganizationsList$ = this.actions$.pipe(
    ofType(organizationsListActions.LOAD_SINGLE_ORGANIZATION_FOR_ORGANIZATIONS_LIST),
    switchMap(({ payload }: organizationsListActions.LoadSingleOrganizationForOrganizationsList) =>
      this.organizationsService.getSingleMinimal(payload).pipe(
        map(
          (organization) =>
            new organizationsListActions.LoadSingleOrganizationForOrganizationsListSuccess(organization),
        ),
        catchError((error) => of(new organizationsListActions.OrganizationsListFailure(new Error(error)))),
      ),
    ),
  );

  @Effect({ dispatch: false })
  organizationsListFailure$ = this.actions$.pipe(
    ofType(organizationsListActions.ORGANIZATIONS_LIST_FAILURE),
    tap(({ payload }: organizationsListActions.OrganizationsListFailure) =>
      this.messageService.handleError(payload, 'resources.organizationsList'),
    ),
  );
}
