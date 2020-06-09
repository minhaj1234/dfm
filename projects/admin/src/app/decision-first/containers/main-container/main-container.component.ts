import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { TechnicalTabType } from 'core/models';
import { ImplementationComponentIconsStompService } from 'core/objects/implementation-component/stomp-services';
import { AuthStompService } from 'core/stomp-services';
import { CustomerStompService, GroupStompService, UserStompService } from 'user-management/stomp-services';
import { IDecisionFirstState } from '../../store';
import * as fromAdminStore from '../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    AuthStompService,
    CustomerStompService,
    UserStompService,
    GroupStompService,
    ImplementationComponentIconsStompService,
  ],
  selector: 'admin-main-container',
  styleUrls: ['./main-container.component.scss'],
  templateUrl: './main-container.component.html',
})
export class MainContainerComponent {
  constructor(
    private adminStore: Store<IDecisionFirstState>,
    private customerStompService: CustomerStompService,
    private userStompService: UserStompService,
    private groupStompService: GroupStompService,
    private implementationComponentIconsStompService: ImplementationComponentIconsStompService,
  ) {
    this.adminStore.dispatch(
      new fromAdminStore.AddTab({
        type: TechnicalTabType.Home,
      }),
    );
  }
}
