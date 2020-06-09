import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Message } from '@stomp/stompjs';
import { eventType, ISocketMessage } from 'core/models';
import * as fromTabsStore from 'core/objects/tabs/store';
import { AuthStompService } from 'core/stomp-services';
import { combineLatest } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { User } from 'user-management/models';
import * as fromActions from 'user-management/store/actions';
import { IDecisionFirstState } from 'user-management/store/reducers';
import * as fromSelectors from 'user-management/store/selectors';
import { CommonStompService } from './common-stomp.service';

const ACTIONS_MAPPING = { loadObjectAction: fromActions.LoadUser };

@Injectable()
export class UserStompService extends CommonStompService {
  private handlers: Partial<Record<eventType, (ISocketMessage) => void>> = {
    create: this.createHandler,
    delete: this.deleteHandler,
    update: this.updateHandler,
    linkUpdate: this.linkUpdateHandler,
    linkDelete: this.linkDeleteHandler,
  };

  constructor(
    private authStompService: AuthStompService,
    private adminStore: Store<IDecisionFirstState>,
  ) {
    super(adminStore);
    this.actionsMapping = ACTIONS_MAPPING;
    this.subscribeUserEvents();
  }

  subscribeUserEvents() {
    const stompSubscription = this.authStompService.subscribe(`/users`);
    stompSubscription
      .pipe(map((message: Message) => JSON.parse(message.body)))
      .subscribe((message: ISocketMessage) => {
        this.handlers[message.eventType].call(this, message);
      });
  }

  createHandler(socketMessage: ISocketMessage): void { 
    this.updateRelationObjects(socketMessage.linkData);
  }

  updateHandler(socketMessage: ISocketMessage): void {
    this.updateObjectTabHandler(socketMessage);
    this.updateChildUsers(socketMessage);
  }

  deleteHandler(socketMessage: ISocketMessage): void {
    this.updateRelationObjects(socketMessage.linkData);
    this.adminStore.dispatch(new fromTabsStore.RemoveTab(socketMessage.resourceId));
  }

  linkUpdateHandler(socketMessage: ISocketMessage): void { 
    this.updateObjectTabHandler(socketMessage);
    this.updateRelationObjects(socketMessage.linkData);
  }

  linkDeleteHandler(socketMessage: ISocketMessage): void { 
    this.updateObjectTabHandler(socketMessage);
    this.updateRelationObjects(socketMessage.linkData);
  }

  updateChildUsers(socketMessage: ISocketMessage): void {
    combineLatest([
      this.adminStore.pipe(select(fromSelectors.getLoadedCustomersUsers)),
      this.adminStore.pipe(select(fromSelectors.getLoadedGroupsUsers))
    ])
      .pipe(
        map(([
          usersCustomers,
          usersGroups
        ]) => [
          ...usersCustomers,
          ...usersGroups
        ]),
        first(),
      )
      .subscribe((childUsers: User[]) => {
        if (childUsers.some((user: User) => user.id === socketMessage.resourceId)) {
          this.adminStore.dispatch(new fromActions.LoadUserAsChild(socketMessage.resourceId));
        }
      });
  }
}
