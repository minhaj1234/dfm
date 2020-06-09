import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NbThemeModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing'
import { DmsThemeModule } from '../../../theme';
import { TestStoreModule } from '../../testing/test-store-module.spec';
import { HomeContainerComponent } from './home-container.component';

describe('HomeContainerComponent', () => {
  let component: HomeContainerComponent;
  let fixture: ComponentFixture<HomeContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeContainerComponent,
        MockComponent({ selector: 'dfm-search-list', inputs: ['searchList', 'searchTerm', 'isReadOnly'] }),
        MockComponent({ selector: 'dfm-search-control', inputs: ['searchAction'] }),
        MockComponent({ selector: 'core-pagination-load-more', inputs: ['store', 'pagination', 'getMoreAction'] }),
      ],
      imports: [
        ReactiveFormsModule,
        DmsThemeModule,
        NbThemeModule.forRoot(),
        TestStoreModule,
        TranslateModule.forRoot(),
      ],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
