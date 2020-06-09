import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import * as fromActions from '../../actions';

export const UPDATE_OBJECT_TAGS_MAPPING = {
  [ObjectClassNames.BusinessObjective]: {
    resourcePath: ObjectRelationsNames.BusinessObjectives,
    finishedNetworkRequestForObject: (id: string) => new fromActions.FinishedNetworkRequestForBusinessObjective(id),
    objectFailureAction: (error: Error, id: string) => new fromActions.BusinessObjectiveFailure({ error, id: id })
  },
  [ObjectClassNames.Decision]: {
    resourcePath: ObjectRelationsNames.Decisions,
    finishedNetworkRequestForObject: (id: string) => new fromActions.FinishedNetworkRequestForDecision(id),
    objectFailureAction: (error: Error, id: string) => new fromActions.DecisionFailure({ error, id: id })
  },
  [ObjectClassNames.Diagram]: {
    resourcePath: ObjectRelationsNames.Diagrams,
    finishedNetworkRequestForObject: (id: string) => new fromActions.FinishedNetworkRequestForDiagram(id),
    objectFailureAction: (error: Error, id: string) => new fromActions.DiagramFailure({ error, id: id })
  },
  [ObjectClassNames.Event]: {
    resourcePath: ObjectRelationsNames.Events,
    finishedNetworkRequestForObject: (id: string) => new fromActions.FinishedNetworkRequestForEvent(id),
    objectFailureAction: (error: Error, id: string) => new fromActions.EventFailure({ error, id: id })
  },
  [ObjectClassNames.ImplementationComponent]: {
    resourcePath: ObjectRelationsNames.ImplementationComponents,
    finishedNetworkRequestForObject: (id: string) => new fromActions.FinishedNetworkRequestForImplementationComponent(id),
    objectFailureAction: (error: Error, id: string) => new fromActions.ImplementationComponentFailure({ error, id: id })
  },
  [ObjectClassNames.InputData]: {
    resourcePath: ObjectRelationsNames.InputDatas,
    finishedNetworkRequestForObject: (id: string) => new fromActions.FinishedNetworkRequestForInputData(id),
    objectFailureAction: (error: Error, id: string) => new fromActions.InputDataFailure({ error, id: id })
  },
  [ObjectClassNames.KnowledgeSource]: {
    resourcePath: ObjectRelationsNames.KnowledgeSources,
    finishedNetworkRequestForObject: (id: string) => new fromActions.FinishedNetworkRequestForKnowledgeSource(id),
    objectFailureAction: (error: Error, id: string) => new fromActions.KnowledgeSourceFailure({ error, id: id })
  },
  [ObjectClassNames.Organization]: {
    resourcePath: ObjectRelationsNames.Organizations,
    finishedNetworkRequestForObject: (id: string) => new fromActions.FinishedNetworkRequestForOrganization(id),
    objectFailureAction: (error: Error, id: string) => new fromActions.OrganizationFailure({ error, id: id })
  },
  [ObjectClassNames.Process]: {
    resourcePath: ObjectRelationsNames.Processes,
    finishedNetworkRequestForObject: (id: string) => new fromActions.FinishedNetworkRequestForProcess(id),
    objectFailureAction: (error: Error, id: string) => new fromActions.ProcessFailure({ error, id: id })
  },
  [ObjectClassNames.System]: {
    resourcePath: ObjectRelationsNames.Systems,
    finishedNetworkRequestForObject: (id: string) => new fromActions.FinishedNetworkRequestForSystem(id),
    objectFailureAction: (error: Error, id: string) => new fromActions.SystemFailure({ error, id: id })
  },
};
