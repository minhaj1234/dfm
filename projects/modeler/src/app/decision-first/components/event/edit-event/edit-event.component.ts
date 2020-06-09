import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { EditObjectComponent } from 'core/components';
import { MaxTextLengthCategory } from 'core/components'
import { Config } from '../../../../config';
import { Event } from '../../../models/events.model';
import * as fromModelerStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-edit-event',
  styleUrls: ['./edit-event.component.scss'],
  templateUrl: './edit-event.component.html',
})
export class EditEventComponent extends EditObjectComponent<Event> {
  fromModelerStore = fromModelerStore;
  maxTextLengthCategory = MaxTextLengthCategory;

  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
  ) {
    super(modelerStore);
    this.formGroup = this.getEventForm();
    this.updateAction = fromModelerStore.UpdateEvent;
    this.debounceTime = Config.debounceTime;
    this.dispatchUpdateAction = this.dispatchUpdateObjectWithTagsAction;
  }

  getEventForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      url: new FormControl(''),
    });
  }

  dispatchUpdateObjectWithTagsAction(value: Partial<Event>): void {
    this.modelerStore.dispatch(new this.updateAction({
      event: {
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
