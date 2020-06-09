import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ISocketMessage } from 'core/models';
import { AuthStompService } from 'core/stomp-services';
import { GroupStompService } from 'user-management/stomp-services';
import { IDecisionFirstState } from 'user-management/store/reducers';
import * as fromActions from '../store/actions';
import { CommonStompService } from './common-stomp.service';

@Injectable()
export class ModelerGroupStompService extends GroupStompService {
  constructor(
    authStompService: AuthStompService,
    private modelerStore: Store<IDecisionFirstState>,
    private commonStompService: CommonStompService
  ) {
    super(authStompService, modelerStore);
  }

  createHandler(socketMessage: ISocketMessage): void {
    this.updateRelationObjects(socketMessage.linkData);
    this.commonStompService.updateAdminTab(socketMessage.linkData, fromActions.LoadCustomer);
  }

  deleteHandler(socketMessage: ISocketMessage): void {
    this.updateRelationObjects(socketMessage.linkData);
    this.commonStompService.updateAdminTab(socketMessage.linkData, fromActions.LoadCustomer);
    this.modelerStore.dispatch(new fromActions.RemoveTab(socketMessage.resourceId));
  }
}
