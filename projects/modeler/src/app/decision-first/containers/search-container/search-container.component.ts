import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { IPagination } from 'core/models';
import { rootReducers, rootSelectors } from 'core/root-store';
import { Observable } from 'rxjs';
import { Search } from '../../models/search.model';
import * as fromModelerStore from '../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-search-container',
  templateUrl: './search-container.component.html',
  styleUrls: ['./search-container.component.scss'],
})
export class SearchContainerComponent implements OnInit, OnDestroy {
  fromModelerStore = fromModelerStore;
  searchList$: Observable<Search[]>;
  searchTerm$: Observable<string>;
  pagination$: Observable<IPagination>;
  isReadOnlySession$: Observable<boolean>;

  constructor(
    public modelerStore: Store<fromModelerStore.IDecisionFirstState>,
    private rootStore: Store<rootReducers.IState>,
  ) { }

  ngOnInit() {
    this.searchList$ = this.modelerStore.pipe(select(fromModelerStore.getMainSearchList));
    this.searchTerm$ = this.modelerStore.pipe(select(fromModelerStore.getMainSearchListSearchTerm));
    this.pagination$ = this.modelerStore.pipe(select(fromModelerStore.getMainSearchListPagination));
    this.isReadOnlySession$ = this.rootStore.pipe(select(rootSelectors.getIsReadOnlySession));
  }

  ngOnDestroy() {
    this.modelerStore.dispatch(new fromModelerStore.GetMainSearchListInitialState());
  }
}
