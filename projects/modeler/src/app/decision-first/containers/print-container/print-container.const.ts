import { ObjectTabType } from 'core/models';
import { DfmObjects } from '../../models/objects.model';
import * as fromModelerStore from '../../store';

export const GET_OBJECTS_SELECTOR_MAPPING = {
  [ObjectTabType.Diagram]: fromModelerStore.getSelectedDiagram,
  [ObjectTabType.Decision]: fromModelerStore.getSelectedDecision,
  [ObjectTabType.InputData]: fromModelerStore.getSelectedInputData,
  [ObjectTabType.KnowledgeSource]: fromModelerStore.getSelectedKnowledgeSource,
  [ObjectTabType.ImplementationComponent]: fromModelerStore.getSelectedImplementationComponent,
  [ObjectTabType.BusinessObjective]: fromModelerStore.getSelectedBusinessObjective,
  [ObjectTabType.Organization]: fromModelerStore.getSelectedOrganization,
  [ObjectTabType.Process]: fromModelerStore.getSelectedProcess,
  [ObjectTabType.System]: fromModelerStore.getSelectedSystem,
  [ObjectTabType.Event]: fromModelerStore.getSelectedEvent,
};

export interface IPrintedObjectState{
  object: DfmObjects,
  diagramImage: SVGElement,
}

export const PRINT_SECTION_PREFIX = 'print-section-';
