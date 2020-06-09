import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ObjectsListComponent } from 'core/components';
import { SearchListItemType } from '../../../models/search.model';
import * as fromModelerStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-events-list',
  styleUrls: ['./events-list.component.scss'],
  templateUrl: './events-list.component.html',
})
export class EventsListComponent extends ObjectsListComponent {
  fromModelerStore = fromModelerStore;
  searchListItemType = SearchListItemType.ShortSearchListItem;

  constructor(
    public modelerStore: Store<fromModelerStore.IDecisionFirstState>,
  ) {
    super(modelerStore);
    this.openTabAction = fromModelerStore.AddTab;
    this.deleteObjectAction = fromModelerStore.DeleteEvent;
    this.paginationSelector = fromModelerStore.getEventsListPagination;
  }
}
