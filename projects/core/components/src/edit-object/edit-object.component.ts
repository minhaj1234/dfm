import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { setFormAvailability } from 'core/utilities';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { debounceTime, filter } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'core-edit-object',
  template: '',
})
export class EditObjectComponent<T> implements OnInit, OnDestroy {
  public formGroup: FormGroup;
  public updateAction: any;
  public debounceTime: number;

  public dispatchUpdateAction = this.dispatchUpdateMinimalObjectAction;

  private _editObject: any;
  @Input() set editObject(value: T) {
    this._editObject = value;
    this.setValueFormGroup();
  };
  get editObject(): T {
    return this._editObject;
  }

  private _isReadOnly: boolean;
  @Input() set isReadOnly(value: boolean) {
    this._isReadOnly = value;
    setFormAvailability(this.formGroup, this.isReadOnly);
  }
  get isReadOnly(): boolean {
    return this._isReadOnly;
  }

  constructor(private store: Store<unknown>) { }

  ngOnInit() {
    this.subscribeFormGroupValueChanges();
  }

  setValueFormGroup(): void {
    if (this.editObject && this.formGroup) {
      Object.keys(this.formGroup.controls).forEach((controlName: string) => {
        this.formGroup.controls[controlName].setValue(this.editObject[controlName], { emitEvent: false });
      });
    }
  }

  subscribeFormGroupValueChanges(): void {
    this.formGroup.valueChanges
      .pipe(
        untilDestroyed(this),
        debounceTime(this.debounceTime),
      )
      .subscribe((value: Partial<T>) => {
        if (this.formGroup.valid) {
          this.dispatchUpdateAction(value);
        }
      });
  }

  dispatchUpdateMinimalObjectAction(value: Partial<T>): void {
    this.store.dispatch(new this.updateAction({
      ...value,
      _links: this.editObject['_links'],
      id: this.editObject['id'],
    }));
  }

  ngOnDestroy() { }
}
