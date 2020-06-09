import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing'
import { NgDragDropModule } from 'ng-drag-drop';
import { DmsThemeModule } from '../../../theme';
import { Decision } from '../../models/decision.model';
import { Organization } from '../../models/organization.model';
import * as fromModelerStore from '../../store';
import { TestStoreModule } from '../../testing/test-store-module.spec';
import { EditOrganizationContainerComponent } from './edit-organization-container.component';

describe('EditOrganizationContainerComponent', () => {
  let component: EditOrganizationContainerComponent;
  let fixture: ComponentFixture<EditOrganizationContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditOrganizationContainerComponent,
        MockComponent({ selector: 'dfm-edit-organization', inputs: ['editObject', 'isReadOnly'] }),
        MockComponent({ selector: 'dfm-relation-objects-display', inputs: ['caption', 'addAction', 'removeAction', 'changeForSingleAction', 'to', 'isReadOnly'] }),
        MockComponent({ selector: 'dfm-jump-menu', inputs: ['object', 'anchors'] }),
        MockComponent({ selector: 'dfm-comments-container', inputs: ['addAction', 'removeAction', 'object', 'comments', 'isReadOnly', 'authenticatedUser'] }),
      ],
      imports: [
        NgDragDropModule.forRoot(),
        NoopAnimationsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        DmsThemeModule,
        TestStoreModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOrganizationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
