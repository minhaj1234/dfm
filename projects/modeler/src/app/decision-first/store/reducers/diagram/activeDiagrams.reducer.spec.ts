import { Decision } from '../../../models/decision.model';
import { DiagramLinkType, DiagramNodeShape, DiagramNodeType, DiagramSidebarTabTypes, IGoJsDiagramNode } from '../../../models/goJsDiagram.model';
import * as fromActiveDiagramsActions from '../../actions/diagram/activeDiagrams.action';
import * as fromActiveDiagrams from './activeDiagrams.reducer';

describe('Active Diagrams Reducer', () => {
  const diagramNode: IGoJsDiagramNode = {
    data: new Decision(),
    key: 'decision1',
    shape: DiagramNodeShape.Decision,
    type: DiagramNodeType.Decision,
    text: 'text',
    isNew: false,
    hasMissingNodes: false,
  };

  const activeDiagram = {
    id: 'activeDiagram1',
    linkType: DiagramLinkType.Information,
    selectedDiagramObjects: [diagramNode],
    selectedSidebarTabType: DiagramSidebarTabTypes.Tools,
    diagramImage: null,
  }

  describe(`${fromActiveDiagramsActions.ADD_ACTIVE_DIAGRAM} action`, () => {
    it('should correct set value', () => {
      const { initialState } = fromActiveDiagrams;
      const action = new fromActiveDiagramsActions.AddActiveDiagram(activeDiagram);

      const state = fromActiveDiagrams.reducer(initialState, action);

      expect(state.ids).toEqual([activeDiagram.id]);
      expect(state.entities.activeDiagram1.linkType).toEqual(activeDiagram.linkType);
      expect(state.entities.activeDiagram1.selectedDiagramObjects).toEqual(activeDiagram.selectedDiagramObjects);
    });
  });

  describe(`${fromActiveDiagramsActions.SET_LINK_TYPE_ACTIVE_DIAGRAM} action`, () => {
    it('should correct set value', () => {
      const { initialState } = fromActiveDiagrams;
      const addActiveDiagramAction = new fromActiveDiagramsActions.AddActiveDiagram(activeDiagram);
      let state = fromActiveDiagrams.reducer(initialState, addActiveDiagramAction);

      expect(state.entities.activeDiagram1.linkType).toEqual(activeDiagram.linkType);

      const setLinkTypeActiveDiagramAction = new fromActiveDiagramsActions.SetLinkTypeActiveDiagram(
        {
          id: 'activeDiagram1',
          linkType: DiagramLinkType.Authority,
        },
      );

      state = fromActiveDiagrams.reducer(state, setLinkTypeActiveDiagramAction);

      expect(state.entities.activeDiagram1.linkType).not.toEqual(activeDiagram.linkType);
      expect(state.entities.activeDiagram1.linkType).toEqual(DiagramLinkType.Authority);
    });
  });

  describe(`${fromActiveDiagramsActions.SET_SELECTED_DIAGRAM_OBJECTS_ACTIVE_DIAGRAM} action`, () => {
    it('should set null value', () => {
      const { initialState } = fromActiveDiagrams;
      const addActiveDiagramAction = new fromActiveDiagramsActions.AddActiveDiagram(activeDiagram);
      let state = fromActiveDiagrams.reducer(initialState, addActiveDiagramAction);

      expect(state.entities.activeDiagram1.selectedDiagramObjects).toEqual(activeDiagram.selectedDiagramObjects);

      const setSelectedDiagramObjectsActiveDiagramAction = new fromActiveDiagramsActions.SetSelectedDiagramObjectsActiveDiagram(
        {
          id: 'activeDiagram1',
          selectedDiagramObjects: null,
        },
      );

      state = fromActiveDiagrams.reducer(state, setSelectedDiagramObjectsActiveDiagramAction);

      expect(state.entities.activeDiagram1.selectedDiagramObjects).not.toEqual(activeDiagram.selectedDiagramObjects);
      expect(state.entities.activeDiagram1.selectedDiagramObjects).toEqual(null);
    });
  });

  describe(`${fromActiveDiagramsActions.REMOVE_ACTIVE_DIAGRAM} action`, () => {
    it('should remove diagram', () => {
      const { initialState } = fromActiveDiagrams;
      const addActiveDiagramAction = new fromActiveDiagramsActions.AddActiveDiagram(activeDiagram);
      let state = fromActiveDiagrams.reducer(initialState, addActiveDiagramAction);

      expect(state.entities.activeDiagram1).toBeTruthy();

      const removeActiveDiagram = new fromActiveDiagramsActions.RemoveActiveDiagram('activeDiagram1');

      state = fromActiveDiagrams.reducer(state, removeActiveDiagram);

      expect(state.entities.activeDiagram1).not.toBeTruthy();
    });
  });
});
