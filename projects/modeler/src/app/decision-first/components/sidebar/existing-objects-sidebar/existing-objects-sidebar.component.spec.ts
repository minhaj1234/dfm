import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarPanel } from 'core/objects/sidebar/models';
import { MockComponent } from 'core/testing';
import { triggerMouseClick } from 'core/testing';
import { DmsThemeModule } from '../../../../theme';
import * as fromStore from '../../../store';
import * as fromReducers from '../../../store/reducers';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { ExistingObjectsSidebarComponent } from './existing-objects-sidebar.component';

describe('ExistingObjectsSidebarComponent', () => {
  let component: ExistingObjectsSidebarComponent;
  let fixture: ComponentFixture<ExistingObjectsSidebarComponent>;
  let store: Store<fromReducers.IDecisionFirstState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ExistingObjectsSidebarComponent,
        MockComponent({ selector: 'dfm-autocomplete-search-control', inputs: [] }),
        MockComponent({ selector: 'dfm-diagrams-list', inputs: ['objectsList', 'isReadOnly'] }),
        MockComponent({ selector: 'dfm-decisions-list', inputs: ['objectsList', 'isReadOnly'] }),
        MockComponent({ selector: 'dfm-input-data-list', inputs: ['objectsList', 'isReadOnly'] }),
        MockComponent({ selector: 'dfm-knowledge-sources-list', inputs: ['objectsList', 'isReadOnly'] }),
        MockComponent({ selector: 'dfm-organizations-list', inputs: ['objectsList', 'isReadOnly'] }),
        MockComponent({ selector: 'dfm-business-objectives-list', inputs: ['objectsList', 'isReadOnly'] }),
        MockComponent({ selector: 'dfm-processes-list', inputs: ['objectsList', 'isReadOnly'] }),
        MockComponent({ selector: 'dfm-events-list', inputs: ['objectsList', 'isReadOnly'] }),
        MockComponent({ selector: 'dfm-systems-list', inputs: ['objectsList', 'isReadOnly'] }),
        MockComponent({ selector: 'dfm-implementation-components-list', inputs: ['objectsList', 'isReadOnly'] }),
      ],
      imports: [
        DmsThemeModule,
        NbThemeModule.forRoot(),
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        TestStoreModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ExistingObjectsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open navigation sidebar panel', () => {
    triggerMouseClick(fixture, '.header-icon');
    expect(store.dispatch).toHaveBeenCalledWith(new fromStore.SetCurrentSidebarPanel(SidebarPanel.Navigation));
  });
});
