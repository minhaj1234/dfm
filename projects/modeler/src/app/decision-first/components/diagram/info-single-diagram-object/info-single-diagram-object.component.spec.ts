import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ObjectTabType } from 'core/models';
import { MockComponent } from 'core/testing';
import { DiagramNodeType, IGoJsDiagramNode } from '../../../models/goJsDiagram.model';
import { ObjectClassNames } from '../../../models/objects.model';
import * as fromStore from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { InfoSingleDiagramObjectComponent } from './info-single-diagram-object.component';

describe('InfoSingleDiagramObjectComponent', () => {
  let component: InfoSingleDiagramObjectComponent;
  let fixture: ComponentFixture<InfoSingleDiagramObjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        InfoSingleDiagramObjectComponent,
        MockComponent({ selector: 'core-view-multiple-lines-control', inputs: ['text'] }),
      ],
      imports: [
        TestStoreModule,
      TranslateModule.forRoot(),]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoSingleDiagramObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('description', () => {
    it('should return description', () => {
      const selecedObject = { text: 'description', type: DiagramNodeType.Annotation } as IGoJsDiagramNode
      component.selectedObject = selecedObject;

      const expected = component.description;

      expect(expected).toEqual(selecedObject.text);
    });
  });

  describe('description', () => {
    it('should return graphable description', () => {
      const selecedObject = { data: { description: 'description'}, type: DiagramNodeType.Decision  } as IGoJsDiagramNode
      component.selectedObject = selecedObject;

      const expected = component.description;

      expect(expected).toEqual(selecedObject.data.description);
    });

    it('should return sketch description', () => {
      const selecedObject = {  text: 'description', type: DiagramNodeType.Annotation } as IGoJsDiagramNode
      component.selectedObject = selecedObject;

      const expected = component.description;

      expect(expected).toEqual(selecedObject.text);
    });
  });

  describe('name', () => {
    it('should return graphable name', () => {
      const selecedObject = { data: { name: 'name'}, type: DiagramNodeType.Decision } as IGoJsDiagramNode
      component.selectedObject = selecedObject;

      const expected = component.name

      expect(expected).toEqual(selecedObject.data.name);
    });

    it('should return empty string', () => {
      const expected = component.name

      expect(expected).toEqual('');
    });
  });

  describe('checkIsGraphable', () => {
    it('should return true if graphable', () => {
      const selecedObject = { data: { name: 'name'}, type: DiagramNodeType.Decision  } as IGoJsDiagramNode

      const expected = component.isGraphable(selecedObject);

      expect(expected).toBeTruthy();
    });
  });

  describe('openTab', () => {
    it('should call dispatch', () => {
      spyOn(TestBed.get(Store), 'dispatch');
      const selecedObject = { data: { id: '1', className: ObjectClassNames.Decision }, type: DiagramNodeType.Decision  } as IGoJsDiagramNode
      component.selectedObject = selecedObject;

      component.openTab();

      expect(TestBed.get(Store).dispatch).toHaveBeenCalledWith(
        new fromStore.AddTab({
          id: selecedObject.data.id,
          type: ObjectTabType[selecedObject.data.className],
      }));
    });
  });
});
