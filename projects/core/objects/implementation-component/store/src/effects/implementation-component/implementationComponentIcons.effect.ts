import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { ImplementationComponentsIconsService } from 'core/objects/implementation-component/services';
import { MessageService } from 'core/services';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as fromActions from '../../actions';

@Injectable()
export class ImplementationComponentsIconsEffects {
  constructor(
    private actions$: Actions,
    private implementationComponentsService: ImplementationComponentsIconsService,
    private messageService: MessageService,
  ) { }

  @Effect()
  loadImplementationComponentsIcons$ = this.actions$.pipe(
    ofType(fromActions.LOAD_IMPLEMENTATION_COMPONENTS_ICONS),
    switchMap(() => {
      return this.implementationComponentsService.getImplementationComponentIcons().pipe(
        map((results) => new fromActions.LoadImplementationComponentsIconsSuccess(results)),
        catchError((error) =>
          of(new fromActions.GenericImplementationComponentsIconsFailure(new Error(error.message))),
        ),
      );
    }),
  );

  @Effect()
  loadImplementationComponentsIcon$ = this.actions$.pipe(
    ofType(fromActions.LOAD_IMPLEMENTATION_COMPONENTS_ICON),
    switchMap((action: fromActions.LoadImplementationComponentsIcon) => {
      return this.implementationComponentsService.getImplementationComponentIcon(action.payload).pipe(
        map((results) => new fromActions.LoadImplementationComponentsIconSuccess(results)),
        catchError((error) =>
          of(new fromActions.ImplementationComponentsIconsFailure({error: new Error(error.message), id: action.payload})),
        ),
      );
    }),
  );

  @Effect()
  updateImplementationComponentsIcon$ = this.actions$.pipe(
    ofType(fromActions.UPDATE_IMPLEMENTATION_COMPONENTS_ICON),
    switchMap((action: fromActions.UpdateImplementationComponentsIcon) => {
      return this.implementationComponentsService.updateImplementationComponentIcon(action.payload).pipe(
        map((results) => new fromActions.FinishedNetworkRequestForImplementationComponentsIcon(action.payload.id)),
        catchError((error) =>
          of(new fromActions.ImplementationComponentsIconsFailure({error: new Error(error.message), id: action.payload.id})),
        ),
      );
    }),
  );

  @Effect()
  deleteImplementationComponentsIcon$ = this.actions$.pipe(
    ofType(fromActions.DELETE_IMPLEMENTATION_COMPONENTS_ICON),
    switchMap((action: fromActions.DeleteImplementationComponentsIcon) => {
      return this.implementationComponentsService.deleteImplementationComponentIcon(action.payload).pipe(
        map(() => new fromActions.FinishedNetworkRequestForImplementationComponentsIcon(action.payload)),
        catchError((error) =>
          of(new fromActions.ImplementationComponentsIconsFailure({error: new Error(error.message), id: action.payload})),
        ),
      );
    }),
  );

  @Effect()
  uploadImplementationComponentsIcons$ = this.actions$.pipe(
    ofType(fromActions.UPLOAD_IMPLEMENTATION_COMPONENTS_ICON),
    switchMap((action: fromActions.UploadImplementationComponentsIcon) => {
      return this.implementationComponentsService.uploadImplementationComponentIcon(action.payload).pipe(
        switchMap(() => [
          new fromActions.UploadImplementationComponentsIconSuccess(),
        ]),
        catchError((error) =>
          of(new fromActions.GenericImplementationComponentsIconsFailure(new Error(error.message))),
        ),
      );
    }),
  );

  @Effect({ dispatch: false })
  genericImplementationComponentsIconsFailure$ = this.actions$.pipe(
    ofType(fromActions.GENERIC_IMPLEMENTATION_COMPONENTS_ICONS_FAILURE),
    tap(({ payload }: fromActions.GenericImplementationComponentsIconsFailure) => {
      this.messageService.handleError(payload, 'resources.implementationComponentIcons');
    }),
  );
  
  @Effect({ dispatch: false })
  implementationComponentsIconsFailure$ = this.actions$.pipe(
    ofType(fromActions.IMPLEMENTATION_COMPONENTS_ICONS_FAILURE),
    tap(({ payload }: fromActions.ImplementationComponentsIconsFailure) => {
      this.messageService.handleError(payload.error, 'resources.implementationComponentIcons');
    }),
  );

  @Effect({ dispatch: false })
  uploadImplementationComponentsIconSuccess$ = this.actions$.pipe(
    ofType(fromActions.UPLOAD_IMPLEMENTATION_COMPONENTS_ICON_SUCCESS),
    tap(() => {
      this.messageService.showSuccess(['resources.iconHasBeenSuccessfullyUploaded'], 'resources.implementationComponentIcons');
    }),
  );
}
