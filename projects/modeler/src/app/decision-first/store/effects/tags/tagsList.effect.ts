import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { MessageService } from 'core/services';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { TagsService } from '../../../services';
import * as tagsListActions from '../../actions/tags/tagsList.actions';

@Injectable()
export class TagsListEffects {
  constructor(
    private actions$: Actions,
    private tagsService: TagsService,
    private messageService: MessageService,
  ) { }

  @Effect()
  loadTagsList$ = this.actions$.pipe(
    ofType(tagsListActions.LOAD_TAGS_LIST),
    switchMap(() => {
      return this.tagsService.getSomeMinimalWithSearch().pipe(
        map((results) => new tagsListActions.LoadTagsListSuccess(results)),
        catchError((error) => of(new tagsListActions.TagsListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect()
  loadSpecificPageForTagsList$ = this.actions$.pipe(
    ofType(tagsListActions.LOAD_SPECIFIC_PAGE_FOR_TAGS_LIST),
    switchMap(({ payload }: tagsListActions.LoadSpecificPageForTagsList) => {
      return this.tagsService.getByUrl(payload).pipe(
        map((results) => new tagsListActions.LoadTagsListSuccess(results)),
        catchError((error) => of(new tagsListActions.TagsListFailure(new Error(error.message)))),
      );
    }),
  );

  @Effect({ dispatch: false })
  tagsListFailure$ = this.actions$.pipe(
    ofType(tagsListActions.TAGS_LIST_FAILURE),
    tap(({ payload }: tagsListActions.TagsListFailure) =>
      this.messageService.handleError(payload, 'resources.tagsList'),
    ),
  );
}
