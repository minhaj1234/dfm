import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { take } from 'rxjs/operators';
import { SearchSort } from '../../../models/search.model';
import * as fromStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-search-sort-tool',
  templateUrl: './search-sort-tool.component.html',
  styleUrls: ['./search-sort-tool.component.scss'],
})
export class SearchSortToolComponent implements OnInit, OnDestroy {
  currentSearchSort: SearchSort;
  searchSortItems: SearchSort[] = [];

  constructor(private store: Store<fromStore.IDecisionFirstState>, private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.fillSearchSortItems();
    this.subscribeMainSearchListSort();
  }

  fillSearchSortItems(): void {
    for (const value of Object.keys(SearchSort)) {
      this.searchSortItems.push(SearchSort[value]);
    }
  }

  subscribeMainSearchListSort(): void {
    this.store
      .pipe(
        select(fromStore.getMainSearchListSort),
        untilDestroyed(this),
      )
      .subscribe((searchSort: SearchSort) => {
        this.currentSearchSort = searchSort;
        this.changeDetectorRef.detectChanges();
      });
  }

  changeSortItem(): void {
    this.store
      .pipe(
        select(fromStore.getMainSearchListState),
        take(1),
      )
      .subscribe((result) => {
        this.store.dispatch(
          new fromStore.UpdateSearchForMainSearchList({
            searchTerm: result.searchTerm,
            sort: this.currentSearchSort,
          }),
        );
      });
  }

  getI18nSearchSortItem(searchSort: SearchSort): string {
    return `resources.alpha${searchSort}`;
  }

  ngOnDestroy() {}
}
