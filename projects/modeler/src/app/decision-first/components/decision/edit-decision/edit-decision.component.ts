import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { EditObjectComponent } from 'core/components';
import { MaxTextLengthCategory } from 'core/components'
import { getEnumValues  } from 'core/utilities';
import { getI18nString } from 'core/utilities';
import { Config } from '../../../../config';
import { Decision, DecisionStatusLevel, DecisionType } from '../../../models/decision.model';
import * as fromModelerStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-edit-decision',
  styleUrls: ['./edit-decision.component.scss'],
  templateUrl: './edit-decision.component.html',
})
export class EditDecisionComponent extends EditObjectComponent<Decision> {
  fromModelerStore = fromModelerStore;
  getDecisionTypeValues = getEnumValues(DecisionType);
  getI18nNameDecisionType = getI18nString;

  getDecisionStatusLevelValues = getEnumValues(DecisionStatusLevel);
  getI18nNameDecisionStatusLevel = getI18nString;

  maxTextLengthCategory = MaxTextLengthCategory;

  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>
  ) {
    super(modelerStore);
    this.formGroup = this.getDecisionForm();
    this.updateAction = fromModelerStore.UpdateDecision;
    this.debounceTime = Config.debounceTime;
    this.dispatchUpdateAction = this.dispatchUpdateObjectWithTagsAction;
  }

  getDecisionForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      type: new FormControl(''),
      statusLevel: new FormControl(''),
      url: new FormControl(''),
    });
  }
  
  dispatchUpdateObjectWithTagsAction(value: Partial<Decision>): void {
    this.modelerStore.dispatch(new this.updateAction({
      decision: {
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
