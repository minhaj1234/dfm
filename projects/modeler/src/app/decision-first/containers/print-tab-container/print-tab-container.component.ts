import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ITab } from 'core/models';
import { PRINT_TAB_ID_TYPE_SEPARATOR } from 'core/models';
import { rootSelectors } from 'core/root-store';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Customer } from 'user-management/models';
import * as fromModelerStore from '../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-print-tab-container',
  styleUrls: ['./print-tab-container.component.scss'],
  templateUrl: './print-tab-container.component.html',
})
export class PrintTabContainerComponent implements OnInit, OnDestroy {
  objectId: string;
  objectType: string;
  customer: Customer;
  state$: Observable<{footerHtml: string}>;
  @Input() set tab(value: ITab) {
    [this.objectType, this.objectId] = value.id.split(PRINT_TAB_ID_TYPE_SEPARATOR);
  };

  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
  ) { }

  ngOnInit() {
    this.subscribeGetAuthenticatedUser();
  }

  subscribeGetAuthenticatedUser(): void {
    this.modelerStore.pipe(select(rootSelectors.getAuthenticatedUser))
      .subscribe((authenticatedUser) => {
        this.modelerStore.dispatch(new fromModelerStore.LoadCustomer(authenticatedUser.accountId));
        this.getFooterHtml(authenticatedUser.accountId);
      });
  }

  getFooterHtml(accountId: string): void {
    this.state$ = combineLatest([
      this.modelerStore.pipe(select(fromModelerStore.getSelectedCustomer(accountId))),
    ]).pipe(
      filter(() => !this.customer),
      map(([customer]) => {
        this.customer = customer;
        
        return { footerHtml: customer ? customer.footerHtml : ''};
      })
    );
  }

  ngOnDestroy() { }
}
