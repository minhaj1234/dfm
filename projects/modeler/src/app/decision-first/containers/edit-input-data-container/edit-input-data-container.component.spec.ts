import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing'
import { NgDragDropModule } from 'ng-drag-drop';
import { DmsThemeModule } from '../../../theme';
import { Decision } from '../../models/decision.model';
import { InputData } from '../../models/inputData.model';
import * as fromModelerStore from '../../store';
import { TestStoreModule } from '../../testing/test-store-module.spec';
import { EditInputDataContainerComponent } from './edit-input-data-container.component';

describe('EditInputDataContainerComponent', () => {
  let component: EditInputDataContainerComponent;
  let fixture: ComponentFixture<EditInputDataContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditInputDataContainerComponent,
        MockComponent({ selector: 'dfm-jump-menu', inputs: ['object', 'anchors'] }),
        MockComponent({ selector: 'dfm-edit-input-data', inputs: ['editObject', 'isReadOnly'] }),
        MockComponent({ selector: 'dfm-graphable-generated-requirements-diagram', inputs: ['graphable'] }),
        MockComponent({ selector: 'dfm-relation-objects-display', inputs:
          ['caption', 'addAction', 'removeAction', 'to', 'acceptsType', 'relationObjectsKey', 'isReadOnly'] }),
        MockComponent({ selector: 'dfm-graphable-primary-diagram', inputs: ['graphable', 'isReadOnly'] }),
        MockComponent({ selector: 'dfm-comments-container', inputs: ['addAction', 'removeAction', 'object', 'comments', 'isReadOnly', 'authenticatedUser'] }),
      ],
      imports: [
        FormsModule,
        NgDragDropModule.forRoot(),
        ReactiveFormsModule,
        DmsThemeModule,
        TestStoreModule,
        TranslateModule.forRoot(),
      ],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInputDataContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
