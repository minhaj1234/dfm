import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NbThemeModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { DmsThemeModule } from '../../../../../theme';
import { DecisionAnswerTypeComponent } from './decision-answer-type.component';

describe('DecisionAnswerTypeComponent', () => {
  let component: DecisionAnswerTypeComponent;
  let fixture: ComponentFixture<DecisionAnswerTypeComponent>;
  const answerForm = new FormGroup({
    answerTypeId: new FormControl(),
    isCollection: new FormControl(),
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DecisionAnswerTypeComponent],
      imports: [DmsThemeModule, NbThemeModule.forRoot(), ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionAnswerTypeComponent);
    component = fixture.componentInstance;
    component.answerForm = answerForm;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
