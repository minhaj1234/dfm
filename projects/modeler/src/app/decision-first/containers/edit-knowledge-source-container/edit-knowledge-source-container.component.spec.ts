import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing'
import { NgDragDropModule } from 'ng-drag-drop';
import { DmsThemeModule } from '../../../theme';
import { Decision } from '../../models/decision.model';
import { KnowledgeSource } from '../../models/knowledgeSource.model';
import * as fromModelerStore from '../../store';
import { TestStoreModule } from '../../testing/test-store-module.spec';
import { EditKnowledgeSourceContainerComponent } from './edit-knowledge-source-container.component';

describe('EditKnowledgeSourceContainerComponent', () => {
  let component: EditKnowledgeSourceContainerComponent;
  let fixture: ComponentFixture<EditKnowledgeSourceContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditKnowledgeSourceContainerComponent,
        MockComponent({ selector: 'dfm-jump-menu', inputs: ['object', 'anchors'] }),
        MockComponent({ selector: 'dfm-edit-knowledge-source', inputs: ['editObject', 'isReadOnly'] }),
        MockComponent({ selector: 'dfm-graphable-generated-requirements-diagram', inputs: ['graphable'] }),
        MockComponent({ selector: 'dfm-relation-objects-display', inputs:
          ['caption', 'addAction', 'removeAction', 'to', 'acceptsType', 'relationObjectsKey', 'isReadOnly'] }),
        MockComponent({ selector: 'dfm-graphable-primary-diagram', inputs: ['graphable', 'isReadOnly'] }),
        MockComponent({ selector: 'dfm-comments-container', inputs: ['addAction', 'removeAction', 'object', 'comments', 'isReadOnly', 'authenticatedUser'] }),
      ],
      imports: [
        FormsModule,
        NgDragDropModule.forRoot(),
        NoopAnimationsModule,
        ReactiveFormsModule,
        DmsThemeModule,
        TestStoreModule,
        TranslateModule.forRoot(),
      ],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditKnowledgeSourceContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
