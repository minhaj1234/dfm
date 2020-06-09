import { DfmObjects, ObjectClassNames } from '../../models/objects.model';
import * as fromModelerStore from '../../store';

export const GET_OBJECT_BY_TYPE = {
  [ObjectClassNames.Diagram]: (object: DfmObjects, objectFromObjectsList: DfmObjects, objectFromAutocompleteList: DfmObjects) => object,
  [ObjectClassNames.Decision]: (object: DfmObjects, objectFromObjectsList: DfmObjects, objectFromAutocompleteList: DfmObjects) => object,
  [ObjectClassNames.InputData]: (object: DfmObjects, objectFromObjectsList: DfmObjects, objectFromAutocompleteList: DfmObjects) => objectFromObjectsList || objectFromAutocompleteList || object,
  [ObjectClassNames.KnowledgeSource]: (object: DfmObjects, objectFromObjectsList: DfmObjects, objectFromAutocompleteList: DfmObjects) => objectFromObjectsList || objectFromAutocompleteList || object,
  [ObjectClassNames.ImplementationComponent]: (object: DfmObjects, objectFromObjectsList: DfmObjects, objectFromAutocompleteList: DfmObjects) => objectFromObjectsList || objectFromAutocompleteList || object,
  [ObjectClassNames.BusinessObjective]: (object: DfmObjects, objectFromObjectsList: DfmObjects, objectFromAutocompleteList: DfmObjects) => objectFromObjectsList || objectFromAutocompleteList || object,
  [ObjectClassNames.Organization]: (object: DfmObjects, objectFromObjectsList: DfmObjects, objectFromAutocompleteList: DfmObjects) => objectFromObjectsList || objectFromAutocompleteList || object,
  [ObjectClassNames.Process]: (object: DfmObjects, objectFromObjectsList: DfmObjects, objectFromAutocompleteList: DfmObjects) => objectFromObjectsList || objectFromAutocompleteList || object,
  [ObjectClassNames.System]: (object: DfmObjects, objectFromObjectsList: DfmObjects, objectFromAutocompleteList: DfmObjects) => objectFromObjectsList || objectFromAutocompleteList || object,
  [ObjectClassNames.Event]: (object: DfmObjects, objectFromObjectsList: DfmObjects, objectFromAutocompleteList: DfmObjects) => objectFromObjectsList || objectFromAutocompleteList || object,
};

export const REMOVE_PREVIEW_OBJECT_ACTION_MAPPING = {
  [ObjectClassNames.Diagram]: (id: string) => new fromModelerStore.RemovePreviewDiagramFromLocalMemory(id),
  [ObjectClassNames.Decision]: (id: string) => new fromModelerStore.RemovePreviewDecisionFromLocalMemory(id),
  [ObjectClassNames.InputData]: (id: string) => new fromModelerStore.RemovePreviewInputDataFromLocalMemory(id),
  [ObjectClassNames.KnowledgeSource]: (id: string) => new fromModelerStore.RemovePreviewKnowledgeSourceFromLocalMemory(id),
  [ObjectClassNames.ImplementationComponent]: (id: string) => new fromModelerStore.RemovePreviewImplementationComponentFromLocalMemory(id),
  [ObjectClassNames.BusinessObjective]: (id: string) => new fromModelerStore.RemovePreviewBusinessObjectiveFromLocalMemory(id),
  [ObjectClassNames.Organization]: (id: string) => new fromModelerStore.RemovePreviewOrganizationFromLocalMemory(id),
  [ObjectClassNames.Process]: (id: string) => new fromModelerStore.RemovePreviewProcessFromLocalMemory(id),
  [ObjectClassNames.System]: (id: string) => new fromModelerStore.RemovePreviewSystemFromLocalMemory(id),
  [ObjectClassNames.Event]: (id: string) => new fromModelerStore.RemovePreviewEventFromLocalMemory(id),
};
