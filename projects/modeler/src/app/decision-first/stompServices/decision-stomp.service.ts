import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Message } from '@stomp/stompjs';
import { eventType, ISocketMessage } from 'core/models';
import { rootReducers } from 'core/root-store';
import { AuthStompService } from 'core/stomp-services';
import { combineLatest } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Decision } from '../models/decision.model';
import { IDecisionFirstState } from '../store';
import * as fromActions from '../store/actions';
import * as fromSelectors from '../store/selectors';
import { CommonStompService } from './common-stomp.service';

const NOT_UPDATED_ENTITIES_NAMES = ['decisionImplementationTable']
const ACTIONS_MAPPING = { loadObjectAction: fromActions.LoadDecision };
   
@Injectable()
export class DecisionStompService extends CommonStompService {
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
    this.notUpdatedEntitiesNames = NOT_UPDATED_ENTITIES_NAMES;
    this.actionsMapping = ACTIONS_MAPPING;
    this.subscribeDecisionsEvent();
  }

  subscribeDecisionsEvent(): void {
    const stompSubscription = this.authStompService.subscribe(`/decisions`);
    stompSubscription
      .pipe(map((message: Message) => JSON.parse(message.body)))
      .subscribe((message: ISocketMessage) => {
        this.handlers[message.eventType].call(this, message);
      });
  }

  createHandler(socketMessage: ISocketMessage): void {
    this.updateSelfPageForSearchLists();
    this.updateSelfPageDecisionsList();
    this.updateSelfPageDiagrammingElementsList();
  }

  updateHandler(socketMessage: ISocketMessage): void {
    this.updateObjectTabHandler(socketMessage);
    this.updateDecisionChilds(socketMessage);
    this.updateSelfPageForSearchLists();
    this.updateSelfPageDecisionsList();
    this.updateSelfPageDiagrammingElementsList();
  }

  deleteHandler(socketMessage: ISocketMessage): void {
    this.modelerStore.dispatch(new fromActions.RemoveTab(socketMessage.resourceId));
    this.updateSelfPageForSearchLists();
    this.updateSelfPageDecisionsList();
    this.updateSelfPageDiagrammingElementsList();
  }

  linkUpdateHandler(socketMessage: ISocketMessage): void {
    this.updateObjectTabHandler(socketMessage);
    this.updateRelationObjects(socketMessage.linkData);
  }

  linkDeleteHandler(socketMessage: ISocketMessage): void {
    this.updateObjectTabHandler(socketMessage);
    this.updateRelationObjects(socketMessage.linkData);
  }

  updateSelfPageDecisionsList(): void {
    this.updateSelfPageObjectsList(
      fromSelectors.getDecisionsListPagination, fromActions.LoadSpecificPageForDecisionsList);
  }

  updateDecisionChilds(socketMessage: ISocketMessage): void {
    combineLatest([
      this.modelerStore.pipe(select(fromSelectors.getLoadedDiagramsDecisions)),
      this.modelerStore.pipe(select(fromSelectors.getLoadedDecisionsDecisions)),
      this.modelerStore.pipe(select(fromSelectors.getLoadedInputDataDecisions)),
      this.modelerStore.pipe(select(fromSelectors.getLoadedKnowledgeSourcesDecisions)),
      this.modelerStore.pipe(select(fromSelectors.getLoadedOrganizationsDecisions)),
      this.modelerStore.pipe(select(fromSelectors.getLoadedBusinessObjectivesDecisions)),
      this.modelerStore.pipe(select(fromSelectors.getLoadedProcessesDecisions)),
      this.modelerStore.pipe(select(fromSelectors.getLoadedEventsDecisions)),
      this.modelerStore.pipe(select(fromSelectors.getLoadedSystemsDecisions)),
      this.modelerStore.pipe(select(fromSelectors.getLoadedImplementationComponentsDecisions)),
    ])
      .pipe(
        map(([
          diagramsDecision,
          decisionsDecision,
          inputDataDecisions,
          knowledgeSourcesDecision,
          organizationsDecision,
          businessObjectivesDecisions,
          processesDecisions,
          eventsDecision,
          systemsDecision,
          implementatinComponentsDecisions,
        ]) =>
        [
          ...diagramsDecision,
          ...decisionsDecision,
          ...inputDataDecisions,
          ...knowledgeSourcesDecision,
          ...organizationsDecision,
          ...businessObjectivesDecisions,
          ...processesDecisions,
          ...eventsDecision,
          ...systemsDecision,
          ...implementatinComponentsDecisions,
        ]),
        first(),
      )
      .subscribe((childDecisions: Decision[]) => {
        if (childDecisions.some((decision) => decision.id === socketMessage.resourceId)) {
          this.modelerStore.dispatch(new fromActions.LoadDecisionAsChild(socketMessage.resourceId));
        }
      });
  }
}
