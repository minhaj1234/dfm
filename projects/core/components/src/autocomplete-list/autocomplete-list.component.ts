import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, Renderer2, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AutocompleteListItem } from 'core/models';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'core-autocomplete-list',
  templateUrl: './autocomplete-list.component.html',
  styleUrls: ['./autocomplete-list.component.scss']
})
export class AutocompleteListComponent implements OnDestroy {
  @Input() searchDebounceTime: number;
  @Input() autocompleteSearchList: AutocompleteListItem[];
  @Output() updateSearchList: EventEmitter<string> = new EventEmitter<string>();
  @Output() resetSearchList: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectListItem: EventEmitter<AutocompleteListItem> = new EventEmitter<AutocompleteListItem>();
  @ViewChild('autocompleteObjects', { static: true }) autocompleteObjects: ElementRef;
  
  searchControl: FormControl = new FormControl('');
  isAutocompleteListDisplayed = false;
  private searchControlValueChangesSubscription: Subscription;
  private selectedListItem: AutocompleteListItem;
  private outsideClickListener: () => void;

  constructor(private renderer: Renderer2) { }

  updateSearch(): void {
    this.updateSearchList.emit(this.searchControl.value);
  }

  onSearchInput(): void {
    this.openAutocompleteList();
  }

  onSearchClicked(): void {
    this.openAutocompleteList();
  }

  openAutocompleteList(): void {
    if (!this.isAutocompleteListDisplayed) {
      this.isAutocompleteListDisplayed = true;
      this.subscribeSearchControlValueChanges();
      this.subscribeOutsideClick();
      this.updateSearch();
    }
  }

  subscribeSearchControlValueChanges(): void {
    this.searchControlValueChangesSubscription = this.searchControl.valueChanges
      .pipe(
        untilDestroyed(this),
        filter(() => this.isAutocompleteListDisplayed),
        debounceTime(this.searchDebounceTime),
      )
      .subscribe(() => {
        this.updateSearch();
      });
  }

  subscribeOutsideClick(): void {
    this.outsideClickListener = this.renderer.listen('document', 'click', (event) => {
      if (!this.autocompleteObjects.nativeElement.contains(event.target)) {
        this.closeAutocompleteList();
      }
    });
  }

  closeAutocompleteList(): void {
    if (this.isAutocompleteListDisplayed) {
      this.isAutocompleteListDisplayed = false;
      this.unsubscribeSearchControlValueChanges();
      this.unsubscribeOutsideClick();
      this.resetSearch();
    }
  }

  resetSearchForm(): void {
    const value = this.getSelectedListItemName();

    this.searchControl.setValue(value, {emitEvent: false});
  }

  getSelectedListItemName(): string {
    return this.selectedListItem ? this.selectedListItem.name : '';
  }

  unsubscribeSearchControlValueChanges(): void {
    if(this.searchControlValueChangesSubscription) {
      this.searchControlValueChangesSubscription.unsubscribe();
    }
  }

  unsubscribeOutsideClick(): void {
    if (this.outsideClickListener) {
      this.outsideClickListener();
      this.outsideClickListener = undefined;
    }
  }

  resetSearch(): void {
    this.resetSearchList.emit();
    this.resetSearchForm();
  }

  onListItemSelected(listItem: AutocompleteListItem): void {
    this.selectedListItem = listItem;
    this.selectListItem.emit(listItem);
    this.closeAutocompleteList(); 
  }

  ngOnDestroy() { 
    this.unsubscribeOutsideClick();
    this.unsubscribeSearchControlValueChanges();
  }
}
