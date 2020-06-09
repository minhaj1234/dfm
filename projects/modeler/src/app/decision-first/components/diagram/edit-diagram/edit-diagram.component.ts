import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { EditObjectComponent } from 'core/components';
import { MaxTextLengthCategory } from 'core/components'
import { Config } from '../../../../config';
import { Diagram } from '../../../models/diagram.model';
import * as fromModelerStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-edit-diagram',
  styleUrls: ['./edit-diagram.component.scss'],
  templateUrl: './edit-diagram.component.html',
})
export class EditDiagramComponent extends EditObjectComponent<Diagram> {
  fromModelerStore = fromModelerStore;
  maxTextLengthCategory = MaxTextLengthCategory;

  constructor(private modelerStore: Store<fromModelerStore.IDecisionFirstState>) {
    super(modelerStore);
    this.formGroup = this.getDiagramForm();
    this.updateAction = fromModelerStore.UpdateDiagram;
    this.debounceTime = Config.debounceTime;
    this.dispatchUpdateAction = this.dispatchUpdateObjectWithTagsAction;
  }

  getDiagramForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
    });
  }

  dispatchUpdateObjectWithTagsAction(value: Partial<Diagram>): void {
    this.modelerStore.dispatch(new this.updateAction({
      diagram: {
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
