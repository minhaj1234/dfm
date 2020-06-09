import { AbstractControl, FormArray, FormGroup } from "@angular/forms";
import { Observable } from 'rxjs';

export interface FormGroupTyped<T> extends FormGroup {
  controls: { [P in keyof T]: AbstractControlTyped<T[P]> };
}

export interface AbstractControlTyped<T> extends AbstractControl {
  readonly value: T;
  valueChanges: Observable<T>;
  setValue<V>(value: V extends T ? V : never, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
  patchValue<V>(value: V extends Partial<T> ? V : never, options?: { onlySelf?: boolean; emitEvent?: boolean }): void;
}

export interface FormArrayTyped<T> extends FormArray {
  readonly value: T[];
  valueChanges: Observable<T[]>;
  controls: FormGroupTyped<T>[];
}
