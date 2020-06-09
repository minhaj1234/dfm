import { Injectable } from '@angular/core';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { MessageService } from 'core/services';
import { of } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import * as fromActions from '../../actions';
import { VersionInformationService } from '../../services/version-information/version-information.service';

@Injectable()
export class VersionInformationEffects {
  constructor(
    private actions$: Actions,
    private versionInformationService: VersionInformationService,
    private messageService: MessageService,
  ) { }

  @Effect()
  loadVersionInformation$ = this.actions$.pipe(
    ofType(fromActions.LOAD_VERSION_INFORMATION),
    mergeMap(() => {
      return this.versionInformationService.loadVersionInformation().pipe(
        switchMap((versionInformation) =>  [
            new fromActions.LoadVersionInformationSuccess(versionInformation),
          ]),
        catchError((error) => of(new fromActions.VersionInformationFailure(error))),
      );
    }),
  );

  @Effect()
  updateVersionInformation$ = this.actions$.pipe(
    ofType(fromActions.UPDATE_VERSION_INFORMATION),
    mergeMap((action: fromActions.UpdateVersionInformation) => {
      return this.versionInformationService.updateVersionInformation(action.payload).pipe(
        switchMap(() => {
          return [
            new fromActions.NoOpAction(),
          ];
        }),
        catchError((error) => of(new fromActions.VersionInformationFailure(error))),
      );
    }),
  );
}
