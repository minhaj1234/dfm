import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { MessageService } from 'core/services';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Tag } from '../../../models/tag.model';
import { TagsService } from '../../../services';
import * as tagsActions from '../../actions/tags/tags.actions';
import { UPDATE_OBJECT_TAGS_MAPPING } from './mappings';

@Injectable()
export class TagsEffects {
  constructor(
    private actions$: Actions, 
    private tagsService: TagsService,
    private messageService: MessageService,
  ) { }

  @Effect()
  loadTag$ = this.actions$.pipe(
    ofType(tagsActions.LOAD_TAG),
    switchMap((action: tagsActions.LoadTag) => {
      return this.tagsService.getSingleEdit(action.payload).pipe(
        map((result) => new tagsActions.LoadTagSuccess(result)),
        catchError((error) => of(new tagsActions.TagFailure({ error, id: action.payload }))),
      );
    })
  );

  @Effect()
  updateTag$ = this.actions$.pipe(
    ofType(tagsActions.UPDATE_TAG),
    switchMap((action: tagsActions.UpdateTag) => {
      const tagToPatch = new Tag();
      Object.keys(action.payload.tag).forEach((key) => {
        tagToPatch[key] = action.payload.tag[key];
      });

      return this.tagsService.patch(tagToPatch).pipe(
        map(() => new tagsActions.FinishedNetworkRequestForTag(action.payload.tag.id)),
        catchError((error) => of(new tagsActions.TagFailure({error,  id: action.payload.tag.id})),
        ),
      );
    }),
  );

  @Effect()
  deleteTag$ = this.actions$.pipe(
    ofType(tagsActions.DELETE_TAG),
    switchMap((action: tagsActions.DeleteTag) => {
      return this.tagsService.delete(action.payload).pipe(
        map(() => new tagsActions.FinishedNetworkRequestForTag(action.payload.id)),
        catchError((error) => of(new tagsActions.TagFailure({ error, id: action.payload.id }))),
      );
    })
  );

  @Effect()
  mergeTags$ = this.actions$.pipe(
    ofType(tagsActions.MERGE_TAGS),
    switchMap((action: tagsActions.MergeTags) => {
      return this.tagsService.mergeTags(action.payload.sourceTagId, action.payload.relatedTagId).pipe(
        map(() => new tagsActions.FinishedNetworkRequestForTag(action.payload.sourceTagId)),
        catchError((error) => of(new tagsActions.TagFailure({ error, id: action.payload.sourceTagId }))),
      );
    })
  );

  @Effect()
  updateObjectTags$ = this.actions$.pipe(
    ofType(tagsActions.UPDATE_OBJECT_TAGS),
    switchMap((action: tagsActions.UpdateObjectTags) => {
      const body = {
        namesToAdd: action.payload.missingTagNames,
        idsToDelete: action.payload.extraTagIds,
      };
      const resource = UPDATE_OBJECT_TAGS_MAPPING[action.payload.type].resourcePath;

      return this.tagsService.updateObjectTags(body, action.payload.id, resource).pipe(
        map(() => UPDATE_OBJECT_TAGS_MAPPING[action.payload.type].finishedNetworkRequestForObject(action.payload.id, action.payload.type)),
        catchError((error) => of(UPDATE_OBJECT_TAGS_MAPPING[action.payload.type].objectFailureAction(error, action.payload.id, action.payload.type )),
        ),
      );
    }),
  );

  @Effect({ dispatch: false })
  tagFailure$ = this.actions$.pipe(
    ofType(tagsActions.TAG_FAILURE),
    tap(({ payload }: tagsActions.TagFailure) => {
      this.messageService.handleError(payload.error, 'resources.tag');
    }),
  );
}
