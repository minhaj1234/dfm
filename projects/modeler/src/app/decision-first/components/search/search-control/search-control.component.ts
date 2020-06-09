import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TechnicalTabType } from 'core/models';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Config } from '../../../../config';
import { defaultSearchFilterTypeObjects, defaultSearchSort } from '../../../models/search.model';
import { IDecisionFirstState } from '../../../store';
import * as fromStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-search-control',
  styleUrls: ['./search-control.component.scss'],
  templateUrl: './search-control.component.html',
})
export class SearchControlComponent implements OnInit {
  searchControl: FormControl = new FormControl('');

  @Input() searchAction: any;

  @Input() set searchTerm(searchTerm: string) {
    this.searchControl.patchValue(searchTerm);
  }

  @Output() clickSearch = new EventEmitter();
  @Output() inputSearch = new EventEmitter();
  @Output() clickButtonSearch = new EventEmitter();

  @HostListener('keypress', ['$event']) onKeyPress(event) {
    return new RegExp('^[^`%^\'"{}|\\\\\\[\\]]*$').test(event.key);
  }

  constructor(
    private store: Store<IDecisionFirstState>
  ) { }

  ngOnInit() {
    this.subscribeSearchControlValueChanges();
  }

  subscribeSearchControlValueChanges(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(Config.searchDebounceTime),
        distinctUntilChanged(),
      )
      .subscribe(() => {
        this.updateSearch();
      });
  }

  onKeydownEnterSearch(): void {
    this.openSearchTab();
  }

  onClickSearch(): void {
    this.openSearchTab();
    this.clickButtonSearch.emit();
  }

  openSearchTab(): void {
    this.store.dispatch(
      new fromStore.UpdateSearchForMainSearchList({
        searchTerm: this.searchControl.value,
        sort: defaultSearchSort,
        typeObjects: defaultSearchFilterTypeObjects,
      }),
    );

    this.store.dispatch(new fromStore.AddTab({ id: TechnicalTabType.Search, type: TechnicalTabType.Search }));
  }

  updateSearch(): void {
    this.store.dispatch(
      new this.searchAction({
        searchTerm: this.searchControl.value,
      }),
    );

    this.clickSearch.emit();
  }
}
