import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NbThemeModule } from '@nebular/theme';
import { combineReducers, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { rootReducers } from 'core/root-store';
import { MockComponent } from 'core/testing';
import { AdminThemeModule } from '../../../../theme';
import * as fromModelerStore from '../../store';
import { HomeContainerComponent } from './home-container.component';

describe('HomeContainerComponent', () => {
  let component: HomeContainerComponent;
  let fixture: ComponentFixture<HomeContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeContainerComponent,
        MockComponent({ selector: 'admin-search-list', inputs: ['searchList', 'searchTerm', 'isReadOnly'] }),
        MockComponent({ selector: 'admin-search-control', inputs: ['searchAction'] }),
        MockComponent({ selector: 'core-pagination-load-more', inputs: ['pagination', 'getMoreAction', 'store'] }),
      ],
      imports: [
        ReactiveFormsModule,
        NbThemeModule.forRoot(),
        AdminThemeModule,
        StoreModule.forRoot({
          ...rootReducers.reducers,
          DecisionFirst: combineReducers(fromModelerStore.reducers),
        }),
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
