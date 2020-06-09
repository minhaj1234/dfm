import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { ObjectTabType } from 'core/models';
import { Customer, USER_MANAGEMENT_OBJECTS } from 'user-management/models';
import { Search } from '../../../models/search.model';
import * as fromAdminStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'admin-search-list',
  styleUrls: ['./search-list.component.scss'],
  templateUrl: './search-list.component.html',
})
export class SearchListComponent {
  @Input() searchList: Search[];
  @Input() searchTerm: string;
  @Input() isShowDelimiter = true;
  @Input() isReadOnly: boolean;

  @Output() clickOpenTab = new EventEmitter();
  @Output() clickDeleteObject = new EventEmitter();

  constructor(
    private modelerStore: Store<fromAdminStore.IDecisionFirstState>
  ) { }

  trackByFn(index: number, searchItem: Search) {
    return searchItem.id;
  }

  openTab(searchItem: Search): void {
    const tabTypeName = USER_MANAGEMENT_OBJECTS[searchItem.className].tabTypeName;
    this.modelerStore.dispatch(
      new fromAdminStore.AddTab({
        id: searchItem.id,
        type: ObjectTabType[tabTypeName],
      }),
    );

    this.clickOpenTab.emit();
  }

  delete(searchItem: Search) {
    switch (searchItem.className) {
      case USER_MANAGEMENT_OBJECTS.Customer.className: {
        this.modelerStore.dispatch(new fromAdminStore.DeleteCustomer(searchItem as Customer));
        break;
      }
    }

    this.clickDeleteObject.emit();
  }
}
