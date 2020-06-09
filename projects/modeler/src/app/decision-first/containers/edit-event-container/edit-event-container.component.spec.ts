import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing'
import { NgDragDropModule } from 'ng-drag-drop';
import { DmsThemeModule } from '../../../theme';
import { Decision } from '../../models/decision.model';
import { Event } from '../../models/events.model';
import * as fromModelerStore from '../../store';
import { TestStoreModule } from '../../testing/test-store-module.spec';
import { EditEventContainerComponent } from './edit-event-container.component';

describe('EditEventContainerComponent', () => {
  let component: EditEventContainerComponent;
  let fixture: ComponentFixture<EditEventContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditEventContainerComponent,
        MockComponent({ selector: 'dfm-edit-event', inputs: ['editObject', 'isReadOnly'] }),
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
    fixture = TestBed.createComponent(EditEventContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
