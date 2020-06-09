import { Component, Input } from '@angular/core';
import { async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { createTestComponentFactory, Spectator } from '@netbasal/spectator';
import { MockComponent } from 'core/testing';
import { DecisionAnswerForTextContentComponent } from './decision-answer-for-text-content.component';

@Component({
  template: `<dfm-decision-answer-for-text-content [(ngModel)]="text"></dfm-decision-answer-for-text-content>`,
})
class TestDecisionAnswerForTextContentComponent {
  @Input() text: string;
}
describe('DecisionAnswerForTextContentComponent', () => {
  let spectator: Spectator<TestDecisionAnswerForTextContentComponent>;

  const createComponent = createTestComponentFactory({
    component: TestDecisionAnswerForTextContentComponent,
    declarations: [
      DecisionAnswerForTextContentComponent,
      MockComponent({ selector: 'core-edit-multiple-lines-control', inputs: ['formControlName', 'isRichEditor', 'rows', 'maxTextLength'] }, true),
    ],
    imports: [FormsModule],
  });

  it('should create', async(() => {
    spectator = createComponent({ text: 'text' });

    spectator.fixture.whenStable().then(() => {
      spectator.detectChanges();
      expect(spectator.component).toBeTruthy();
    });
  }));
});
