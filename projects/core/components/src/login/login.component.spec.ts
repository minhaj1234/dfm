import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NbAlertModule, NbSpinnerModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { triggerMouseClick } from 'core/testing';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NbAlertModule,
        NbSpinnerModule,
        TranslateModule.forRoot(),
      ]
    })
    .overrideComponent(LoginComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    component.authenticationState = { authenticationInProgress: false, authenticationError: false, authorizationError: false };
    fixture.detectChanges();

    spyOn(component.sendLogin, 'emit');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('click login', () => {
    it('should emit sendLogin if form is valid', () => {
      component.form.setValue({
        username: 'name@gmail.com',
        password: 'password'
      });

      triggerMouseClick(fixture, '.btn-info');

      expect(component.sendLogin.emit).toHaveBeenCalledWith({
        username: 'name@gmail.com',
        password: 'password'
      });
    });

    it('should not emit sendLogin if form is not valid', () => {
      triggerMouseClick(fixture, '.btn-info');

      expect(component.sendLogin.emit).not.toHaveBeenCalled();
    });
  });

  describe('loginButtonAvailable', () => {
    it('should return true if inProgress and submitAttempted are equal false', () => {
      component.authenticationState = { authenticationInProgress: false, authenticationError: false, authorizationError: false };

      const results = component.loginButtonAvailable();

      expect(results).toBeTruthy();
    });

    it('should return false if inProgress is true', () => {
      component.authenticationState = { authenticationInProgress: true, authenticationError: false, authorizationError: false };

      const results = component.loginButtonAvailable();

      expect(results).toBeFalsy();
    });

    it('should return false if submitAttempted is true and authentication error is false', () => {
      component.authenticationState = { authenticationInProgress: false, authenticationError: false, authorizationError: false };
      triggerMouseClick(fixture, '.btn-info');

      const results = component.loginButtonAvailable();

      expect(results).toBeFalsy();
    });

    it('should return true if submitAttempted and authentication error are equal true', () => {
      component.authenticationState = { authenticationInProgress: false, authenticationError: true, authorizationError: false };
      triggerMouseClick(fixture, '.btn-info');

      const results = component.loginButtonAvailable();

      expect(results).toBeTruthy();
    });
  });
});
