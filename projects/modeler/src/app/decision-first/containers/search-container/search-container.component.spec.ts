import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'core/testing'
import { DmsThemeModule } from '../../../theme';
import { TestStoreModule } from '../../testing/test-store-module.spec';
import { SearchContainerComponent } from './search-container.component';

describe('SearchContainerComponent', () => {
  let component: SearchContainerComponent;
  let fixture: ComponentFixture<SearchContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchContainerComponent,
        MockComponent({ selector: 'dfm-search-tools' }),
        MockComponent({ selector: 'dfm-search-control', inputs: ['searchAction', 'searchTerm'] }),
        MockComponent({ selector: 'dfm-search-list', inputs: ['searchList', 'searchTerm', 'isReadOnly'] }),
        MockComponent({ selector: 'core-pagination-load-more', inputs: ['store', 'pagination', 'getMoreAction'] }),
      ],
      imports: [
        DmsThemeModule,
        TestStoreModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
