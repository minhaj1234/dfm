import { APP_BASE_HREF } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterModule } from '@angular/router';
import { NbSidebarService, NbThemeModule } from '@nebular/theme';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { rootReducers } from 'core/root-store';
import { MockComponent } from 'core/testing';
import { NgDragDropModule } from 'ng-drag-drop';
import { AdminThemeModule } from '../../../../theme';
import * as fromReducers from '../../store/reducers';
import { IDecisionFirstState } from '../../store/reducers';
import { TabsComponent } from './tabs.component';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;
  let store: Store<IDecisionFirstState>;
  let navigate: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TabsComponent,
        MockComponent({ selector: 'admin-home-container' }),
        MockComponent({ 
          selector: 'user-management-edit-customer-container-tab',
          inputs: ['customerId','options']
        }),
        MockComponent({
          selector: 'user-management-edit-user-container',
          inputs: ['userId', 'options']
        }),
        MockComponent({
          selector: 'user-management-edit-group-container',
          inputs: ['groupId','options']
        }),
        MockComponent({
          selector: 'core-implementation-component-icons-container',
          inputs: []
        }),
        MockComponent({
          selector: 'core-edit-version-information-container',
          inputs: []
        }),
        MockComponent({
          selector: 'core-edit-implementation-component-icon-container',
          inputs: ['iconId']
        }),
      ],
      imports: [
        NgDragDropModule.forRoot(),
        NoopAnimationsModule,
        NbThemeModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        AdminThemeModule,
        StoreModule.forRoot({
          ...rootReducers.reducers,
          DecisionFirst: combineReducers(fromReducers.reducers),
        }),
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, NbSidebarService],
    }).compileComponents();

    store = TestBed.get(Store);
    const router = TestBed.get(Router);
    navigate = spyOn(router, 'navigate');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
