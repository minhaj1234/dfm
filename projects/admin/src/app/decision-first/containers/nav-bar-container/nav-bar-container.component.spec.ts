import { ChangeDetectionStrategy } from '@angular/core';
import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NbDialogService, NbThemeModule } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { TechnicalTabType } from 'core/models';
import { rootActions } from 'core/root-store';
import { getDebugElement, triggerMouseClick, MockComponent } from 'core/testing'
import { NgDragDropModule } from 'ng-drag-drop';
import { of } from 'rxjs';
import { UsersService } from 'user-management/services';
import { FakeUsersService } from 'user-management/testing';
import { AdminThemeModule } from '../../../../theme';
import * as fromAdminStore from '../../store';
import { TestStoreModule } from '../../testing/test-store-module.spec';
import { NavBarContainerComponent } from './nav-bar-container.component';

describe('NavBarContainerComponent', () => {
  let component: NavBarContainerComponent;
  let fixture: ComponentFixture<NavBarContainerComponent>;
  let dispatch: jasmine.Spy;
  
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
        AdminThemeModule,
        NbThemeModule.forRoot(),
        ReactiveFormsModule,
        FormsModule,
        TestStoreModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: UsersService, useValue: new FakeUsersService() }
      ],
    }).overrideComponent(NavBarContainerComponent, {
      set: {
        changeDetection: ChangeDetectionStrategy.Default,
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBarContainerComponent);
    dispatch = spyOn(TestBed.get(Store), 'dispatch');
    component = fixture.componentInstance;
    spyOn(TestBed.get(UsersService), 'isSuperAdmin').and.returnValue(of(true));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('add customer click', () => {
    it('should oped dialog AddCustomer', () => {
      const spyOpenDialog = spyOn(TestBed.get(NbDialogService), 'open')
      
      triggerMouseClick(fixture, '.add-customer-link');

      expect(spyOpenDialog).toHaveBeenCalled();
    });
  });

  describe('log out click', () => {
    it('should dispatch Logout action', () => {
      triggerMouseClick(fixture, '.log-out-link');

      expect(dispatch).toHaveBeenCalledWith(new rootActions.Logout());
    });
  });

  describe('open implementation iomponent icons click', () => {
    it('should dispatch AddTab action', () => {
      triggerMouseClick(fixture, '.icons-link');

      expect(dispatch.calls.first().args[0]).toEqual(new fromAdminStore.AddTab({
        type: TechnicalTabType.ImplementationComponentIcons,
      }));
    });
  });

  describe('open version information click', () => {
    it('should dispatch AddTab action', () => {
      triggerMouseClick(fixture, '.version-information-link');

      expect(dispatch.calls.first().args[0]).toEqual(new fromAdminStore.AddTab({
        type: TechnicalTabType.VersionInformation,
      }));
    });
  });
});
