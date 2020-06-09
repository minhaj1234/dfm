import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing';
import { IGoJsDiagramNode } from '../../../models/goJsDiagram.model';
import * as fromModelerStore from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { EditSketchComponent } from './edit-sketch.component';

describe('EditSketchComponent', () => {
  let component: EditSketchComponent;
  let fixture: ComponentFixture<EditSketchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditSketchComponent,
        MockComponent({ selector: 'core-edit-multiple-lines-control', inputs: ['formControlName', 'isRichEditor', 'rows', 'maxTextLength'] }, true),
      ],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        TestStoreModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSketchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setValueSketchForm', () => {
    it('should set form value', () => {
      component.selectedObject = { text: 'text' } as IGoJsDiagramNode;

      component.setValueSketchForm();

      expect(component.selectedObject.text).toEqual('text');
    });
  });

  describe('updateSketch', () => {
    it('should dispatch Update Sketch Object', () => {
      spyOn(TestBed.get(Store),'dispatch');
      const eventValue = { description: 'description' };
      const diagram = {id: 'diagramId'} as any;
      component.diagram = diagram;
      component.selectedObject = {key: 'selectedObjectKey'} as any;

      component.updateSketch(eventValue);

      expect(TestBed.get(Store).dispatch).toHaveBeenCalledWith(new fromModelerStore.UpdateSketchObject({
        diagram: diagram,
        sketch: {
          id: 'selectedObjectKey',
          description: 'description'
        }
      }));
    });
  });
});
