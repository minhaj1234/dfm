import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NbThemeModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { DmsThemeModule } from '../../../../../theme';
import { DecisionAnswerYesNoComponent } from './decision-answer-yes-no.component';

describe('DecisionAnswerYesNoComponent', () => {
  let component: DecisionAnswerYesNoComponent;
  let fixture: ComponentFixture<DecisionAnswerYesNoComponent>;
  const answerForm = new FormGroup({
    yesNo: new FormControl(),
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DecisionAnswerYesNoComponent],
      imports: [DmsThemeModule, NbThemeModule.forRoot(), ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionAnswerYesNoComponent);
    component = fixture.componentInstance;
    component.answerForm = answerForm;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
