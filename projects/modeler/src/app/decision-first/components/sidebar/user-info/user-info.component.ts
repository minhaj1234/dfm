import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { rootReducers, rootSelectors } from 'core/root-store';
import { Observable } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  userInfo$: Observable<rootReducers.authenticationReducer.IAuthenticationState>;

  constructor(
    private rootStore: Store<rootReducers.authenticationReducer.IAuthenticationState>,
  ) { }

  ngOnInit() {
    this.userInfo$ = this.rootStore.pipe(select(rootSelectors.getAuthenticationState));
  }
}
