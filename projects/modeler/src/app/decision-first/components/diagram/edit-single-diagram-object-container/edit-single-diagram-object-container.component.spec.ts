import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbThemeModule } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing';
import { DmsThemeModule } from '../../../../theme';
import { DiagramNodeType, IGoJsDiagramNode } from '../../../models/goJsDiagram.model';
import { ObjectClassNames } from '../../../models/objects.model';
import * as fromRoot from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { EditSingleDiagramObjectContainerComponent } from './edit-single-diagram-object-container.component';

describe('EditSingleDiagramObjectContainerComponent', () => {
  let component: EditSingleDiagramObjectContainerComponent;
  let fixture: ComponentFixture<EditSingleDiagramObjectContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditSingleDiagramObjectContainerComponent,
        MockComponent({ selector: 'dfm-edit-graphable', inputs: ['graphable', 'isReadOnly'] }),
        MockComponent({ selector: 'dfm-edit-sketch', inputs: ['selectedObject', 'diagram'] }),
        MockComponent({ selector: 'dfm-diagram-implementation-components', inputs: ['implementationComponents', 'icons'] }),
        MockComponent({ selector: 'dfm-question-and-answers', inputs: ['decision', 'isReadOnly'] }),
      ],
      imports: [
        FormsModule,
        CommonModule,
        DmsThemeModule,
        ReactiveFormsModule,
        TestStoreModule,
        TranslateModule.forRoot(),
        NbThemeModule.forRoot(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSingleDiagramObjectContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('checkIsDecision', () => {
    it('should return true when data is decision', () => {
      const selectedObject = { data: { className: ObjectClassNames.Decision } } as IGoJsDiagramNode;

      expect(component.checkIsDecision(selectedObject)).toBeTruthy();
    });
  });

  describe('checkIsGraphable', () => {
    it('should return true when decision', () => {
      const selectedObject = { data: {}, type: DiagramNodeType.Decision } as IGoJsDiagramNode;

      expect(component.checkIsGraphable(selectedObject)).toBeTruthy();
    });

    it('should return true when knowledge source', () => {
      const selectedObject = { data: {}, type: DiagramNodeType.KnowledgeSource } as IGoJsDiagramNode;

      expect(component.checkIsGraphable(selectedObject)).toBeTruthy();
    });

    it('should return true when input data', () => {
      const selectedObject = { data: {}, type: DiagramNodeType.InputData } as IGoJsDiagramNode;

      expect(component.checkIsGraphable(selectedObject)).toBeTruthy();
    });
  });

  describe('checkIsSketch', () => {
    it('should return true when annotation', () => {
      const selectedObject = { data: {}, type: DiagramNodeType.Annotation } as IGoJsDiagramNode;

      expect(component.checkIsSketch(selectedObject)).toBeTruthy();
    });
  });

  describe('objectName', () => {
    it('should return graphable name', () => {
      const selecedObject = { data: { name: 'name'}, type: DiagramNodeType.Decision  } as IGoJsDiagramNode
      component.selectedObject = selecedObject;

      const expected = component.objectName;

      expect(expected).toEqual(selecedObject.data.name);
    });
  });

  describe('closeEditorContainer', () => {
    it('should dispatch SetSelectedDiagramObjectsActiveDiagram', () => {
      spyOn(TestBed.get(Store),'dispatch');
      const diagram = {id: 'diagramId'} as any;
      component.diagram = diagram;

      component.closeEditorContainer();

      expect(TestBed.get(Store).dispatch).toHaveBeenCalledWith(new fromRoot.SetSelectedDiagramObjectsActiveDiagram({
        id: diagram.id,
        selectedDiagramObjects: []
      }));
    });
  });
});
