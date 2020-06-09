import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NbDialogService, NbThemeModule } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing'
import { triggerMouseClick } from 'core/testing';
import { DmsThemeModule } from '../../../theme';
import * as fromModelerStore from '../../store';
import { TestStoreModule } from '../../testing/test-store-module.spec';
import { HeaderContainerComponent } from './header-container.component';

describe('HeaderContainerComponent', () => {
  let component: HeaderContainerComponent;
  let fixture: ComponentFixture<HeaderContainerComponent>;
  let modelerStore: Store<fromModelerStore.IDecisionFirstState>;
  let dispatchModelerStore: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeaderContainerComponent,
        MockComponent({ selector: 'dfm-autocomplete-search-control' }),
        MockComponent({ selector: 'core-logo' }),
      ],
      imports: [
        NbThemeModule.forRoot(),
        DmsThemeModule,
        TestStoreModule,
        TranslateModule.forRoot(),
      ],
      providers: [NbDialogService],
    }).compileComponents();
  }));

  beforeEach(() => {
    modelerStore = TestBed.get(Store);
    dispatchModelerStore = spyOn(modelerStore, 'dispatch');

    fixture = TestBed.createComponent(HeaderContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggle sidebar', () => {
    it('should dispatch only ToggleSidebar action', () => {
      triggerMouseClick(fixture, 'i.sidebar-toggle');
      expect(dispatchModelerStore).toHaveBeenCalledWith(new fromModelerStore.ToggleSidebar());
    });

    it('should dispatch SetIsPinnedPropertySidebar and ToggleSidebar actions', () => {
      dispatchModelerStore.and.callThrough();
      modelerStore.dispatch(new fromModelerStore.SetIsPinnedPropertySidebar(true));
      fixture.detectChanges();

      triggerMouseClick(fixture, 'i.sidebar-toggle');
      expect(dispatchModelerStore).toHaveBeenCalledWith(new fromModelerStore.SetIsPinnedPropertySidebar(false));
      expect(dispatchModelerStore).toHaveBeenCalledWith(new fromModelerStore.ToggleSidebar());
    });
  });
});
