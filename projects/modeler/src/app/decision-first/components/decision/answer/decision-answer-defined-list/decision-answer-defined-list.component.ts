import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { AnswerItem } from '../../../../models/decision.model';

@Component({
  selector: 'dfm-decision-answer-defined-list',
  templateUrl: './decision-answer-defined-list.component.html',
  styleUrls: ['./decision-answer-defined-list.component.scss'],
})
export class DecisionAnswerDefinedListComponent {
  newAnswerItemValue = '';
  private _answerItems: AnswerItem[]
  private _answerForm: FormGroup;

  @Input() set answerItems(answerItems: AnswerItem[]) {
    this._answerItems = answerItems;
  }
  get answerItems(): AnswerItem[] {
    return this._answerItems;
  }

  @Input()
  set answerForm(answerForm: FormGroup) {
    this._answerForm = answerForm;
  }
  get answerForm(): FormGroup {
    return this._answerForm;
  }

  addAnswerItem(): void {
    const newAnswerItem = new AnswerItem();
    newAnswerItem.id = Guid.create().toString();
    newAnswerItem.value = this.newAnswerItemValue;
    this.newAnswerItemValue = '';

    this.answerItems = [...this.answerItems, newAnswerItem];
    this.updateAnswerItems();
  }

  removeAnswerItem(answerItem: AnswerItem): void {
    this.answerItems = this.answerItems.filter((x) => x !== answerItem);
    this.updateAnswerItems();

    if (answerItem.id === this.answerForm.controls['defaultAnswerItemId'].value) {
      this.answerForm.controls['defaultAnswerItemId'].setValue(null);
    }
  }

  updateAnswerItems(): void {
    this.answerForm.patchValue({
      answerItems: this.answerItems,
    });
  }
}
