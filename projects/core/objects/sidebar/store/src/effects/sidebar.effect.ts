import { Injectable } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, tap, withLatestFrom } from 'rxjs/operators';
import * as sidebarActions from '../actions';
import * as fromSidebarreducers from '../reducers';
import * as sidebarSelectors from '../selectors';

@Injectable()
export class SidebarEffects {
  constructor(
    private store: Store<fromSidebarreducers.ISidebarState>,
    private actions$: Actions,
    private sidebarService: NbSidebarService,
  ) { }

  @Effect({ dispatch: false })
  expandSidebar$ = this.actions$.pipe(
    ofType(sidebarActions.EXPAND_SIDEBAR),
    tap(() => {
      this.sidebarService.expand();
    })
  );

  @Effect()
  toggleSidebar$ = this.actions$.pipe(
    ofType(sidebarActions.TOGGLE_SIDEBAR),
    withLatestFrom(this.store.select(sidebarSelectors.getIsShowPropertySidebar)),
    map(([action, isShow]) => {
      if (isShow) {
        return new sidebarActions.CollapseSidebar();
      } else {
        return new sidebarActions.ExpandSidebar();
      }
    })
  );

  @Effect()
  collapseSidebar$ = this.actions$.pipe(
    ofType(sidebarActions.COLLAPSE_SIDEBAR),
    withLatestFrom(this.store.select(sidebarSelectors.getIsPinnedPropertySidebar)),
    filter(([action, isPinned]) => !isPinned),
    map(() => {
        this.sidebarService.collapse();
        return new sidebarActions.SetInitialStateSidebar();
    })
  );
}
