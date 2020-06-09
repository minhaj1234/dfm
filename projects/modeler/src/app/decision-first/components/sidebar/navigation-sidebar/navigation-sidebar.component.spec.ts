import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthenticatedUser, ObjectTabType, TechnicalTabType } from 'core/models';
import { SidebarPanel } from 'core/objects/sidebar/models';
import { rootActions } from 'core/root-store';
import { getDebugElement, MockComponent } from 'core/testing';
import { triggerMouseClick } from 'core/testing';
import { DmsThemeModule } from '../../../../theme';
import * as fromModelerStore from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { NavigationSidebarComponent } from './navigation-sidebar.component';

describe('NavigationSidebarComponent', () => {
  let component: NavigationSidebarComponent;
  let fixture: ComponentFixture<NavigationSidebarComponent>;
  let modelerStore: Store<fromModelerStore.IDecisionFirstState>;
  let translateService: TranslateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NavigationSidebarComponent,
        MockComponent({ selector: 'dfm-user-info' }),
      ],
      imports: [
        FormsModule,
        TranslateModule.forRoot(),
        DmsThemeModule,
        TestStoreModule,
      ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    modelerStore = TestBed.get(Store);
    spyOn(modelerStore, 'dispatch');

    translateService = TestBed.get(TranslateService);
    spyOn(translateService, 'use');

    fixture = TestBed.createComponent(NavigationSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open add objects sidebar panel', () => {
    triggerMouseClick(fixture, '.add-object-sidebar-panel');
    expect(modelerStore.dispatch).toHaveBeenCalledWith(new fromModelerStore.SetCurrentSidebarPanel(SidebarPanel.AddObjects));
  });

  it('should open existing objects sidebar panel', () => {
    triggerMouseClick(fixture, '.existing-objects-sidebar-panel');
    expect(modelerStore.dispatch).toHaveBeenCalledWith(new fromModelerStore.SetCurrentSidebarPanel(SidebarPanel.ExistingObjects));
  });

  it('should change language', () => {
    const languageSelect = getDebugElement(fixture, '#languageSelect').nativeElement;
    languageSelect.value = languageSelect.options[2].value;
    languageSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(translateService.use).toHaveBeenCalledWith(languageSelect.options[2].value);
  });

  it('should open admin tab', () => {
    triggerMouseClick(fixture, '.admin-tab');
    expect(modelerStore.dispatch).toHaveBeenCalledWith(new fromModelerStore.AddTab({
      type: TechnicalTabType.Admin,
    }));
  });

  it('should logOut', () => {
    triggerMouseClick(fixture, '.logOut');
    expect(modelerStore.dispatch).toHaveBeenCalledWith(new rootActions.Logout());
  });

  describe('openProfileTab', () => {
    it('should dispatch AddTab', () => {
      const authenticatedUser = { userId: 'userId'} as AuthenticatedUser;

      component.openProfileTab(authenticatedUser);

      expect(modelerStore.dispatch).toHaveBeenCalledWith(new fromModelerStore.AddTab({
        type: ObjectTabType.User,
        id: authenticatedUser.userId
      }));
    });
  });
});
