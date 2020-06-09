import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Message } from '@stomp/stompjs';
import { eventType, ISocketMessage } from 'core/models';
import { rootReducers } from 'core/root-store';
import { AuthStompService } from 'core/stomp-services';
import { combineLatest } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { BusinessObjective } from '../models/businessObjective.model';
import { IDecisionFirstState } from '../store';
import * as fromActions from '../store/actions';
import * as fromSelectors from '../store/selectors';
import { CommonStompService } from './common-stomp.service';

const ACTIONS_MAPPING = { loadObjectAction: fromActions.LoadBusinessObjective };

@Injectable()
export class BusinessObjectiveStompService extends CommonStompService {
  private handlers: Partial<Record<eventType, (ISocketMessage: ISocketMessage) => void>> = {
    create: this.createHandler,
    delete: this.deleteHandler,
    update: this.updateHandler,
    linkUpdate: this.linkUpdateHandler,
    linkDelete: this.linkDeleteHandler,
  };

  constructor(
    private authStompService: AuthStompService,
    private modelerStore: Store<IDecisionFirstState | rootReducers.authenticationReducer.IAuthenticationState>,
  ) {
    super(modelerStore);
    this.actionsMapping = ACTIONS_MAPPING;
    this.subscribeBusinessObjectivesEvents();
  }

  subscribeBusinessObjectivesEvents(): void {
    const stompSubscription = this.authStompService.subscribe(`/business-objectives`);
    stompSubscription
      .pipe(map((message: Message) => JSON.parse(message.body)))
      .subscribe((message: ISocketMessage) => {
        this.handlers[message.eventType].call(this, message);
      });
  }

  createHandler(socketMessage: ISocketMessage): void {
    this.updateSelfPageForSearchLists();
    this.updateSelfPageBusinessObjectivesList();
  }

  updateHandler(socketMessage: ISocketMessage): void {
    this.updateObjectTabHandler(socketMessage);
    this.updateChildBusinessObjectives(socketMessage);
    this.updateSelfPageForSearchLists();
    this.updateSelfPageBusinessObjectivesList();
  }

  deleteHandler(socketMessage: ISocketMessage): void {
    this.modelerStore.dispatch(new fromActions.RemoveTab(socketMessage.resourceId));
    this.updateSelfPageForSearchLists();
    this.updateSelfPageBusinessObjectivesList();
  }

  linkUpdateHandler(socketMessage: ISocketMessage): void {
    this.updateObjectTabHandler(socketMessage);
    this.updateRelationObjects(socketMessage.linkData);
  }

  linkDeleteHandler(socketMessage: ISocketMessage): void {
    this.updateObjectTabHandler(socketMessage);

    this.updateRelationObjects(socketMessage.linkData);
  }

  updateSelfPageBusinessObjectivesList(): void {
    this.updateSelfPageObjectsList(
      fromSelectors.getBusinessObjectivesListPagination, fromActions.LoadSpecificPageForBusinessObjectivesList);
  }

  updateChildBusinessObjectives(socketMessage: ISocketMessage): void {
    combineLatest([
      this.modelerStore.pipe(select(fromSelectors.getLoadedDecisionsBusinessObjectives)),
      this.modelerStore.pipe(select(fromSelectors.getLoadedOrganizationsBusinessObjectives))
    ])
      .pipe(
        map(([businessObjectivesDecisions, businessObjectivesOrganizations]) => [...businessObjectivesDecisions, ...businessObjectivesOrganizations]),
        first(),
      )
      .subscribe((childBusinessObjectives) => {
        if (childBusinessObjectives.some((businessObjective: BusinessObjective) => businessObjective.id === socketMessage.resourceId)) {
          this.modelerStore.dispatch(new fromActions.LoadBusinessObjectiveAsChild(socketMessage.resourceId));
        }
      });
  }
}
