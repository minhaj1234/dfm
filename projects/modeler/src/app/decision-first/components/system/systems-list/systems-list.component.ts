import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ObjectsListComponent } from 'core/components';
import { SearchListItemType } from '../../../models/search.model';
import * as fromModelerStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-systems-list',
  styleUrls: ['./systems-list.component.scss'],
  templateUrl: './systems-list.component.html',
})
export class SystemsListComponent extends ObjectsListComponent {
  fromModelerStore = fromModelerStore;
  searchListItemType = SearchListItemType.ShortSearchListItem;

  constructor(
    public modelerStore: Store<fromModelerStore.IDecisionFirstState>,
  ) {
    super(modelerStore);
    this.openTabAction = fromModelerStore.AddTab;
    this.deleteObjectAction = fromModelerStore.DeleteSystem;
    this.paginationSelector = fromModelerStore.getSystemsListPagination;
  }
}
