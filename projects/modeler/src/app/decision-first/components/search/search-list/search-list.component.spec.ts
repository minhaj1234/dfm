import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing';
import { DmsThemeModule } from '../../../../theme';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { SearchListComponent } from './search-list.component';

describe('SearchListComponent', () => {
  let component: SearchListComponent;
  let fixture: ComponentFixture<SearchListComponent>;
  let dispatchModelerStore: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchListComponent,
        MockComponent({ selector: 'dfm-search-item-list', inputs: ['searchItem'] }),
        MockComponent({ selector: 'core-view-multiple-lines-control', inputs: ['text'] }),
        MockComponent({ selector: 'dfm-go-js-preview-diagram', inputs: ['diagramId'] }),
        MockComponent({ selector: 'dfm-search-list-item', inputs: ['searchItem', 'isReadOnly'], outputs: ['clickOpenTab', 'clickDeleteObject'] }),
        MockComponent({ selector: 'dfm-preview-container', inputs: ['to'] }),
      ],
      imports: [
        ReactiveFormsModule,
        DmsThemeModule,
        TestStoreModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    const modelerStore = TestBed.get(Store);
    dispatchModelerStore = spyOn(modelerStore, 'dispatch');
    fixture = TestBed.createComponent(SearchListComponent);
    component = fixture.componentInstance;
   
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
