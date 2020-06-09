import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NbCardModule, NbLayoutModule, NbThemeModule } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { rootActions, rootReducers } from 'core/root-store';
import { getDebugElement, triggerMouseClick, MockComponent, TestStoreModule } from 'core/testing';
import { of } from 'rxjs';
import { LoginContainerComponent } from './login-container.component';

class FakeActivatedRoute {
  data = of({})
} 

describe('LoginContainerComponent', () => {
  let component: LoginContainerComponent;
  let fixture: ComponentFixture<LoginContainerComponent>;
  let store: Store<rootReducers.IState>;
  let dispatch: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginContainerComponent,
        MockComponent({ selector: 'core-login', inputs: ['authenticationState'], outputs: ['sendLogin'] }),
        MockComponent({ selector: 'core-forgot-password', inputs: ['inProgress'], outputs: ['sendForgotPassword'] }),
        MockComponent({ selector: 'core-logo' }),
      ],
      imports: [
        TestStoreModule,
        NbThemeModule.forRoot(),
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
        CommonModule,
        NbCardModule,
        NbLayoutModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: new FakeActivatedRoute() }
      ]
    })
    .overrideComponent(LoginContainerComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    dispatch = spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(LoginContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSendLogin', () => {
    it('should dispatch StartValidation', () => {
      const loginRequest = { username: 'username', password: 'password' };
      component.onSendLogin(loginRequest);

      expect(dispatch).toHaveBeenCalledWith(new rootActions.StartValidation(loginRequest));
    });
  });

  describe('onSendForgotPassword', () => {
    it('should dispatch StartValidation', () => {
      const email = 'email@gmail.com';

      component.onSendForgotPassword(email);

      expect(dispatch).toHaveBeenCalledWith(new rootActions.ForgotPassword(email));
    });
  });

  describe('click on forms links', () => {
    it('should display forgot password form if click on forgot password link', fakeAsync(() => {
      component.isForgotPasswordDisplayed = false;

      triggerMouseClick(fixture, '.forms-links-container div');
      tick();
      
      fixture.detectChanges();
      expect(getDebugElement(fixture, 'core-forgot-password')).toBeTruthy();
    }));

    it('should display forgot password form if click on login link', fakeAsync(() => {
      component.isForgotPasswordDisplayed = true;
      fixture.detectChanges();

      triggerMouseClick(fixture, '.forms-links-container div');
      tick();
      
      fixture.detectChanges();
      expect(getDebugElement(fixture, 'core-login')).toBeTruthy();
    }));
  });

  describe('display version information', () => {
    it('should display information if displayVersionInformation is true', () => {
      component.displayVersionInformation = true;
      fixture.detectChanges();

      const element = getDebugElement(fixture, '.login-version-information-container');

      expect(element).toBeTruthy();
    });

    it('should not display information if displayVersionInformation is false', () => {
      component.displayVersionInformation = false;
      fixture.detectChanges();

      const element = getDebugElement(fixture, '.login-version-information-container');

      expect(element).toBeFalsy();
    });
  });
});
