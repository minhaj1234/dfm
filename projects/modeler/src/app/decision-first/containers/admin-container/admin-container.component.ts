import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AuthenticatedUser } from 'core/models';
import { rootSelectors } from 'core/root-store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EditCustomerContainerOptions } from 'user-management/containers';
import { EditCustomerFormEditableType, UserType } from 'user-management/models';
import { Config } from '../../../config';
import * as fromModelerStore from '../../store';
import { IStateAdminTab } from './interfaces';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-admin-container',
  templateUrl: './admin-container.component.html',
  styleUrls: ['./admin-container.component.scss'],
})
export class AdminContainerComponent implements OnInit, OnDestroy {
  state$: Observable<IStateAdminTab>;
  options: EditCustomerContainerOptions = {
    loadCustomerAction: fromModelerStore.LoadCustomer,
    addUserAction: fromModelerStore.AddUser,
    deleteUserAction: fromModelerStore.DeleteUser,
    addGroupAction: fromModelerStore.AddGroup,
    deleteGroupAction: fromModelerStore.DeleteGroup,
    getSelectedCustomerSelector: fromModelerStore.getSelectedCustomer,
    removeCustomerFromLocalMemoryAction: fromModelerStore.RemoveCustomerFromLocalMemory,
    updateCustomerAction: fromModelerStore.UpdateCustomer,
    addTabAction: fromModelerStore.AddTab,
    debounceTime: Config.debounceTime,
    editCustomerFormEditableType: EditCustomerFormEditableType.HtmlFooterAndDomainsOnly,
    getAuthenticatedUserSelector: rootSelectors.getAuthenticatedUser,
  }
  
  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>
  ) { }

  ngOnInit() {
    this.modelerStore.dispatch(new fromModelerStore.LoadTagsList());
    
    this.state$ = combineLatest([
      this.modelerStore.pipe(select(fromModelerStore.getTagsList)),
      this.modelerStore.pipe(select(rootSelectors.getAuthenticatedUser))
    ]).pipe(
      map(([tags, authenticatedUser]) => {
        return { tags, authenticatedUser }
      })
    );
  }

  ngOnDestroy() {
    this.modelerStore.dispatch(new fromModelerStore.SetInitialStateTagsList());
  }

  isAdmin(user: AuthenticatedUser): boolean {
    return user.userType === UserType.ADMIN;
  }
}
