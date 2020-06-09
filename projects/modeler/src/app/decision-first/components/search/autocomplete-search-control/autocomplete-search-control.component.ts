import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { rootReducers, rootSelectors } from 'core/root-store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IDecisionFirstState } from '../../../store';
import * as fromModelerStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-autocomplete-search-control',
  templateUrl: './autocomplete-search-control.component.html',
  styleUrls: ['./autocomplete-search-control.component.scss']
})
export class AutocompleteSearchControlComponent implements OnDestroy {
  fromModelerStore = fromModelerStore;
  state$: Observable<any>;
  isShowAutocompleteList = false;

  outsideClick: () => void;
  @ViewChild('autocompleteSearchControl', { static: false }) autocompleteSearchControl: ElementRef;

  constructor(
    private modelerStore: Store<IDecisionFirstState>,
    private rootStore: Store<rootReducers.IState>,
    private renderer: Renderer2,
  ) {
    this.state$ = combineLatest([
      this.modelerStore.pipe(select(fromModelerStore.getAutocompleteSearchList)),
      this.rootStore.pipe(select(rootSelectors.getIsReadOnlySession))
    ]).pipe(
      map(([autocompleteSearchList, isReadOnlySession]) => {
        return { autocompleteSearchList, isReadOnlySession }
      })
    );
  }

  resetAutocompleteSearchList(): void {
    this.modelerStore.dispatch(new fromModelerStore.SetAutocompleteSearchListInitialState());
    this.unsubscriveOutsideClick();
    this.isShowAutocompleteList = false;
  }

  clickOpenTabAutocompleteSearchList(): void {
    this.resetAutocompleteSearchList();
  }

  clickDeleteObjectAutocompleteSearchList(): void {
    this.resetAutocompleteSearchList();
  }

  clickButtonSearchSearchControl(): void {
    this.resetAutocompleteSearchList();
  }

  subscribeOutsideClick(): void {
    this.outsideClick = this.renderer.listen('document', 'click', (event) => {
      if (!this.autocompleteSearchControl.nativeElement.contains(event.target)) {
        this.resetAutocompleteSearchList();
      }
    });
  }

  clickSearch(): void {
    this.showAutocompleteList();
  }

  inputSearch(): void {
    this.showAutocompleteList();
  }

  showAutocompleteList(): void {
    if (!this.isShowAutocompleteList) {
      this.isShowAutocompleteList = true;
      this.subscribeOutsideClick();
    }
  }

  unsubscriveOutsideClick(): void {
    if (this.outsideClick) {
      this.outsideClick();
      this.outsideClick = undefined;
    }
  }

  ngOnDestroy() { }
}
