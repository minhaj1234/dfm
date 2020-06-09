import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Message } from '@stomp/stompjs';
import { eventType, ISocketMessage } from 'core/models';
import { rootReducers } from 'core/root-store';
import { AuthStompService } from 'core/stomp-services';
import { combineLatest } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { ImplementationComponent } from '../models/implementationComponent.model';
import { IDecisionFirstState } from '../store';
import * as fromActions from '../store/actions';
import * as fromSelectors from '../store/selectors';
import { CommonStompService } from './common-stomp.service';

const ACTIONS_MAPPING = { loadObjectAction: fromActions.LoadImplementationComponent };

@Injectable()
export class ImplementationComponentStompService extends CommonStompService {
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
    this.subscribeImplementationComponentsEvents();
  }

  subscribeImplementationComponentsEvents(): void {
    const stompSubscription = this.authStompService.subscribe(`/implementation-components`);
    stompSubscription
      .pipe(map((message: Message) => JSON.parse(message.body)))
      .subscribe((message: ISocketMessage) => {
        this.handlers[message.eventType].call(this, message);
      });
  }

  createHandler(socketMessage: ISocketMessage): void {
    this.updateSelfPageForSearchLists();
    this.updateSelfPageImplementationComponentsList();
  }

  updateHandler(socketMessage: ISocketMessage): void {
    this.updateObjectTabHandler(socketMessage);
    this.updateChildImplementationComponents(socketMessage);
    this.updateSelfPageForSearchLists();
    this.updateSelfPageImplementationComponentsList();
  }

  deleteHandler(socketMessage: ISocketMessage): void {
    this.modelerStore.dispatch(new fromActions.RemoveTab(socketMessage.resourceId));
    this.updateSelfPageForSearchLists();
    this.updateSelfPageImplementationComponentsList();
  }

  linkUpdateHandler(socketMessage: ISocketMessage): void {
    this.updateObjectTabHandler(socketMessage);
    this.updateRelationObjects(socketMessage.linkData);
  }

  linkDeleteHandler(socketMessage: ISocketMessage): void {
    this.updateObjectTabHandler(socketMessage);
    this.updateRelationObjects(socketMessage.linkData);
  }

  updateSelfPageImplementationComponentsList(): void {
    this.updateSelfPageObjectsList(
      fromSelectors.getImplementationComponentsListPagination, fromActions.LoadSpecificPageForImplementationComponentsList);
  }

  updateChildImplementationComponents(socketMessage: ISocketMessage): void {
    combineLatest([
      this.modelerStore.pipe(select(fromSelectors.getLoadedDecisionsImplementationComponents))
    ])
      .pipe(
        map(([implementationComponentsDecisions]) => [...implementationComponentsDecisions]),
        first(),
      )
      .subscribe((childImplementationComponents) => {
        if (childImplementationComponents.some((implementationComponent: ImplementationComponent) =>
          implementationComponent.id === socketMessage.resourceId)) {
          this.modelerStore.dispatch(new fromActions.LoadImplementationComponentAsChild(socketMessage.resourceId));
        }
      });
  }
}
