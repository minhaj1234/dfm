import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { IPagination } from 'core/models';
import { rootReducers, rootSelectors } from 'core/root-store';
import { Observable } from 'rxjs';
import { Search } from '../../models/search.model';
import * as fromModelerStore from '../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-home-container',
  styleUrls: ['./home-container.component.scss'],
  templateUrl: './home-container.component.html',
})
export class HomeContainerComponent implements OnInit {
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
    this.searchList$ = this.modelerStore.pipe(select(fromModelerStore.getHomeSearchList));
    this.searchTerm$ = this.modelerStore.pipe(select(fromModelerStore.getHomeSearchListSearchTerm));
    this.pagination$ = this.modelerStore.pipe(select(fromModelerStore.getHomeSearchListPagination));
    this.isReadOnlySession$ = this.rootStore.pipe(select(rootSelectors.getIsReadOnlySession));
  }
}
