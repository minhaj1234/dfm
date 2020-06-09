import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { AddObjectComponent } from 'core/components';
import { MaxTextLengthCategory } from 'core/components'
import * as fromModelerStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-add-diagram',
  styleUrls: ['./add-diagram.component.scss'],
  templateUrl: './add-diagram.component.html',
})
export class AddDiagramComponent extends AddObjectComponent {
  maxTextLengthCategory = MaxTextLengthCategory;

  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
    private nbDialogRef: NbDialogRef<AddDiagramComponent>,
  ) {
    super(modelerStore, nbDialogRef);
    this.formGroup = this.getDiagramForm();
    this.addAction = fromModelerStore.AddDiagram;
  }

  getDiagramForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
    });
  }
}
