import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NbSpinnerModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { triggerMouseClick } from 'core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotPasswordComponent ],
      imports: [
        FormsModule,
        NbSpinnerModule,
        TranslateModule.forRoot(),
      ]
    })
    .overrideComponent(ForgotPasswordComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;

    spyOn(component.sendForgotPassword, 'emit');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('click forgot password button', () => {
    it('should emit sendForgotPassword', () => {
      component.email = 'email';
      triggerMouseClick(fixture, 'button');

      expect(component.sendForgotPassword.emit).toHaveBeenCalledWith('email');
    });
  });
});
