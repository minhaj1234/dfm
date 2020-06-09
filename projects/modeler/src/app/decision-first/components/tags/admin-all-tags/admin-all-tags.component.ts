import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { IPagination } from 'core/models';
import { Observable } from 'rxjs';
import { Tag } from '../../../models/tag.model';
import * as fromModelerStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-admin-all-tags',
  templateUrl: './admin-all-tags.component.html',
  styleUrls: ['./admin-all-tags.component.scss'],
})
export class AdminAllTagsComponent implements OnInit {
  @Input() tags: Tag[];
  fromModelerStore = fromModelerStore;
  pagination$: Observable<IPagination>;

  constructor(
    public modelerStore: Store<fromModelerStore.IDecisionFirstState>,
  ) { }

  ngOnInit() {
    this.pagination$ = this.modelerStore.pipe(select(fromModelerStore.getTagsListPagination));
  }
}
