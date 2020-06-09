import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { AddObjectComponent, MaxTextLengthCategory } from 'core/components'
import * as fromModelerStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-add-process',
  templateUrl: './add-process.component.html',
  styleUrls: ['./add-process.component.scss']
})
export class AddProcessComponent extends AddObjectComponent {
  maxTextLengthCategory = MaxTextLengthCategory;

  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
    private nbDialogRef: NbDialogRef<AddProcessComponent>,
  ) {
    super(modelerStore, nbDialogRef);
    this.formGroup = this.getProcessForm();
    this.addAction = fromModelerStore.AddProcess;
  }

  getProcessForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      url: new FormControl(''),
    });
  }
}
