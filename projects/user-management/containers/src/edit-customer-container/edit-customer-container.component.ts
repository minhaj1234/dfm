import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Customer, IStateEditCustomer } from 'user-management/models';
import { UsersService } from 'user-management/services';
import { IDecisionFirstState } from 'user-management/store/reducers';
import { EditCustomerContainerOptions } from './interfaces';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'user-management-edit-customer-container',
  templateUrl: './edit-customer-container.component.html',
  styleUrls: ['./edit-customer-container.component.scss']
})
export class EditCustomerContainerComponent implements OnInit, OnDestroy {
  @Input() customerId: string;
  @Input() options: EditCustomerContainerOptions
  state$: Observable<IStateEditCustomer>;

  constructor(
    private userManagementStore: Store<IDecisionFirstState>,
    private usersService: UsersService,
  ) { }

  ngOnInit() {
    this.userManagementStore.dispatch(new this.options.loadCustomerAction(this.customerId));
    this.getStateForCustomer();
  }

  getStateForCustomer(): void {
    this.state$ = combineLatest([
      this.userManagementStore.pipe(select(this.options.getSelectedCustomerSelector(this.customerId))),
    ]).pipe(
      map(([ customer ]) => {
        return { customer: <Customer>customer }
      })
    );
  }

  ngOnDestroy() {
    if (this.options.removeCustomerFromLocalMemoryAction) {
      this.userManagementStore.dispatch(new this.options.removeCustomerFromLocalMemoryAction(this.customerId));  
    }
  }
}
