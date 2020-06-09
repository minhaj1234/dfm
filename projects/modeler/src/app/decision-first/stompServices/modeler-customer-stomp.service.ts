import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ISocketMessage } from 'core/models';
import { AuthStompService } from 'core/stomp-services';
import { CustomerStompService } from 'user-management/stomp-services';
import { IDecisionFirstState } from 'user-management/store/reducers';
import * as fromActions from '../store/actions';
import { CommonStompService } from './common-stomp.service';

@Injectable()
export class ModelerCustomerStompService extends CustomerStompService {
  constructor(
    authStompService: AuthStompService,
    private modelerStore: Store<IDecisionFirstState>,
    private commonStompService: CommonStompService
  ) {
    super(authStompService, modelerStore);
  }

  updateHandler(socketMessage: ISocketMessage): void {
    this.updateObjectTabHandler(socketMessage); 
    this.commonStompService.updateAdminTab([socketMessage.resourceId], fromActions.LoadCustomer);
  }
}
