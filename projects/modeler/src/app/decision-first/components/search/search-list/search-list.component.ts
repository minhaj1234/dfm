import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Search } from '../../../models/search.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-search-list',
  styleUrls: ['./search-list.component.scss'],
  templateUrl: './search-list.component.html',
})
export class SearchListComponent implements OnInit {
  @Input() searchList: Search[];
  @Input() searchTerm: string;
  @Input() isShowDelimiter = true;
  @Input() isReadOnly: boolean;

  @Output() clickOpenTab = new EventEmitter();
  @Output() clickDeleteObject = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  trackByFn(index: number, searchItem: Search): string {
    return searchItem.id;
  }

  onClickOpenTab(): void {
    this.clickOpenTab.emit();
  }

  onClickDeleteObject(): void {
    this.clickDeleteObject.emit();
  }
}
