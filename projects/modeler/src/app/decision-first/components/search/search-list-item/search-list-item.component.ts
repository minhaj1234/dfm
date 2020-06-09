import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { ObjectTabType } from 'core/models';
import { convertStringToI18nString } from 'core/utilities';
import { DfmObjects, ObjectClassNames } from '../../../models/objects.model';
import { Search, SearchListItemType } from '../../../models/search.model';
import * as fromModelerStore from '../../../store';
import { DELETE_OBJECT_ACTION_MAPPING } from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-search-list-item',
  styleUrls: ['./search-list-item.component.scss'],
  templateUrl: './search-list-item.component.html',
})
export class SearchListItemComponent implements OnInit {
  @Input() isReadOnly: boolean;
  @Input() searchItem: DfmObjects;
  @Input() type = SearchListItemType.FullSearchListItem;
  @Output() clickOpenTab = new EventEmitter();
  @Output() clickDeleteObject = new EventEmitter();
  
  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>
  ) { }

  ngOnInit() { }

  getResourceClassName(className: string): string {
    return convertStringToI18nString(className);
  }

  openTab(searchItem: Search): void {
    this.modelerStore.dispatch(
      new fromModelerStore.AddTab({
        id: searchItem.id,
        type: ObjectTabType[searchItem.className],
      }),
    );

    this.clickOpenTab.emit();
  }

  delete(): void {
    if (DELETE_OBJECT_ACTION_MAPPING[this.searchItem.className]) {
      this.modelerStore.dispatch(DELETE_OBJECT_ACTION_MAPPING[this.searchItem.className](this.searchItem));
    }

    this.clickDeleteObject.emit();
  }

  isDiagram(searchItem: Search): boolean {
    return searchItem && searchItem.className === ObjectClassNames.Diagram;
  }

  isFullListItemType(): boolean {
    return this.type === SearchListItemType.FullSearchListItem;
  }
}
