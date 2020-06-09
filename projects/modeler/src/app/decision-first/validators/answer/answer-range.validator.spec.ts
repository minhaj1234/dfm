import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { answerRangeValidator } from './answer-range.validator';

@Component({
  template: `
    <form [formGroup]='answerForm'>
      <input type="number" formControlName='minimum' />
      <input type="number" formControlName='maximum' />
      <input type="number" formControlName='default' />
    </form>
  `,
})
class TestAnswerRangeValidatorComponent {
  answerForm = new FormGroup({
    minimum: new FormControl(1, [answerRangeValidator('minimum', 'maximum', 'default')]),
    maximum: new FormControl(10, [answerRangeValidator('minimum', 'maximum', 'default')]),
    default: new FormControl(5, [answerRangeValidator('minimum', 'maximum', 'default')]),
  });
}

describe('answerRangeValidator', () => {
  let component: TestAnswerRangeValidatorComponent;
  let fixture: ComponentFixture<TestAnswerRangeValidatorComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, ReactiveFormsModule],
      declarations: [TestAnswerRangeValidatorComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(TestAnswerRangeValidatorComponent);
    component = fixture.componentInstance;
  });

  it('should work without validation errors', () => {
    expect(component.answerForm.controls['minimum'].errors).toBe(null);
    expect(component.answerForm.controls['maximum'].errors).toBe(null);
    expect(component.answerForm.controls['default'].errors).toBe(null);
  });

  it('should work without validation error for minimum value', () => {
    component.answerForm.patchValue({
      minimum: 2,
    });
    expect(component.answerForm.controls['minimum'].errors).toEqual(null);
  });

  it('should work with validation errors for minimum value', () => {
    component.answerForm.patchValue({
      minimum: 6,
    });
    expect(component.answerForm.controls['minimum'].errors).toEqual({ invalid: true });
  });

  it('should work without validation error for maximum value', () => {
    component.answerForm.patchValue({
      maximum: 9,
    });
    expect(component.answerForm.controls['maximum'].errors).toEqual(null);
  });

  it('should work with validation errors for maximum value', () => {
    component.answerForm.patchValue({
      maximum: 4,
    });
    expect(component.answerForm.controls['maximum'].errors).toEqual({ invalid: true });
  });

  it('should work without validation error for default value', () => {
    component.answerForm.patchValue({
      default: 6,
    });
    expect(component.answerForm.controls['default'].errors).toEqual(null);
  });

  it('should work with validation errors for default value', () => {
    component.answerForm.patchValue({
      default: 11,
    });
    expect(component.answerForm.controls['default'].errors).toEqual({ invalid: true });
  });
});
