import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockComponent } from 'core/testing';
import * as fromModelerStore from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { AutocompleteSearchControlComponent } from './autocomplete-search-control.component';

describe('AutocompleteSearchControlComponent', () => {
  let component: AutocompleteSearchControlComponent;
  let fixture: ComponentFixture<AutocompleteSearchControlComponent>;
  let modelerStore: Store<fromModelerStore.IDecisionFirstState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AutocompleteSearchControlComponent,
        MockComponent({ selector: 'dfm-search-control', inputs: ['searchAction'] }),
        MockComponent({ selector: 'dfm-search-list', inputs: ['searchList', 'isShowDelimiter', 'isReadOnly'] }),
      ],
      imports: [
        TestStoreModule,
      ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    modelerStore = TestBed.get(Store);
    spyOn(modelerStore, 'dispatch');

    fixture = TestBed.createComponent(AutocompleteSearchControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset autocomplete search list after open tab', () => {
    component.clickOpenTabAutocompleteSearchList();
    expect(modelerStore.dispatch).toHaveBeenCalledWith(new fromModelerStore.SetAutocompleteSearchListInitialState());
    expect(component.isShowAutocompleteList).toBeFalsy();
  });

  it('should reset autocomplete search list after delete object', () => {
    component.clickDeleteObjectAutocompleteSearchList();
    expect(modelerStore.dispatch).toHaveBeenCalledWith(new fromModelerStore.SetAutocompleteSearchListInitialState());
    expect(component.isShowAutocompleteList).toBeFalsy();
  });

  it('should reset autocomplete search list after click search button', () => {
    component.clickButtonSearchSearchControl();
    expect(modelerStore.dispatch).toHaveBeenCalledWith(new fromModelerStore.SetAutocompleteSearchListInitialState());
    expect(component.isShowAutocompleteList).toBeFalsy();
  });

  it('should show autocomplete search list after click search input', () => {
    component.clickSearch();
    expect(component.isShowAutocompleteList).toBeTruthy();
  });

  it('should show autocomplete search list after input search input', () => {
    component.inputSearch();
    expect(component.isShowAutocompleteList).toBeTruthy();
  });
});
