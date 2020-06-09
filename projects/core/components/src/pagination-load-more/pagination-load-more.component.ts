import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IPagination } from 'core/models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'core-pagination-load-more',
  styleUrls: ['./pagination-load-more.component.scss'],
  templateUrl: './pagination-load-more.component.html',
})
export class PaginationLoadMoreComponent implements OnInit {
  @Input() store: Store<unknown>;
  @Input() pagination: IPagination;
  @Input() getMoreAction: any;

  ngOnInit() {}

  get currentlyLoadedCount(): number {
    return Math.min(this.pagination.totalElements, (this.pagination.number + 1) * this.pagination.size);
  }

  get isFirstPage(): boolean {
    return !this.pagination.prevUrl;
  }

  get isLastPage(): boolean {
    return !this.pagination.nextUrl;
  }

  getPreviousPage(): void {
    this.store.dispatch(new this.getMoreAction(this.pagination.prevUrl));
  }

  getNextPage(): void {
    this.store.dispatch(new this.getMoreAction(this.pagination.nextUrl));
  }
}
