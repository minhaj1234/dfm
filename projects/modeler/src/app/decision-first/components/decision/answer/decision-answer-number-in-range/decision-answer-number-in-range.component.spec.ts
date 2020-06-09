import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { DecisionAnswerNumberInRangeComponent } from './decision-answer-number-in-range.component';

describe('DecisionAnswerNumberInRangeComponent', () => {
  let component: DecisionAnswerNumberInRangeComponent;
  let fixture: ComponentFixture<DecisionAnswerNumberInRangeComponent>;
  const answerForm = new FormGroup({
    minimumNumber: new FormControl(),
    maximumNumber: new FormControl(),
    defaultNumber: new FormControl(),
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DecisionAnswerNumberInRangeComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionAnswerNumberInRangeComponent);
    component = fixture.componentInstance;
    component.answerForm = answerForm;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('validators', () => {
    function setInputValue(selector: string, value: string) {
      const input = fixture.debugElement.query(By.css(selector)).nativeElement;
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }

    beforeEach(() => {
      spyOn(component.answerForm.controls['minimumNumber'], 'updateValueAndValidity');
      spyOn(component.answerForm.controls['maximumNumber'], 'updateValueAndValidity');
      spyOn(component.answerForm.controls['defaultNumber'], 'updateValueAndValidity');
    });

    it('should call after change minimum number', () => {
      setInputValue('#minimumNumber', '1');

      expect(component.answerForm.controls['minimumNumber'].updateValueAndValidity).toHaveBeenCalled();
      expect(component.answerForm.controls['maximumNumber'].updateValueAndValidity).toHaveBeenCalled();
      expect(component.answerForm.controls['defaultNumber'].updateValueAndValidity).toHaveBeenCalled();
    });

    it('should call after change maximum number', () => {
      setInputValue('#maximumNumber', '1');

      expect(component.answerForm.controls['minimumNumber'].updateValueAndValidity).toHaveBeenCalled();
      expect(component.answerForm.controls['maximumNumber'].updateValueAndValidity).toHaveBeenCalled();
      expect(component.answerForm.controls['defaultNumber'].updateValueAndValidity).toHaveBeenCalled();
    });

    it('should call after change default number', () => {
      setInputValue('#defaultNumber', '1');

      expect(component.answerForm.controls['minimumNumber'].updateValueAndValidity).toHaveBeenCalled();
      expect(component.answerForm.controls['maximumNumber'].updateValueAndValidity).toHaveBeenCalled();
      expect(component.answerForm.controls['defaultNumber'].updateValueAndValidity).toHaveBeenCalled();
    });
  });
});
