import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Message } from '@stomp/stompjs';
import { eventType, ISocketMessage } from 'core/models';
import { rootReducers } from 'core/root-store';
import { AuthStompService } from 'core/stomp-services';
import { combineLatest, Subscription } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { IDecisionFirstState } from '../store';
import * as fromActions from '../store/actions';
import * as fromSelectors from '../store/selectors';
import { CommonStompService } from './common-stomp.service';

const ACTIONS_MAPPING = { loadObjectAction: fromActions.LoadKnowledgeSource };

@Injectable()
export class KnowledgeSourceStompService extends CommonStompService {
  private handlers: Partial<Record<eventType, (ISocketMessage: ISocketMessage) => void>> = {
    create: this.createHandler,
    update: this.updateHandler,
    delete: this.deleteHandler,
    linkUpdate: this.linkUpdateHandler,
    linkDelete: this.linkDeleteHandler,
  };
  subscriptions: Subscription[] = [];
  constructor(
    private authStompService: AuthStompService,
    private modelerStore: Store<IDecisionFirstState | rootReducers.authenticationReducer.IAuthenticationState>,
  ) {
    super(modelerStore);
    this.actionsMapping = ACTIONS_MAPPING;
    this.subscribeKnowledgeSourcesEvent();
  }

  subscribeKnowledgeSourcesEvent(): void {
    const stompSubscription = this.authStompService.subscribe(`/knowledge-sources`);
    stompSubscription
      .pipe(map((message: Message) => JSON.parse(message.body)))
      .subscribe((message: ISocketMessage) => {
        this.handlers[message.eventType].call(this, message);
      });
  }

  createHandler(socketMessage: ISocketMessage): void {
    this.updateSelfPageForSearchLists();
    this.updateSelfPageKnowledgeSourcesList();
    this.updateSelfPageDiagrammingElementsList();
  }

  updateHandler(socketMessage: ISocketMessage): void {
    this.updateObjectTabHandler(socketMessage);
    this.updateChildKnowledgeSources(socketMessage);
    this.updateSelfPageForSearchLists();
    this.updateSelfPageKnowledgeSourcesList();
    this.updateSelfPageDiagrammingElementsList();
  }

  deleteHandler(socketMessage: ISocketMessage): void {
    this.modelerStore.dispatch(new fromActions.RemoveTab(socketMessage.resourceId));
    this.updateSelfPageForSearchLists();
    this.updateSelfPageKnowledgeSourcesList();
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

  updateSelfPageKnowledgeSourcesList(): void {
    this.updateSelfPageObjectsList(
      fromSelectors.getKnowledgeSourcesListPagination, fromActions.LoadSpecificPageForKnowledgeSourcesList);
  }

  updateChildKnowledgeSources(socketMessage: ISocketMessage) {
    combineLatest([
      this.modelerStore.pipe(select(fromSelectors.getLoadedDiagramsKnowledgeSources)),
      this.modelerStore.pipe(select(fromSelectors.getLoadedDecisionsKnowledgeSources)),
      this.modelerStore.pipe(select(fromSelectors.getLoadedInputDataKnowledgeSources)),
      this.modelerStore.pipe(select(fromSelectors.getLoadedKnowledgeSourcesKnowledgeSources)),
      this.modelerStore.pipe(select(fromSelectors.getLoadedOrganizationsKnowledgeSources)),
    ])
      .pipe(
        map(([
          knowledgeSourcesDiagrams,
          knowlegeSourcesDecisions,
          knowledgeSourcesInputData,
          knowledgeSourcesKnowledgeSources,
          knowledgeSourcesOrganizations,
        ]) => [
          ...knowledgeSourcesDiagrams,
          ...knowlegeSourcesDecisions,
          ...knowledgeSourcesInputData,
          ...knowledgeSourcesKnowledgeSources,
          ...knowledgeSourcesOrganizations, 
        ]),
        first(),
      )
      .subscribe((childKnowledgeSources) => {
        if (childKnowledgeSources.some((knowledgeSource) => knowledgeSource.id === socketMessage.resourceId)) {
          this.modelerStore.dispatch(new fromActions.LoadKnowledgeSourceAsChild(socketMessage.resourceId));
        }
      });
  }
}
