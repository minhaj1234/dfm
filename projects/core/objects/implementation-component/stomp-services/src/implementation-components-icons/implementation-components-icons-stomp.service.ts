import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Message } from '@stomp/stompjs';
import { eventType, ISocketMessage } from 'core/models';
import * as fromStore from 'core/objects/implementation-component/store';
import { AuthStompService } from 'core/stomp-services';
import { map } from 'rxjs/operators';

@Injectable()
export class ImplementationComponentIconsStompService {
  private handlers: Partial<Record<eventType, (ISocketMessage) => void>> = {
    create: this.createHandler,
    delete: this.deleteHandler,
    update: this.updateHandler,
  };

  constructor(
    private authStompService: AuthStompService,
    private implementationComponentIconsStore: Store<fromStore.DecisionFirstImplementationComponentsIconsState>,
  ) {
    this.subscribeCustomerEvents();
  }

  subscribeCustomerEvents() {
    const stompSubscription = this.authStompService.subscribe(`/implementation-component-icons`);
    stompSubscription
      .pipe(map((message: Message) => JSON.parse(message.body)))
      .subscribe((message: ISocketMessage) => {
        this.handlers[message.eventType].call(this, message);
      });
  }

  createHandler(socketMessage: ISocketMessage): void {
    this.implementationComponentIconsStore.dispatch(new fromStore.LoadImplementationComponentsIcons());
  }

  deleteHandler(socketMessage: ISocketMessage): void {
    this.implementationComponentIconsStore.dispatch(new fromStore.RemovelementationComponentIconFromLocalMemory(socketMessage.resourceId));
  }

  updateHandler(socketMessage: ISocketMessage): void {
    this.implementationComponentIconsStore.dispatch(new fromStore.LoadImplementationComponentsIcons());
  }
}
