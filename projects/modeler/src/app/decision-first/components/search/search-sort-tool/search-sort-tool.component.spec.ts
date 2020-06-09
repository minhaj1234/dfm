import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { getDebugElement } from 'core/testing';
import { SearchSort } from '../../../models/search.model';
import { IDecisionFirstState } from '../../../store';
import * as fromRoot from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { SearchSortToolComponent } from './search-sort-tool.component';

describe('SearchSortToolComponent', () => {
  let component: SearchSortToolComponent;
  let fixture: ComponentFixture<SearchSortToolComponent>;
  let store: Store<IDecisionFirstState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchSortToolComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forRoot(),
        TestStoreModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(SearchSortToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change sort item', () => {
    const selectSearchSort = getDebugElement(fixture, '#sortBy').nativeElement;
    selectSearchSort.value = selectSearchSort.options[1].value;
    selectSearchSort.dispatchEvent(new Event('change'));

    expect(store.dispatch).toHaveBeenCalledWith(
      new fromRoot.UpdateSearchForMainSearchList({ searchTerm: '', sort: SearchSort.Desc }),
    );
  });
});
