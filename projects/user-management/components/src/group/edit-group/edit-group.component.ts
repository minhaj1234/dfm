import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { EditObjectComponent } from 'core/components';
import { MaxTextLengthCategory } from 'core/components';
import { Group } from 'user-management/models';
import { IDecisionFirstState } from 'user-management/store/reducers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'user-management-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent extends EditObjectComponent<Group> {
  MaxTextLengthCategory = MaxTextLengthCategory;

  @Input() updateAction: any;
  @Input() debounceTime: number;

  constructor(
    private userManagementStor: Store<IDecisionFirstState>,
  ) {
    super(userManagementStor);
    this.formGroup = this.getGroupForm();
    this.updateAction = this.updateAction;
    this.debounceTime = this.debounceTime;
  }

  getGroupForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
    });
  }

  isVisibleTagList(): boolean {
    return this.editObject && this.editObject.tags && this.editObject.tags.length > 0;
  }
}
