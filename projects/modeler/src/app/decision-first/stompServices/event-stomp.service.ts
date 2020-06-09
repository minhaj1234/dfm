import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Message } from '@stomp/stompjs';
import { eventType, ISocketMessage } from 'core/models';
import { rootReducers } from 'core/root-store';
import { AuthStompService } from 'core/stomp-services';
import { combineLatest } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Event } from '../models/events.model';
import { IDecisionFirstState } from '../store';
import * as fromActions from '../store/actions';
import * as fromSelectors from '../store/selectors';
import { CommonStompService } from './common-stomp.service';

const ACTIONS_MAPPING = { loadObjectAction: fromActions.LoadEvent };

@Injectable()
export class EventStompService extends CommonStompService {
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
    this.subscribeEventObjectsEvents();
  }

  subscribeEventObjectsEvents(): void {
    const stompSubscription = this.authStompService.subscribe(`/events`);
    stompSubscription
      .pipe(map((message: Message) => JSON.parse(message.body)))
      .subscribe((message: ISocketMessage) => {
        this.handlers[message.eventType].call(this, message);
      });
  }

  createHandler(socketMessage: ISocketMessage): void {
    this.updateSelfPageForSearchLists();
    this.updateSelfPageEventsList();
  }

  updateHandler(socketMessage: ISocketMessage): void {
    this.updateObjectTabHandler(socketMessage);
    this.updateChildEvents(socketMessage);
    this.updateSelfPageForSearchLists();
    this.updateSelfPageEventsList();
  }

  deleteHandler(socketMessage: ISocketMessage): void {
    this.modelerStore.dispatch(new fromActions.RemoveTab(socketMessage.resourceId));
    this.updateSelfPageForSearchLists();
    this.updateSelfPageEventsList();
  }

  linkUpdateHandler(socketMessage: ISocketMessage): void {
    this.updateObjectTabHandler(socketMessage);
    this.updateRelationObjects(socketMessage.linkData);
  }

  linkDeleteHandler(socketMessage: ISocketMessage): void {
    this.updateObjectTabHandler(socketMessage);
    this.updateRelationObjects(socketMessage.linkData);
  }

  updateSelfPageEventsList(): void {
    this.updateSelfPageObjectsList(fromSelectors.getEventsListPagination, fromActions.LoadSpecificPageForEventsList);
  }

  updateChildEvents(socketMessage: ISocketMessage): void {
    combineLatest([
      this.modelerStore.pipe(select(fromSelectors.getLoadedDecisionsEvents)),
    ])
      .pipe(
        map(([decisionsEvent]) => [...decisionsEvent]),
        first(),
      )
      .subscribe((childEvents) => {
        if (childEvents.some((event: Event) => event.id === socketMessage.resourceId)) {
          this.modelerStore.dispatch(new fromActions.LoadEventAsChild(socketMessage.resourceId));
        }
      });
  }
}
