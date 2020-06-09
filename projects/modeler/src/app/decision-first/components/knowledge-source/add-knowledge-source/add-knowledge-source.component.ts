import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { AddObjectComponent } from 'core/components';
import { MaxTextLengthCategory } from 'core/components'
import { getEnumValues  } from 'core/utilities';
import { getI18nString } from 'core/utilities';
import { defaultKnowledgeSourceType, KnowledgeSourceType } from '../../../models/knowledgeSource.model';
import * as fromModelerStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-add-knowledge-source',
  styleUrls: ['./add-knowledge-source.component.scss'],
  templateUrl: './add-knowledge-source.component.html',
})
export class AddKnowledgeSourceComponent extends AddObjectComponent {
  getKnowledgeSourceTypeValues = getEnumValues(KnowledgeSourceType);
  getI18nNameKnowledgeSourceType = getI18nString;
  maxTextLengthCategory = MaxTextLengthCategory;

  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
    private nbDialogRef: NbDialogRef<AddKnowledgeSourceComponent>,
  ) {
    super(modelerStore, nbDialogRef);
    this.formGroup = this.getKnowledgeSourceForm();
    this.addAction = fromModelerStore.AddKnowledgeSource;
  }

  getKnowledgeSourceForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      url: new FormControl(''),
      type: new FormControl(defaultKnowledgeSourceType),
    });
  }
}
