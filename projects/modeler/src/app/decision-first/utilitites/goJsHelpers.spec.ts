import * as go from 'gojs';
import { Decision } from '../models/decision.model';
import {
  DiagramLinkType,
  DiagramNodeType,
  DEFAULT_ANNOTATION_DIAGRAM_NODE,
  DEFAULT_DECISION_DIAGRAM_NODE,
  DEFAULT_GROUP_ITEM_DIAGRAM_NODE,
  DEFAULT_INPUT_DATA_DIAGRAM_NODE,
  DEFAULT_KNOWLEDGE_SOURCE_DIAGRAM_NODE,
  IGoJsDiagramNode,
  IGoJsLink
} from '../models/goJsDiagram.model';
import { InputData } from '../models/inputData.model';
import { KnowledgeSource } from '../models/knowledgeSource.model';
import { ObjectClassNames } from '../models/objects.model';
import { decisionsData } from '../services/decisions.service.spec-data';
import { inputDatasData } from '../services/input-data.service.spec-data';
import { knowledgeSourcesData } from '../services/knowledge-source.service.spec-data';
import {
  checkIfFinishedEventsWithTransactions,
  convertDecisionToDiagramNode,
  convertDiagramToGoJsDiagram,
  convertGraphableToDiagramNode,
  convertInputDataToDiagramNode,
  convertKnowledgeSourceToDiagramNode,
  convertLinksToRecord,
  convertLinkDataArrayToString,
  convertNodeToGoJsDiagramNode,
  convertSketchToAnnotation,
  convertSketchToDiagramNode,
  convertSketchToGroupItem,
  getAllNodeRelations,
  getCategoryConnector,
  getDiagramGoJsLinks,
  getExtraLinks,
  getFromNodeRelations,
  getMostImportantEvents,
  getNewGraphableObject,
  getPositiveCoordinates,
  getToNodeRelations,
  hasGraphableMissingLinks,
  isDecision,
  isEventWeCareAbout,
  isGraphable,
  isSketch
} from './goJsHelpers';
import { toDecision, toInputData, toKnowledgeSource } from './mappings';

describe('goJsHelpers', () => {
  describe('convertDecisionToDiagramNode', () => {
    it('returns a IGoJsDiagramNode for a decision', () => {
      const decision = toDecision(decisionsData._embedded.decisions[0]);
      expect(convertDecisionToDiagramNode(decision)).toEqual({
        ...DEFAULT_DECISION_DIAGRAM_NODE,
        data: decision,
        isNew: false,
        key: decision.id,
        text: decision.name,
      } as any);
    });
  });

  describe('convertInputDataToDiagramNode', () => {
    it('returns a IGoJsDiagramNode for a input data', () => {
      const inputData = toInputData(inputDatasData._embedded.inputDatas[0]);
      expect(convertInputDataToDiagramNode(inputData)).toEqual({
        ...DEFAULT_INPUT_DATA_DIAGRAM_NODE,
        data: inputData,
        isNew: false,
        key: inputData.id,
        text: inputData.name,
      } as any);
    });
  });

  describe('convertKnowledgeSourceToDiagramNode', () => {
    it('returns a IGoJsDiagramNode for a knowledge source', () => {
      const knowledgeSource = toKnowledgeSource(knowledgeSourcesData._embedded.knowledgeSources[0]);
      expect(convertKnowledgeSourceToDiagramNode(knowledgeSource)).toEqual({
        ...DEFAULT_KNOWLEDGE_SOURCE_DIAGRAM_NODE,
        data: knowledgeSource,
        isNew: false,
        key: knowledgeSource.id,
        text: knowledgeSource.name,
      } as any);
    });
  });

  describe('convertSketchToAnnotation', () => {
    it('returns a IGoJsDiagramNode for a annotation', () => {
      expect(convertSketchToAnnotation('key', {type: DiagramNodeType.Annotation, text: 'text'})).toEqual({
        ...DEFAULT_ANNOTATION_DIAGRAM_NODE,
        data: null,
        isNew: false,
        key: 'key',
        text: 'text',
      } as any);
    });
  });

  describe('convertSketchToGroupItem', () => {
    it('returns a IGoJsDiagramNode for a group item', () => {
      expect(convertSketchToGroupItem('key', {type: DiagramNodeType.GroupItem, text: 'text', size: { height: 1, width: 2} as go.Size})).toEqual({
        ...DEFAULT_GROUP_ITEM_DIAGRAM_NODE,
        isNew: false,
        key: 'key',
        text: 'text',
        size: new go.Size(2, 1),
      } as any);
    });
  });

  describe('convertSketchToDiagramNode', () => {
    it('should return annotation node', () => {
      const result = convertSketchToDiagramNode('key', {type: DiagramNodeType.Annotation, text: 'text'});

      expect(result.type).toEqual(DiagramNodeType.Annotation);
    });
  });

  describe('convertSketchToDiagramNode', () => {
    it('should return group item node', () => {
      const result = convertSketchToDiagramNode('key', {type: DiagramNodeType.GroupItem, text: 'text', size: { height: 1, width: 2} as go.Size});

      expect(result.type).toEqual(DiagramNodeType.GroupItem);
    });
  });

  describe('convertGraphableToDiagramNode', () => {
    it('should return decision node', () => {
      const decision = toDecision(decisionsData._embedded.decisions[0]);
      const result = convertGraphableToDiagramNode(decision);

      expect(result.type).toEqual(DiagramNodeType.Decision);
    });
  });

  describe('convertGraphableToDiagramNode', () => {
    it('should return knowledge source node', () => {
      const knowledgeSource = toKnowledgeSource(knowledgeSourcesData._embedded.knowledgeSources[0]);
      const result = convertGraphableToDiagramNode(knowledgeSource);

      expect(result.type).toEqual(DiagramNodeType.KnowledgeSource);
    });
  });

  describe('convertGraphableToDiagramNode', () => {
    it('should return input data node', () => {
      const inputData = toInputData(inputDatasData._embedded.inputDatas[0]);
      const result = convertGraphableToDiagramNode(inputData);

      expect(result.type).toEqual(DiagramNodeType.InputData);
    });
  });

  describe('checkIfFinishedEventsWithTransactions', () => {
    it('returns true if the event is finished and it has an object', () => {
      const event = new go.ChangedEvent();
      event.change = go.ChangedEvent.Transaction;
      event.propertyName = 'CommittedTransaction';
      event.object = new go.Transaction();
      expect(checkIfFinishedEventsWithTransactions(event)).toBe(true);
    });

    it('returns false if the event is not finished, even if it has an object', () => {
      const event = new go.ChangedEvent();
      event.change = go.ChangedEvent.Transaction;
      event.propertyName = 'UnCommittedTransaction';
      event.object = new go.Transaction();
      expect(checkIfFinishedEventsWithTransactions(event)).toBe(false);
    });

    it('returns true if the event is finished but has no object', () => {
      const event = new go.ChangedEvent();
      event.change = go.ChangedEvent.Transaction;
      event.propertyName = 'CommittedTransaction';
      expect(checkIfFinishedEventsWithTransactions(event)).toBe(false);
    });
  });

  describe('isDecision', () => {
    it('returns true if the graphable is a decision', () => {
      const decision = toDecision(decisionsData._embedded.decisions[0]);
      expect(isDecision(decision)).toBe(true);
    });

    it('returns false if the graphable is not a decision', () => {
      const knowledgeSource = toKnowledgeSource(knowledgeSourcesData._embedded.knowledgeSources[0]);
      expect(isDecision(knowledgeSource)).toBe(false);
    });
  });

  describe('convertLinksToRecord', () => {
    it('converts the links to a Record<string, Link>', () => {
      const links = [{ from: 'abc', to: 'def' }, { from: 'ghi', to: 'jkl' }];

      expect(convertLinksToRecord(links)).toEqual({
        abcdef: links[0],
        ghijkl: links[1],
      });
    });
  });

  describe('isEventWeCareAbout', () => {
    it('returns true if the event.modelChange is nodeDataArray', () => {
      const event = new go.ChangedEvent();
      event.modelChange = 'nodeDataArray';
      expect(isEventWeCareAbout(event)).toBe(true);
    });

    it('returns true if the event.modelChange is linkDataArray', () => {
      const event = new go.ChangedEvent();
      event.modelChange = 'linkDataArray';
      expect(isEventWeCareAbout(event)).toBe(true);
    });

    it('returns true if the event.change is go.ChangedEvent.Property', () => {
      const event = new go.ChangedEvent();
      event.change = go.ChangedEvent.Property;
      expect(isEventWeCareAbout(event)).toBe(true);
    });
  });

  describe('getMostImportantEvent', () => {
    it('prioritizes latest event', () => {
      const changes = new go.List<go.ChangedEvent>(go.ChangedEvent);

      const add = new go.ChangedEvent();
      add.modelChange = 'nodeDataArray';
      add.change = go.ChangedEvent.Insert;

      const add2 = new go.ChangedEvent();
      add2.modelChange = 'nodeDataArray';
      add2.change = go.ChangedEvent.Insert;

      changes.addAll([add, add2]);

      expect(getMostImportantEvents(changes).get(0)).toBe(add2);
      expect(getMostImportantEvents(changes).count).toBe(1);
    });

    it('prioritizes Adding Nodes over Removing Nodes', () => {
      const changes = new go.List<go.ChangedEvent>(go.ChangedEvent);

      const add = new go.ChangedEvent();
      add.modelChange = 'nodeDataArray';
      add.change = go.ChangedEvent.Insert;

      const remove = new go.ChangedEvent();
      remove.modelChange = 'nodeDataArray';
      remove.change = go.ChangedEvent.Remove;

      changes.addAll([add, remove]);

      expect(getMostImportantEvents(changes).get(0)).toBe(add);
      expect(getMostImportantEvents(changes).count).toBe(1);
    });

    it('includes the location change on new nodes', () => {
      const changes = new go.List<go.ChangedEvent>(go.ChangedEvent);

      const add = new go.ChangedEvent();
      add.modelChange = 'nodeDataArray';
      add.change = go.ChangedEvent.Insert;

      const remove = new go.ChangedEvent();
      remove.modelChange = 'nodeDataArray';
      remove.change = go.ChangedEvent.Remove;

      const locChange = new go.ChangedEvent();
      locChange.change = go.ChangedEvent.Property;
      locChange.propertyName = 'loc';

      changes.addAll([add, remove, locChange]);

      expect(getMostImportantEvents(changes).get(0)).toBe(add);
      expect(getMostImportantEvents(changes).get(1)).toBe(locChange);
      expect(getMostImportantEvents(changes).count).toBe(2);
    });

    it('prioritizes Removing Nodes over Adding Links', () => {
      const changes = new go.List<go.ChangedEvent>(go.ChangedEvent);

      const add = new go.ChangedEvent();
      add.modelChange = 'linkDataArray';
      add.change = go.ChangedEvent.Insert;

      const remove = new go.ChangedEvent();
      remove.modelChange = 'nodeDataArray';
      remove.change = go.ChangedEvent.Remove;

      changes.addAll([add, remove]);

      expect(getMostImportantEvents(changes).get(0)).toBe(remove);
      expect(getMostImportantEvents(changes).count).toBe(1);
    });

    it('prioritizes Adding Links over Removing Links', () => {
      const changes = new go.List<go.ChangedEvent>(go.ChangedEvent);

      const add = new go.ChangedEvent();
      add.modelChange = 'linkDataArray';
      add.change = go.ChangedEvent.Insert;

      const remove = new go.ChangedEvent();
      remove.modelChange = 'linkDataArray';
      remove.change = go.ChangedEvent.Remove;

      changes.addAll([add, remove]);

      expect(getMostImportantEvents(changes).get(0)).toBe(add);
      expect(getMostImportantEvents(changes).count).toBe(1);
    });

    it('prioritizes Removing Links over changing text', () => {
      const changes = new go.List<go.ChangedEvent>(go.ChangedEvent);

      const change = new go.ChangedEvent();
      change.propertyName = 'text';
      change.change = go.ChangedEvent.Property;
      change.object = {};

      const remove = new go.ChangedEvent();
      remove.modelChange = 'linkDataArray';
      remove.change = go.ChangedEvent.Remove;

      changes.addAll([change, remove]);

      expect(getMostImportantEvents(changes).get(0)).toBe(remove);
      expect(getMostImportantEvents(changes).count).toBe(1);
    });

    it('prioritizes changing text over changing location', () => {
      const changes = new go.List<go.ChangedEvent>(go.ChangedEvent);

      const textChange = new go.ChangedEvent();
      textChange.propertyName = 'text';
      textChange.change = go.ChangedEvent.Property;
      textChange.object = {};

      const locChange = new go.ChangedEvent();
      locChange.propertyName = 'loc';
      locChange.change = go.ChangedEvent.Property;

      changes.addAll([textChange, locChange]);

      expect(getMostImportantEvents(changes).get(0)).toBe(textChange);
      expect(getMostImportantEvents(changes).count).toBe(1);
    });

    it('prioritizes changing text over changing size', () => {
      const changes = new go.List<go.ChangedEvent>(go.ChangedEvent);

      const textChange = new go.ChangedEvent();
      textChange.propertyName = 'text';
      textChange.change = go.ChangedEvent.Property;
      textChange.object = {};

      const sizeChange = new go.ChangedEvent();
      sizeChange.propertyName = 'size';
      sizeChange.change = go.ChangedEvent.Property;

      changes.addAll([textChange, sizeChange]);

      expect(getMostImportantEvents(changes).get(0)).toBe(textChange);
      expect(getMostImportantEvents(changes).count).toBe(1);
    });

    it('prioritizes changing location over other property changes', () => {
      const changes = new go.List<go.ChangedEvent>(go.ChangedEvent);

      const otherChange = new go.ChangedEvent();
      otherChange.propertyName = 'other';
      otherChange.change = go.ChangedEvent.Property;

      const locChange = new go.ChangedEvent();
      locChange.propertyName = 'loc';
      locChange.change = go.ChangedEvent.Property;

      changes.addAll([otherChange, locChange]);

      expect(getMostImportantEvents(changes).get(0)).toBe(locChange);
      expect(getMostImportantEvents(changes).count).toBe(1);
    });
  });

  describe('convertDiagramToGoJsDiagram', () => {
    it('returns an empty graph if the diagram is not defined', () => {
      expect(convertDiagramToGoJsDiagram(null)).toEqual({
        links: [],
        nodes: [],
        graphableNodesRecord: {},
      });
    });
  });

  describe('getCategoryConnector', () => {
    describe('decision category', () => {
      it('with decision', () => {
        expect(getCategoryConnector('id1', 'id2', DiagramNodeType.Decision, DiagramNodeType.Decision)).toEqual(
          DiagramLinkType.Information,
        );
      });

      it('with input data', () => {
        expect(getCategoryConnector('id1', 'id2', DiagramNodeType.Decision, DiagramNodeType.InputData)).toEqual('');
      });

      it('with knowledge source', () => {
        expect(getCategoryConnector('id1', 'id2', DiagramNodeType.Decision, DiagramNodeType.KnowledgeSource)).toEqual(
          DiagramLinkType.Authority,
        );
      });
    });

    describe('input data category', () => {
      it('with decision', () => {
        expect(getCategoryConnector('id1', 'id2', DiagramNodeType.InputData, DiagramNodeType.Decision)).toEqual(
          DiagramLinkType.Information,
        );
      });

      it('with input data', () => {
        expect(getCategoryConnector('id1', 'id2', DiagramNodeType.InputData, DiagramNodeType.InputData)).toEqual('');
      });

      it('with knowledge source', () => {
        expect(getCategoryConnector('id1', 'id2', DiagramNodeType.InputData, DiagramNodeType.KnowledgeSource)).toEqual(
          DiagramLinkType.Authority,
        );
      });
    });

    describe('knowledge source category', () => {
      it('with decision', () => {
        expect(getCategoryConnector('id1', 'id2', DiagramNodeType.KnowledgeSource, DiagramNodeType.Decision)).toEqual(
          DiagramLinkType.Authority,
        );
      });

      it('with input data', () => {
        expect(getCategoryConnector('id1', 'id2', DiagramNodeType.KnowledgeSource, DiagramNodeType.InputData)).toEqual(
          '',
        );
      });

      it('with knowledge source', () => {
        expect(
          getCategoryConnector('id1', 'id2', DiagramNodeType.KnowledgeSource, DiagramNodeType.KnowledgeSource),
        ).toEqual(DiagramLinkType.Authority);
      });
    });

    describe('annotation category', () => {
      it('with decision', () => {
        const result = getCategoryConnector(null, null, DiagramNodeType.Annotation, DiagramNodeType.Decision);

        expect(result).toEqual(DiagramLinkType.Annotation);
      });

      it('with knowledge source', () => {
        const result = getCategoryConnector(null, null, DiagramNodeType.Annotation, DiagramNodeType.KnowledgeSource);

        expect(result).toEqual(DiagramLinkType.Annotation);
      });

      it('with input data', () => {
        const result = getCategoryConnector(null, null, DiagramNodeType.Annotation, DiagramNodeType.InputData);

        expect(result).toEqual(DiagramLinkType.Annotation);
      });

      it('with group item', () => {
        const result = getCategoryConnector(null, null, DiagramNodeType.Annotation, DiagramNodeType.GroupItem);

        expect(result).toEqual(DiagramLinkType.Annotation);
      });

      it('with annotation', () => {
        const result = getCategoryConnector(null, null, DiagramNodeType.Annotation, DiagramNodeType.Annotation);

        expect(result).toEqual(DiagramLinkType.Annotation);
      });
    });
  });

  describe('getFromNodeRelations', () => {
    it('for decision', () => {
      const decision = new Decision();
      decision.requiresDecisions = [new Decision()];
      decision.requiresInputData = [new InputData(), new InputData()];
      decision.requiresKnowledgeSources = [new KnowledgeSource(), new KnowledgeSource()];
      decision.requiredByDecisions = [new Decision()];
      decision.requiredByKnowledgeSources = [new KnowledgeSource()];

      const result = [
        ...decision.requiresDecisions,
        ...decision.requiresInputData,
        ...decision.requiresKnowledgeSources,
      ];

      expect(getFromNodeRelations(decision)).toEqual(result);
    });

    it('for input data', () => {
      const inputData = new InputData();
      inputData.requiredByDecisions = [new Decision()];
      inputData.requiredByKnowledgeSources = [new KnowledgeSource()];

      const result = [];

      expect(getFromNodeRelations(inputData)).toEqual(result);
    });

    it('for knowledge source', () => {
      const knowledgeSource = new KnowledgeSource();
      knowledgeSource.requiresDecisions = [new Decision(), new Decision()];
      knowledgeSource.requiresInputData = [new InputData(), new InputData()];
      knowledgeSource.requiresKnowledgeSources = [new KnowledgeSource(), new KnowledgeSource()];
      knowledgeSource.requiredByDecisions = [new Decision()];
      knowledgeSource.requiredByKnowledgeSources = [new KnowledgeSource()];

      const result = [
        ...knowledgeSource.requiresDecisions,
        ...knowledgeSource.requiresInputData,
        ...knowledgeSource.requiresKnowledgeSources,
      ];

      expect(getFromNodeRelations(knowledgeSource)).toEqual(result);
    });
  });

  describe('getToNodeRelations', () => {
    it('for decision', () => {
      const decision = new Decision();
      decision.requiresDecisions = [new Decision()];
      decision.requiresInputData = [new InputData(), new InputData()];
      decision.requiresKnowledgeSources = [new KnowledgeSource(), new KnowledgeSource()];
      decision.requiredByDecisions = [new Decision()];
      decision.requiredByKnowledgeSources = [new KnowledgeSource()];

      const result = [...decision.requiredByDecisions, ...decision.requiredByKnowledgeSources];

      expect(getToNodeRelations(decision)).toEqual(result);
    });

    it('for input data', () => {
      const inputData = new InputData();
      inputData.requiredByDecisions = [new Decision()];
      inputData.requiredByKnowledgeSources = [new KnowledgeSource()];

      const result = [...inputData.requiredByDecisions, ...inputData.requiredByKnowledgeSources];

      expect(getToNodeRelations(inputData)).toEqual(result);
    });

    it('for knowledge source', () => {
      const knowledgeSource = new KnowledgeSource();
      knowledgeSource.requiresDecisions = [new Decision(), new Decision()];
      knowledgeSource.requiresInputData = [new InputData(), new InputData()];
      knowledgeSource.requiresKnowledgeSources = [new KnowledgeSource(), new KnowledgeSource()];
      knowledgeSource.requiredByDecisions = [new Decision()];
      knowledgeSource.requiredByKnowledgeSources = [new KnowledgeSource()];

      const result = [...knowledgeSource.requiredByDecisions, ...knowledgeSource.requiredByKnowledgeSources];

      expect(getToNodeRelations(knowledgeSource)).toEqual(result);
    });
  });

  describe('getAllNodeRelations', () => {
    it('for decision', () => {
      const decision = new Decision();
      decision.requiresDecisions = [new Decision()];
      decision.requiresInputData = [new InputData(), new InputData()];
      decision.requiresKnowledgeSources = [new KnowledgeSource(), new KnowledgeSource()];
      decision.requiredByDecisions = [new Decision()];
      decision.requiredByKnowledgeSources = [new KnowledgeSource()];

      const result = [
        ...decision.requiresDecisions,
        ...decision.requiresInputData,
        ...decision.requiresKnowledgeSources,
        ...decision.requiredByDecisions,
        ...decision.requiredByKnowledgeSources,
      ];

      expect(getAllNodeRelations(decision)).toEqual(result);
    });

    it('for input data', () => {
      const inputData = new InputData();
      inputData.requiredByDecisions = [new Decision()];
      inputData.requiredByKnowledgeSources = [new KnowledgeSource()];

      const result = [...inputData.requiredByDecisions, ...inputData.requiredByKnowledgeSources];

      expect(getAllNodeRelations(inputData)).toEqual(result);
    });

    it('for knowledge source', () => {
      const knowledgeSource = new KnowledgeSource();
      knowledgeSource.requiresDecisions = [new Decision(), new Decision()];
      knowledgeSource.requiresInputData = [new InputData(), new InputData()];
      knowledgeSource.requiresKnowledgeSources = [new KnowledgeSource(), new KnowledgeSource()];
      knowledgeSource.requiredByDecisions = [new Decision()];
      knowledgeSource.requiredByKnowledgeSources = [new KnowledgeSource()];

      const result = [
        ...knowledgeSource.requiresDecisions,
        ...knowledgeSource.requiresInputData,
        ...knowledgeSource.requiresKnowledgeSources,
        ...knowledgeSource.requiredByDecisions,
        ...knowledgeSource.requiredByKnowledgeSources,
      ];

      expect(getAllNodeRelations(knowledgeSource)).toEqual(result);
    });
  });

  describe('convertNodeToGoJsDiagramNode', () => {
    it('should return Graphable', () => {
      const result = convertNodeToGoJsDiagramNode('key', {type: DiagramNodeType.Decision, text: 'text'}, {'key': {className: ObjectClassNames.Decision}} as any, {loc: 'loc'});

      expect(result.type).toEqual(DiagramNodeType.Decision);
    });

    it('should return Sketch', () => {
      const result = convertNodeToGoJsDiagramNode('key', {type: DiagramNodeType.Annotation, text: 'text'}, {} as any, {loc: 'loc'});

      expect(result.type).toEqual(DiagramNodeType.Annotation);
    });
  });

  describe('convertDiagramToGoJsDiagram', () => {
    it('should convert to GoJs Diagram', () => {
      const goNodes = {'annotationId': {type: DiagramNodeType.Annotation, text: "text"}, 'decisionId': {type: DiagramNodeType.Decision}};
      const goLocations = {'annotationId': { loc: 'annotationLoc'}, 'decisionId': { loc: 'decisionLoc'}};
      const diagram: any = {
        inputDatas: [],
        decisions: [{id: 'decisionId', className: ObjectClassNames.Decision, name: 'name'}],
        knowledgeSources: [],
        goNodes: JSON.stringify(goNodes),
        goLocations: JSON.stringify(goLocations)
      };

      const result = convertDiagramToGoJsDiagram(diagram);
      const expected = {
        nodes: [{
          ...DEFAULT_ANNOTATION_DIAGRAM_NODE,
          isNew: false,
          key: 'annotationId',
          text: 'text',
          loc: 'annotationLoc'
        }, {
          ...DEFAULT_DECISION_DIAGRAM_NODE,
          data: { id: 'decisionId', name: 'name', className: 'Decision'} as any,
          isNew: false,
          key: 'decisionId',
          text: "name",
          loc: 'decisionLoc'
        }],
        links: [],
        graphableNodesRecord: {'decisionId': { id: 'decisionId', name: 'name', className: ObjectClassNames.Decision}} as any
      };

      expect(result).toEqual(expected);
    });

    it('should convert to GoJs Diagram when goNodes and goLocations are empty', () => {
      const diagram: any = {
        inputDatas: [],
        decisions: [{id: 'decisionId', className: ObjectClassNames.Decision, name: 'name'}],
        knowledgeSources: [],
      };

      const result = convertDiagramToGoJsDiagram(diagram);

      expect(result).toEqual({
        nodes: [],
        links: [],
        graphableNodesRecord: {'decisionId': { id: 'decisionId', name: 'name', className: ObjectClassNames.Decision}} as any
      });
    });
  });

  describe('isSketch', () => {
    it('should return true for annotation node', () => {
      const node = {type: DiagramNodeType.Annotation} as IGoJsDiagramNode;

      expect(isSketch(node)).toBeTruthy();
    });

    it('should return true for group item node', () => {
      const node = {type: DiagramNodeType.GroupItem} as IGoJsDiagramNode;

      expect(isSketch(node)).toBeTruthy();
    });
  });

  describe('isGraphable', () => {
    describe('true', () => {
      it('should return true for decision node', () => {
        const node = {data: {}, type: DiagramNodeType.Decision} as IGoJsDiagramNode;
  
        expect(isGraphable(node)).toBeTruthy();
      });
  
      it('should return true for input data node', () => {
        const node = {data: {}, type: DiagramNodeType.InputData} as IGoJsDiagramNode;
  
        expect(isGraphable(node)).toBeTruthy();
      });
  
      it('should return true for knowledge source node', () => {
        const node = {data: {}, type: DiagramNodeType.KnowledgeSource} as IGoJsDiagramNode;
  
        expect(isGraphable(node)).toBeTruthy();
      });
    });

    describe('false', () => {
      it('should return false for annotation', () => {
        const node = {type: DiagramNodeType.Annotation} as IGoJsDiagramNode;
  
        expect(isGraphable(node)).toBeFalsy();
      });

      it('should return false for group item', () => {
        const node = {type: DiagramNodeType.GroupItem} as IGoJsDiagramNode;
  
        expect(isGraphable(node)).toBeFalsy();
      });

      it('should return false for null', () => {
        const node = null;  
        expect(isGraphable(node)).toBeFalsy();
      });
    });
  });

  describe('getDiagramGoJsLinks', () => {
    it('should return array of IGoJsLink', () => {
      const goConnectors = '[{"from":"decision3","to":"decision5"},{"from":"inputdata2","to":"decision3"},{"from":"inputdata2","to":"decision5"},{"from":"decision4","to":"decision5"},{"from":"knowledgesource2","to":"decision4"},{"from":"knowledgesource2","to":"decision5"}]';
      const nodes = [{key: 'decision3', type: DiagramNodeType.Decision}, {key: 'inputdata2', type: DiagramNodeType.InputData}, {key: 'decision5', type: DiagramNodeType.Decision}, {key: 'decision4', type: DiagramNodeType.Decision}, {key: 'knowledgesource2', type: DiagramNodeType.KnowledgeSource}] as IGoJsDiagramNode[];
      const expected = [
        { from: 'decision3', to: 'decision5', category: 'Information' },
        { from: 'inputdata2', to: 'decision3', category: 'Information' },
        { from: 'inputdata2', to: 'decision5', category: 'Information' },
        { from: 'decision4', to: 'decision5', category: 'Information' },
        { from: 'knowledgesource2', to: 'decision4', category: 'Authority' },
        { from: 'knowledgesource2', to: 'decision5', category: 'Authority' }
      ];

      expect(getDiagramGoJsLinks(goConnectors, nodes)).toEqual(expected);
    });

    it('should return empty array if goConnectors is undefined', () => {
      expect(getDiagramGoJsLinks(null, null)).toEqual([]);
    });
  });

  describe('convertLinkDataArrayToString', () => {
    it('should return goJs connectors', () => {
      const linkDataArray = [
        {"from":"decision3","to":"decision5"},
      {"from":"inputdata2","to":"decision3"},{"from":"inputdata2","to":"decision5"},
      {"from":"decision4","to":"decision5"},{"from":"knowledgesource2","to":"decision4"},
      {"from":"knowledgesource2","to":"decision5"}
    ] as IGoJsLink[];

      expect(convertLinkDataArrayToString(linkDataArray)).toEqual(JSON.stringify(linkDataArray));
    });
  });

  describe('hasGraphableMissingLinks', () => {
    it('should return true', () => {
      const graphable = {
        className: ObjectClassNames.Decision,
        id: 'decision1',
        requiresDecisions: [{id: 'decision2'}],
        requiresInputData: [],
        requiresKnowledgeSources: [{id: 'knowladgeSource1'}],
        requiredByDecisions: [],
        requiredByKnowledgeSources: []
      } as any;
      const diagramLinks = [{to: 'decision1', from: 'decision3'}] as IGoJsLink[];

      expect(hasGraphableMissingLinks(diagramLinks, graphable)).toBeTruthy();
    });

    it('should return false', () => {
      const graphable = {
        className: ObjectClassNames.Decision,
        id: 'decision1',
        requiresDecisions: [{id: 'decision2'}],
        requiresInputData: [],
        requiresKnowledgeSources: [],
        requiredByDecisions: [],
        requiredByKnowledgeSources: []
      } as any;
      const diagramLinks = [{to: 'decision1', from: 'decision2'}] as IGoJsLink[];

      expect(hasGraphableMissingLinks(diagramLinks, graphable)).toBeFalsy();
    });
  });

  describe('getNewGraphableObject', () => {
    it('should return new decision', () => {
      expect(getNewGraphableObject(DiagramNodeType.Decision)).toEqual(new Decision());
    });

    it('should return new input data', () => {
      expect(getNewGraphableObject(DiagramNodeType.InputData)).toEqual(new InputData());
    });

    it('should return new knowledge source', () => {
      expect(getNewGraphableObject(DiagramNodeType.KnowledgeSource)).toEqual(new KnowledgeSource());
    });
  });

  describe('getPositiveCoordinates', () => {
    it('should return 0 for x coordinate when x is negative', () => {
      const newCoordinates = getPositiveCoordinates(new go.Point(-1, 10));
  
      expect(newCoordinates).toEqual(new go.Point(0, 10));
    });
  
    it('should return 0 for y coordinate when y is negative', () => {
      const newCoordinates = getPositiveCoordinates(new go.Point(10, -1));
  
      expect(newCoordinates).toEqual(new go.Point(10, 0));
    });
  
    it('should return the same point when all coordinates are positive', () => {
      const newCoordinates = getPositiveCoordinates(new go.Point(10, 10));
  
      expect(newCoordinates).toEqual(new go.Point(10, 10));
    });
  });

  describe('getExtraLinks', () => {
    it('should return links that does not match to relations', () => {
      const linkDataArray = [{from: 'decision1', to: 'decision3'}, { from: 'decision2', to: 'decision1'}, { from: 'decision3', to: 'decision2'}] as IGoJsLink[];
      const expected = [{from: 'decision1', to: 'decision3'}] as IGoJsLink[];
      const graphables = [
        getTestDecisionWithRequiresDecisions('decision1', [{id: 'decision2'} as Decision]),
        getTestDecisionWithRequiresDecisions('decision2', [{id: 'decision3'} as Decision]),
        getTestDecisionWithRequiresDecisions('decision3', []),
      ];

      const extraLinks = getExtraLinks(graphables, linkDataArray);

      expect(extraLinks).toEqual(expected);
    });

    it('should return empty array if there are no extra links', () => {
      const linkDataArray = [{from: 'decision1', to: 'decision3'}, { from: 'decision2', to: 'decision1'}, { from: 'decision3', to: 'decision2'}] as IGoJsLink[];
      const expected = [{from: 'decision1', to: 'decision3'}] as IGoJsLink[];
      const graphables = [
        getTestDecisionWithRequiresDecisions('decision1', [{id: 'decision2'} as Decision, {id: 'decision3'} as Decision]),
        getTestDecisionWithRequiresDecisions('decision2', [{id: 'decision3'} as Decision]),
        getTestDecisionWithRequiresDecisions('decision3', []),
      ];

      const extraLinks = getExtraLinks(graphables, linkDataArray);

      expect(extraLinks).toEqual(expected);
    });
  });
});

function getTestDecisionWithRequiresDecisions(id: string, requiresDecisions: Decision[]): Decision {
  return {
    className: ObjectClassNames.Decision,
    id,
    requiresDecisions,
    requiresInputData: [],
    requiresKnowledgeSources: [],
    requiredByDecisions: [],
    requiredByKnowledgeSources: []
  } as Decision
}


