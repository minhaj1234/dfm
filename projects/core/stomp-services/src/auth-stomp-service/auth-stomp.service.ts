import { Injectable, Injector, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { StompConfig, StompRService } from '@stomp/ng2-stompjs';
import { stompBaseConfig } from 'core/config';
import { rootReducers, rootSelectors } from 'core/root-store';
import { APP_CONFIG } from 'core/services';
import { Subscription } from 'rxjs';

@Injectable()
export class AuthStompService extends StompRService implements OnDestroy {
  subscriptions: Subscription[] = [];
  rootUri: string;
  environment: string;
  config: StompConfig;

  constructor(injector: Injector, private store: Store<rootReducers.IState>) {
    super();
    this.rootUri = injector.get(APP_CONFIG).rootUri;
    this.environment = injector.get(APP_CONFIG).environment;
    this.initSocketConnection = this.initSocketConnection.bind(this);
    this.subscriptions.push(
      this.store.pipe(select(rootSelectors.getAccessToken)).subscribe(this.initSocketConnection),
    );
  }

  initSocketConnection(accessToken) {
    if (accessToken.length) {
      this.config = stompBaseConfig(`${this.rootUri}dfm?access_token=${accessToken}`, this.environment);
      this.initAndConnect();
    } else if (this.connected()) {
      this.disconnect();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
