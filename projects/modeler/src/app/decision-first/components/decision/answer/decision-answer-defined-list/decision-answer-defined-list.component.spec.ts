import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { triggerMouseClick } from 'core/testing';
import { DmsThemeModule } from '../../../../../theme';
import { AnswerItem } from '../../../../models/decision.model';
import { DecisionAnswerDefinedListComponent } from './decision-answer-defined-list.component';

describe('DecisionAnswerDefinedListComponent', () => {
  let component: DecisionAnswerDefinedListComponent;
  let fixture: ComponentFixture<DecisionAnswerDefinedListComponent>;
  const answerItems = [{ id: '300', value: 'Answer Item 300' }, { id: '301', value: 'Answer Item 301' }] as AnswerItem[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DecisionAnswerDefinedListComponent,
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
    fixture = TestBed.createComponent(DecisionAnswerDefinedListComponent);
    component = fixture.componentInstance;
    const answerForm = new FormGroup({
      answerItems: new FormControl(answerItems),
      defaultAnswerItemId: new FormControl('301'),
    });
    component.answerItems = answerItems;
    component.answerForm = answerForm;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create new answer item', () => {
    expect(component.answerForm.controls.answerItems.value.length).toBe(2);
    component.newAnswerItemValue = 'new answer item';
    triggerMouseClick(fixture, '#btnAddAnswerItem');
    expect(component.answerForm.controls.answerItems.value.length).toBe(3);
    expect(component.answerForm.controls.answerItems.value[2].value).toBe('new answer item');
  });

  it('should remove answer item without change default answer item', () => {
    expect(component.answerForm.controls.answerItems.value.length).toBe(2);
    triggerMouseClick(fixture, '#remove-answer-item-300');
    expect(component.answerForm.controls.answerItems.value.length).toBe(1);
    expect(component.answerForm.controls.defaultAnswerItemId.value).toEqual('301');
  });

  it('should remove answer item with change default answer item', () => {
    expect(component.answerForm.controls.answerItems.value.length).toBe(2);
    triggerMouseClick(fixture, '#remove-answer-item-301');
    expect(component.answerForm.controls.answerItems.value.length).toBe(1);
    expect(component.answerForm.controls.defaultAnswerItemId.value).toEqual(null);
  });
});
