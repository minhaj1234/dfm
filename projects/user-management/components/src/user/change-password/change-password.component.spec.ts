import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbAlertModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { triggerMouseClick } from 'core/testing';
import { ChangePasswordComponent } from './change-password.component';
import { ERROR_MESSAGES } from './change-password.const';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ChangePasswordComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NbAlertModule,
        TranslateModule.forRoot(),
      ],
    })
    .overrideComponent(ChangePasswordComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    component.formState = {
      displayChangePassword: false,
      changePasswordError: false
    };

    spyOn(component.openForm, 'emit');
    spyOn(component.closeForm, 'emit');
    spyOn(component.changePassword, 'emit');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('click open form button', () => {
    it('should emit openForm', () => {
      triggerMouseClick(fixture, '.open-form-button');

      expect(component.openForm.emit).toHaveBeenCalled();
    });
  });

  describe('click close form button', () => {
    it('should emit closeForm', () => {
      component.formState = {
        displayChangePassword: true,
        changePasswordError: false
      };
      fixture.detectChanges();

      triggerMouseClick(fixture, '.close-form-button');

      expect(component.closeForm.emit).toHaveBeenCalled();
    });
  });

  describe('displayForm', () => {
    it('should reset form value if displayForm is false', () => {
      setFormValidData();
      
      component.formState = {
        displayChangePassword: false,
        changePasswordError: false
      };
      expect(component.form.value).toEqual({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    });
  });

  describe('setValidationErrorMessages', () => {
    it('should set empty array if there are no validation errors', () => {
      setFormValidData();

      component.setValidationErrorMessages();

      expect(component.validationErrorMessages).toEqual([]);
    });

    it('should set minlength error messages', () => {
      component.form.setValue({
        oldPassword: 'oldPassword',
        newPassword: '1',
        confirmPassword: '1',
      });

      component.setValidationErrorMessages();

      expect(component.validationErrorMessages).toEqual([ERROR_MESSAGES.minlength]);
    });

    it('should set maxlength error messages', () => {
      component.form.setValue({
        oldPassword: 'oldPassword',
        newPassword: '1'.repeat(65),
        confirmPassword: '1'.repeat(65),
      });

      component.setValidationErrorMessages();

      expect(component.validationErrorMessages).toEqual([ERROR_MESSAGES.maxlength]);
    });

    it('should set matchPassword error messages', () => {
      component.form.setValue({
        oldPassword: 'oldPassword',
        newPassword: '123456789',
        confirmPassword: '1234567890',
      });

      component.setValidationErrorMessages();

      expect(component.validationErrorMessages).toEqual([ERROR_MESSAGES.matchPassword]);
    });

    it('should set multiple errors error messages', () => {
      component.form.setValue({
        oldPassword: 'oldPassword',
        newPassword: '1',
        confirmPassword: '1234567890',
      });

      component.setValidationErrorMessages();

      expect(component.validationErrorMessages.sort()).toEqual([
        ERROR_MESSAGES.matchPassword,
        ERROR_MESSAGES.minlength,
      ]
        .sort());
    });
  });

  describe('change password button click', () => {
    it('should emit changePassword if form is valid', () => {
      component.formState = {
        displayChangePassword: true,
        changePasswordError: false
      };
      setFormValidData();
      fixture.detectChanges();

      triggerMouseClick(fixture, '.change-password-button');

      expect(component.changePassword.emit).toHaveBeenCalled();
    });

    it('should not emit changePassword if form is invalid', () => {
      component.formState = {
        displayChangePassword: true,
        changePasswordError: false
      };
      fixture.detectChanges();

      triggerMouseClick(fixture, '.change-password-button');

      expect(component.changePassword.emit).not.toHaveBeenCalled();
    });

    it('should set displayIncorrectPasswordError to false', () => {
      component.formState = {
        displayChangePassword: true,
        changePasswordError: true
      };
      setFormValidData();
      fixture.detectChanges();

      triggerMouseClick(fixture, '.change-password-button');

      expect(component.doDisplayIncorrectPasswordError()).toBeFalsy();
    });
  });

  function setFormValidData(): void {
    component.form.setValue({
      oldPassword: 'oldPassword',
      newPassword: 'newPassword',
      confirmPassword: 'newPassword',
    });
  }
});
