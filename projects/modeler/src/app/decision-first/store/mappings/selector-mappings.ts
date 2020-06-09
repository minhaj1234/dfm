import { ObjectClassNames } from '../../models/objects.model';
import * as fromSelectors from '../selectors';

export const GET_OBJECT_SELECTOR_MAPPING = {
  [ObjectClassNames.Diagram]: fromSelectors.getSelectedDiagram,
  [ObjectClassNames.Decision]: fromSelectors.getSelectedDecision,
  [ObjectClassNames.InputData]: fromSelectors.getSelectedInputData,
  [ObjectClassNames.KnowledgeSource]: fromSelectors.getSelectedKnowledgeSource,
  [ObjectClassNames.ImplementationComponent]: fromSelectors.getSelectedImplementationComponent,
  [ObjectClassNames.BusinessObjective]: fromSelectors.getSelectedBusinessObjective,
  [ObjectClassNames.Organization]: fromSelectors.getSelectedOrganization,
  [ObjectClassNames.Process]: fromSelectors.getSelectedProcess,
  [ObjectClassNames.System]: fromSelectors.getSelectedSystem,
  [ObjectClassNames.Event]: fromSelectors.getSelectedEvent,
};

export const GET_OBJECT_FROM_SEARCH_OBJECT_LIST_SELECTOR_MAPPING = {
  [ObjectClassNames.Diagram]: fromSelectors.getSelectedDiagramFromDiagramsList,
  [ObjectClassNames.Decision]: fromSelectors.getSelectedDecisionFromDecisionsList,
  [ObjectClassNames.InputData]: fromSelectors.getSelectedInputDataFromInputDataList,
  [ObjectClassNames.KnowledgeSource]: fromSelectors.getSelectedKnowledgeSourceFromKnowledgeSourcesList,
  [ObjectClassNames.ImplementationComponent]: fromSelectors.getSelectedImplementationComponentFromImplementationComponentsList,
  [ObjectClassNames.BusinessObjective]: fromSelectors.getSelectedBusinessObjectiveFromBusinessObjectivesList,
  [ObjectClassNames.Organization]: fromSelectors.getSelectedOrganizationFromOrganizationsList,
  [ObjectClassNames.Process]: fromSelectors.getSelectedProcessFromProcessesList,
  [ObjectClassNames.System]: fromSelectors.getSelectedSystemFromSystemsList,
  [ObjectClassNames.Event]: fromSelectors.getSelectedEventFromEventsList,
};
