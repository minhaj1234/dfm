import { createSelector } from '@ngrx/store';
import { Decision } from '../../../models/decision.model';
import { Diagram } from '../../../models/diagram.model';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import * as fromFeature from '../../reducers';
import * as fromDecisions from '../../reducers/decision/decisions.reducer';

export const getDecisionsState = createSelector(
  fromFeature.getDecisionFirstState,
  (state: fromFeature.IDecisionFirstState) => state.decisions,
);

export const getDecisionNetworkActive = createSelector(
  getDecisionsState,
  fromDecisions.selectAnyNetworkActive,
);

export const getSelectedDecision = (id: string) =>
  createSelector(
    getDecisionsState,
    (decisionState): Decision => decisionState.entities[id],
  );

export const getSelectedDecisionNetworkActive = (id: string) =>
  createSelector(
    getDecisionsState,
    (decisionState): boolean => decisionState.networkActive[id] || false,
  );

export const getLoadedDecisions = createSelector(
  getDecisionsState,
  fromDecisions.selectEntities,
);

export const getLoadedDecisionsAsArray = createSelector(
  getDecisionsState,
  fromDecisions.selectAll,
);

export const getLoadedDecisionsDiagrams = createSelector(
  getLoadedDecisionsAsArray,
  (decisions) => {
    return [].concat.apply(
      [],
      decisions.map((decision) => [...decision.diagrams]));
  },
);

export const getLoadedDecisionsDecisions = createSelector(
  getLoadedDecisionsAsArray,
  (decisions) => {
    return [].concat.apply(
      [],
      decisions.map((decision) => [...decision.requiresDecisions, ...decision.requiredByDecisions]));
  },
);

export const getLoadedDecisionsInputData = createSelector(
  getLoadedDecisionsAsArray,
  (decisions: Decision[]) => {
    return [].concat.apply([], decisions.map((decision: Decision) => [...decision.requiresInputData]));
  },
);

export const getLoadedDecisionsKnowledgeSources = createSelector(
  getLoadedDecisionsAsArray,
  (decisions) => {
    return [].concat.apply(
      [],
      decisions.map((decision) => [...decision.requiresKnowledgeSources, ...decision.requiredByKnowledgeSources]),
    ) as KnowledgeSource[];
  },
);

export const getLoadedDecisionsOrganizations = createSelector(
  getLoadedDecisionsAsArray,
  (decisions: Decision[]) => {
    return [].concat.apply([], decisions.map((decision: Decision) => [
      ...decision.organizationsOwnsDecisions,
      ...decision.organizationsMakesDecisions,
      ...decision.organizationsImpactedByDecisions,
    ]));
  },
);

export const getLoadedDecisionsBusinessObjectives = createSelector(
  getLoadedDecisionsAsArray,
  (decisions: Decision[]) => {
    return [].concat.apply([], decisions.map((decision: Decision) => [...decision.businessObjectives]));
  },
);

export const getLoadedDecisionsProcesses = createSelector(
  getLoadedDecisionsAsArray,
  (decisions: Decision[]) => {
    return [].concat.apply([], decisions.map((decision: Decision) => [...decision.processes]));
  },
);

export const getLoadedDecisionsEvents = createSelector(
  getLoadedDecisionsAsArray,
  (decisions: Decision[]) => {
    return [].concat.apply([], decisions.map((decision: Decision) => [...decision.events]));
  },
);

export const getLoadedDecisionsSystems = createSelector(
  getLoadedDecisionsAsArray,
  (decisions: Decision[]) => {
    return [].concat.apply([], decisions.map((decision: Decision) => [...decision.systems]));
  },
);

export const getLoadedDecisionsImplementationComponents = createSelector(
  getLoadedDecisionsAsArray,
  (decisions: Decision[]) => {
    return [].concat.apply([], decisions.map((decision: Decision) => [...decision.implementationComponents]));
  },
);