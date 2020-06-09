import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as go from 'gojs';
import { Decision } from '../../../models/decision.model';
import { Diagram } from '../../../models/diagram.model';
import { DiagramLinkType, DiagramNodeType, IGoJsDiagramNode } from '../../../models/goJsDiagram.model';
import { diagramsData } from '../../../services/diagrams.service.spec-data';
import { toDiagram } from '../../../utilitites/mappings';
import { CommonGoJsDisplayDiagramComponent } from './common-go-js-display-diagram.component';

describe('CommonGoJsDisplayDiagramComponent', () => {
  let component: CommonGoJsDisplayDiagramComponent;
  let fixture: ComponentFixture<CommonGoJsDisplayDiagramComponent>;
  
  function diagramGenerator(index = 1): Diagram {
    const diagram = toDiagram({ ...diagramsData._embedded.diagrams[1] });
    return diagram;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonGoJsDisplayDiagramComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonGoJsDisplayDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('link type', () => {
    it('should correct set settings for information link type', () => {
      component.fillGoJsDiagramLinkingTool(DiagramLinkType.Information);

      expect(component.goJsdiagram.allowLink).toBe(true);
      expect(component.goJsdiagram.toolManager.linkingTool.archetypeLinkData).toEqual({
        category: DiagramLinkType.Information,
      });
    });

    it('should correct set settings for authority link type', () => {
      component.fillGoJsDiagramLinkingTool(DiagramLinkType.Authority);

      expect(component.goJsdiagram.allowLink).toBe(true);
      expect(component.goJsdiagram.toolManager.linkingTool.archetypeLinkData).toEqual({
        category: DiagramLinkType.Authority,
      });
    });

    it('should correct set settings for authority link type', () => {
      component.fillGoJsDiagramLinkingTool(DiagramLinkType.Annotation);

      expect(component.goJsdiagram.allowLink).toBe(true);
      expect(component.goJsdiagram.toolManager.linkingTool.archetypeLinkData).toEqual({
        category: DiagramLinkType.Annotation,
      });
    });

    it('should correct set settings for null', () => {
      component.fillGoJsDiagramLinkingTool(null);

      expect(component.goJsdiagram.allowLink).toBe(false);
    });
  });

  describe('node changes', () => {
    it('can add a node to the list without changing any old nodes', () => {
      component.updateDiagram(diagramGenerator());
      const originalNodeDataArray = component.goJsdiagram.model.nodeDataArray;
      const newData = diagramGenerator();
      const newNode: Decision = new Decision();
      newNode.name = 'new decision';
      newNode.type = 'some type';
      newNode.id = 'newDecision';
      newNode.diagrams = [];
      newNode.requiresDecisions = [];
      newNode.requiredByDecisions = [];
      newNode.requiresInputData = [];
      newNode.requiresKnowledgeSources = [];
      newNode.requiredByKnowledgeSources = [];
      newData.decisions.push(newNode);
      newData.goNodes = '{"newDecision":{"type":0,"text":"new decision"},"decision5":{"type":0,"text":"Decision E"},"knowledgesource2":{"type":2,"text":"Knowledge Source K"},"decision4":{"type":0,"text":"Decision D"},"decision3":{"type":0,"text":"Decision C"},"inputdata2":{"type":1,"text":"Input Data H"}}'
      component.updateDiagram(newData);
      const newNodeDataArray = component.goJsdiagram.model.nodeDataArray;

      expect(newNodeDataArray[0]).toBe(originalNodeDataArray[0]);
      expect(newNodeDataArray.length).toEqual(6);
    });

    it('remove a node from the list without changing any other nodes', () => {
      component.updateDiagram(diagramGenerator());
      const originalNodeDataArray = component.goJsdiagram.model.nodeDataArray as IGoJsDiagramNode[];
      const newData = diagramGenerator();
      newData.decisions = newData.decisions.filter((d) => d.id !== 'decision3');
      newData.goNodes = '{"decision5":{"type":0,"text":"Decision E"},"knowledgesource2":{"type":2,"text":"Knowledge Source K"},"decision4":{"type":0,"text":"Decision D"},"inputdata2":{"type":1,"text":"Input Data H"}}';
      component.updateDiagram(newData);
      const newNodeDataArray = component.goJsdiagram.model.nodeDataArray as IGoJsDiagramNode[];

      expect(newNodeDataArray[0]).toBe(originalNodeDataArray[0]);
      expect(newNodeDataArray.length).toEqual(4);
    });

    it('edits a node without changing any other nodes', () => {
      component.updateDiagram(diagramGenerator());
      
      const originalNodeDataArray = component.goJsdiagram.model.nodeDataArray as IGoJsDiagramNode[];
      const newData = diagramGenerator();
      newData.decisions[1].name = 'Decision Four New Name';
      component.updateDiagram(newData);
      const newNodeDataArray = component.goJsdiagram.model.nodeDataArray as IGoJsDiagramNode[];
      const changedNode = newNodeDataArray.find((node) => node.key === newData.decisions[1].id);

      expect(newNodeDataArray[0]).toBe(originalNodeDataArray[0]);
      expect(changedNode.text).toEqual('Decision Four New Name');
    });
  });

  describe('getNodeToSpot', () => {
    it('should retrurn Left spot for Annotation', () => {
      expect(component.getNodeToSpot(DiagramNodeType.Annotation)).toEqual(go.Spot.Left);
    });

    it('should retrurn AllSides spot for GroupItem', () => {
      expect(component.getNodeToSpot(DiagramNodeType.GroupItem)).toEqual(go.Spot.AllSides);
    });

    it('should retrurn Left spot for other nodes', () => {
      expect(component.getNodeToSpot({} as any)).toEqual(go.Spot.Default);
    });
  });
});
