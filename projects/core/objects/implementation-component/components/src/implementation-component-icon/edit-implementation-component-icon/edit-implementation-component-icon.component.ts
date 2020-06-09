import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ImplementationComponentIcon } from 'core/objects/implementation-component/models';
import * as fromStore from 'core/objects/implementation-component/store';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { debounceTime } from 'rxjs/operators';

export const DEBOUNCE_TIME = 3000;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'core-edit-implementation-component-icon',
  styleUrls: ['./edit-implementation-component-icon.component.scss'],
  templateUrl: './edit-implementation-component-icon.component.html',
})
export class EditImplementationComponentIconComponent implements OnInit, OnDestroy {
  editIconForm: FormGroup;
  private _icon: ImplementationComponentIcon;
  @Input() set icon(icon: ImplementationComponentIcon) {
    this._icon = icon;
    this.setIconFormValue();
  };
  get icon(): ImplementationComponentIcon {
    return this._icon;
  };

  constructor(private store: Store<fromStore.DecisionFirstImplementationComponentsIconsState>) {
    this.createEditiconForm();
  }

  ngOnInit() {
    this.subscrbeIconFormValueChanges();
  }

  createEditiconForm(): void {
    this.editIconForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      tooltip: new FormControl('', [Validators.required]),
      isDefault: new FormControl(false),
    });
  }

  setIconFormValue(): void {
    this.editIconForm.setValue({
      name: this.icon.name,
      tooltip: this.icon.tooltip,
      isDefault: this.icon.isDefault,
    }, {
      emitEvent: false
    });
  }

  subscrbeIconFormValueChanges(): void {
    this.editIconForm.valueChanges
    .pipe(
      untilDestroyed(this),
      debounceTime(DEBOUNCE_TIME),
    )
    .subscribe((value) => {
      this.store.dispatch(new fromStore.UpdateImplementationComponentsIcon({
        id: this.icon.id,
        ...value,
      }));
    });
  }

  ngOnDestroy() {}
}
