import { ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MaxTextLengthCategory } from 'core/components'
import { setFormAvailability } from 'core/utilities';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { debounceTime, filter } from 'rxjs/operators';
import { Config } from '../../../../config';
import { Decision } from '../../../models/decision.model';
import * as fromStore from '../../../store';
import { IDecisionFirstState } from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-question-and-answers',
  templateUrl: './question-and-answers.component.html',
  styleUrls: ['./question-and-answers.component.scss']
})
export class QuestionAndAnswersComponent implements OnInit, OnDestroy{
  _decision: Decision;
  decisionForm: FormGroup;
  sendChanges = true;
  maxTextLengthCategory = MaxTextLengthCategory;

  @Input() set decision(decision: Decision) {
    this._decision = decision;
    if (this.decisionForm && decision) {
      this.sendChanges = false;
      this.decisionForm.setValue({
        question: this._decision.question || '',
      });
      this.sendChanges = true;
    }
  }
  get decision(): Decision {
    return this._decision;
  }

  private _isReadOnly: boolean;
  @Input() set isReadOnly(value: boolean) {
    this._isReadOnly = value;
    setFormAvailability(this.decisionForm, this.isReadOnly);
  }
  get isReadOnly(): boolean {
    return this._isReadOnly;
  }

  constructor(
    private store: Store<IDecisionFirstState>
  ) {
    this.createDecisionForm();
  }

  ngOnInit() {
    this.subscribeDecisionFormValueChanges();
  }

  createDecisionForm(): void {
    this.decisionForm = new FormGroup({
      question: new FormControl(''),
    });
  }

  subscribeDecisionFormValueChanges(): void {
    this.decisionForm.valueChanges
      .pipe(
        filter(() => this.sendChanges),
        untilDestroyed(this),
        debounceTime(Config.debounceTime),
      )
      .subscribe((results) => {
        if (this.decisionForm.valid) {
          this.store.dispatch(
            new fromStore.UpdateDecision({
              decision: { ...results, _links: this.decision._links, id: this.decision.id }
            }),
          );
        }
      });
  }

  ngOnDestroy() {}
}
