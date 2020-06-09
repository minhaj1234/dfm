import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'core/services';
import { getDebugElement, triggerMouseClick, FakeMessageService } from 'core/testing';
import * as go from 'gojs';
import { DrawCommandHandler } from 'gojs/extensionsTS/DrawCommandHandler';
import { Subject } from 'rxjs';
import { Config } from '../../../../config';
import { Decision } from '../../../models/decision.model';
import { Diagram } from '../../../models/diagram.model';
import {
  DiagramLinkType,
  DiagramNodeShape,
  DiagramNodeType,
  DEFAULT_ANNOTATION_DIAGRAM_NODE,
  DEFAULT_DECISION_DIAGRAM_NODE,
  IGoJsDiagramNode,
} from '../../../models/goJsDiagram.model';
import { InputData } from '../../../models/inputData.model';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import { ObjectRelationsNames } from '../../../models/objects.model';
import { diagramsData } from '../../../services/diagrams.service.spec-data';
import * as fromStore from '../../../store';
import { IDecisionFirstState } from '../../../store/reducers';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as helpers from '../../../utilitites/goJsHelpers';
import { isSketch } from '../../../utilitites/goJsHelpers';
import { toDiagram } from '../../../utilitites/mappings';
import { GoJsDisplayDiagramComponent } from './go-js-display-diagram.component';

describe('GoJsDisplayDiagramComponent', () => {
  let component: GoJsDisplayDiagramComponent;
  let fixture: ComponentFixture<GoJsDisplayDiagramComponent>;
  let store: Store<IDecisionFirstState>;
  let dispatchModelerStore: jasmine.Spy;
  let messageService: MessageService;

  function diagramGenerator(index = 1): Diagram {
    const diagram = toDiagram({ ...diagramsData._embedded.diagrams[1] });
    return diagram;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GoJsDisplayDiagramComponent],
      imports: [
        TestStoreModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: MessageService, useClass: FakeMessageService}
      ]
    }).compileComponents();
    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    messageService = TestBed.get(MessageService);
    fixture = TestBed.createComponent(GoJsDisplayDiagramComponent);
    component = fixture.componentInstance;
    spyOn(component.goJsdiagram, 'makeSvg').and.returnValue({} as SVGAElement);
    spyOn(component, 'subscribeDiagramCurrentLinkType');
    spyOn(component, 'subscribeDiagramObjectsChangeSelection');
    spyOn(component, 'subscribeDiagramLayoutChange');
    dispatchModelerStore = spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('can set the initial data', () => {
    component.diagram = diagramGenerator();
    expect(component.goJsdiagram.model.nodeDataArray.length).toEqual(8);
    expect((component.goJsdiagram.model as go.GraphLinksModel).linkDataArray.length).toEqual(8);
  });

  describe('link validation', () => {
    beforeEach(() => {
      component.diagram = diagramGenerator();
    });

    it('should return false for unknown link category', () => {
      component.goJsdiagram.toolManager.linkingTool.archetypeLinkData.category = {} as any;

      expect(component.goJsdiagram.toolManager.linkingTool.linkValidation(null, null, null, null, null)).toBeFalsy();
    });

    describe('information link type', () => {
      beforeEach(() => {
        component.goJsdiagram.toolManager.linkingTool.archetypeLinkData.category = DiagramLinkType.Information;
      });

      describe('information link for decision node', () => {
        it('should return true for to decision node', () => {
          const fromNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.Decision).first();
          const toNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.Decision).first();

          expect(component.goJsdiagram.toolManager.linkingTool.linkValidation(fromNode, null, toNode, null, null)).toBeTruthy();
        });

        it('should return false for to input data node', () => {
          const fromNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.Decision).first();
          const toNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.InputData).first();

          expect(component.goJsdiagram.toolManager.linkingTool.linkValidation(fromNode, null, toNode, null, null)).toBeFalsy();
        });

        it('should return false for to knowledge source node', () => {
          const fromNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.Decision).first();
          const toNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.KnowledgeSource).first();

          expect(component.goJsdiagram.toolManager.linkingTool.linkValidation(fromNode, null, toNode, null, null)).toBeFalsy();
        });
      });

      describe('information link for input data node', () => {
        it('should return true for to decision node', () => {
          const fromNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.InputData).first();
          const toNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.Decision).first();

          expect(component.goJsdiagram.toolManager.linkingTool.linkValidation(fromNode, null, toNode, null, null)).toBeTruthy();
        });

        it('should return false for to input data node', () => {
          const fromNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.InputData).first();
          const toNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.InputData).first();

          expect(component.goJsdiagram.toolManager.linkingTool.linkValidation(fromNode, null, toNode, null, null)).toBeFalsy();
        });

        it('should return false for to knowledge source node', () => {
          const fromNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.InputData).first();
          const toNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.KnowledgeSource).first();

          expect(component.goJsdiagram.toolManager.linkingTool.linkValidation(fromNode, null, toNode, null, null)).toBeFalsy();
        });
      });

      describe('information link for knowledge source node', () => {
        it('should return false for to decision node', () => {
          const fromNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.KnowledgeSource).first();
          const toNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.Decision).first();

          expect(component.goJsdiagram.toolManager.linkingTool.linkValidation(fromNode, null, toNode, null, null)).toBeFalsy();
        });

        it('should return false for to input data node', () => {
          const fromNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.KnowledgeSource).first();
          const toNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.InputData).first();

          expect(component.goJsdiagram.toolManager.linkingTool.linkValidation(fromNode, null, toNode, null, null)).toBeFalsy();
        });

        it('should return false for to knowledge source node', () => {
          const fromNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.KnowledgeSource).first();
          const toNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.KnowledgeSource).first();

          expect(component.goJsdiagram.toolManager.linkingTool.linkValidation(fromNode, null, toNode, null, null)).toBeFalsy();
        });
      });
    });

    describe('authority link type', () => {
      beforeEach(() => {
        component.goJsdiagram.toolManager.linkingTool.archetypeLinkData.category = DiagramLinkType.Authority;
      });

      describe('authority link for decision node', () => {
        it('should return false for to decision node', () => {
          const fromNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.Decision).first();
          const toNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.Decision).first();

          expect(component.goJsdiagram.toolManager.linkingTool.linkValidation(fromNode, null, toNode, null, null)).toBeFalsy();
        });

        it('should return false for to input data node', () => {
          const fromNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.Decision).first();
          const toNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.InputData).first();

          expect(component.goJsdiagram.toolManager.linkingTool.linkValidation(fromNode, null, toNode, null, null)).toBeFalsy();
        });

        it('should return true for to knowledge source node', () => {
          const fromNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.Decision).first();
          const toNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.KnowledgeSource).first();

          expect(component.goJsdiagram.toolManager.linkingTool.linkValidation(fromNode, null, toNode, null, null)).toBeTruthy();
        });
      });

      describe('authority link for input data node', () => {
        it('should return false for to decision node', () => {
          const fromNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.InputData).first();
          const toNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.Decision).first();

          expect(component.goJsdiagram.toolManager.linkingTool.linkValidation(fromNode, null, toNode, null, null)).toBeFalsy();
        });

        it('should return false for to input data node', () => {
          const fromNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.InputData).first();
          const toNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.InputData).first();

          expect(component.goJsdiagram.toolManager.linkingTool.linkValidation(fromNode, null, toNode, null, null)).toBeFalsy();
        });

        it('should return true for to knowledge source node', () => {
          const fromNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.InputData).first();
          const toNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.KnowledgeSource).first();

          expect(component.goJsdiagram.toolManager.linkingTool.linkValidation(fromNode, null, toNode, null, null)).toBeTruthy();
        });
      });

      describe('authority link for knowledge source node', () => {
        it('should return true for to decision node', () => {
          const fromNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.KnowledgeSource).first();
          const toNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.Decision).first();

          expect(component.goJsdiagram.toolManager.linkingTool.linkValidation(fromNode, null, toNode, null, null)).toBeTruthy();
        });

        it('should return false for to input data node', () => {
          const fromNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.KnowledgeSource).first();
          const toNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.InputData).first();

          expect(component.goJsdiagram.toolManager.linkingTool.linkValidation(fromNode, null, toNode, null, null)).toBeFalsy();
        });

        it('should return true for to knowledge source node', () => {
          const fromNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.KnowledgeSource).first();
          const toNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.KnowledgeSource).first();

          expect(component.goJsdiagram.toolManager.linkingTool.linkValidation(fromNode, null, toNode, null, null)).toBeTruthy();
        });
      });
    });

    describe('annotation link type', () => {
      beforeEach(() => {
        component.goJsdiagram.toolManager.linkingTool.archetypeLinkData.category = DiagramLinkType.Annotation;
      });

      it('should return false for the same node', () => {
        const fromNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.Annotation).first();
        const toNode = fromNode;

        expect(component.goJsdiagram.toolManager.linkingTool.linkValidation(fromNode, null, toNode, null, null)).toBeFalsy();
      });

      it('should return true for the annotation node', () => {
        const fromNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.Annotation).first();
        const toNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.Annotation)[1];

        expect(component.goJsdiagram.toolManager.linkingTool.linkValidation(fromNode, null, toNode, null, null)).toBeTruthy();
      });

      it('should return true for the group item node', () => {
        const fromNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.Annotation).first();
        const toNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.GroupItem).first();

        expect(component.goJsdiagram.toolManager.linkingTool.linkValidation(fromNode, null, toNode, null, null)).toBeTruthy();
      });

      it('should return true for the knowledge source node', () => {
        const fromNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.Annotation).first();
        const toNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.KnowledgeSource).first();

        expect(component.goJsdiagram.toolManager.linkingTool.linkValidation(fromNode, null, toNode, null, null)).toBeTruthy();
      });

      it('should return true for the decision node', () => {
        const fromNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.Annotation).first();
        const toNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.Decision).first();

        expect(component.goJsdiagram.toolManager.linkingTool.linkValidation(fromNode, null, toNode, null, null)).toBeTruthy();
      });

      it('should return true for the input data node', () => {
        const fromNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.Annotation).first();
        const toNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.InputData).first();

        expect(component.goJsdiagram.toolManager.linkingTool.linkValidation(fromNode, null, toNode, null, null)).toBeTruthy();
      });

      it('should return false for the not annotation node', () => {
        const fromNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.InputData).first();
        const toNode = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.Annotation).first();

        expect(component.goJsdiagram.toolManager.linkingTool.linkValidation(fromNode, null, toNode, null, null)).toBeFalsy();
      });
    });
  });

  describe('listenForChanges', () => {
    function getEvent() {
      return {
        isTransactionFinished: true,
        object: {
          changes: new go.List(),
        },
      };
    }

    it('does nothing if it is an outside event', () => {
      const event = getEvent();
      const changeEvent = new go.ChangedEvent();
      changeEvent.modelChange = 'nodeDataArray';
      event.object.changes.add(changeEvent);
      spyOn(component, 'forTesting');
      component.diagram = diagramGenerator();
      component.outsideUpdate = true;
      component.listenForChanges(event as any);

      expect(component.forTesting).not.toHaveBeenCalled();
    });

    it('does nothing if checkIfFinishedEventsWithTransactions is false', () => {
      const event = getEvent();
      event.isTransactionFinished = false;
      const changeEvent = new go.ChangedEvent();
      changeEvent.modelChange = 'nodeDataArray';
      event.object.changes.add(changeEvent);
      spyOn(helpers, 'checkIfFinishedEventsWithTransactions').and.returnValue(false);
      spyOn(component, 'forTesting');
      component.diagram = diagramGenerator();
      component.outsideUpdate = false;
      component.listenForChanges(event as any);

      expect(component.forTesting).not.toHaveBeenCalled();
    });

    it('does nothing if no diagram is set', () => {
      const event = getEvent();
      const changeEvent = new go.ChangedEvent();
      changeEvent.modelChange = 'nodeDataArray';
      event.object.changes.add(changeEvent);
      spyOn(component, 'forTesting');
      component.outsideUpdate = false;
      component.listenForChanges(event as any);

      expect(component.forTesting).not.toHaveBeenCalled();
    });

    describe('Delete selection', () => {
      beforeEach(() => {
        const diagram = diagramGenerator();
        component.diagram = diagram;
      });

      it('should dispatch RemoveGraphableObjectsFromDiagram with single graphable if only one graphable is selected', () => {
        const node = component.goJsdiagram.findNodeForKey(component.diagram.decisions[0].id);
        component.goJsdiagram.select(node);

        component.goJsdiagram.commandHandler.deleteSelection();

        expect(store.dispatch).toHaveBeenCalledWith(
          new fromStore.RemoveGraphableObjectsFromDiagram({
            diagram: component.diagram,
            deletedGraphables: [{
              graphable: component.diagram.decisions[0],
              relationPath: ObjectRelationsNames.Decisions,
            }]
          })
        );
      });

      it('should dispatch RemoveGraphableObjectsFromDiagram with multiple graphables if multiple graphables are selected', () => {
        component.goJsdiagram.selectCollection([
          component.goJsdiagram.findNodeForKey(component.diagram.decisions[0].id),
          component.goJsdiagram.findNodeForKey(component.diagram.knowledgeSources[0].id),
        ]);

        component.goJsdiagram.commandHandler.deleteSelection();

        expect(store.dispatch).toHaveBeenCalledWith(
          new fromStore.RemoveGraphableObjectsFromDiagram({
            diagram: component.diagram,
            deletedGraphables: [
              {
                graphable: component.diagram.decisions[0],
                relationPath: ObjectRelationsNames.Decisions,
              },
              {
                graphable: component.diagram.knowledgeSources[0],
                relationPath: ObjectRelationsNames.KnowledgeSources,
              },
            ]
          })
        );
      });

      it('should dispatch RemoveGraphableObjectsFromDiagram only with graphables', () => {
        const graphable = component.goJsdiagram.findNodeForKey(component.diagram.decisions[0].id);
        component.goJsdiagram.selectCollection([
          graphable, 
          ...getNodeLinks(graphable), 
          ...getDiagramSketchNodes(component.goJsdiagram)
        ]);

        component.goJsdiagram.commandHandler.deleteSelection();

        expect(store.dispatch).toHaveBeenCalledWith(
          new fromStore.RemoveGraphableObjectsFromDiagram({
            diagram: component.diagram,
            deletedGraphables: [
              {
                graphable: component.diagram.decisions[0],
                relationPath: ObjectRelationsNames.Decisions,
              },
            ]
          })
        );
      });
    });

    describe('nodeDataArray', () => {
      beforeEach(() => {
        component.outsideUpdate = false;
      });

      it('should adding a new decision', () => {
        const node: IGoJsDiagramNode = {
          data: new Decision(),
          isNew: false,
          key: 'decision1',
          shape: DiagramNodeShape.Decision,
          text: 'Decision',
          type: DiagramNodeType.Decision,
          hasMissingNodes: false,
        };

        const diagram = diagramGenerator();
        component.diagram = diagram;
        const event = getEvent();
        const nodeDataArrayChange = new go.ChangedEvent();
        nodeDataArrayChange.change = go.ChangedEvent.Transaction;
        nodeDataArrayChange.modelChange = 'nodeDataArray';
        nodeDataArrayChange.change = go.ChangedEvent.Insert;
        nodeDataArrayChange.newValue = node;
        event.object.changes.add(nodeDataArrayChange);
        component.listenForChanges(event as any);

        expect(store.dispatch).toHaveBeenCalledWith(
          new fromStore.AddGraphableObjectToDiagram({
            sourceObject: diagram,
            relatedObject: node.data,
            relationPath: ObjectRelationsNames.Decisions,
            isNew: false,
          })
        );
      });

      it('should adding a new input data', () => {
        const node: IGoJsDiagramNode = {
          data: new InputData(),
          isNew: false,
          key: 'inputData1',
          shape: DiagramNodeShape.InputData,
          text: 'Input Data',
          type: DiagramNodeType.InputData,
          hasMissingNodes: false,
        };

        const diagram = diagramGenerator();
        component.diagram = diagram;
        const event = getEvent();
        const nodeDataArrayChange = new go.ChangedEvent();
        nodeDataArrayChange.change = go.ChangedEvent.Transaction;
        nodeDataArrayChange.modelChange = 'nodeDataArray';
        nodeDataArrayChange.change = go.ChangedEvent.Insert;
        nodeDataArrayChange.newValue = node;
        event.object.changes.add(nodeDataArrayChange);
        component.listenForChanges(event as any);

        expect(store.dispatch).toHaveBeenCalledWith(
          new fromStore.AddGraphableObjectToDiagram({
            sourceObject: diagram,
            relatedObject: node.data,
            relationPath: ObjectRelationsNames.InputDatas,
            isNew: false,
          })
        );
      });

      it('should adding a new knowledge source', () => {
        const node: IGoJsDiagramNode = {
          data: new KnowledgeSource(),
          isNew: false,
          key: 'inputData1',
          shape: DiagramNodeShape.KnowledgeSource,
          text: 'Knowledge Source',
          type: DiagramNodeType.KnowledgeSource,
          hasMissingNodes: false,
        };

        const diagram = diagramGenerator();
        component.diagram = diagram;
        const event = getEvent();
        const nodeDataArrayChange = new go.ChangedEvent();
        nodeDataArrayChange.change = go.ChangedEvent.Transaction;
        nodeDataArrayChange.modelChange = 'nodeDataArray';
        nodeDataArrayChange.change = go.ChangedEvent.Insert;
        nodeDataArrayChange.newValue = node;
        event.object.changes.add(nodeDataArrayChange);
        component.listenForChanges(event as any);

        expect(store.dispatch).toHaveBeenCalledWith(
          new fromStore.AddGraphableObjectToDiagram({
            sourceObject: diagram,
            relatedObject: node.data,
            relationPath: ObjectRelationsNames.KnowledgeSources,
            isNew: false,
          })
        );
      });

      it('should add node with isNew flag', () => {
        const node: IGoJsDiagramNode = {
          ...DEFAULT_DECISION_DIAGRAM_NODE,
          key: 'test-key',
          data: new Decision(),
          isNew: true
        };

        const diagram = diagramGenerator();
        component.diagram = diagram;
        const event = getEvent();
        const nodeDataArrayChange = new go.ChangedEvent();
        nodeDataArrayChange.change = go.ChangedEvent.Transaction;
        nodeDataArrayChange.modelChange = 'nodeDataArray';
        nodeDataArrayChange.change = go.ChangedEvent.Insert;
        nodeDataArrayChange.newValue = node;
        event.object.changes.add(nodeDataArrayChange);
        component.listenForChanges(event as any);

        expect(node.data._links.self.href).toEqual(`${Config.rootUri}decisions/test-key`);

        expect(store.dispatch).toHaveBeenCalledWith(
          new fromStore.AddGraphableObjectToDiagram({
            sourceObject: diagram,
            relatedObject: node.data,
            relationPath: ObjectRelationsNames.Decisions,
            isNew: true,
          })
        );
      });

      it('should not dispatch AddGraphableObjectToDiagram action if node is not graphable', () => {
        const node: IGoJsDiagramNode = {
          ...DEFAULT_ANNOTATION_DIAGRAM_NODE,
          key: 'annotation-id',
          isNew: true
        };        
        const diagram = diagramGenerator();
        component.diagram = diagram;
        const event = getEvent();
        const nodeDataArrayChange = new go.ChangedEvent();
        nodeDataArrayChange.change = go.ChangedEvent.Transaction;
        nodeDataArrayChange.modelChange = 'nodeDataArray';
        nodeDataArrayChange.change = go.ChangedEvent.Insert;
        nodeDataArrayChange.newValue = node;
        event.object.changes.add(nodeDataArrayChange);
        component.listenForChanges(event as any);

        expect(store.dispatch).toHaveBeenCalledTimes(2);
        expect(store.dispatch).toHaveBeenCalledWith(
          new fromStore.SetDiagramImageActiveDiagram({
            id: diagram.id,
            diagramImage: {} as SVGAElement,
          }),
        );
        expect(store.dispatch).toHaveBeenCalledWith(
          new fromStore.SetSelectedDiagramObjectsActiveDiagram({
            id: diagram.id,
            selectedDiagramObjects: [],
          }),
        );
      });

      it('does nothing if event is not an Insert or Remove', () => {
        const node: IGoJsDiagramNode = {
          data: new KnowledgeSource(),
          isNew: false,
          key: 'knowledgeSource1',
          shape: 'RoundedRectangle',
          text: 'Decision One',
          type: DiagramNodeType.KnowledgeSource,
          hasMissingNodes: false,
        };
        const diagram = diagramGenerator();
        component.diagram = diagram;
        const event = getEvent();
        const nodeDataArrayChange = new go.ChangedEvent();
        nodeDataArrayChange.change = go.ChangedEvent.Transaction;
        nodeDataArrayChange.modelChange = 'nodeDataArray';
        nodeDataArrayChange.change = go.ChangedEvent.Property;
        nodeDataArrayChange.oldValue = node;
        event.object.changes.add(nodeDataArrayChange);
        component.listenForChanges(event as any);

        expect(store.dispatch).toHaveBeenCalledTimes(2);
        expect(store.dispatch).toHaveBeenCalledWith(
          new fromStore.SetSelectedDiagramObjectsActiveDiagram({
            id: diagram.id,
            selectedDiagramObjects: [],
          }),
        );
        expect(store.dispatch).toHaveBeenCalledWith(
          new fromStore.SetDiagramImageActiveDiagram({
            id: diagram.id,
            diagramImage: {} as SVGAElement,
          }),
        );
      });
    });

    describe('Property Changes', () => {
      it('updates the decision when a name changes', () => {
        const diagram = diagramGenerator();
        component.diagram = diagram;
        component.outsideUpdate = false;
        const event = getEvent();
        const decisionNameChange = new go.ChangedEvent();

        decisionNameChange.change = go.ChangedEvent.Property;
        decisionNameChange.propertyName = 'text';
        decisionNameChange.object = { key: diagram.decisions[0].id, data: diagram.decisions[0] };
        decisionNameChange.newValue = 'New Name';
        event.object.changes.add(decisionNameChange);
        component.listenForChanges(event as any);

        expect(store.dispatch).toHaveBeenCalledWith(
          new fromStore.UpdateDecision({
            decision: {
              _links: diagram.decisions[0]._links,
              id: diagram.decisions[0].id,
              name: 'New Name',
            },
            objectTagsUpdate: { 
              tags: diagram.decisions[0].tags,
              description: diagram.decisions[0].description, 
              name: 'New Name' 
            }
          }),
        );
      });

      it('updates the input data when a name changes', () => {
        const diagram = diagramGenerator();
        component.diagram = diagram;
        component.outsideUpdate = false;
        const event = getEvent();
        const decisionNameChange = new go.ChangedEvent();

        decisionNameChange.change = go.ChangedEvent.Property;
        decisionNameChange.propertyName = 'text';
        decisionNameChange.object = { key: diagram.inputDatas[0].id, data: diagram.inputDatas[0] };
        decisionNameChange.newValue = 'New Name';
        event.object.changes.add(decisionNameChange);
        component.listenForChanges(event as any);

        expect(store.dispatch).toHaveBeenCalledWith(
          new fromStore.UpdateInputData({
            inputData: {
              _links: diagram.inputDatas[0]._links,
              id: diagram.inputDatas[0].id,
              name: 'New Name',
            },
            objectTagsUpdate: { 
              tags: diagram.inputDatas[0].tags,
              description: diagram.inputDatas[0].description, 
              name: 'New Name' 
            }
          }),
        );
      });

      it('updates the knowledge source when a name changes', () => {
        const diagram = diagramGenerator();
        component.diagram = diagram;
        component.outsideUpdate = false;
        const event = getEvent();
        const knowledgeSourceNameChange = new go.ChangedEvent();

        knowledgeSourceNameChange.change = go.ChangedEvent.Property;
        knowledgeSourceNameChange.propertyName = 'text';
        knowledgeSourceNameChange.object = { key: diagram.knowledgeSources[0].id, data: diagram.knowledgeSources[0] };
        knowledgeSourceNameChange.newValue = 'New Name';
        event.object.changes.add(knowledgeSourceNameChange);
        component.listenForChanges(event as any);

        expect(store.dispatch).toHaveBeenCalledWith(
          new fromStore.UpdateKnowledgeSource({
            knowledgeSource: {
              _links: diagram.knowledgeSources[0]._links,
              id: diagram.knowledgeSources[0].id,
              name: 'New Name',
            },
            objectTagsUpdate: { 
              tags: diagram.knowledgeSources[0].tags,
              description: diagram.knowledgeSources[0].description, 
              name: 'New Name' 
            }
          }),
        );
      });
    });
  });

  describe('context menu', () => {
    beforeEach(() => {
      component.diagram = diagramGenerator();
    });

    describe('graphable tab item', () => {
      it('should show graphable tab context menu item', () => {
        component.goJsdiagram.select(component.goJsdiagram.nodes.first());
        component.goJsdiagram.select(component.goJsdiagram.nodes.first());
        component.goJsdiagram.commandHandler.showContextMenu();
        expect(getDebugElement(fixture, '#graphableTabContextMenuItem').nativeElement.style.display).toBe('block');
      });

      it('should hide graphable tab context menu item', () => {
        component.goJsdiagram.selectCollection(component.goJsdiagram.nodes);
        component.goJsdiagram.commandHandler.showContextMenu();
        expect(getDebugElement(fixture, '#graphableTabContextMenuItem').nativeElement.style.display).toBe('none');
      });


      it('should open graphable tab', () => {
        spyOn(component.goJsdiagram.currentTool, 'stopTool');

        const node = component.goJsdiagram.nodes.first();

        component.goJsdiagram.select(node);
        triggerMouseClick(fixture, '#graphableTabContextMenuItem');

        expect(store.dispatch).toHaveBeenCalledWith(
          new fromStore.AddTab({
            id: node.data.data.id,
            type: node.data.data.className,
          })
        );
        expect(component.goJsdiagram.currentTool.stopTool).toHaveBeenCalled();
      });
    });

    describe('align context menu item', () => {
      it('should show align context menu item', () => {
        component.goJsdiagram.selectCollection(component.goJsdiagram.nodes);
        component.goJsdiagram.commandHandler.showContextMenu();
        expect(getDebugElement(fixture, '#alignContextMenuItem').nativeElement.style.display).toBe('block');
      });

      it('should hide align context menu item', () => {
        component.goJsdiagram.select(component.goJsdiagram.nodes.first());
        component.goJsdiagram.commandHandler.showContextMenu();
        expect(getDebugElement(fixture, '#alignContextMenuItem').nativeElement.style.display).toBe('none');
      });

      it('should call align left context menu item', () => {
        spyOn(component.goJsdiagram.commandHandler as DrawCommandHandler, 'alignLeft');
        spyOn(component.goJsdiagram.currentTool, 'stopTool');

        component.goJsdiagram.selectCollection(component.goJsdiagram.nodes);
        triggerMouseClick(fixture, '#alignLeftContextMenuItem');

        expect((component.goJsdiagram.commandHandler as DrawCommandHandler).alignLeft).toHaveBeenCalled();
        expect(component.goJsdiagram.currentTool.stopTool).toHaveBeenCalled();
      });

      it('should call align right context menu item', () => {
        spyOn(component.goJsdiagram.commandHandler as DrawCommandHandler, 'alignRight');
        spyOn(component.goJsdiagram.currentTool, 'stopTool');

        component.goJsdiagram.selectCollection(component.goJsdiagram.nodes);
        triggerMouseClick(fixture, '#alignRightContextMenuItem');

        expect((component.goJsdiagram.commandHandler as DrawCommandHandler).alignRight).toHaveBeenCalled();
        expect(component.goJsdiagram.currentTool.stopTool).toHaveBeenCalled();
      });

      it('should call align top context menu item', () => {
        spyOn(component.goJsdiagram.commandHandler as DrawCommandHandler, 'alignTop');
        spyOn(component.goJsdiagram.currentTool, 'stopTool');

        component.goJsdiagram.selectCollection(component.goJsdiagram.nodes);
        triggerMouseClick(fixture, '#alignTopContextMenuItem');

        expect((component.goJsdiagram.commandHandler as DrawCommandHandler).alignTop).toHaveBeenCalled();
        expect(component.goJsdiagram.currentTool.stopTool).toHaveBeenCalled();
      });

      it('should call align bottom context menu item', () => {
        spyOn(component.goJsdiagram.commandHandler as DrawCommandHandler, 'alignBottom');
        spyOn(component.goJsdiagram.currentTool, 'stopTool');

        component.goJsdiagram.selectCollection(component.goJsdiagram.nodes);
        triggerMouseClick(fixture, '#alignBottomContextMenuItem');

        expect((component.goJsdiagram.commandHandler as DrawCommandHandler).alignBottom).toHaveBeenCalled();
        expect(component.goJsdiagram.currentTool.stopTool).toHaveBeenCalled();
      });
    });

    describe('delete context menu item', () => {
      it('should show delete context menu item for one element', () => {
        component.goJsdiagram.select(component.goJsdiagram.nodes.first());
        component.goJsdiagram.commandHandler.showContextMenu();
        expect(getDebugElement(fixture, '#deleteContextMenuItem').nativeElement.style.display).toBe('block');
      });

      it('should hide delete context menu item for collection', () => {
        component.goJsdiagram.selectCollection(component.goJsdiagram.nodes);
        component.goJsdiagram.commandHandler.showContextMenu();
        expect(getDebugElement(fixture, '#deleteContextMenuItem').nativeElement.style.display).toBe('block');
      });

      it('should delete selection', () => {
        spyOn(component.goJsdiagram.commandHandler, 'deleteSelection');
        spyOn(component.goJsdiagram.currentTool, 'stopTool');

        component.goJsdiagram.selectCollection(component.goJsdiagram.nodes);
        triggerMouseClick(fixture, '#deleteContextMenuItem');

        expect(component.goJsdiagram.commandHandler.deleteSelection).toHaveBeenCalled();
        expect(component.goJsdiagram.currentTool.stopTool).toHaveBeenCalled();
      });
    });

    describe('implementation component context menu items', () => {
      it('should show implementation component context menu items', () => {
        const node = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.Decision &&
          x.data.data.implementationComponents.length === 1).first();

        component.goJsdiagram.select(node);
        component.goJsdiagram.commandHandler.showContextMenu();

        expect(getDebugElement(fixture, `#implementationComponentContextMenuItem`)).toBeTruthy();
      });

      it('should open implementation component url', () => {
        spyOn(window, 'open');

        const node = component.goJsdiagram.nodes.filter(x => x.data.type === DiagramNodeType.Decision &&
          x.data.data.implementationComponents.length === 1).first();

        const implementationComponent = node.data.data.implementationComponents[0];

        component.goJsdiagram.select(node);
        component.goJsdiagram.commandHandler.showContextMenu();

        triggerMouseClick(fixture, `#implementationComponentContextMenuItem`);

        expect(window.open).toHaveBeenCalledWith(implementationComponent.url, '_blank');
      });
    });

    it('should hide', () => {
      const contextMenu = getDebugElement(fixture, '#contextMenu');
      component.goJsdiagram.selectCollection(component.goJsdiagram.nodes);

      component.goJsdiagram.commandHandler.showContextMenu();
      expect(contextMenu.nativeElement.style.display).toBe('block');

      component.goJsdiagram.currentTool.stopTool();
      expect(contextMenu.nativeElement.style.display).toBe('none');
    });
  });

  describe('diagramObjectsResetFocus', () => {
    it('should clear selection', () => {
      spyOn(component.goJsdiagram, 'clearSelection');

      component.diagramObjectsResetFocus();

      expect(component.goJsdiagram.clearSelection).toHaveBeenCalled();
    });
  });

  describe('subscribeDiagramLayoutChange', () => {
    it('chould update goJsDiagram', () => {
      (component.subscribeDiagramLayoutChange as jasmine.Spy).and.callThrough();
      spyOn(component.goJsdiagram, 'requestUpdate');
      component.resizingDiagram = new Subject<any>();
      component.subscribeDiagramLayoutChange();

      component.resizingDiagram.next();

      expect(component.goJsdiagram.requestUpdate).toHaveBeenCalled();
    });
  });

  describe('subscribeDiagramObjectsChangeSelection', () => {
    beforeEach(() => {
      spyOn(component.goJsdiagram, 'clearSelection');
      (TestBed.get(Store).dispatch as jasmine.Spy).and.callThrough();
      const activeDiagram = {
        id: 'diagram2',
        linkType: DiagramLinkType.Information,
        selectedDiagramObjects: [],
        selectedSidebarTabType: null,
        diagramImage: null,
      }

      store.dispatch(new fromStore.LoadDiagramSuccess({id: 'diagram2'} as Diagram));
      store.dispatch(new fromStore.AddActiveDiagram(activeDiagram));
      component.diagram = diagramGenerator();
    });

    it('should call clearSelection of goJsdiagram when there are no selected objects', () => {
      (component.subscribeDiagramObjectsChangeSelection as jasmine.Spy).and.callThrough();

      component.subscribeDiagramObjectsChangeSelection();

      expect(component.goJsdiagram.clearSelection).toHaveBeenCalled();
    });

    it('should not call clearSelection of goJsdiagram when there is selected object', () => {
      store.dispatch(new fromStore.SetSelectedDiagramObjectsActiveDiagram({ id: 'diagram2', selectedDiagramObjects: [{} as any] }));

      component.subscribeDiagramObjectsChangeSelection();

      expect(component.goJsdiagram.clearSelection).not.toHaveBeenCalled();
    });
  });

  describe('checkIfAndHandlePropertyChanges', () => {
    it('should call dispatch with goNodes and goLocations when property name is "loc"', () => {
      component.diagram = diagramGenerator();

      component.checkIfAndHandlePropertyChanges({ change: go.ChangedEvent.Property, propertyName: 'loc', object: {type: DiagramNodeType.GroupItem} } as any);

      expect(store.dispatch).toHaveBeenCalledWith(
        new fromStore.UpdateGoJson({
          diagram: diagramGenerator(),
          goNodes: JSON.stringify(component.getGoNodes()),
          goLocations: JSON.stringify(component.getGoLocations())
        })
      );
    });

    it('should call dispatch with goNodes when property name is "text"', () => {
      component.diagram = diagramGenerator();

      component.checkIfAndHandlePropertyChanges({ change: go.ChangedEvent.Property, propertyName: 'text', object: {type: DiagramNodeType.GroupItem}} as any);

      expect(store.dispatch).toHaveBeenCalledWith(
        new fromStore.UpdateGoJson({
          diagram: diagramGenerator(),
          goNodes: JSON.stringify(component.getGoNodes())
        })
      );
    });

    it('should call dispatch with goNodes when property name is "size"', () => {
      component.diagram = diagramGenerator();
      component.checkIfAndHandlePropertyChanges({
        change: go.ChangedEvent.Property,
        propertyName: 'size',
        object: {
          type: DiagramNodeType.GroupItem
        }
      } as any);

      expect(store.dispatch).toHaveBeenCalledWith(
        new fromStore.UpdateGoJson({
          diagram: diagramGenerator(),
          goNodes: JSON.stringify(component.getGoNodes())
        })
      );
    });
  });

  describe('updateGoNodes', () => {
    it('should call dispatch with goNodes', () => {
      component.diagram = diagramGenerator();

      component.updateGoNodes();

      expect(store.dispatch).toHaveBeenCalledWith(
        new fromStore.UpdateGoJson({
          diagram: diagramGenerator(),
          goNodes: JSON.stringify(component.getGoNodes())
        })
      );
    });
  });

  describe('updateGoLocationsWithGoNodes', () => {
    it('should call dispatchUpdateGoJson with goNodes and goLocations', () => {
      component.diagram = diagramGenerator();

      component.updateGoLocationsWithGoNodes();

      expect(store.dispatch).toHaveBeenCalledWith(
        new fromStore.UpdateGoJson({
          diagram: diagramGenerator(),
          goNodes: JSON.stringify(component.getGoNodes()),
          goLocations: JSON.stringify(component.getGoLocations())
        })
      );
    });
  });

  describe('subscribeDiagramCurrentLinkType', () => {
    beforeEach(() => {
      (TestBed.get(Store).dispatch as jasmine.Spy).and.callThrough();
      (component.subscribeDiagramCurrentLinkType as jasmine.Spy).and.callThrough();
      const activeDiagram = {
        id: 'diagram2',
        linkType: null,
        selectedDiagramObjects: [],
        selectedSidebarTabType: null,
        diagramImage: null,
      }

      store.dispatch(new fromStore.LoadDiagramSuccess({id: 'diagram2'} as Diagram));
      store.dispatch(new fromStore.AddActiveDiagram(activeDiagram));
      component.diagram = diagramGenerator();
    });

    it('should set goJsdiagram allowLink to true when link type is defined', () => {
      store.dispatch(new fromStore.SetLinkTypeActiveDiagram({ id: 'diagram2', linkType: DiagramLinkType.Information }));

      expect(component.goJsdiagram.allowLink).toBeTruthy();
    });

    it('should set goJsdiagram allowLink to false when link type is undefined', () => {
      store.dispatch(new fromStore.SetLinkTypeActiveDiagram({ id: 'diagram2', linkType: null }));

      expect(component.goJsdiagram.allowLink).toBeFalsy();
    });
  });

  describe('handleAddRelationObject', () => {
    it('should dispatch AddRelatedObjectToDecision if there is no relations', () => {
      const sourceObject = getTestDecision('decision1');
      const relatedObject = getTestDecision('decision2');

      component.handleAddRelationObject(sourceObject, relatedObject);

      expect(store.dispatch).toHaveBeenCalledWith(
        new fromStore.AddRelatedObjectToDecision({
          sourceObject,
          relatedObject,
          relationPath: ObjectRelationsNames.RequiredByDecisions,
        })
      );
    });

    it('should dispatch AddRelatedObjectToDecision if there is no relations', () => {
      const sourceObject = getTestDecision('decision1');
      const relatedObject = getTestDecision('decision2');
      sourceObject.requiredByDecisions = [relatedObject];

      component.handleAddRelationObject(sourceObject, relatedObject);

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should display error if there is circular dependency', () => {
      spyOn(messageService, 'showWarning');
      const sourceObject = getTestDecision('decision1');
      const relatedObject = getTestDecision('decision2');
      sourceObject.requiresDecisions = [relatedObject];

      component.handleAddRelationObject(sourceObject, relatedObject);

      expect(messageService.showWarning).toHaveBeenCalledWith(['resources.circularDependenciesAreNotAllowed'], 'resources.diagrams');
    });
  });

  describe('onLinkDrawn', () => {
    beforeEach(() => {
      spyOn(component, 'handleAddRelationObject');
      component.diagram = diagramGenerator();
    });

    describe('when link category is Annotation', () => {
      it('should not call handleAddRelationObject', () => {
        const event = getTestLinkDrawnEvent(
          component.diagram.decisions[0].id,
          component.diagram.decisions[1].id,
          DiagramLinkType.Annotation,
        );

        component.onLinkDrawn(event);

        expect(component.handleAddRelationObject).not.toHaveBeenCalled()
      });
    });

    describe('when link category is not Annotation', () => {
      it('should call handleAddRelationObject', () => {
        const event = getTestLinkDrawnEvent(
          component.diagram.decisions[0].id,
          component.diagram.decisions[1].id,
          DiagramLinkType.Authority,
        );

        component.onLinkDrawn(event);

        expect(component.handleAddRelationObject).toHaveBeenCalledWith(
          component.goJsdiagram.findNodeForKey(component.diagram.decisions[1].id).data.data,
          component.goJsdiagram.findNodeForKey(component.diagram.decisions[0].id).data.data,
        )
      });
    });
  });
});

function getNodeLinks(node: go.Node): go.Link[] {
   return [
    ...getLinksFromIterator(node.findLinksOutOf()), 
    ...getLinksFromIterator(node.findLinksInto())
  ];
}

function getLinksFromIterator(iterator: go.Iterator<go.Link>): go.Link[] {
  const links: go.Link[] = [];
  iterator.each((link) => links.push(link));

  return links;
}

function getDiagramSketchNodes(diagram: go.Diagram): go.Node[] {
  return diagram.model.nodeDataArray
    .filter((node: IGoJsDiagramNode) => isSketch(node))
    .map((node: IGoJsDiagramNode) => diagram.findNodeForKey(node.key))
}

function getTestDecision(id: string): Decision {
  const decision = new Decision();
  decision.id = id;
  decision.requiresDecisions = [];
  decision.requiresInputData = [];
  decision.requiresKnowledgeSources = [];
  decision.requiredByDecisions = [];
  decision.requiredByKnowledgeSources = [];

  return decision;
}

function getTestLinkDrawnEvent(to: string, from: string, category: DiagramLinkType) {
  return {
    subject: {
      data: { category, to, from }
    }
  }
}