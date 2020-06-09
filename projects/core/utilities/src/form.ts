import { FormGroup } from "@angular/forms";

export function setFormAvailability(formGroup: FormGroup, isDisabled: boolean): void {
  if (formGroup) {
    if (isDisabled) {
      formGroup.disable({ emitEvent: false });
    }
    else {
      formGroup.enable({ emitEvent: false });
    }
  }
}