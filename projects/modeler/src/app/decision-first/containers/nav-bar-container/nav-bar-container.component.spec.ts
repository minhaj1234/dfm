import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing'
import { NgDragDropModule } from 'ng-drag-drop';
import { DmsThemeModule } from '../../../theme';
import { TestStoreModule } from '../../testing/test-store-module.spec';
import { NavBarContainerComponent } from './nav-bar-container.component';

describe('NavBarContainerComponent', () => {
  let component: NavBarContainerComponent;
  let fixture: ComponentFixture<NavBarContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NavBarContainerComponent,
        MockComponent({ selector: 'dfm-navigation-sidebar' }),
        MockComponent({ selector: 'dfm-add-object-sidebar' }),
        MockComponent({ selector: 'dfm-existing-objects-sidebar' }),
      ],
      imports: [
        NgDragDropModule.forRoot(),
        NoopAnimationsModule,
        DmsThemeModule,
        NbThemeModule.forRoot(),
        ReactiveFormsModule,
        FormsModule,
        TestStoreModule,
        TranslateModule.forRoot(),
      ],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBarContainerComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
