import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbThemeModule } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing';
import { Config } from '../../../../config';
import { DmsThemeModule } from '../../../../theme';
import { Decision } from '../../../models/decision.model';
import { UpdateDecision } from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { QuestionAndAnswersComponent } from './question-and-answers.component';

describe('QuestionAndAnswersComponent', () => {
  let component: QuestionAndAnswersComponent;
  let fixture: ComponentFixture<QuestionAndAnswersComponent>;
  const decision = new Decision();
  decision.id = 'decision1000';
  decision.name = 'decision name';
  decision.description = 'decision description';
  decision.question = 'question';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionAndAnswersComponent,
        MockComponent({ selector: 'dfm-decision-answer', inputs: ['decision', 'isReadOnly'] }),
        MockComponent({ selector: 'core-edit-multiple-lines-control', inputs: ['formControlName', 'isRichEditor', 'maxTextLength'] }, true),
      ],
      imports: [
        TranslateModule.forRoot(),
        DmsThemeModule,
        FormsModule,
        ReactiveFormsModule,
        NbThemeModule.forRoot(),
        TestStoreModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionAndAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.decision = decision;
    expect(component).toBeTruthy();
  });

  it('dispatches an UpdateDecision on value changes if the form is valid', fakeAsync(() => {
    spyOn(TestBed.get(Store), 'dispatch')
    component.decision = decision;
    component.decisionForm.get('question').setValue('new question')
    tick(Config.debounceTime);

    expect(TestBed.get(Store).dispatch.calls.first().args[0]).toEqual(
      new UpdateDecision({
        decision: {
          id: decision.id,
          question: 'new question',
          _links: decision._links,
        }
      }),
    );

  }));
});
