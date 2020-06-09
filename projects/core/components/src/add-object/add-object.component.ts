import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { Action, Store } from '@ngrx/store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'core-add-object',
  template: '',
})
export class AddObjectComponent {
  public formGroup: FormGroup;
  public addAction: any;

  constructor(
    private store: Store<unknown>,
    private dialogRef: NbDialogRef<unknown>,
  ) { }

  addObject(): void {
    if (this.formGroup.valid) {
      this.store.dispatch(new this.addAction(this.formGroup.value));
      this.dialogRef.close();
    }
  }
}
