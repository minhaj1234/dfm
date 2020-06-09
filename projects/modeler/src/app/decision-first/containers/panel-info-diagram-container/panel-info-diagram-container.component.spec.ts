import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing'
import { DmsThemeModule } from '../../../theme';
import { Diagram } from '../../models/diagram.model';
import { DiagramNodeType, GoJsDiagramObject } from '../../models/goJsDiagram.model';
import { KnowledgeSource } from '../../models/knowledgeSource.model';
import { TestStoreModule } from '../../testing/test-store-module.spec';
import { PanelInfoDiagramContainerComponent } from './panel-info-diagram-container.component';

describe('PanelInfoDiagramContainerComponent', () => {
  let component: PanelInfoDiagramContainerComponent;
  let fixture: ComponentFixture<PanelInfoDiagramContainerComponent>;

  const diagram = new Diagram();
  diagram.id = 'diagram1000';
  diagram.name = 'description';
  diagram.description = 'description';
  diagram._links = { self: { href: 'http://self' } } as any;

  const graphable = new KnowledgeSource();
  graphable.id = 'knowledgeSource1000';
  graphable.name = 'name';
  graphable.description = 'description';
  graphable.type = 'type';
  graphable.complexity = 'simple';
  graphable._links = { self: { href: 'http://self' } } as any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PanelInfoDiagramContainerComponent,
        MockComponent({ selector: 'dfm-edit-single-diagram-object-container', inputs: ['selectedObject', 'diagram', 'isReadOnly'] }),
        MockComponent({ selector: 'dfm-info-single-diagram-object', inputs: ['selectedObject'] }),
      ],
      imports: [
        DmsThemeModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        TestStoreModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelInfoDiagramContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correct set and get null value for diagram', () => {
    component.diagram = null;
    expect(component.diagram).toBe(null);
  });

  it('should correct set and get selected graphable', () => {
    component.selectedDiagramObjects = [{ data: graphable, type: DiagramNodeType.KnowledgeSource }] as GoJsDiagramObject[];
    expect(component.isShowEditSingleDiagramObjectComponent).toBe(true);
    expect(component.selectedNode.data).toBe(graphable);
  });

  it('should correct set and get null value for selected graphable', () => {
    component.selectedDiagramObjects = null;
    expect(component.isShowEditSingleDiagramObjectComponent).toBeFalsy();
    expect(component.selectedNode).toBe(null);
  });
});
