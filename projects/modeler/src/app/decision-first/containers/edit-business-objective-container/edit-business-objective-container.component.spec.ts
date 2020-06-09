import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing'
import { NgDragDropModule } from 'ng-drag-drop';
import { DmsThemeModule } from '../../../theme';
import { BusinessObjective } from '../../models/businessObjective.model';
import { Decision } from '../../models/decision.model';
import * as fromModelerStore from '../../store';
import { TestStoreModule } from '../../testing/test-store-module.spec';
import { EditBusinessObjectiveContainerComponent } from './edit-business-objective-container.component';

describe('EditBusinessObjectiveContainerComponent', () => {
  let component: EditBusinessObjectiveContainerComponent;
  let fixture: ComponentFixture<EditBusinessObjectiveContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditBusinessObjectiveContainerComponent,
        MockComponent({ selector: 'dfm-edit-business-objective', inputs: ['editObject', 'isReadOnly'] }),
        MockComponent({ selector: 'dfm-jump-menu', inputs: ['object', 'anchors'] }),
        MockComponent({ selector: 'dfm-relation-objects-display', inputs: ['caption', 'addAction', 'removeAction', 'to', 'isReadOnly'] }),
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
    fixture = TestBed.createComponent(EditBusinessObjectiveContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
