import { Decision } from '../../../models/decision.model';
import { InputData } from '../../../models/inputData.model';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import { ObjectClassNames } from '../../../models/objects.model';
import * as fromStore from '../../../store';

export const UPDATE_GRAPHABLE_MAPPING = {
  [ObjectClassNames.Decision]: (decision: Decision) => new fromStore.UpdateDecision({decision}),
  [ObjectClassNames.InputData]: (inputData: InputData) => new fromStore.UpdateInputData({inputData}),
  [ObjectClassNames.KnowledgeSource]: (knowledgeSource: KnowledgeSource) => new fromStore.UpdateKnowledgeSource({knowledgeSource}),
};