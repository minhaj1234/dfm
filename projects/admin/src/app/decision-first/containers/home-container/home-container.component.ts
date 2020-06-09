import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { IPagination } from 'core/models';
import { Observable } from 'rxjs';
import { Customer } from 'user-management/models';
import * as fromModelerStore from '../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'admin-home-container',
  styleUrls: ['./home-container.component.scss'],
  templateUrl: './home-container.component.html',
})
export class HomeContainerComponent implements OnInit {
  fromModelerStore = fromModelerStore;
  searchList$: Observable<Customer[]>;
  searchTerm$: Observable<string>;
  pagination$: Observable<IPagination>;
  isReadOnlySession$: Observable<boolean>;

  constructor(
    public modelerStore: Store<fromModelerStore.IDecisionFirstState>,
  ) { }

  ngOnInit() {
    this.modelerStore.dispatch(new fromModelerStore.LoadCustomersList());

    this.searchList$ = this.modelerStore.pipe(select(fromModelerStore.getCustomersList));
    this.searchTerm$ = this.modelerStore.pipe(select(fromModelerStore.getCustomersListSearchTerm));
    this.pagination$ = this.modelerStore.pipe(select(fromModelerStore.getCustomersListPagination));
  }
}
