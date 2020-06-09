import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing';
import { DecisionAnswerSupportingInformationComponent } from './decision-answer-supporting-information.component';

describe('DecisionAnswerSupportingInformationComponent', () => {
  let component: DecisionAnswerSupportingInformationComponent;
  let fixture: ComponentFixture<DecisionAnswerSupportingInformationComponent>;
  const answerForm: FormGroup = new FormGroup({
    supportingInformation: new FormControl(),
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DecisionAnswerSupportingInformationComponent,
        MockComponent({ selector: 'core-edit-multiple-lines-control', inputs: ['formControlName', 'isRichEditor', 'rows', 'maxTextLength'] }, true),
      ],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionAnswerSupportingInformationComponent);
    component = fixture.componentInstance;
    component.answerForm = answerForm;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
