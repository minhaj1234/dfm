import { IPagination } from 'core/models';
import { sanitizeLinks } from 'core/utilities';
import { User } from 'user-management/models';
import { BusinessObjective } from '../models/businessObjective.model';
import { Comment } from '../models/comment.model';
import { Answer, Decision } from '../models/decision.model';
import { DecisionImplementationTable } from '../models/decisionImplementationTable.model';
import * as decisionTable from '../models/decisionImplementationTable.model';
import { Diagram } from '../models/diagram.model';
import { Event } from '../models/events.model';
import { ImplementationComponent } from '../models/implementationComponent.model';
import { InputData } from '../models/inputData.model';
import { KnowledgeSource } from '../models/knowledgeSource.model';
import { ObjectRelationsNames } from '../models/objects.model';
import { Organization } from '../models/organization.model';
import { Process } from '../models/process.model';
import { System } from '../models/system.model';
import { Tag } from '../models/tag.model';
import { convertStringToDate } from './convertStringToDate';

export const toAnswerFields = {
  'answerTypeId': {
    'YES_NO': 1,
    'DEFINED_LIST': 2,
    'EXTERNAL_VALUE_LIST': 3,
    'NUMBER_IN_RANGE': 4,
    'TEXT': 5,
    'DATE_TIME': 6,
    'OTHER': 7,
  },
};

const ANSWER_FIELDS_DATA_CONVERSION_MAPPINGS = {
  'minimumDateTime': convertStringToDate,
  'maximumDateTime': convertStringToDate,
  'defaultDateTime': convertStringToDate,
}

export const fromAnswerFields = {
  'answerTypeId': swapObjectKeysAndValues(toAnswerFields.answerTypeId)
};

const toImplementationComponentFields = {
  'icon': 'iconId',
};

const fromImplementationComponentFields = swapObjectKeysAndValues(toImplementationComponentFields);

function swapObjectKeysAndValues(obj) {
  return Object.keys(obj)
  .reduce((previous, current) => ({...previous, [obj[current]]: current}), {});
} 

export function toDiagram(sourceDiagram: any): Diagram {
  const targetDiagram = new Diagram();
  Object.keys(sourceDiagram).forEach((key) => {
    if (key === ObjectRelationsNames.Decisions) {
      targetDiagram[key] = sourceDiagram[key].map(toDecision);
    } else if (key === ObjectRelationsNames.InputDatas) {
      targetDiagram[key] = sourceDiagram[key].map(toInputData);
    } else if (key === ObjectRelationsNames.KnowledgeSources) {
      targetDiagram[key] = sourceDiagram[key].map(toKnowledgeSource);
    } else if (key === ObjectRelationsNames.Tags) {
      targetDiagram[key] = sourceDiagram[key].map(toTag);
    } else if (key === ObjectRelationsNames.Links) {
      targetDiagram[key] = sanitizeLinks(sourceDiagram[key]);
    } else {
      targetDiagram[key] = sourceDiagram[key];
    }
  });

  return targetDiagram;
}

export function toDecision(sourceDecision: any): Decision {
  const targetDecision = new Decision();
  Object.keys(sourceDecision).forEach((key) => {
    if (key === ObjectRelationsNames.Diagrams) {
      targetDecision[key] = sourceDecision[key].map(toDiagram);
    } else if (key === ObjectRelationsNames.RequiresDecisions || key === ObjectRelationsNames.RequiredByDecisions) {
      targetDecision[key] = sourceDecision[key].map(toDecision);
    } else if (key === ObjectRelationsNames.RequiresInputData) {
      targetDecision[key] = sourceDecision[key].map(toInputData);
    } else if (
      key === ObjectRelationsNames.RequiresKnowledgeSources ||
      key === ObjectRelationsNames.RequiredByKnowledgeSources
    ) {
      targetDecision[key] = sourceDecision[key].map(toKnowledgeSource);
    } else if (key === ObjectRelationsNames.OrganizationsOwnsDecisions) {
      targetDecision[key] = sourceDecision[key].map(toOrganization);
    } else if (key === ObjectRelationsNames.OrganizationsMakesDecisions) {
      targetDecision[key] = sourceDecision[key].map(toOrganization);
    } else if (key === ObjectRelationsNames.OrganizationsImpactedByDecisions) {
      targetDecision[key] = sourceDecision[key].map(toOrganization);
    } else if (key === ObjectRelationsNames.BusinessObjectives) {
      targetDecision[key] = sourceDecision[key].map(toBusinessObjective);
    } else if (key === ObjectRelationsNames.Processes) {
      targetDecision[key] = sourceDecision[key].map(toProcess);
    } else if (key === ObjectRelationsNames.Events) {
      targetDecision[key] = sourceDecision[key].map(toEvent);
    } else if (key === ObjectRelationsNames.Systems) {
      targetDecision[key] = sourceDecision[key].map(toSystem);
    } else if (key === ObjectRelationsNames.ImplementationComponents) {
      targetDecision[key] = sourceDecision[key].map(toImplementationComponent);
    } else if (key === ObjectRelationsNames.DecisionImplementationTable) {
      targetDecision[key] = sourceDecision[key] ? toDecisionImplementationTable(sourceDecision[key]) : null;
    } else if (key === ObjectRelationsNames.Comments) {
      targetDecision[key] = sourceDecision[key].map(toComment);
    } else if (key === ObjectRelationsNames.Tags) {
      targetDecision[key] = sourceDecision[key].map(toTag);
    } else if (key === ObjectRelationsNames.Answer) {
      targetDecision[key] = toAnswer(sourceDecision[key]);
    } else if (key === ObjectRelationsNames.Links) {
      targetDecision[key] = sanitizeLinks(sourceDecision[key] as any);
    } else {
      targetDecision[key] = sourceDecision[key];
    }
  });
  
  return targetDecision;
}

export function toAnswer(sourceAnswer: any): Answer {
  const  targetAnswer = new Answer()
  Object.keys(sourceAnswer).forEach((key) => {
    if (toAnswerFields[key]) {
      targetAnswer[key] = toAnswerFields[key][sourceAnswer[key]];
    } else if (ANSWER_FIELDS_DATA_CONVERSION_MAPPINGS[key] ) {
      targetAnswer[key] = ANSWER_FIELDS_DATA_CONVERSION_MAPPINGS[key](sourceAnswer[key]);
    } else {
      targetAnswer[key] = sourceAnswer[key];
    }
  });

  return targetAnswer;
}

export function fromAnswer(sourceAnswer: Answer): any {
  const obj = {};
  Object.keys(sourceAnswer).forEach((key) => {
    if (fromAnswerFields[key]) {
      obj[key] = fromAnswerFields[key][sourceAnswer[key]];
    } else {
      obj[key] = sourceAnswer[key];
    }
  });

  return obj;
}

export function toDecisionImplementationTable(sourcedecisionTable: any): DecisionImplementationTable {
  const targetdecisionTable = new DecisionImplementationTable();
  Object.keys(sourcedecisionTable).forEach((key) => {
    if (key === ObjectRelationsNames.Headers) {
      targetdecisionTable[key] = sourcedecisionTable[key].map(toDecisionImplementationTableHeader);
    } else if (key === ObjectRelationsNames.Rows) {
      targetdecisionTable[key] = sourcedecisionTable[key].map(toDecisionImplementationTableRow);
    } else {
      targetdecisionTable[key] = sourcedecisionTable[key];
    }
  });

  return targetdecisionTable;
}

export function toDecisionImplementationTableHeader(sourcedecisionTableHeader: any): decisionTable.Header {
  const targetdecisionTableHeader = new decisionTable.Header();
  Object.keys(sourcedecisionTableHeader).forEach((key) => {
    targetdecisionTableHeader[key] = sourcedecisionTableHeader[key];
  });

  return targetdecisionTableHeader;
}

export function toDecisionImplementationTableRow(sourcedecisionTableRow: any): decisionTable.Row {
  const targetdecisionTableHeader = new decisionTable.Row();
  Object.keys(sourcedecisionTableRow).forEach((key) => {
    if (key === ObjectRelationsNames.Cells) {
      targetdecisionTableHeader[key] = sourcedecisionTableRow[key].map(toDecisionImplementationTableCell);
    } else {
      targetdecisionTableHeader[key] = sourcedecisionTableRow[key];
    }
  });

  return targetdecisionTableHeader;
}

export function toDecisionImplementationTableCell(sourcedecisionTableCell: any): decisionTable.Cell {
  const targetdecisionTableCell = new decisionTable.Cell();
  Object.keys(sourcedecisionTableCell).forEach((key) => {
    targetdecisionTableCell[key] = sourcedecisionTableCell[key];
  });

  return targetdecisionTableCell;
}

export function toInputData(sourceInputData: any): InputData {
  const targetInputData = new InputData();
  Object.keys(sourceInputData).forEach((key) => {
    if (key === ObjectRelationsNames.Diagrams) {
      targetInputData[key] = sourceInputData[key].map(toDiagram);
    } else if (key === ObjectRelationsNames.RequiredByDecisions) {
      targetInputData[key] = sourceInputData[key].map(toDecision);
    } else if (key === ObjectRelationsNames.RequiredByKnowledgeSources) {
      targetInputData[key] = sourceInputData[key].map(toKnowledgeSource);
    } else if (key === ObjectRelationsNames.Organizations) {
      targetInputData[key] = sourceInputData[key].map(toOrganization);
    } else if (key === ObjectRelationsNames.Comments) {
      targetInputData[key] = sourceInputData[key].map(toComment);
    } else if (key === ObjectRelationsNames.Tags) {
      targetInputData[key] = sourceInputData[key].map(toTag);
    } else if (key === ObjectRelationsNames.Links) {
      targetInputData[key] = sanitizeLinks(sourceInputData[key]);
    } else {
      targetInputData[key] = sourceInputData[key];
    }
  });

  return targetInputData;
}

export function toKnowledgeSource(sourceKnowledgeSource: any): KnowledgeSource {
  const targetKnowledgeSource = new KnowledgeSource();
  Object.keys(sourceKnowledgeSource).forEach((key) => {
    if (key === ObjectRelationsNames.Diagrams) {
      targetKnowledgeSource[key] = sourceKnowledgeSource[key].map(toDiagram);
    } else if (key === ObjectRelationsNames.RequiresDecisions || key === ObjectRelationsNames.RequiredByDecisions) {
      targetKnowledgeSource[key] = sourceKnowledgeSource[key].map(toDecision);
    } else if (key === ObjectRelationsNames.RequiresInputData) {
      targetKnowledgeSource[key] = sourceKnowledgeSource[key].map(toInputData);
    } else if (
      key === ObjectRelationsNames.RequiresKnowledgeSources ||
      key === ObjectRelationsNames.RequiredByKnowledgeSources
    ) {
      targetKnowledgeSource[key] = sourceKnowledgeSource[key].map(toKnowledgeSource);
    } else if (key === ObjectRelationsNames.Organizations) {
      targetKnowledgeSource[key] = sourceKnowledgeSource[key].map(toOrganization);
    } else if (key === ObjectRelationsNames.Comments) {
      targetKnowledgeSource[key] = sourceKnowledgeSource[key].map(toComment);
    } else if (key === ObjectRelationsNames.Tags) {
      targetKnowledgeSource[key] = sourceKnowledgeSource[key].map(toTag);
    } else if (key === ObjectRelationsNames.Links) {
      targetKnowledgeSource[key] = sanitizeLinks(sourceKnowledgeSource[key]);
    } else {
      targetKnowledgeSource[key] = sourceKnowledgeSource[key];
    }
  });

  return targetKnowledgeSource;
}

export function toOrganization(sourceOrganization: any): Organization {
  const targetOrganization = new Organization();
  Object.keys(sourceOrganization).forEach((key) => {
    if (key === ObjectRelationsNames.InputDatas) {
      targetOrganization[key] = sourceOrganization[key].map(toInputData);
    } else if (key === ObjectRelationsNames.OwnsDecisions) {
      targetOrganization[key] = sourceOrganization[key].map(toDecision);
    } else if (key === ObjectRelationsNames.MakesDecisions) {
      targetOrganization[key] = sourceOrganization[key].map(toDecision);
    } else if (key === ObjectRelationsNames.ImpactedByDecisions) {
      targetOrganization[key] = sourceOrganization[key].map(toDecision);
    } else if (key === ObjectRelationsNames.KnowledgeSources) {
      targetOrganization[key] = sourceOrganization[key].map(toKnowledgeSource);
    } else if (key === ObjectRelationsNames.ParentOrganization) {
      targetOrganization[key] = !!sourceOrganization[key] ? toOrganization(sourceOrganization[key]) : null;
    } else if (key === ObjectRelationsNames.ChildOrganizations) {
      targetOrganization[key] = sourceOrganization[key].map(toOrganization);
    } else if (key === ObjectRelationsNames.BusinessObjectives) {
      targetOrganization[key] = sourceOrganization[key].map(toBusinessObjective);
    } else if (key === ObjectRelationsNames.Comments) {
      targetOrganization[key] = sourceOrganization[key].map(toComment);
    } else if (key === ObjectRelationsNames.Tags) {
      targetOrganization[key] = sourceOrganization[key].map(toTag);
    } else if (key === ObjectRelationsNames.Links) {
      targetOrganization[key] = sanitizeLinks(sourceOrganization[key] as any);
    } else {
      targetOrganization[key] = sourceOrganization[key];
    }
  });

  return targetOrganization;
}

export function toBusinessObjective(sourceBusinessObjective: any): BusinessObjective {
  const targetBusinessObjective = new BusinessObjective();
  Object.keys(sourceBusinessObjective).forEach((key) => {
    if (key === ObjectRelationsNames.Decisions) {
      targetBusinessObjective[key] = sourceBusinessObjective[key].map(toDecision);
    } else if (key === ObjectRelationsNames.Organizations) {
      targetBusinessObjective[key] = sourceBusinessObjective[key].map(toOrganization);
    } else if (key === ObjectRelationsNames.Comments) {
      targetBusinessObjective[key] = sourceBusinessObjective[key].map(toComment);
    } else if (key === ObjectRelationsNames.Tags) {
      targetBusinessObjective[key] = sourceBusinessObjective[key].map(toTag);
    } else if (key === ObjectRelationsNames.Links) {
      targetBusinessObjective[key] = sanitizeLinks(sourceBusinessObjective[key]);
    } else {
      targetBusinessObjective[key] = sourceBusinessObjective[key];
    }
  });

  return targetBusinessObjective;
}

export function toProcess(sourceProcess: any): Process {
  const targetProcess = new Process();
  Object.keys(sourceProcess).forEach((key) => {
    if (key === ObjectRelationsNames.Decisions) {
      targetProcess[key] = sourceProcess[key].map(toDecision);
    } else if (key === ObjectRelationsNames.Comments) {
      targetProcess[key] = sourceProcess[key].map(toComment);
    } else if (key === ObjectRelationsNames.Tags) {
      targetProcess[key] = sourceProcess[key].map(toTag);
    } else if (key === ObjectRelationsNames.Links) {
      targetProcess[key] = sanitizeLinks(sourceProcess[key]);
    } else {
      targetProcess[key] = sourceProcess[key];
    }
  });

  return targetProcess;
}

export function toEvent(sourceEvent: any): Event {
  const targetEvent = new Event();
  Object.keys(sourceEvent).forEach((key) => {
    if (key === ObjectRelationsNames.Decisions) {
      targetEvent[key] = sourceEvent[key].map(toDecision);
    } else if (key === ObjectRelationsNames.Comments) {
      targetEvent[key] = sourceEvent[key].map(toComment);
    } else if (key === ObjectRelationsNames.Tags) {
      targetEvent[key] = sourceEvent[key].map(toTag);
    } else if (key === ObjectRelationsNames.Links) {
      targetEvent[key] = sanitizeLinks(sourceEvent[key]);
    } else {
      targetEvent[key] = sourceEvent[key];
    }
  });

  return targetEvent;
}

export function toSystem(sourceSystem: any): System {
  const targetSystem = new System();
  Object.keys(sourceSystem).forEach((key) => {
    if (key === ObjectRelationsNames.Decisions) {
      targetSystem[key] = sourceSystem[key].map(toDecision);
    } else if (key === ObjectRelationsNames.Comments) {
      targetSystem[key] = sourceSystem[key].map(toComment);
    } else if (key === ObjectRelationsNames.Tags) {
      targetSystem[key] = sourceSystem[key].map(toTag);
    } else if (key === ObjectRelationsNames.Links) {
      targetSystem[key] = sanitizeLinks(sourceSystem[key]);
    } else {
      targetSystem[key] = sourceSystem[key];
    }
  });

  return targetSystem;
}

export function toImplementationComponent(
  sourceImplementationComponent: any,
): ImplementationComponent {
  const targetImplementationComponent = new ImplementationComponent();
  Object.keys(sourceImplementationComponent).forEach((key) => {
    if (key === ObjectRelationsNames.Decisions) {
      targetImplementationComponent[key] = sourceImplementationComponent[key].map(toDecision);
    } else if (key === ObjectRelationsNames.Comments) {
      targetImplementationComponent[key] = sourceImplementationComponent[key].map(toComment);
    }  else if (key === ObjectRelationsNames.Tags) {
      targetImplementationComponent[key] = sourceImplementationComponent[key].map(toTag);
    } else if (key === ObjectRelationsNames.Links) {
      targetImplementationComponent[key] = sanitizeLinks(sourceImplementationComponent[key]);
    } else if(toImplementationComponentFields[key]) {
      targetImplementationComponent[toImplementationComponentFields[key]] = sourceImplementationComponent[key];
    } else {
      targetImplementationComponent[key] = sourceImplementationComponent[key];
    }
  });

  return targetImplementationComponent;
}

export function fromImplementationComponent(sourceImplementationComponent: Partial<ImplementationComponent>): any {
  const obj = {};
  Object.keys(sourceImplementationComponent).forEach((key) => {
    if (fromImplementationComponentFields[key]) {
      obj[fromImplementationComponentFields[key]] = sourceImplementationComponent[key];
    } else {
      obj[key] = sourceImplementationComponent[key];
    }
  });

  return obj;
}

export function toTag(
  sourceTag: any,
): Tag {
  const targetTag = new Tag();
  Object.keys(sourceTag).forEach((key) => {
    if (key === ObjectRelationsNames.Diagrams) {
      targetTag[key] = sourceTag[key].map(toDiagram);
    } else if (key === ObjectRelationsNames.Decisions) {
      targetTag[key] = sourceTag[key].map(toDecision);
    } else if (key === ObjectRelationsNames.InputDatas) {
      targetTag[key] = sourceTag[key].map(toInputData);
    } else if (key === ObjectRelationsNames.KnowledgeSources) {
      targetTag[key] = sourceTag[key].map(toKnowledgeSource);
    } else if (key === ObjectRelationsNames.Organizations) {
      targetTag[key] = sourceTag[key].map(toOrganization);
    } else if (key === ObjectRelationsNames.BusinessObjectives) {
      targetTag[key] = sourceTag[key].map(toBusinessObjective);
    } else if (key === ObjectRelationsNames.Processes) {
      targetTag[key] = sourceTag[key].map(toProcess);
    } else if (key === ObjectRelationsNames.Events) {
      targetTag[key] = sourceTag[key].map(toEvent);
    } else if (key === ObjectRelationsNames.Systems) {
      targetTag[key] = sourceTag[key].map(toSystem);
    } else if (key === ObjectRelationsNames.ImplementationComponents) {
      targetTag[key] = sourceTag[key].map(toImplementationComponent);
    } else if (key === ObjectRelationsNames.Links) {
      targetTag[key] = sanitizeLinks(sourceTag[key]);
    } else {
      targetTag[key] = sourceTag[key];
    }
  });

  return targetTag;
}

export function toComment(sourceComment: any): Comment {
  const targetComment = new Comment();
  Object.keys(sourceComment).forEach((key) => {
    if (key === ObjectRelationsNames.ChildComments) {
      targetComment[key] = sourceComment[key].map(toComment);
    } else if (key === ObjectRelationsNames.User) {
      targetComment[key] = toUser(sourceComment[key]);
    } else {
      targetComment[key] = sourceComment[key];
    }
  });

  return targetComment;
}

export function toUser(sourceComment: any): User {
  const targetComment = new User();
  Object.keys(sourceComment).forEach((key) => {
    targetComment[key] = sourceComment[key];
  });

  return targetComment;
}

export function getPagination(objs: any): IPagination {
  const pagination: IPagination = objs.page;
  pagination.prevUrl = objs._links.prev ? objs._links.prev.href : null;
  pagination.selfUrl = objs._links.self ? objs._links.self.href : null;
  pagination.nextUrl = objs._links.next ? objs._links.next.href : null;

  return pagination;
}
