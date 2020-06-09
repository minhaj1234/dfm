import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Action, Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { TechnicalTabType } from 'core/models';
import { triggerMouseClick } from 'core/testing';
import { defaultSearchFilterTypeObjects, defaultSearchSort } from '../../../models/search.model';
import * as fromStore from '../../../store';
import { IDecisionFirstState } from '../../../store/reducers/index';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { SearchControlComponent } from './search-control.component';

class FakeSearch implements Action {
  readonly type = 'search';
  constructor(payload: string) {}
}

@Component({
  template: `
    <dfm-search-control #actual [searchAction]="searchAction" [searchTerm]="searchTerm"></dfm-search-control>
  `,
})
class TestHostComponent {
  searchAction = FakeSearch;
  searchTerm = 'search';
  
  @ViewChild('actual', { static: false }) actual: SearchControlComponent;

  constructor() {}
}

describe('SearchControlComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let store: Store<IDecisionFirstState>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [SearchControlComponent, TestHostComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        TestStoreModule,
        TranslateModule.forRoot(),
      ],
      providers: [],
    }).compileComponents();
    store = TestBed.get(Store);
    spyOn(store, 'dispatch');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component.actual).toBeTruthy();
  });

  it('dispatches the search Action when search is fired', () => {
    const searchValue = '123';

    component.actual.updateSearch();

    expect(store.dispatch).toHaveBeenCalledWith(new FakeSearch(searchValue));
  });

  it('should open search tab after click search icon', () => {
    triggerMouseClick(fixture, '.search-icon');

    expect(store.dispatch).toHaveBeenCalledWith(
      new fromStore.UpdateSearchForMainSearchList({
        searchTerm: 'search',
        sort: defaultSearchSort,
        typeObjects: defaultSearchFilterTypeObjects,
      }),
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      new fromStore.AddTab({ id: TechnicalTabType.Search, type: TechnicalTabType.Search }),
    );
  });

  it('should open search tab after press enter', () => {
    fixture.debugElement
      .query(By.css('.search-input'))
      .nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(store.dispatch).toHaveBeenCalledWith(
      new fromStore.UpdateSearchForMainSearchList({
        searchTerm: 'search',
        sort: defaultSearchSort,
        typeObjects: defaultSearchFilterTypeObjects,
      }),
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      new fromStore.AddTab({ id: TechnicalTabType.Search, type: TechnicalTabType.Search }),
    );
  });

  it('should getter searchTerm return correct value', () => {
    component.searchTerm = 'new search';
    expect(component.searchTerm).toEqual('new search');
  });
});
