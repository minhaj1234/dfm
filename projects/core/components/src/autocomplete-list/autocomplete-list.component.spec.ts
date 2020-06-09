import { DebugElement, Renderer2 } from '@angular/core';
import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NbListModule, NbThemeModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { AutocompleteListItem } from 'core/models';
import { getDebugElement, triggerMouseClick } from 'core/testing';
import { AutocompleteListComponent } from './autocomplete-list.component';

describe('AutocompleteListComponent', () => {
  let component: AutocompleteListComponent;
  let fixture: ComponentFixture<AutocompleteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AutocompleteListComponent],
      imports: [
        ReactiveFormsModule,
        NbThemeModule.forRoot(),
        NbListModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        Renderer2,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteListComponent);
    component = fixture.componentInstance;
    component.searchDebounceTime = 100;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSearchClicked', () => {
    it('should set isAutocompleteListDisplayed to true', () => {
      component.onSearchClicked();

      expect(component.isAutocompleteListDisplayed).toBeTruthy();
    });
  });

  describe('onSearchInput', () => {
    it('should set isAutocompleteListDisplayed to true', () => {
      component.onSearchInput();

      expect(component.isAutocompleteListDisplayed).toBeTruthy();
    });
  });
   
  describe('resetSearchForm', () => {
    it('should set object name if list item is selected', () => {
      const searchBoxElement = getSearchBoxDebugElement().nativeElement;
      component.onListItemSelected({name: 'selected name'} as AutocompleteListItem);

      component.resetSearchForm();

      expect(searchBoxElement.value).toEqual('selected name');
    });

    it('should set empty string in search control if item is not selected', () => {
      const inputElement = getSearchBoxDebugElement().nativeElement;
     
      component.resetSearchForm();

      expect(inputElement.value).toEqual('');
    });
  });

  describe('autocomplete list item clicked', () => {
    beforeEach(() => {
      triggerMouseClick(fixture, '.search-control');
      component.autocompleteSearchList = [{
        id: 'itemId',
        name: 'item name'
      }];
      fixture.detectChanges();
    });

    it('should emit resetSearchList', () => {
      const spyResetSearchListEmit = spyOn(component.resetSearchList, 'emit');
      
      triggerMouseClick(fixture, '#item-itemId');

      expect(spyResetSearchListEmit).toHaveBeenCalled();
    });

    it('should set isAutocompleteListDisplayed to false', () => {
      triggerMouseClick(fixture, '#item-itemId');

      expect(component.isAutocompleteListDisplayed).toBeFalsy();
    });
  });

  describe('search control value changed', () => {
    it('should emit UpdateSearchList', fakeAsync(() => {
      triggerMouseClick(fixture, '.search-control');
      const spyUpdateSearchListEmit = spyOn(component.updateSearchList, 'emit');

      component.searchControl.setValue('new value');

      tick(250);
      expect(spyUpdateSearchListEmit).toHaveBeenCalledWith('new value');
    }));
  });

  function getSearchBoxDebugElement(): DebugElement {
    return getDebugElement(fixture, '.search-control');
  }
});
