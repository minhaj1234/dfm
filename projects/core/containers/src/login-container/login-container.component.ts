import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { LoginRequest } from 'core/models';
import { rootActions, rootSelectors } from 'core/root-store';
import { IState } from 'core/root-store/reducers';
import { getUrlWithoutProtocol, getUrlWithProtocol } from 'core/utilities';
import { combineLatest, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { ILoginContainerState, LoginContainerOptions } from './login-container.const';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'core-login-container',
  templateUrl: './login-container.component.html',
  styleUrls: ['./login-container.component.scss'],
})
export class LoginContainerComponent implements OnInit {
  displayVersionInformation: boolean;
  isForgotPasswordDisplayed = false;
  loginContainerState$: Observable<ILoginContainerState>;
  getUrlWithoutProtocol = getUrlWithoutProtocol;
  getUrlWithProtocol = getUrlWithProtocol;
  
  constructor(private store: Store<IState>, private route: ActivatedRoute) {
    this.loginContainerState$ = combineLatest([
      this.store.select(rootSelectors.getAuthenticationState),
      this.store.select(rootSelectors.getVersionInformation)
    ])
    .pipe(
      map(([userState, versionInformation]) => {
        return {
          authenticationInProgress: userState.authenticationInProgress, 
          authenticationError: userState.authenticationError, 
          authorizationError: userState.authorizationError,
          forgotPasswordInProgress: userState.forgotPasswordInProgress,
          versionInformation: versionInformation.information,
          supportLink: versionInformation.supportLink,
        };
      }));
  }

  ngOnInit() {
    this.store.dispatch(new rootActions.LoadVersionInformation());
    this.subscribeRouteData();
  }

  subscribeRouteData(): void {
    this.route.data
      .pipe(
        first()
      )
      .subscribe((options: LoginContainerOptions) => {
        this.displayVersionInformation = options.displayVersionInformation;
      });
  }

  onSendLogin(loginRequest: LoginRequest): void {
    this.store.dispatch(new rootActions.StartValidation(loginRequest));
  }

  onSendForgotPassword(email: string): void {
    this.store.dispatch(new rootActions.ForgotPassword(email));
  }

  onToggleForm(): void {
    this.isForgotPasswordDisplayed = !this.isForgotPasswordDisplayed;
  }
}
