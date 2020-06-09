import { Action } from '@ngrx/store'
import { ResourceWithId } from 'core/models'
import { getI18nString } from 'core/utilities';
import { DfmObjects, ObjectClassNames, ObjectRelationsNames } from "../../../models/objects.model"
import { ObjectTagsUpdate } from '../../../models/tag.model'
import * as fromStore from '../../../store';

export const GRAPHABLE_OBJECTS_ACTIONS_MAPPINGS: Record<string, {
  updateActionFactory: (payload: {object: Partial<DfmObjects>, objectTagsUpdate: ObjectTagsUpdate }) => Action,
  addRelatedObjectAction: new (payload: {
    sourceObject: ResourceWithId;
    relatedObject: ResourceWithId;
    relationPath: string;
  }) => Action,
}> = {
  [ObjectClassNames.Decision]: {
    updateActionFactory: (payload: {object: Partial<DfmObjects>, objectTagsUpdate: ObjectTagsUpdate }) => new fromStore.UpdateDecision({
      decision: payload.object,
      objectTagsUpdate: payload.objectTagsUpdate
    }),
    addRelatedObjectAction: fromStore.AddRelatedObjectToDecision,
  },
  [ObjectClassNames.InputData]: {
    updateActionFactory: (payload: {object: Partial<DfmObjects>, objectTagsUpdate: ObjectTagsUpdate }) => new fromStore.UpdateInputData({
      inputData: payload.object,
      objectTagsUpdate: payload.objectTagsUpdate
    }),
    addRelatedObjectAction: fromStore.AddRelatedObjectToInputData,
  },
  [ObjectClassNames.KnowledgeSource]: {
    updateActionFactory: (payload: {object: Partial<DfmObjects>, objectTagsUpdate: ObjectTagsUpdate }) => new fromStore.UpdateKnowledgeSource({
      knowledgeSource: payload.object,
      objectTagsUpdate: payload.objectTagsUpdate
    }),
    addRelatedObjectAction: fromStore.AddRelatedObjectToKnowledgeSource,
  }
}

export const RELATION_PATHS = {
  [ObjectClassNames.Decision]: ObjectRelationsNames.RequiredByDecisions,
  [ObjectClassNames.KnowledgeSource]: ObjectRelationsNames.RequiredByKnowledgeSources,
}

export const CANVAS_ELEMENT_LOCAL_NAME = 'canvas';
export const OBJECT_IS_ALREADY_ON_THE_DIAGRAM_MESSAGE = getI18nString('objectIsAlreadyOnTheDiagram');
