import { APP_BASE_HREF } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NbSidebarService, NbThemeModule, NbThemeService } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { CoreComponentsModule } from 'core/components';
import { APP_CONFIG, MessageService } from 'core/services';
import { FakeMessageService, MockComponent } from 'core/testing';
import { NgDragDropModule } from 'ng-drag-drop';
import * as fromContainers from '..';
import { DmsThemeModule } from '../../../theme';
import * as fromComponents from '../../components';
import {
  DecisionStompService,
  DiagramStompService,
  KnowledgeSourceStompService,
  OrganizationStompService,
} from '../../stompServices';
import { TestStoreModule } from '../../testing/test-store-module.spec';
import { MainContainerComponent } from './main-container.component';

describe('MainContainerComponent', () => {
  const config = {};
  let component: MainContainerComponent;
  let fixture: ComponentFixture<MainContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ...fromContainers.containers, 
        ...fromComponents.components,
        MockComponent({
          selector: 'user-management-edit-user-container',
          inputs: ['userId','options'] 
        }),
        MockComponent({
          selector: 'user-management-edit-group-container',
          inputs: ['groupId','options' ] 
        }),
        MockComponent({
          selector: 'user-management-edit-customer-container',
          inputs: ['customerId','options' ] 
        }),
       ],
      imports: [
        NgDragDropModule.forRoot(),
        NoopAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule.forRoot([]),
        DmsThemeModule,
        NbThemeModule.forRoot(),
        CoreComponentsModule,
        TestStoreModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: DiagramStompService, useValue: {} },
        { provide: DecisionStompService, useValue: {} },
        { provide: KnowledgeSourceStompService, useValue: {} },
        { provide: OrganizationStompService, useValue: {} },
        { provide: MessageService, useValue: new FakeMessageService() },
        { provide: APP_CONFIG, useFactory: () => config },
        NbThemeService,
        NbSidebarService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
