import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'core/testing';
import { SearchToolsComponent } from './search-tools.component';

describe('SearchToolsComponent', () => {
  let component: SearchToolsComponent;
  let fixture: ComponentFixture<SearchToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchToolsComponent,
        MockComponent({ selector: 'dfm-search-sort-tool' }),
        MockComponent({ selector: 'dfm-search-filter-tool' }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
