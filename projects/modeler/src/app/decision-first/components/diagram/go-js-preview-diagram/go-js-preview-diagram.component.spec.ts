import { Renderer2 } from '@angular/core';
import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { diagramsData } from '../../../services/diagrams.service.spec-data';
import { toDiagram } from '../../../utilitites/mappings';
import { GoJsPreviewDiagramComponent } from './go-js-preview-diagram.component';

describe('GoJsPreviewDiagramComponent', () => {
  let component: GoJsPreviewDiagramComponent;
  let fixture: ComponentFixture<GoJsPreviewDiagramComponent>;
  const diagram = toDiagram({ ...diagramsData._embedded.diagrams[1] });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoJsPreviewDiagramComponent],
      providers: [
        Renderer2
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {  
    fixture = TestBed.createComponent(GoJsPreviewDiagramComponent);
    component = fixture.componentInstance;
    component.diagram = diagram;
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
