import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { IStateTabs, ITab, ObjectTabType, TechnicalTabType } from 'core/models';
import { rootSelectors } from 'core/root-store';
import { getI18nString } from 'core/utilities';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { combineLatest, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { EditGroupContainerOptions, EditUserContainerOptions } from 'user-management/containers';
import { Group, User, USER_NAMAGEMENT_CLASS_NAMES } from 'user-management/models';
import { Config } from '../../../config';
import { BusinessObjective } from '../../models/businessObjective.model';
import { Decision } from '../../models/decision.model';
import { Diagram } from '../../models/diagram.model';
import { Event as EventObject } from '../../models/events.model';
import { ImplementationComponent } from '../../models/implementationComponent.model';
import { InputData } from '../../models/inputData.model';
import { KnowledgeSource } from '../../models/knowledgeSource.model';
import { DfmObjects } from '../../models/objects.model';
import { Organization } from '../../models/organization.model';
import { Process } from '../../models/process.model';
import { System } from '../../models/system.model';
import { Tag } from '../../models/tag.model';
import * as fromModelerStore from '../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-tabs-container',
  styleUrls: ['./tabs-container.component.scss'],
  templateUrl: './tabs-container.component.html',
})
export class TabsContainerComponent implements OnInit, OnDestroy {
  state$: Observable<IStateTabs>;
  tabs$: Observable<ITab[]>;
  namesMap$: Observable<Record<string, string>>;
  getTechnicalTabName = getI18nString;
  fromModelerStore = fromModelerStore;
  Config = Config;
  editUserContainerOptions: EditUserContainerOptions = {
    loadUserAction: fromModelerStore.LoadUser,
    getSelectedUserSelector: fromModelerStore.getSelectedUser,
    getAuthenticatedUser: rootSelectors.getAuthenticatedUser,
    getAutocompleteSearchListSelector: fromModelerStore.getAutocompleteSearchList,
    removeUserFromLocalMemoryAction: fromModelerStore.RemoveUserFromLocalMemory,
    updateUserAction: fromModelerStore.UpdateUser,
    addTabAction: fromModelerStore.AddTab,
    addGroupsToUserAction: fromModelerStore.AddGroupsToUser,
    removeGroupFromUserAction: fromModelerStore.RemoveGroupFromUser,
    loadGroupsToAutocompleteSearchListAction: fromModelerStore.LoadGroupsToAutocompleteSearchList,
    setAutocompleteSearchListInitialStateAction: fromModelerStore.SetAutocompleteSearchListInitialState,
    debounceTime: Config.debounceTime,
    searchDebounceTime: Config.searchDebounceTime,
    autocompleteListPageSize: Config.autocompleteListPageSize,
    changePasswordAction: fromModelerStore.ChangePassword,
    openChangePasswordFormAction: fromModelerStore.OpenChangePasswordForm,
    closeChangePasswordFormAction: fromModelerStore.CloseChangePasswordForm,
    getChangePasswordFormStateSelector: fromModelerStore.getChangePasswordFormState
  }
  editGroupContainerOptions: EditGroupContainerOptions = {
    loadGroupAction: fromModelerStore.LoadGroup,
    getSelectedGroupSelector: fromModelerStore.getSelectedGroup,
    getAuthenticatedUserType: rootSelectors.getAuthenticatedUserType,
    getAutocompleteSearchListSelector: fromModelerStore.getAutocompleteSearchList,
    removeGroupFromLocalMemoryAction: fromModelerStore.RemoveGroupFromLocalMemory,
    updateGroupAction: fromModelerStore.UpdateGroup,
    addTabAction: fromModelerStore.AddTab,
    addUsersToGroupAction: fromModelerStore.AddUsersToGroup,
    removeUserFromGroupAction: fromModelerStore.RemoveUserFromGroup,
    loadUsersToAutocompleteSearchListAction: fromModelerStore.LoadUsersToAutocompleteSearchList,
    setAutocompleteSearchListInitialStateAction: fromModelerStore.SetAutocompleteSearchListInitialState,
    debounceTime: Config.debounceTime,
    searchDebounceTime: Config.searchDebounceTime,
    autocompleteListPageSize: Config.autocompleteListPageSize,
  }

  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.getStateForTabs();
    this.setNamesMap();
    this.subscribeCurrentTabEntity();
    this.checkIfTabNeedsToBeLoadedFirstTime();
  }

  getStateForTabs(): void {
    this.state$ = combineLatest([
      this.modelerStore.pipe(select(fromModelerStore.getAllTabs)),
      this.modelerStore.pipe(select(fromModelerStore.getCurrentTabId)),
    ]).pipe(
      map(([tabs, activeTabId]) => {
        return { tabs, activeTabId }
      })
    );
  }

  setNamesMap() {
    this.namesMap$ = combineLatest([
      this.modelerStore.pipe(select(fromModelerStore.getLoadedDiagrams)),
      this.modelerStore.pipe(select(fromModelerStore.getLoadedDecisions)),
      this.modelerStore.pipe(select(fromModelerStore.getLoadedKnowledgeSources)),
      this.modelerStore.pipe(select(fromModelerStore.getLoadedOrganizations)),
      this.modelerStore.pipe(select(fromModelerStore.getLoadedInputDatas)),
      this.modelerStore.pipe(select(fromModelerStore.getLoadedBusinessObjectives)),
      this.modelerStore.pipe(select(fromModelerStore.getLoadedProcesses)),
      this.modelerStore.pipe(select(fromModelerStore.getLoadedEvents)),
      this.modelerStore.pipe(select(fromModelerStore.getLoadedSystems)),
      this.modelerStore.pipe(select(fromModelerStore.getLoadedImplementationComponents)),
      this.modelerStore.pipe(select(fromModelerStore.getLoadedTags)),
      this.modelerStore.pipe(select(fromModelerStore.getLoadedUsers)),
      this.modelerStore.pipe(select(fromModelerStore.getLoadedGroups)),
    ]).pipe(
      map(
        ([
          diagrams,
          decisions,
          knowledgeSouces,
          organizations,
          inputDatas,
          businessObjectives,
          processes,
          events,
          systems,
          implementationComponents,
          tags,
          users,
          groups,
        ]) => {
          return {
            ...convertRecordToIdKeyedNames(diagrams),
            ...convertRecordToIdKeyedNames(decisions),
            ...convertRecordToIdKeyedNames(knowledgeSouces),
            ...convertRecordToIdKeyedNames(organizations),
            ...convertRecordToIdKeyedNames(inputDatas),
            ...convertRecordToIdKeyedNames(businessObjectives),
            ...convertRecordToIdKeyedNames(processes),
            ...convertRecordToIdKeyedNames(events),
            ...convertRecordToIdKeyedNames(systems),
            ...convertRecordToIdKeyedNames(implementationComponents),
            ...convertRecordToIdKeyedNames(tags),
            ...convertRecordToIdKeyedNames(users),
            ...convertRecordToIdKeyedNames(groups),
          };
        },
      ),
    );
  }

  subscribeCurrentTabEntity(): void {
    this.modelerStore.pipe(
      select(fromModelerStore.getCurrentTabEntity),
      untilDestroyed(this),
    ).subscribe((tab: ITab) => {
      if (tab) {
        this.router.navigate([''], { queryParams: this.getQueryParamsCurrentTabEntity(tab), relativeTo: this.activatedRoute });
      } else {
        this.router.navigate([''], { relativeTo: this.activatedRoute });
      }

      this.collapseSidebar();
    });
  }

  collapseSidebar(): void {
    this.modelerStore.select(fromModelerStore.getIsShowPropertySidebar)
      .pipe(first())
      .subscribe((isShow: boolean) => {
        if (isShow) {
          this.modelerStore.dispatch(new fromModelerStore.CollapseSidebar());
        }
      });
  }

  getQueryParamsCurrentTabEntity(tab: ITab): Object {
    if (TechnicalTabType[tab.type]) {
      return { type: tab.type };
    }
    else {
      return { id: tab.id, type: tab.type };
    }
  }

  checkIfTabNeedsToBeLoadedFirstTime(): void {
    this.modelerStore
      .pipe(
        select(rootSelectors.getRouterQueryParams),
        first(),
      )
      .subscribe(({ type, id } = {}) => {
        if (type && id) {
          this.modelerStore.dispatch(new fromModelerStore.AddTab({ type, id }));
        }
      });
  }

  trackByFn(index: number, tab: ITab) {
    return tab.id;
  }

  getObjectName(tab: ITab): Observable<string> {
    return this.namesMap$.pipe(
      map((diagramsMap) => {
        return diagramsMap[tab.id] ? diagramsMap[tab.id] : '';
      }),
    );
  }

  closeTab($event: Event, id: string) {
    $event.stopPropagation();
    this.modelerStore.dispatch(new fromModelerStore.RemoveTab(id));
  }

  focusTab($event: Event, tab: ITab) {
    this.modelerStore.dispatch(new fromModelerStore.SetSelectedTab(tab));
  }

  isTechnicalTab(type: ObjectTabType | TechnicalTabType): boolean {
    return type in TechnicalTabType;
  }

  isHomeTab(type: ObjectTabType | TechnicalTabType): boolean {
    return type === TechnicalTabType.Home;
  }

  isAdminTab(type: ObjectTabType | TechnicalTabType): boolean {
    return type === TechnicalTabType.Admin;
  }

  isSearchTab(type: ObjectTabType | TechnicalTabType): boolean {
    return type === TechnicalTabType.Search;
  }

  isDiagramTab(type: ObjectTabType | TechnicalTabType): boolean {
    return type === ObjectTabType.Diagram;
  }

  isDecisionTab(type: ObjectTabType | TechnicalTabType): boolean {
    return type === ObjectTabType.Decision;
  }

  isKnowledgeSourceTab(type: ObjectTabType | TechnicalTabType): boolean {
    return type === ObjectTabType.KnowledgeSource;
  }

  isOrganizationTab(type: ObjectTabType | TechnicalTabType): boolean {
    return type === ObjectTabType.Organization;
  }

  isInputDataTab(type: ObjectTabType | TechnicalTabType): boolean {
    return type === ObjectTabType.InputData;
  }

  isBusinessObjectiveTab(type: ObjectTabType | TechnicalTabType): boolean {
    return type === ObjectTabType.BusinessObjective;
  }

  isProcessTab(type: ObjectTabType | TechnicalTabType): boolean {
    return type === ObjectTabType.Process;
  }

  isEventTab(type: ObjectTabType | TechnicalTabType): boolean {
    return type === ObjectTabType.Event;
  }

  isSystemTab(type: ObjectTabType | TechnicalTabType): boolean {
    return type === ObjectTabType.System;
  }

  isImplementationComponentTab(type: ObjectTabType | TechnicalTabType): boolean {
    return type === ObjectTabType.ImplementationComponent;
  }

  isDecisionTable(type: ObjectTabType | TechnicalTabType): boolean {
    return type === ObjectTabType.DecisionTable;
  }

  isRequirementNetwork(type: ObjectTabType | TechnicalTabType): boolean {
    return type === ObjectTabType.ViewRequirementsNetwork;
  }

  isTagTab(type: ObjectTabType | TechnicalTabType): boolean {
    return type === ObjectTabType.Tag;
  }

  isUserTab(type: ObjectTabType | TechnicalTabType): boolean {
    return type === ObjectTabType.User;
  }

  isGroupTab(type: ObjectTabType | TechnicalTabType): boolean {
    return type === ObjectTabType.Group;
  }

  isPrintTab(type: ObjectTabType | TechnicalTabType): boolean {
    return type === TechnicalTabType.Print;
  }

  ngOnDestroy() { }
}

function convertRecordToIdKeyedNames(
  records:
    | Record<string, Diagram>
    | Record<string, Decision>
    | Record<string, KnowledgeSource>
    | Record<string, Organization>
    | Record<string, InputData>
    | Record<string, BusinessObjective>
    | Record<string, Process>
    | Record<string, EventObject>
    | Record<string, System>
    | Record<string, ImplementationComponent>
    | Record<string, Tag>
    | Record<string, User>
    | Record<string, Group>
): Record<string, string> {
  return Object.keys(records)
    .map((key) => records[key])
    .reduce((newRecords, item) => {
      newRecords[item.id] = getTabName(item);

      return newRecords;
    }, {});
}

function getTabName(item: DfmObjects | Tag | User | Group): string {
  if (item.className === USER_NAMAGEMENT_CLASS_NAMES.User) {
    return (item as User).firstName;
  } else {
    return (item as DfmObjects | Tag).name;
  }
}
