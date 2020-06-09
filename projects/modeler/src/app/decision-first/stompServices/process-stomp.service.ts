import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Message } from '@stomp/stompjs';
import { eventType, ISocketMessage } from 'core/models';
import { rootReducers } from 'core/root-store';
import { AuthStompService } from 'core/stomp-services';
import { combineLatest } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Process } from '../models/process.model';
import { IDecisionFirstState } from '../store';
import * as fromActions from '../store/actions';
import * as fromSelectors from '../store/selectors';
import { CommonStompService } from './common-stomp.service';

const ACTIONS_MAPPING = { loadObjectAction: fromActions.LoadProcess };

@Injectable()
export class ProcessStompService extends CommonStompService {
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
    this.subscribeProcessesEvents();
  }

  subscribeProcessesEvents(): void {
    const stompSubscription = this.authStompService.subscribe(`/processes`);
    stompSubscription
      .pipe(map((message: Message) => JSON.parse(message.body)))
      .subscribe((message: ISocketMessage) => {
        this.handlers[message.eventType].call(this, message);
      });
  }

  createHandler(socketMessage: ISocketMessage): void {
    this.updateSelfPageForSearchLists();
    this.updateSelfPageProcessesList();
  }

  updateHandler(socketMessage: ISocketMessage): void {
    this.updateObjectTabHandler(socketMessage);
    this.updateChildProcesses(socketMessage);
    this.updateSelfPageForSearchLists();
    this.updateSelfPageProcessesList();
  }

  deleteHandler(socketMessage: ISocketMessage): void {
    this.modelerStore.dispatch(new fromActions.RemoveTab(socketMessage.resourceId));
    this.updateSelfPageForSearchLists();
    this.updateSelfPageProcessesList();
  }

  linkUpdateHandler(socketMessage: ISocketMessage): void {
    this.updateObjectTabHandler(socketMessage);
    this.updateRelationObjects(socketMessage.linkData);
  }

  linkDeleteHandler(socketMessage: ISocketMessage): void {
    this.updateObjectTabHandler(socketMessage);
    this.updateRelationObjects(socketMessage.linkData);
  }

  updateSelfPageProcessesList(): void {
    this.updateSelfPageObjectsList(fromSelectors.getProcessesListPagination, fromActions.LoadSpecificPageForProcessesList);
  }

  updateChildProcesses(socketMessage: ISocketMessage): void {
    combineLatest([
      this.modelerStore.pipe(select(fromSelectors.getLoadedDecisionsProcesses))
    ])
      .pipe(
        map(([processesDecisions]) => [...processesDecisions]),
        first(),
      )
      .subscribe((childProcesses) => {
        if (childProcesses.some((process: Process) => process.id === socketMessage.resourceId)) {
          this.modelerStore.dispatch(new fromActions.LoadProcessAsChild(socketMessage.resourceId));
        }
      });
  }
}
