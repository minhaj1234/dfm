import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Message } from '@stomp/stompjs';
import { eventType, ISocketMessage } from 'core/models';
import { rootReducers } from 'core/root-store';
import { AuthStompService } from 'core/stomp-services';
import { combineLatest } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Graphable } from '../models/graphable.model';
import { ObjectClassNames } from '../models/objects.model';
import { IDecisionFirstState } from '../store';
import * as fromActions from '../store/actions';
import * as fromSelectors from '../store/selectors';
import { CommonStompService } from './common-stomp.service';

const ACTIONS_MAPPING = { loadObjectAction: fromActions.LoadTag };

const LOAD_OBJECT_AS_CHILD_ACTIONS_MAPPINGS = {
  [ObjectClassNames.Decision]: (id: string) => new fromActions.LoadDecisionAsChild(id),
  [ObjectClassNames.InputData]: (id: string) => new fromActions.LoadInputDataAsChild(id),
  [ObjectClassNames.KnowledgeSource]: (id: string) => new fromActions.LoadKnowledgeSourceAsChild(id),
};

@Injectable()
export class TagStompService extends CommonStompService {
  private handlers: Partial<Record<eventType, (ISocketMessage: ISocketMessage) => void>> = {
    linkUpdate: this.linkUpdateHandler,
    linkDelete: this.linkDeleteHandler,
  };
  constructor(
    private authStompService: AuthStompService,
    private modelerStore: Store<IDecisionFirstState | rootReducers.authenticationReducer.IAuthenticationState>,
  ) {
    super(modelerStore);
    this.actionsMapping = ACTIONS_MAPPING;
    this.subscribeTagsEvents();
  }

  subscribeTagsEvents(): void {
    const stompSubscription = this.authStompService.subscribe(`/tags`);
    stompSubscription
      .pipe(map((message: Message) => JSON.parse(message.body)))
      .subscribe((message: ISocketMessage) => {
        this.handlers[message.eventType].call(this, message);
      });
  }

  linkUpdateHandler(socketMessage: ISocketMessage): void {
    this.updateObjectTabHandler(socketMessage);
    this.updateSelfPageTagLists();
    this.updateRelationObjects(socketMessage.linkData);
    this.updateChildObjectsForDiagram(socketMessage.linkData);
  }

  linkDeleteHandler(socketMessage: ISocketMessage): void {
    this.modelerStore.dispatch(new fromActions.RemoveTab(socketMessage.resourceId));
    this.updateSelfPageTagLists();
    this.updateRelationObjects(socketMessage.linkData);
    this.updateChildObjectsForDiagram(socketMessage.linkData);
  }

  updateChildObjectsForDiagram(relatedObjectIds: string[]): void {
    combineLatest([
      this.modelerStore.pipe(select(fromSelectors.getLoadedDiagramsInputData)),
      this.modelerStore.pipe(select(fromSelectors.getLoadedDiagramsKnowledgeSources)),
      this.modelerStore.pipe(select(fromSelectors.getLoadedDiagramsDecisions)),
    ]).pipe(
        map(([inputDatas, knowledgeSources, decisions]) => [
          ...inputDatas,
          ...knowledgeSources,
          ...decisions
        ]),
        first(),
      )
      .subscribe((diagramObjects: Graphable[]) => {
        diagramObjects
          .filter((diagramObject) => relatedObjectIds.some((item) => item === diagramObject.id))
          .forEach((diagramObject) => {
            this.dispatchLoadObjectAsChild(diagramObject);
          });
      });
  }

  dispatchLoadObjectAsChild(object: Graphable): void {
    if(LOAD_OBJECT_AS_CHILD_ACTIONS_MAPPINGS[object.className]) {
      this.modelerStore.dispatch(LOAD_OBJECT_AS_CHILD_ACTIONS_MAPPINGS[object.className](object.id));
    }
  }

  updateSelfPageTagLists(): void {
    this.updateSelfPageObjectsList(fromSelectors.getTagsListPagination, fromActions.LoadSpecificPageForTagsList);
  }
}
