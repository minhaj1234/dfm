import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Message } from '@stomp/stompjs';
import { eventType, ISocketMessage } from 'core/models';
import * as fromTabsStore from 'core/objects/tabs/store';
import { AuthStompService } from 'core/stomp-services';
import { first, map } from 'rxjs/operators';
import * as fromActions from 'user-management/store/actions';
import { IDecisionFirstState } from 'user-management/store/reducers';
import * as fromSelectors from 'user-management/store/selectors';
import { CommonStompService } from './common-stomp.service';

const ACTIONS_MAPPING = { loadObjectAction: fromActions.LoadCustomer };

@Injectable()
export class CustomerStompService  extends CommonStompService {
  private handlers: Partial<Record<eventType, (ISocketMessage) => void>> = {
    create: this.createHandler,
    delete: this.deleteHandler,
    update: this.updateHandler,
    linkUpdate: this.linkUpdateHandler,
    linkDelete: this.linkDeleteHandler,
  };

  constructor(
    private authStompService: AuthStompService,
    private userManagementStore: Store<IDecisionFirstState>,
  ) {
    super(userManagementStore);
    this.actionsMapping = ACTIONS_MAPPING;
    this.subscribeCustomerEvents();
  }

  subscribeCustomerEvents() {
    const stompSubscription = this.authStompService.subscribe(`/accounts`);
    stompSubscription
      .pipe(map((message: Message) => JSON.parse(message.body)))
      .subscribe((message: ISocketMessage) => {
        this.handlers[message.eventType].call(this, message);
      });
  }

  createHandler(socketMessage: ISocketMessage): void {
    this.updateSelfPageCustomersList();
  }

  updateHandler(socketMessage: ISocketMessage): void {
    this.updateSelfPageCustomersList();
    this.updateObjectTabHandler(socketMessage);
  }

  deleteHandler(socketMessage: ISocketMessage): void {
    this.updateSelfPageCustomersList();
    this.userManagementStore.dispatch(new fromTabsStore.RemoveTab(socketMessage.resourceId));
  }

  linkUpdateHandler(socketMessage: ISocketMessage): void { }

  linkDeleteHandler(socketMessage: ISocketMessage): void { }

  updateSelfPageCustomersList(): void {
    this.userManagementStore.pipe(select(fromSelectors.getCustomersListState))
      .pipe(
        first(),
      )
      .subscribe(() => {
        this.updateSelfPageObjectsList(
          fromSelectors.getCustomersListPagination, fromActions.LoadSpecificPageForCustomersList
        );
      });
  }
}
