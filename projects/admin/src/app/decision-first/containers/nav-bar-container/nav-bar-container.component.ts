import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { TechnicalTabType } from 'core/models';
import { rootActions, rootReducers } from 'core/root-store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddCustomerComponent } from 'user-management/components';
import { UsersService } from 'user-management/services';
import * as fromAdminStore from '../../store';
import { NavBarState } from './nav-bar-container.const';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'admin-nav-bar-container',
  styleUrls: ['./nav-bar-container.component.scss'],
  templateUrl: './nav-bar-container.component.html',
})
export class NavBarContainerComponent implements OnInit {
  state$: Observable<NavBarState>;
  
  constructor(
    private adminStore: Store<fromAdminStore.IDecisionFirstState>,
    private dialogService: NbDialogService,
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.state$ = combineLatest([
      this.usersService.isSuperAdmin(),
    ]).pipe(
      map(([isSuperAdmin]) => {
        return { isSuperAdmin }
      })
    );
  }

  showDialogAddCustomer(): void {
    this.dialogService.open(AddCustomerComponent, { context: { addAction: fromAdminStore.AddCustomer } });
  }

  logOut(): void {
    this.adminStore.dispatch(new rootActions.Logout());
  }

  openImplementationComponentIcons(): void {
    this.adminStore.dispatch(new fromAdminStore.AddTab({
      type: TechnicalTabType.ImplementationComponentIcons,
    }));
    this.adminStore.dispatch(new fromAdminStore.CollapseSidebar());
  }

  openVersionInformation(): void {
    this.adminStore.dispatch(new fromAdminStore.AddTab({
      type: TechnicalTabType.VersionInformation,
    }));
    this.adminStore.dispatch(new fromAdminStore.CollapseSidebar());
  }
}
