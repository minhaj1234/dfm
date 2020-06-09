import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { MessageService } from 'core/services';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ObjectClassNames } from '../../../models/objects.model';
import { RepositoryService } from '../../../services/repository.service';
import * as fromAutocompleteSearchListActions from '../../actions/search/autocompleteSearchList.actions';

@Injectable()
export class AutocompleteSearchListEffects {
  constructor(
    private actions$: Actions,
    private repositoryService: RepositoryService,
    private messageService: MessageService,
  ) {}

  @Effect()
  updateAutocompleteSearchList$ = this.actions$.pipe(
    ofType(fromAutocompleteSearchListActions.UPDATE_SEARCH_FOR_AUTOCOMPLETE_SEARCH_LIST),
    switchMap(({ payload }: fromAutocompleteSearchListActions.UpdateSearchForAutocompleteSearchList) => {
      const searchTerm = this.getSearchTerm(payload.objectTypes, payload.searchTerm);

      return this.repositoryService.getSomeMinimalWithSearch(
        searchTerm, 
        payload.objectTypes, 
        payload.sort, 
        payload.excludeIds, 
        payload.pageSize, 
        payload.fullMatchOnly,
      ).pipe(
        map((results) => new fromAutocompleteSearchListActions.LoadAutocompleteSearchListSuccess(results)),
        catchError((error) => of(new fromAutocompleteSearchListActions.AutocompleteSearchListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect({ dispatch: false })
  autocompleteSearchListFailure$ = this.actions$.pipe(
    ofType(fromAutocompleteSearchListActions.AUTOCOMPLETE_SEARCH_LIST_FAILURE),
    tap(({ payload }: fromAutocompleteSearchListActions.AutocompleteSearchListFailure) =>
      this.messageService.handleError(payload, 'resources.searchList'),
    ),
  );

  private getSearchTerm(objectTypes: ObjectClassNames[], searchTerm: string): string {
    return this.hasOnlySingleTagType(objectTypes) && !searchTerm.startsWith('#')
      ? `#${searchTerm}`
      : searchTerm;
  }

  private hasOnlySingleTagType(objectTypes: ObjectClassNames[]): boolean {
    return objectTypes
      && !objectTypes.some((type) => type !== ObjectClassNames.Tag)
      && objectTypes.some((type) => type === ObjectClassNames.Tag);
  }
}
