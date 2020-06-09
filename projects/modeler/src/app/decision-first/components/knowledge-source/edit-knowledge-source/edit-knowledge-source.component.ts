import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { EditObjectComponent } from 'core/components';
import { MaxTextLengthCategory } from 'core/components'
import { getEnumValues  } from 'core/utilities';
import { getI18nString } from 'core/utilities';
import { Config } from '../../../../config';
import { KnowledgeSource, KnowledgeSourceType } from '../../../models/knowledgeSource.model';
import * as fromModelerStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-edit-knowledge-source',
  styleUrls: ['./edit-knowledge-source.component.scss'],
  templateUrl: './edit-knowledge-source.component.html',
})
export class EditKnowledgeSourceComponent extends EditObjectComponent<KnowledgeSource> {
  fromModelerStore = fromModelerStore;
  getKnowledgeSourceTypeValues = getEnumValues(KnowledgeSourceType);
  getI18nNameKnowledgeSourceType = getI18nString;
  maxTextLengthCategory = MaxTextLengthCategory;

  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>
  ) {
    super(modelerStore);
    this.formGroup = this.getKnowledgeSourceForm();
    this.updateAction = fromModelerStore.UpdateKnowledgeSource;
    this.debounceTime = Config.debounceTime;
    this.dispatchUpdateAction = this.dispatchUpdateObjectWithTagsAction;
  }

  getKnowledgeSourceForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      url: new FormControl(''),
      complexity: new FormControl(''),
      type: new FormControl(''),
    });
  }

  dispatchUpdateObjectWithTagsAction(value: Partial<KnowledgeSource>): void {
    this.modelerStore.dispatch(new this.updateAction({
      knowledgeSource: {
        ...value,
        _links: this.editObject._links,
        id: this.editObject.id
      },
      objectTagsUpdate: {
        tags: this.editObject.tags,
        name: value.name,
        description: value.description,
      }
    }));
  }
}
