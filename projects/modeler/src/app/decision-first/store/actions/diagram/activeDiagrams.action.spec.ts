import { Decision } from '../../../models/decision.model';
import { IActiveDiagram } from '../../../models/diagram.model';
import { DiagramLinkType, DiagramNodeShape, DiagramNodeType, DiagramSidebarTabTypes, GoJsDiagramObject } from '../../../models/goJsDiagram.model';
import * as activeDiagramsActions from './activeDiagrams.action';

describe('Active Diagram Actions', () => {
  describe('Add Active Diagram', () => {
    it('should create an action', () => {
      const activeDiagram: IActiveDiagram = {
        id: 'activeDiagram1',
        linkType: DiagramLinkType.Information,
        selectedDiagramObjects: null,
        selectedSidebarTabType: DiagramSidebarTabTypes.Tools,
        diagramImage: null,
      }

      const payload = activeDiagram;
      const action = new activeDiagramsActions.AddActiveDiagram(payload);
      expect({ ...action }).toEqual({
        payload,
        type: activeDiagramsActions.ADD_ACTIVE_DIAGRAM,
      });
    });
  });

  describe('Set Link Type Active Diagram', () => {
    it('should set link to active diagram', () => {
      const payload = {
        id: 'testId',
        linkType: DiagramLinkType.Authority,
      };

      const action = new activeDiagramsActions.SetLinkTypeActiveDiagram(payload);
      expect({ ...action }).toEqual({
        payload,
        type: activeDiagramsActions.SET_LINK_TYPE_ACTIVE_DIAGRAM,
      });
    });
  });

  describe('Set Selected Diagram Objects Active Diagram', () => {
    it('should selected diagram objects for active diagram', () => {
      const payload = {
        id: 'testId',
        selectedDiagramObjects: [{
          data: new Decision(),
          key: 'test1',
          shape: DiagramNodeShape.Decision,
          text: 'test',
          type: DiagramNodeType.Decision,
          isNew: false,
          hasMissingNodes: false
        }] as GoJsDiagramObject[]
      } ;

      const action = new activeDiagramsActions.SetSelectedDiagramObjectsActiveDiagram(payload);
      expect({ ...action }).toEqual({
        payload,
        type: activeDiagramsActions.SET_SELECTED_DIAGRAM_OBJECTS_ACTIVE_DIAGRAM,
      });
    });
  });

  describe('Remove Active Diagram', () => {
    it('should remove diagram', () => {
      const payload = 'diagramTestId';

      const action = new activeDiagramsActions.RemoveActiveDiagram(payload);
      expect({ ...action }).toEqual({
        payload,
        type: activeDiagramsActions.REMOVE_ACTIVE_DIAGRAM,
      });
    });
  });
});
