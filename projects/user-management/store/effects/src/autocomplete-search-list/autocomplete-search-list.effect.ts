import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { USER_MANAGEMENT_OBJECTS } from 'user-management/models';
import { GroupsService, UsersService } from 'user-management/services';
import * as fromActions from 'user-management/store/actions';
import { toAutocompleteListItem } from 'user-management/utilities';

const firstPage = 1;
@Injectable()
export class AutocompleteSearchListEffects {
  constructor(
    private actions$: Actions,
    private groupsService: GroupsService,
    private usersService: UsersService,
  ) { }

  @Effect()
  loadGroupsToAutocompleteList$ = this.actions$.pipe(
    ofType(fromActions.LOAD_GROUPS_TO_AUTOCOMPLETE_SEARCH_LIST),
    switchMap((action: fromActions.LoadGroupsToAutocompleteSearchList) => {
      return this.groupsService.getSomeMinimalWithSearch(action.payload.searchTerm, action.payload.pageNumber, action.payload.accountId)
        .pipe(
          map((results: any) => {
            return new fromActions.LoadAutocompleteSearchListSuccess({
              results: results._embedded[USER_MANAGEMENT_OBJECTS.Group.listName].map(toAutocompleteListItem)
            });
          }),
          catchError((error) =>
            of(new fromActions.AutocompleteSearchListFailure(error)),
          ),
        );
    }),
  );

  @Effect()
  loadUsersToAutocompleteList$ = this.actions$.pipe(
    ofType(fromActions.LOAD_USERS_TO_AUTOCOMPLETE_SEARCH_LIST),
    switchMap((action: fromActions.LoadUsersToAutocompleteSearchList) => {
      return this.usersService.getSomeMinimalWithSearch(action.payload.searchTerm, action.payload.pageNumber, action.payload.accountId)
        .pipe(
          map((results: any) => {
            return new fromActions.LoadAutocompleteSearchListSuccess({
              results: results._embedded[USER_MANAGEMENT_OBJECTS.User.listName].map(toAutocompleteListItem)
            });
          }),
          catchError((error) =>
            of(new fromActions.AutocompleteSearchListFailure(error)),
          ),
        );
    }),
  );
}
