import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';
import { fromImplementationComponentIcons } from 'core/objects/implementation-component/store';
import { fromSidebarReducers } from 'core/objects/sidebar/store';
import { fromTabsReducers } from 'core/objects/tabs/store';
import { reducers as userManagementReducers } from 'user-management/store/reducers';
import { ICustomersState } from 'user-management/store/reducers/customer/customers.reducer';
import { IGroupsState } from 'user-management/store/reducers/group/groups.reducer';
import { IUsersState } from 'user-management/store/reducers/user/users.reducer';
import * as fromBusinessObjectives from './business-objective/businessObjectives.reducer';
import * as fromBusinessObjectivesList from './business-objective/businessObjectivesList.reducer';
import * as fromDecisions from './decision/decisions.reducer';
import * as fromDecisionsList from './decision/decisionsList.reducer';
import * as fromActiveDiagrams from './diagram/activeDiagrams.reducer';
import * as fromDiagrammingElements from './diagram/diagrammingElements.reducer';
import * as fromDiagrams from './diagram/diagrams.reducer';
import * as fromDiagramsList from './diagram/diagramsList.reducer';
import * as fromEvents from './event/events.reducer';
import * as fromEventsList from './event/eventsList.reducer';
import * as fromImplementationComponents from './implementation-component/implementationComponents.reducer';
import * as fromImplementationComponentsList from './implementation-component/implementationComponentsList.reducer';
import * as fromInputDatas from './input-data/inputData.reducer';
import * as fromInputDatasList from './input-data/inputDatasList.reducer';
import * as fromKnowledgeSources from './knowledge-source/knowledgeSources.reducer';
import * as fromKnowledgeSourcesList from './knowledge-source/knowledgeSourcesList.reducer';
import * as fromOrganizations from './organization/organization.reducer';
import * as fromOrganizationsList from './organization/organizationsList.reducer';
import * as fromProcesses from './process/processes.reducer';
import * as fromProcessesList from './process/processesList.reducer';
import * as fromAutocompleteSearchList from './search/autocompleteSearchList.reducer';
import * as fromHomeSeartList from './search/homeSearchList.reducer';
import * as fromMainSearchList from './search/mainSearchList.reducer';
import * as fromSystems from './system/systems.reducer';
import * as fromSystemsList from './system/systemsList.reducer';
import * as fromTags from './tags/tags.reducer';
import * as fromTagsList from './tags/tagsList.reducer';

export interface IDecisionFirstState {
  activeDiagrams: fromActiveDiagrams.IActiveDiagramsState;
  businessObjectives: fromBusinessObjectives.IBusinessObjectivesState;
  businessObjectivesList: fromBusinessObjectivesList.IBusinessObjectivesListState;
  decisions: fromDecisions.IDecisionsState;
  decisionsList: fromDecisionsList.IDecisionListState;
  diagramsList: fromDiagramsList.IDiagramListState;
  diagrammingElements: fromDiagrammingElements.IDigrammingElementsState;
  diagrams: fromDiagrams.IDiagramsState;
  events: fromEvents.IEventsState;
  eventsList: fromEventsList.IEventsListState;
  implementationComponents: fromImplementationComponents.IImplementationComponentsState;
  implementationComponentsList: fromImplementationComponentsList.IImplementationComponentsListState;
  implementationComponentsIcons: fromImplementationComponentIcons.IImplementationComponentsIconsState;
  inputDatas: fromInputDatas.IInputDatasState;
  inputDatasList: fromInputDatasList.IInputDatasListState;
  knowledgeSources: fromKnowledgeSources.IKnowledgeSourcesState;
  knowledgeSourcesList: fromKnowledgeSourcesList.IKnowledgeSourceListState;
  organizations: fromOrganizations.IOrganizationsState;
  organizationsList: fromOrganizationsList.IOrganizationsListState;
  processes: fromProcesses.IProcessesState;
  processesList: fromProcessesList.IProcessesListState;
  mainSearchList: fromMainSearchList.IMainSearchListState;
  systems: fromSystems.ISystemsState;
  systemsList: fromSystemsList.ISystemsListState;
  homeSearchList: fromHomeSeartList.IHomeSearchListState;
  autocompleteSearchList: fromAutocompleteSearchList.IAutocompleteSearchListState;
  tabs: fromTabsReducers.ITabState;
  tags: fromTags.ITagsState;
  tagsList: fromTagsList.ITagsListState;
  sidebar: fromSidebarReducers.ISidebarState;
  customers: ICustomersState
  users: IUsersState,
  groups: IGroupsState,
}

export const reducers: ActionReducerMap<IDecisionFirstState> = {
  activeDiagrams: fromActiveDiagrams.reducer,
  businessObjectives: fromBusinessObjectives.reducer,
  businessObjectivesList: fromBusinessObjectivesList.reducer,
  decisions: fromDecisions.reducer,
  decisionsList: fromDecisionsList.reducer,
  diagrammingElements: fromDiagrammingElements.reducer,
  diagrams: fromDiagrams.reducer,
  diagramsList: fromDiagramsList.reducer,
  events: fromEvents.reducer,
  eventsList: fromEventsList.reducer,
  implementationComponents: fromImplementationComponents.reducer,
  implementationComponentsList: fromImplementationComponentsList.reducer,
  implementationComponentsIcons: fromImplementationComponentIcons.reducer,
  inputDatas: fromInputDatas.reducer,
  inputDatasList: fromInputDatasList.reducer,
  knowledgeSources: fromKnowledgeSources.reducer,
  knowledgeSourcesList: fromKnowledgeSourcesList.reducer,
  organizations: fromOrganizations.reducer,
  organizationsList: fromOrganizationsList.reducer,
  processes: fromProcesses.reducer,
  processesList: fromProcessesList.reducer,
  mainSearchList: fromMainSearchList.reducer,
  systems: fromSystems.reducer,
  systemsList: fromSystemsList.reducer,
  homeSearchList: fromHomeSeartList.reducer,
  autocompleteSearchList: fromAutocompleteSearchList.reducer,
  tabs: fromTabsReducers.reducer,
  tags: fromTags.reducer,
  tagsList: fromTagsList.reducer,
  sidebar: fromSidebarReducers.reducer,
  customers: userManagementReducers.customers,
  users: userManagementReducers.users,
  groups: userManagementReducers.groups,
};

export const getDecisionFirstState = createFeatureSelector<IDecisionFirstState>('DecisionFirst');
