import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ObjectsListComponent } from 'core/components';
import { SearchListItemType } from '../../../models/search.model';
import * as fromModelerStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-knowledge-sources-list',
  styleUrls: ['./knowledge-sources-list.component.scss'],
  templateUrl: './knowledge-sources-list.component.html',
})
export class KnowledgeSourcesListComponent extends ObjectsListComponent {
  fromModelerStore = fromModelerStore;
  searchListItemType = SearchListItemType.ShortSearchListItem;

  constructor(
    public modelerStore: Store<fromModelerStore.IDecisionFirstState>,
  ) {
    super(modelerStore);
    this.openTabAction = fromModelerStore.AddTab;
    this.deleteObjectAction = fromModelerStore.DeleteKnowledgeSource;
    this.paginationSelector = fromModelerStore.getKnowledgeSourcesListPagination;
  }
}
