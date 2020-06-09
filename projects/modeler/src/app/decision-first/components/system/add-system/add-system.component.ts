import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { AddObjectComponent, MaxTextLengthCategory } from 'core/components'
import * as fromModelerStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-add-system',
  templateUrl: './add-system.component.html',
  styleUrls: ['./add-system.component.scss']
})
export class AddSystemComponent extends AddObjectComponent {
  maxTextLengthCategory = MaxTextLengthCategory;

  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
    private nbDialogRef: NbDialogRef<AddSystemComponent>,
  ) {
    super(modelerStore, nbDialogRef);
    this.formGroup = this.getSystemForm();
    this.addAction = fromModelerStore.AddSystem;
  }

  getSystemForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      url: new FormControl(''),
    });
  }
}
