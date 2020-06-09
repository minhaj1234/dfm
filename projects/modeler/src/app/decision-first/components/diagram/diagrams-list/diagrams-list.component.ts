import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ObjectsListComponent } from 'core/components';
import { SearchListItemType } from '../../../models/search.model';
import * as fromModelerStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-diagrams-list',
  styleUrls: ['./diagrams-list.component.scss'],
  templateUrl: './diagrams-list.component.html',
})
export class DiagramsListComponent extends ObjectsListComponent {
  fromModelerStore = fromModelerStore;
  searchListItemType = SearchListItemType.ShortSearchListItem;
  
  constructor(
    public modelerStore: Store<fromModelerStore.IDecisionFirstState>,
  ) {
    super(modelerStore);
    this.openTabAction = fromModelerStore.AddTab;
    this.deleteObjectAction = fromModelerStore.DeleteDiagram;
    this.paginationSelector = fromModelerStore.getDiagramsListPagination;
  }
}
