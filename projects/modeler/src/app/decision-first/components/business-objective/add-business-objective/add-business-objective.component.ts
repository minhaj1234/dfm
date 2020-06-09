import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { AddObjectComponent } from 'core/components';
import { MaxTextLengthCategory } from 'core/components';
import * as fromModelerStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-add-business-objective',
  templateUrl: './add-business-objective.component.html',
  styleUrls: ['./add-business-objective.component.scss']
})
export class AddBusinessObjectiveComponent extends AddObjectComponent {
  maxTextLengthCategory = MaxTextLengthCategory;

  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
    private nbDialogRef: NbDialogRef<AddBusinessObjectiveComponent>,
  ) {
    super(modelerStore, nbDialogRef);

    this.formGroup = this.getBusinessObjectiveForm();
    this.addAction = fromModelerStore.AddBusinessObjective;
  }

  getBusinessObjectiveForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      url: new FormControl(''),
    });
  }
}
