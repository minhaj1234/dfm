import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing'
import { NgDragDropModule } from 'ng-drag-drop';
import { DmsThemeModule } from '../../../theme';
import { Decision } from '../../models/decision.model';
import { System } from '../../models/system.model';
import * as fromModelerStore from '../../store';
import { TestStoreModule } from '../../testing/test-store-module.spec';
import { EditSystemContainerComponent } from './edit-system-container.component';

describe('EditSystemContainerComponent', () => {
  let component: EditSystemContainerComponent;
  let fixture: ComponentFixture<EditSystemContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditSystemContainerComponent,
        MockComponent({ selector: 'dfm-edit-system', inputs: ['editObject', 'isReadOnly'] }),
        MockComponent({ selector: 'dfm-relation-objects-display', inputs: ['caption', 'addAction', 'removeAction', 'to', 'isReadOnly'] }),
        MockComponent({ selector: 'dfm-jump-menu', inputs: ['object', 'anchors'] }),
        MockComponent({ selector: 'dfm-comments-container', inputs: ['addAction', 'removeAction', 'object', 'comments', 'isReadOnly', 'authenticatedUser'] }),
      ],
      imports: [
        NgDragDropModule.forRoot(),
        DmsThemeModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        TestStoreModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSystemContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
