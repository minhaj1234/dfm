import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Message } from '@stomp/stompjs';
import { eventType, ISocketMessage } from 'core/models';
import { rootReducers } from 'core/root-store';
import { AuthStompService } from 'core/stomp-services';
import { combineLatest } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Organization } from '../models/organization.model';
import { IDecisionFirstState } from '../store';
import * as fromActions from '../store/actions';
import * as fromSelectors from '../store/selectors/';
import { CommonStompService } from './common-stomp.service';

const ACTIONS_MAPPING = { loadObjectAction: fromActions.LoadOrganization };

@Injectable()
export class OrganizationStompService extends CommonStompService {
  private handlers: Partial<Record<eventType, (ISocketMessage: ISocketMessage) => void>> = {
    create: this.createHandler,
    update: this.updateHandler,
    delete: this.deleteHandler,
    linkUpdate: this.linkUpdateHandler,
    linkDelete: this.linkDeleteHandler,
  };
  constructor(
    private authStompService: AuthStompService,
    private modelerStore: Store<IDecisionFirstState | rootReducers.authenticationReducer.IAuthenticationState>,
  ) {
    super(modelerStore);
    this.actionsMapping = ACTIONS_MAPPING;
    this.subscribeOrganizationsEvent();
  }

  subscribeOrganizationsEvent(): void {
    const stompSubscription = this.authStompService.subscribe(`/organizations`);
    stompSubscription
      .pipe(map((message: Message) => JSON.parse(message.body)))
      .subscribe((message: ISocketMessage) => {
        this.handlers[message.eventType].call(this, message);
      });
  }

  createHandler(socketMessage: ISocketMessage): void {
    this.updateSelfPageForSearchLists();
    this.updateSelfPageSystemsList();
  }

  updateHandler(socketMessage: ISocketMessage): void {
    this.updateObjectTabHandler(socketMessage);
    this.updateChildOrganizations(socketMessage);
    this.updateSelfPageForSearchLists();
    this.updateSelfPageSystemsList();
  }

  deleteHandler(socketMessage: ISocketMessage): void {
    this.modelerStore.dispatch(new fromActions.RemoveTab(socketMessage.resourceId));
    this.updateSelfPageForSearchLists();
    this.updateSelfPageSystemsList();
  }

  linkUpdateHandler(socketMessage: ISocketMessage): void {
    this.updateObjectTabHandler(socketMessage);
    this.updateRelationObjects(socketMessage.linkData);
  }

  linkDeleteHandler(socketMessage: ISocketMessage): void {
    this.updateObjectTabHandler(socketMessage);
    this.updateRelationObjects(socketMessage.linkData);
  }

  updateSelfPageSystemsList(): void {
    this.updateSelfPageObjectsList(
      fromSelectors.getOrganizationsListPagination, fromActions.LoadSpecificPageForOrganizationsList);
  }

  updateChildOrganizations(socketMessage: ISocketMessage): void {
    combineLatest([
      this.modelerStore.pipe(select(fromSelectors.getLoadedInputDataOrganizations)),
      this.modelerStore.pipe(select(fromSelectors.getLoadedDecisionsOrganizations)),
      this.modelerStore.pipe(select(fromSelectors.getLoadedKnowledgeSourcesOrganizations)),
      this.modelerStore.pipe(select(fromSelectors.getLoadedOrganizationsOrganizations)),
      this.modelerStore.pipe(select(fromSelectors.getLoadedBusinessObjectivesOrganizations)),
    ])
      .pipe(
        map(([
          organizationsInputData,
          organizationsDecisions,
          organizationsKnowledgeSources,
          organizationsOrganizations,
          organizationsBusinessObjectives,
        ]) => [
          ...organizationsInputData,
          ...organizationsDecisions,
          ...organizationsKnowledgeSources,
          ...organizationsOrganizations,
          ...organizationsBusinessObjectives,
        ]),
        first(),
      )
      .subscribe((childOrganizations) => {
        if (childOrganizations.some((organization: Organization) => organization && organization.id === socketMessage.resourceId)) {
          this.modelerStore.dispatch(new fromActions.LoadOrganizationAsChild(socketMessage.resourceId));
        }
      });
  }
}
