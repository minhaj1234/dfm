import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Message } from '@stomp/stompjs';
import { eventType, ISocketMessage } from 'core/models';
import { rootReducers } from 'core/root-store';
import { AuthStompService } from 'core/stomp-services';
import { combineLatest } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { InputData } from '../models/inputData.model';
import { IDecisionFirstState } from '../store';
import * as fromActions from '../store/actions';
import * as fromSelectors from '../store/selectors';
import { CommonStompService } from './common-stomp.service';

const ACTIONS_MAPPING = { loadObjectAction: fromActions.LoadInputData };

@Injectable()
export class InputDataStompService extends CommonStompService {
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
    this.subscribeInputDataEvents();
  }

  subscribeInputDataEvents(): void {
    const stompSubscription = this.authStompService.subscribe(`/input-datas`);
    stompSubscription
      .pipe(map((message: Message) => JSON.parse(message.body)))
      .subscribe((message: ISocketMessage) => {
        this.handlers[message.eventType].call(this, message);
      });
  }

  createHandler(socketMessage: ISocketMessage): void {
    this.updateSelfPageForSearchLists();
    this.updateSelfPageInputDataList();
    this.updateSelfPageDiagrammingElementsList();
  }

  updateHandler(socketMessage: ISocketMessage): void {
    this.updateObjectTabHandler(socketMessage);
    this.updateChildInputData(socketMessage);
    this.updateSelfPageForSearchLists();
    this.updateSelfPageInputDataList();
    this.updateSelfPageDiagrammingElementsList();
  }

  deleteHandler(socketMessage: ISocketMessage): void {
    this.modelerStore.dispatch(new fromActions.RemoveTab(socketMessage.resourceId));
    this.updateSelfPageForSearchLists();
    this.updateSelfPageInputDataList();
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

  updateSelfPageInputDataList(): void {
    this.updateSelfPageObjectsList(
      fromSelectors.getInputDataListPagination, fromActions.LoadSpecificPageForInputDataList);
  }

  updateChildInputData(socketMessage: ISocketMessage): void {
    combineLatest([
      this.modelerStore.pipe(select(fromSelectors.getLoadedDiagramsInputData)),
      this.modelerStore.pipe(select(fromSelectors.getLoadedDecisionsInputData)),
      this.modelerStore.pipe(select(fromSelectors.getLoadedKnowledgeSourcesInputData)),
      this.modelerStore.pipe(select(fromSelectors.getLoadedOrganizationsInputData)),
    ])
      .pipe(
        map(([
          inputDataDiagrams,
          inputDataDecisions,
          inputDataKnowledgeSources,
          inputDataOrganizations
        ]) => [
          ...inputDataDiagrams,
          ...inputDataDecisions,
          ...inputDataKnowledgeSources,
          ...inputDataOrganizations
        ]),
        first(),
      )
      .subscribe((childInputData) => {
        if (childInputData.some((inputData: InputData) => inputData.id === socketMessage.resourceId)) {
          this.modelerStore.dispatch(new fromActions.LoadInputDataAsChild(socketMessage.resourceId));
        }
      });
  }
}
