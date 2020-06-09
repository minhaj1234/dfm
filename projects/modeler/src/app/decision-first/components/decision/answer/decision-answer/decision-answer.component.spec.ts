import { DatePipe } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NbThemeModule } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'core/testing';
import { of, Observable } from 'rxjs';
import { DmsThemeModule } from '../../../../../theme';
import { Answer, AnswerType, Decision } from '../../../../models/decision.model';
import { DecisionAnswerService } from '../../../../services';
import * as fromModelerStore from '../../../../store';
import { TestStoreModule } from '../../../../testing/test-store-module.spec';
import { DecisionAnswerComponent } from './decision-answer.component';

function getAnswerObject(): Answer {
  const answer = new Answer();
  answer.answerItems = [{ id: 'answerItem1', value: 'Answer Item 1' }, { id: 'answerItem2', value: 'Answer Item 2' }];
  answer.defaultAnswerItemId = 'answerItem1';
  answer.externalValueList = 'external\nvalue\nlist';
  answer.minimumNumber = 1;
  answer.defaultNumber = 5;
  answer.maximumNumber = 10;
  answer.text = 't\ne\nx\nt';
  answer.minimumDateTime = new Date('2026-02-20 10:10');
  answer.defaultDateTime = new Date('2026-06-20 10:10');
  answer.maximumDateTime = new Date('2026-10-20 10:10');
  answer.other = 'o\nt\nh\ne\nr';
  answer.isCollection = false;

  return answer;
}

describe('DecisionAnswerComponent', () => {
  let component: DecisionAnswerComponent;
  let fixture: ComponentFixture<DecisionAnswerComponent>;
  let decisionAnswerService: DecisionAnswerService;
  let modelerStore: Store<fromModelerStore.IDecisionFirstState>;

  const decision = new Decision();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DecisionAnswerComponent,
        MockComponent({ selector: 'dfm-decision-answer-type', inputs: ['answerForm'] }),
        MockComponent({ selector: 'dfm-decision-answer-yes-no', inputs: ['answerForm'] }),
        MockComponent({ selector: 'dfm-decision-answer-defined-list', inputs: ['answerForm', 'answerItems'] }),
        MockComponent({ selector: 'dfm-decision-answer-for-text-content', inputs: ['formControlName'] }, true),
        MockComponent({ selector: 'dfm-decision-answer-number-in-range', inputs: ['answerForm'] }),
        MockComponent({ selector: 'dfm-decision-answer-date-time', inputs: ['answerForm'] }),
        MockComponent({ selector: 'dfm-decision-answer-supporting-information', inputs: ['answerForm'] }),
      ],
      imports: [
        DmsThemeModule,
        FormsModule,
        NbThemeModule.forRoot(),
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        TestStoreModule,
      ],
      providers: [
        DecisionAnswerService,
        DatePipe,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    decisionAnswerService = TestBed.get(DecisionAnswerService);
    modelerStore = TestBed.get(Store);
    spyOn(modelerStore, 'dispatch');
    spyOn(decisionAnswerService, 'getNameAnswerType').and.returnValue(of('<p>Defined List</p>'));
    spyOn(decisionAnswerService, 'getAnswerTextValue').and.returnValue(of('<u>Answer Item 1</u>, Answer Item 2'));
    spyOn(decisionAnswerService, 'getAnswerSupportingInformation').and.returnValue(of('<p>Supporting information</p>'));
    fixture = TestBed.createComponent(DecisionAnswerComponent);
    component = fixture.componentInstance;
    decision.answer = getAnswerObject();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('read only mode', () => {
    beforeEach(() => {
      component.decision = decision;
      component.isReadOnly = true;
      fixture.detectChanges();
    });
    
    it('should set answer type', () => {
      expect(fixture.debugElement.query(By.css('.name-answer-type')).nativeElement.innerHTML).toEqual('<p>Defined List</p>');
    });

    it('should set answer text', () => {
      expect(fixture.debugElement.query(By.css('.answer-text-value')).nativeElement.innerHTML)
        .toEqual('<u>Answer Item 1</u>, Answer Item 2');
    });

    it('should set answer supporting information', () => {
      expect(fixture.debugElement.query(By.css('.answer-supporting-information')).nativeElement.innerHTML)
        .toEqual('<p>Supporting information</p>');
    });
  });
});
