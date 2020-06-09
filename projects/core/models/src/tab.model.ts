export enum ObjectTabType {
  Diagram = 'Diagram',
  Decision = 'Decision',
  InputData = 'InputData',
  KnowledgeSource = 'KnowledgeSource',
  Organization = 'Organization',
  BusinessObjective = 'BusinessObjective',
  Process = 'Process',
  Event = 'Event',
  System = 'System',
  ImplementationComponent = 'ImplementationComponent',
  Tag = 'Tag',
  Account = 'Account',
  User = 'User',
  Group = 'Group',
  ImplementationComponentIcon = 'ImplementationComponentIcon',
  DecisionTable = 'DecisionTable',
  ViewRequirementsNetwork = 'ViewRequirementsNetwork'
}

export enum TechnicalTabType {
  Home = 'Home',
  Admin = 'Admin',
  Search = 'Search',
  Print = 'Print',
  ImplementationComponentIcons = 'ImplementationComponentIcons',
  VersionInformation = 'VersionInformation',
}

export enum ObjectType {
  Decision = 'Decision',
  InputData = 'InputData',
  KnowledgeSource = 'KnowledgeSource',
}

export interface ITab {
  id?: string;
  type: ObjectTabType | TechnicalTabType;
  jumpMenuSelectedItem?: JumpMenuItems,
  objectType?: ObjectType;
}

export class IStateTabs {
  tabs: ITab[];
  activeTabId: string;
}

export enum JumpMenuItems {
  BasicDetails = 'BasicDetails',
  Requirements = 'Dependencies',
  QuestionAndAnswers = 'QuestionAndAnswers',
  Implementation = 'Implementation',
  ApplicationContext = 'ApplicationContext',
  OrganizationContext = 'OrganizationContext',
  OrganizationStructure = 'OrganizationStructure',
  DecisionsInvolved = 'DecisionsInvolved',
  ObjectivesInvolved = 'ObjectivesInvolved',
  Owns = 'Owns',
  Decisions = 'Decisions',
  BusinessImpact = 'BusinessImpact',
  Comments = 'Comments',
}

export const DefaultJumpMenuSelectedItem = JumpMenuItems.BasicDetails;

export const PRINT_TAB_ID_TYPE_SEPARATOR = '_'
