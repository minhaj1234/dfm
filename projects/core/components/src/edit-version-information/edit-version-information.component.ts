import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { VersionInformation } from 'core/models';
import { rootActions, rootReducers } from 'core/root-store';
import { debounceTime, filter } from 'rxjs/operators';
import { MaxTextLengthCategory } from '../multiple-lines-control/edit-multiple-lines-control/edit-multiple-lines-control.const';

export const DEBOUNCE_TIME = 5000;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'core-edit-version-information',
  styleUrls: ['./edit-version-information.component.scss'],
  templateUrl: './edit-version-information.component.html',
})
export class EditVersionInformationComponent implements OnInit {
  versionInformationForm: FormGroup;
  maxTextLengthCategory = MaxTextLengthCategory;
  private _versionInformation: VersionInformation;
  @Input() set versionInformation(versionInformation: VersionInformation) {
    this._versionInformation = versionInformation;
    if (versionInformation) {
      this.versionInformationForm.setValue(versionInformation, {emitEvent: false});
    }
  };
  get versionInformation(): VersionInformation {
    return this._versionInformation ;
  };

  constructor(private store: Store<rootReducers.versionInformationReducer.IVersionInformationState>) {
    this.createVersionInformationForm();
  }

  ngOnInit() {
    this.subscribeValueChanges();
  }

  createVersionInformationForm(): void {
    this.versionInformationForm = new FormGroup({
      information: new FormControl('', [Validators.required]),
      supportLink: new FormControl('', [Validators.required]),
    });
  }

  subscribeValueChanges(): void {
    this.versionInformationForm.valueChanges
    .pipe(
      filter(() => this.versionInformationForm.valid),
      debounceTime(DEBOUNCE_TIME),
    )
    .subscribe((value: VersionInformation) => {
      this.store.dispatch(new rootActions.UpdateVersionInformation(value));
    });
  }
}
