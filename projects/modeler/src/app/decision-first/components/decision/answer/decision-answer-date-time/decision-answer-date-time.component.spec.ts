import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing';
import { DmsThemeModule } from '../../../../../theme';
import { DecisionAnswerDateTimeComponent } from './decision-answer-date-time.component';

describe('DecisionAnswerDateTimeComponent', () => {
  let component: DecisionAnswerDateTimeComponent;
  let fixture: ComponentFixture<DecisionAnswerDateTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DecisionAnswerDateTimeComponent,
        MockComponent({ selector: 'core-date-time-picker', inputs: ['formControlName'] }, true),
      ],
      imports: [
        DmsThemeModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot()
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionAnswerDateTimeComponent);
    component = fixture.componentInstance;
    const answerForm = new FormGroup({
      minimumDateTime: new FormControl(),
      maximumDateTime: new FormControl(),
      defaultDateTime: new FormControl(),
    });
    component.answerForm = answerForm;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('validators', () => {
    it('should call after change minimum datetime', () => {
      spyOn(component.answerForm.controls['maximumDateTime'], 'updateValueAndValidity');
      spyOn(component.answerForm.controls['defaultDateTime'], 'updateValueAndValidity');

      component.answerForm.patchValue({
        minimumDateTime: new Date(),
      });

      expect(component.answerForm.controls['maximumDateTime'].updateValueAndValidity).toHaveBeenCalled();
      expect(component.answerForm.controls['defaultDateTime'].updateValueAndValidity).toHaveBeenCalled();
    });

    it('should call after change maximum datetime', () => {
      spyOn(component.answerForm.controls['minimumDateTime'], 'updateValueAndValidity');
      spyOn(component.answerForm.controls['defaultDateTime'], 'updateValueAndValidity');

      component.answerForm.patchValue({
        maximumDateTime: new Date(),
      });

      expect(component.answerForm.controls['minimumDateTime'].updateValueAndValidity).toHaveBeenCalled();
      expect(component.answerForm.controls['defaultDateTime'].updateValueAndValidity).toHaveBeenCalled();
    });

    it('should call after change default datetime', () => {
      spyOn(component.answerForm.controls['minimumDateTime'], 'updateValueAndValidity');
      spyOn(component.answerForm.controls['maximumDateTime'], 'updateValueAndValidity');

      component.answerForm.patchValue({
        defaultDateTime: new Date(),
      });

      expect(component.answerForm.controls['minimumDateTime'].updateValueAndValidity).toHaveBeenCalled();
      expect(component.answerForm.controls['maximumDateTime'].updateValueAndValidity).toHaveBeenCalled();
    });
  });
});
