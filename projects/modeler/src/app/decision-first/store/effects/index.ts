import { ImplementationComponentsIconsEffects } from 'core/objects/implementation-component/store';
import { SidebarEffects } from 'core/objects/sidebar/store';
import { AutocompleteSearchListEffects as UserManagementAutocompleteSearchListEffects, CustomersEffects, GroupsEffects, UsersEffects, UserOwnProfileEffects } from 'user-management/store/effects';
import { BusinessObjectivesEffects } from './business-objective/businessObjectives.effect';
import { BusinessObjectivesListEffects } from './business-objective/businessObjectivesList.effect';
import { DecisionsEffects } from './decision/decisions.effect';
import { DecisionsListEffects } from './decision/decisionsList.effect';
import { DiagrammingElementsEffects } from './diagram/diagrammingElements.effect';
import { DiagramsEffects } from './diagram/diagrams.effect';
import { DiagramsListEffects } from './diagram/diagramsList.effect';
import { EventsEffects } from './event/events.effect';
import { EventsListEffects } from './event/eventsList.effect';
import { ImplementationComponentsEffects } from './implementation-component/implementationComponents.effect';
import { ImplementationComponentsListEffects } from './implementation-component/implementationComponentsList.effect';
import { InputDatasEffects } from './input-data/inputData.effect';
import { InputDatasListEffects } from './input-data/inputDatasList.effect';
import { KnowledgeSourceEffects } from './knowledge-source/knowledgeSource.effect';
import { KnowledgeSourceListEffects } from './knowledge-source/knowledgeSourceList.effect';
import { OrganizationsEffects } from './organization/organizations.effect';
import { OrganizationsListEffects } from './organization/organizationsList.effect';
import { ProcessesEffects } from './process/processes.effect';
import { ProcessesListEffects } from './process/processesList.effect';
import { AutocompleteSearchListEffects } from './search/autocompleteSearchList.effect';
import { HomeSearchListEffects } from './search/homeSearchList.effect';
import { MainSearchListEffects } from './search/mainSearchList.effect';
import { SystemsEffects } from './system/systems.effect';
import { SystemsListEffects } from './system/systemsList.effect';
import { TagsEffects } from './tags/tags.effect';
import { TagsListEffects } from './tags/tagsList.effect';

export const effects: any[] = [
  DiagramsListEffects,
  DecisionsListEffects,
  DiagrammingElementsEffects,
  DiagramsEffects,
  DecisionsEffects,
  KnowledgeSourceListEffects,
  KnowledgeSourceEffects,
  OrganizationsEffects,
  OrganizationsListEffects,
  MainSearchListEffects,
  InputDatasListEffects,
  BusinessObjectivesListEffects,
  ProcessesListEffects,
  EventsListEffects,
  SystemsListEffects,
  InputDatasEffects,
  BusinessObjectivesEffects,
  ProcessesEffects,
  EventsEffects,
  SystemsEffects,
  ImplementationComponentsListEffects,
  ImplementationComponentsEffects,
  TagsEffects,
  TagsListEffects,
  HomeSearchListEffects,
  AutocompleteSearchListEffects,
  SidebarEffects,
  CustomersEffects,
  UsersEffects,
  GroupsEffects,
  UserManagementAutocompleteSearchListEffects,
  UserOwnProfileEffects,
  ImplementationComponentsIconsEffects,
];

export * from './decision/decisionsList.effect';
export * from './diagram/diagramsList.effect';
export * from './diagram/diagrammingElements.effect';
export * from './diagram/diagrams.effect';
export * from './decision/decisions.effect';
export * from './knowledge-source/knowledgeSourceList.effect';
export * from './knowledge-source/knowledgeSource.effect';
export * from './organization/organizations.effect';
export * from './organization/organizationsList.effect';
export * from './search/mainSearchList.effect';
export * from './input-data/inputDatasList.effect';
export * from './business-objective/businessObjectivesList.effect';
export * from './process/processesList.effect';
export * from './event/eventsList.effect';
export * from './system/systemsList.effect';
export * from './input-data/inputData.effect';
export * from './business-objective/businessObjectives.effect';
export * from './process/processes.effect';
export * from './event/events.effect';
export * from './system/systems.effect';
export * from './implementation-component/implementationComponentsList.effect';
export * from './implementation-component/implementationComponents.effect';
export * from './tags/tags.effect';
export * from './tags/tagsList.effect';
export * from './search/homeSearchList.effect';
export * from './search/autocompleteSearchList.effect';
export { SidebarEffects } from 'core/objects/sidebar/store';
export { 
  UsersEffects, 
  GroupsEffects, 
  AutocompleteSearchListEffects as UserManagementAutocompleteSearchListEffects,
  UserOwnProfileEffects,
 } from 'user-management/store/effects';
