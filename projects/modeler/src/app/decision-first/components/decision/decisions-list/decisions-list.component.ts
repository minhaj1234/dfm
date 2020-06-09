import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ObjectsListComponent } from 'core/components';
import { SearchListItemType } from '../../../models/search.model';
import * as fromModelerStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-decisions-list',
  styleUrls: ['./decisions-list.component.scss'],
  templateUrl: './decisions-list.component.html',
})
export class DecisionsListComponent extends ObjectsListComponent {
  fromModelerStore = fromModelerStore;
  searchListItemType = SearchListItemType.ShortSearchListItem;

  constructor(
    public modelerStore: Store<fromModelerStore.IDecisionFirstState>,
  ) {
    super(modelerStore);
    this.openTabAction = fromModelerStore.AddTab;
    this.deleteObjectAction = fromModelerStore.DeleteDecision;
    this.paginationSelector = fromModelerStore.getDecisionsListPagination;
  }
}
