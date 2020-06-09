import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Message } from '@stomp/stompjs';
import { ITab } from 'core/models';
import { eventType, ISocketMessage } from 'core/models';
import { rootReducers } from 'core/root-store';
import { MessageService } from 'core/services';
import { AuthStompService } from 'core/stomp-services';
import { combineLatest } from 'rxjs';
import { first, map, } from 'rxjs/operators';
import { Diagram } from '../models/diagram.model';
import { IDecisionFirstState } from '../store';
import * as fromActions from '../store/actions';
import * as fromSelectors from '../store/selectors';
import { CommonStompService } from './common-stomp.service';

const ACTIONS_MAPPING = { loadObjectAction: fromActions.LoadDiagram };

@Injectable()
export class DiagramStompService extends CommonStompService {
  private handlers: Partial<Record<eventType, (ISocketMessage) => void>> = {
    create: this.createHandler,
    delete: this.deleteHandler,
    update: this.updateHandler,
    linkUpdate: this.linkUpdateHandler,
    linkDelete: this.linkDeleteHandler,
  };
  private openTabs: Record<string, ITab> = {};
  constructor(
    private authStompService: AuthStompService,
    private modelerStore: Store<IDecisionFirstState | rootReducers.authenticationReducer.IAuthenticationState>,
    private messageService: MessageService,
  ) {
    super(modelerStore);
    this.actionsMapping = ACTIONS_MAPPING;
    this.subscribeDiagramsEvent();
    this.subscribeToTabs();
  }

  subscribeDiagramsEvent(): void {
    const stompSubscription = this.authStompService.subscribe(`/diagrams`);
    stompSubscription
      .pipe(map((message: Message) => JSON.parse(message.body)))
      .subscribe((message: ISocketMessage) => {
        this.handlers[message.eventType].call(this, message);
      });
  }

  subscribeToTabs() {
      this.modelerStore.pipe(select(fromSelectors.getAllTabsEntities)).subscribe((tabs) => {
        this.openTabs = tabs;
      });
  }

  createHandler(socketMessage: ISocketMessage): void {
    this.updateSelfPageForSearchLists();
    this.updateSelfPageDiagramsList();
  }

  updateHandler(socketMessage: ISocketMessage) {
    this.updateObjectTabHandler(socketMessage);
    this.updateDiagramsChild(socketMessage);
    this.updateSelfPageForSearchLists();
    this.updateSelfPageDiagramsList();
  }

  deleteHandler(socketMessage: ISocketMessage): void {
    this.modelerStore.dispatch(new fromActions.RemoveTab(socketMessage.resourceId));
    this.updateSelfPageForSearchLists();
    this.updateSelfPageDiagramsList();
  }

  linkUpdateHandler(socketMessage: ISocketMessage): void {
    this.updateObjectTabHandler(socketMessage);
    this.updateRelationObjects(socketMessage.linkData);
  }

  linkDeleteHandler(socketMessage: ISocketMessage): void {
    this.updateObjectTabHandler(socketMessage);
    this.updateRelationObjects(socketMessage.linkData);
  }

  updateSelfPageDiagramsList(): void {
    this.updateSelfPageObjectsList(
      fromSelectors.getDiagramsListPagination, fromActions.LoadSpecificPageForDiagramsList);
  }

  updateDiagramsChild(socketMessage: ISocketMessage) {
    combineLatest([
      this.modelerStore.pipe(select(fromSelectors.getLoadedDecisionsDiagrams)),
      this.modelerStore.pipe(select(fromSelectors.getLoadedInputDataDiagrams)),
      this.modelerStore.pipe(select(fromSelectors.getLoadedKnowledgeSourcesDiagrams)),
    ])
      .pipe(
        map(([
          decisionsDiagrams, 
          inputDataDiagrams,
          knowledgeSourcesDiagrams,
        ]) => 
        [
          ...decisionsDiagrams, 
          ...inputDataDiagrams,
          ...knowledgeSourcesDiagrams,
        ]),
        first(),
      )
      .subscribe((childDiagrams: Diagram[]) => {
        if (childDiagrams.some((diagram) => diagram.id === socketMessage.resourceId)) {
          this.modelerStore.dispatch(new fromActions.LoadDiagramAsChild(socketMessage.resourceId));
        }
      });
  }
}
