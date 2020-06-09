import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UploadImplementationComponentIconRequest } from 'core/objects/implementation-component/models';
import * as fromStore from 'core/objects/implementation-component/store';
import { FormGroupTyped } from 'core/utilities';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ACCEPT_ONLY_SVG, ALLOWED_TYPE_REGEX, INCORRECT_FILE_TYPE_ERROR_MESSAGE } from './upload-implementation-component-icon.const';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'core-upload-implementation-component-icon',
  styleUrls: ['./upload-implementation-component-icon.component.scss'],
  templateUrl: './upload-implementation-component-icon.component.html',
})
export class UploadImplementationComponentIconComponent implements OnInit, OnDestroy {
  uploadIconForm: FormGroupTyped<UploadImplementationComponentIconRequest>;
  accept = ACCEPT_ONLY_SVG;
  private _displayForm;
  @Input() set displayForm(value: boolean){
    this._displayForm = value;

    if (!this.displayForm) {
      this.resetForm();
    }
  }
  get displayForm(): boolean {
    return this._displayForm;
  }
  
  constructor(
    private formBuilder: FormBuilder, 
    private store: Store<fromStore.DecisionFirstImplementationComponentsIconsState>, 
    ) { 
    this.uploadIconForm = formBuilder.group({
      name: formBuilder.control('', Validators.required),
      tooltip: formBuilder.control('', Validators.required),
      icon: formBuilder.control(null, Validators.required),
    }) as FormGroupTyped<UploadImplementationComponentIconRequest>;
  }

  ngOnInit() { 
    this.subscribeFormValueChangs();
  }

  resetForm(): void {
    this.uploadIconForm.reset()
  }

  subscribeFormValueChangs(): void {
    this.uploadIconForm.controls.icon.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((icon: File) => {
        if (icon && !icon.type.match(ALLOWED_TYPE_REGEX)) {
          this.store.dispatch(new fromStore.GenericImplementationComponentsIconsFailure(new Error(INCORRECT_FILE_TYPE_ERROR_MESSAGE)));
          this.uploadIconForm.patchValue({icon: null}, {emitEvent: false});
        }
      });
  }

  openUploadIconForm(): void {
    this.store.dispatch(new fromStore.OpenUploadImplementationComponentsIconForm());
  }

  closeUploadIconForm(): void {
    this.store.dispatch(new fromStore.CloseUploadImplementationComponentsIconForm());
  }

  onUploadIconClick(): void {
    this.dispatchImplementationComponentUploadIcon();
  }

  dispatchImplementationComponentUploadIcon(): void {
    this.store.dispatch(new fromStore.UploadImplementationComponentsIcon({
        name: this.uploadIconForm.controls.name.value,
        tooltip: this.uploadIconForm.controls.tooltip.value,
        icon: this.uploadIconForm.controls.icon.value,
      },
    ));
  }

  isFormValid(): boolean {
    return this.uploadIconForm.valid;
  }

  ngOnDestroy() { 
    this.closeUploadIconForm();
  }
}
